import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { stripe, constructWebhookEvent } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendSubscriptionConfirmationEmail, sendPurchaseReceiptEmail } from "@/lib/email"

// Disable body parsing for webhook signature verification
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set")
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = constructWebhookEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!userId) {
    console.error("No userId in checkout session metadata")
    return
  }

  // Update user with Stripe customer ID if not already set
  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
    },
  })

  // If this is a subscription checkout, create/update subscription record
  if (session.mode === "subscription" && subscriptionId) {
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription
    const subscriptionItem = stripeSubscription.items.data[0]
    
    // Stripe v20: billing periods are now on subscription items
    const periodStart = (subscriptionItem as { current_period_start?: number }).current_period_start || Date.now() / 1000
    const periodEnd = (subscriptionItem as { current_period_end?: number }).current_period_end || Date.now() / 1000
    
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      create: {
        userId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: subscriptionItem?.price.id,
        plan: getPlanFromPriceId(subscriptionItem?.price.id),
        status: "ACTIVE",
        amount: subscriptionItem?.price.unit_amount || 0,
        startsAt: new Date(periodStart * 1000),
        endsAt: new Date(periodEnd * 1000),
      },
      update: {
        status: "ACTIVE",
        startsAt: new Date(periodStart * 1000),
        endsAt: new Date(periodEnd * 1000),
      },
    })

    // Send subscription confirmation email (best-effort)
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      })

      if (user?.email) {
        const plan = getPlanFromPriceId(subscriptionItem?.price.id)
        const normalizedPlan: "monthly" | "yearly" =
          plan === "YEARLY" ? "yearly" : "monthly"

        await sendSubscriptionConfirmationEmail({
          name: user.name,
          email: user.email,
          plan: normalizedPlan,
        })
      }
    } catch (err) {
      console.error("Failed to send subscription confirmation email:", err)
    }
  }

  // If this is a resource purchase, create purchase record
  if (session.mode === "payment" && session.metadata?.resourceId) {
    const resourceId = session.metadata.resourceId
    const paymentIntentId = session.payment_intent as string

    const purchase = await prisma.purchase.create({
      data: {
        userId,
        resourceId,
        amount: session.amount_total || 0,
        paymentStatus: "COMPLETED",
        stripePaymentId: paymentIntentId,
        stripeSessionId: session.id,
      },
      include: {
        resource: {
          select: {
            title: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Send purchase receipt email (best-effort)
    if (purchase.user?.email && purchase.resource?.title) {
      try {
        await sendPurchaseReceiptEmail({
          name: purchase.user.name,
          email: purchase.user.email,
          resourceTitle: purchase.resource.title,
          amountCents: purchase.amount,
        })
      } catch (err) {
        console.error("Failed to send purchase receipt email:", err)
      }
    }
  }

  console.log(`Checkout completed for user ${userId}`)
}

/**
 * Handle subscription created/updated events
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id
  const customerId = subscription.customer as string

  // Find the user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`No user found for customer ${customerId}`)
    return
  }

  const status = mapSubscriptionStatus(subscription.status)
  const subscriptionItem = subscription.items.data[0]
  
  // Stripe v20: billing periods are now on subscription items
  const periodStart = (subscriptionItem as { current_period_start?: number }).current_period_start || Date.now() / 1000
  const periodEnd = (subscriptionItem as { current_period_end?: number }).current_period_end || Date.now() / 1000

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscriptionId },
    create: {
      userId: user.id,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: subscriptionItem?.price.id,
      plan: getPlanFromPriceId(subscriptionItem?.price.id),
      status,
      amount: subscriptionItem?.price.unit_amount || 0,
      startsAt: new Date(periodStart * 1000),
      endsAt: new Date(periodEnd * 1000),
      cancelledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
    update: {
      status,
      startsAt: new Date(periodStart * 1000),
      endsAt: new Date(periodEnd * 1000),
      cancelledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    },
  })

  console.log(`Subscription ${subscriptionId} updated: ${status}`)
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id

  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  })

  console.log(`Subscription ${subscriptionId} cancelled`)
}

/**
 * Handle invoice.payment_failed event
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Stripe v20: subscription may be nested differently
  const subscriptionId = (invoice as unknown as { subscription?: string }).subscription

  if (subscriptionId) {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: "PENDING",
      },
    })

    console.log(`Payment failed for subscription ${subscriptionId}`)
  }
}

/**
 * Map Stripe subscription status to our SubscriptionStatus enum
 */
function mapSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING" {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "ACTIVE"
    case "canceled":
      return "CANCELLED"
    case "past_due":
    case "unpaid":
      return "PENDING" // Treat as pending until resolved
    case "incomplete":
    case "incomplete_expired":
      return "EXPIRED"
    default:
      return "PENDING"
  }
}

/**
 * Get plan name from Stripe price ID
 */
function getPlanFromPriceId(priceId: string | undefined): "MONTHLY" | "YEARLY" {
  if (!priceId) return "MONTHLY"
  
  if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
    return "YEARLY"
  }
  
  return "MONTHLY"
}
