import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendErrorAlert } from "@/lib/error-alert";
import { PACK_CREDITS } from "@/config/pricing";
import { normalizePlan } from "@/lib/plan-guard";
import type { PlanId } from "@/types";

const TIER_RANK: Record<PlanId, number> = { free: 0, starter: 1, explorer: 2, founder: 3 };

type PackId = "starter" | "explorer" | "founder";

function packFromPriceId(priceId: string): PackId | null {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.STRIPE_EXPLORER_PRICE_ID) return "explorer";
  if (priceId === process.env.STRIPE_FOUNDER_PRICE_ID) return "founder";
  return null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing webhook signature or secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let userId: string | undefined;
  let customerId: string | undefined;
  let priceId: string | undefined;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        userId = session.metadata?.userId;
        customerId = session.customer as string;

        if (!userId) {
          console.error("checkout.session.completed missing userId");
          break;
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        priceId = lineItems.data[0]?.price?.id;

        if (!priceId) {
          console.error("checkout.session.completed missing priceId");
          break;
        }

        const packId = session.metadata?.packId as PackId | undefined
          ?? packFromPriceId(priceId);

        if (!packId || !(packId in PACK_CREDITS)) {
          console.error("checkout.session.completed unknown pack:", packId);
          break;
        }

        const currentUser = await db.user.findUnique({
          where: { id: userId },
          select: { plan: true },
        });

        const currentPlan = normalizePlan(currentUser?.plan ?? null);
        const targetPlan: PlanId = packId;
        const newPlan =
          TIER_RANK[targetPlan] >= TIER_RANK[currentPlan] ? targetPlan : currentPlan;

        await db.user.update({
          where: { id: userId },
          data: {
            credits: { increment: PACK_CREDITS[packId] },
            plan: newPlan,
            stripeCustomerId: customerId,
          },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    await sendErrorAlert({
      source: "Stripe Webhook",
      error: err,
      context: {
        endpoint: "/api/stripe/webhook",
        eventType: event.type,
        eventId: event.id,
        userId,
        customerId,
        priceId,
      },
    });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
