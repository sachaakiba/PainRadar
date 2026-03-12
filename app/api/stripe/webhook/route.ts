import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendErrorAlert } from "@/lib/error-alert";
import type { PlanId } from "@/types";

function planFromPriceId(priceId: string): PlanId {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return "pro";
  return "free";
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
  let subscriptionId: string | undefined;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        userId = session.metadata?.userId;
        customerId = session.customer as string;
        subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!userId || !subscriptionId) {
          console.error("checkout.session.completed missing userId or subscriptionId");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        priceId = subscription.items.data[0]?.price?.id;
        const plan = priceId ? planFromPriceId(priceId) : "free";

        await db.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        userId = subscription.metadata?.userId;
        customerId = subscription.customer as string;
        subscriptionId = subscription.id;
        priceId = subscription.items.data[0]?.price?.id;
        const plan = priceId ? planFromPriceId(priceId) : "free";

        if (!userId) {
          const existing = await db.user.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
            select: { id: true },
          });
          if (!existing) break;
          userId = existing.id;
          await db.user.update({
            where: { id: existing.id },
            data: { plan, stripeSubscriptionId: subscriptionId },
          });
        } else {
          await db.user.update({
            where: { id: userId },
            data: { plan, stripeSubscriptionId: subscriptionId },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        subscriptionId = subscription.id;
        customerId = subscription.customer as string;

        await db.user.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            plan: "free",
            stripeSubscriptionId: null,
          },
        });
        break;
      }

      default:
        // Unhandled event type
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
        subscriptionId,
      },
    });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
