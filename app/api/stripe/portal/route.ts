import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendErrorAlert } from "@/lib/error-alert";

export async function POST() {
  let userId: string | undefined;
  let customerId: string | undefined;

  try {
    const session = await requireSession();
    userId = session.user.id;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    customerId = user?.stripeCustomerId ?? undefined;

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found. Subscribe first to manage your plan." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/settings`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err instanceof Error && err.message === "Email not verified") {
      return NextResponse.json({ error: "Email not verified" }, { status: 403 });
    }
    console.error("Stripe portal error:", err);
    await sendErrorAlert({
      source: "Stripe Portal",
      error: err,
      context: {
        endpoint: "/api/stripe/portal",
        userId,
        customerId,
      },
    });
    return NextResponse.json(
      { error: "Failed to open billing portal." },
      { status: 500 }
    );
  }
}
