import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!userId || !subscriptionId) {
          console.error("checkout.session.completed missing userId or subscriptionId");
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = priceId ? planFromPriceId(priceId) : "free";

        await db.user.update({
          where: { id: userId },
          data: {
            plan,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const subscriptionId = subscription.id;
        const priceId = subscription.items.data[0]?.price?.id;
        const plan = priceId ? planFromPriceId(priceId) : "free";

        if (!userId) {
          const existing = await db.user.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
            select: { id: true },
          });
          if (!existing) break;
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
        const subscriptionId = subscription.id;

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
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
