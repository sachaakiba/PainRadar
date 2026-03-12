import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendErrorAlert } from "@/lib/error-alert";
import type { PlanId } from "@/types";

const PLAN_PRICE_IDS: Record<Exclude<PlanId, "free">, string | undefined> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  pro: process.env.STRIPE_PRO_PRICE_ID,
};

export async function POST(request: Request) {
  let userId: string | undefined;
  let customerId: string | null = null;
  let priceId: string | undefined;

  try {
    const session = await requireSession();
    userId = session.user.id;

    const body = await request.json();
    const planId = body?.planId as "starter" | "pro" | undefined;

    if (!planId || (planId !== "starter" && planId !== "pro")) {
      return NextResponse.json(
        { error: "Invalid planId. Use 'starter' or 'pro'." },
        { status: 400 }
      );
    }

    priceId = PLAN_PRICE_IDS[planId];
    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price not configured for this plan." },
        { status: 500 }
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.stripeCustomerId) {
      try {
        await stripe.customers.retrieve(user.stripeCustomerId);
        customerId = user.stripeCustomerId;
      } catch {
        customerId = null;
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;
      await db.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const sessionStripe = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard/settings?success=true`,
      cancel_url: `${baseUrl}/dashboard/settings`,
      metadata: { userId: session.user.id },
      subscription_data: { metadata: { userId: session.user.id } },
    });

    const url = sessionStripe.url;
    if (!url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Stripe checkout error:", err);
    await sendErrorAlert({
      source: "Stripe Checkout",
      error: err,
      context: {
        endpoint: "/api/stripe/checkout",
        userId,
        customerId,
        priceId,
      },
    });
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
