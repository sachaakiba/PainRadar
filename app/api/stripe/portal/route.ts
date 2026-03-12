import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const session = await requireSession();

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

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
    console.error("Stripe portal error:", err);
    return NextResponse.json(
      { error: "Failed to open billing portal." },
      { status: 500 }
    );
  }
}
