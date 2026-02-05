import Stripe from "stripe"

// Re-export client-safe config
export { PLANS, SINGLE_RESOURCE_PRICE } from "./stripe-config"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Price IDs from environment
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || "",
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || "",
}

/**
 * Create a Stripe checkout session for subscription
 */
export async function createSubscriptionCheckout({
  customerId,
  customerEmail,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string
  customerEmail: string
  priceId: string
  userId: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
  }

  // Use existing customer or create new with email
  if (customerId) {
    sessionParams.customer = customerId
  } else {
    sessionParams.customer_email = customerEmail
  }

  return stripe.checkout.sessions.create(sessionParams)
}

/**
 * Create a Stripe checkout session for single resource purchase
 */
export async function createResourceCheckout({
  customerId,
  customerEmail,
  resourceId,
  resourceTitle,
  price,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId?: string
  customerEmail: string
  resourceId: string
  resourceTitle: string
  price: number // in cents
  userId: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: resourceTitle,
            description: "Single resource download access",
          },
          unit_amount: price,
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      resourceId,
      type: "resource",
    },
  }

  if (customerId) {
    sessionParams.customer = customerId
  } else {
    sessionParams.customer_email = customerEmail
  }

  return stripe.checkout.sessions.create(sessionParams)
}

/**
 * Create a Stripe customer portal session
 */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string
  returnUrl: string
}): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateCustomer({
  userId,
  email,
  name,
}: {
  userId: string
  email: string
  name: string
}): Promise<Stripe.Customer> {
  // Search for existing customer
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  return stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  })
}

/**
 * Get a customer's active subscription
 */
export async function getCustomerSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 1,
  })

  return subscriptions.data[0] || null
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
}

/**
 * Reactivate a cancelled subscription
 */
export async function reactivateSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
}

/**
 * Verify a webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
