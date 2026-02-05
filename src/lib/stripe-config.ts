// Stripe configuration - safe for client-side
// This file contains only constants and types, no server-side Stripe SDK

// Plan metadata
export const PLANS = {
  monthly: {
    name: "Monthly",
    price: 999, // in cents
    priceDisplay: "$9.99",
    interval: "month" as const,
    features: [
      "Unlimited access to all resources",
      "New content added weekly",
      "Download in PDF format",
      "Mobile-friendly access",
      "Cancel anytime",
    ],
  },
  yearly: {
    name: "Yearly",
    price: 7999, // in cents
    priceDisplay: "$79.99",
    interval: "year" as const,
    savings: "Save 33%",
    features: [
      "Everything in Monthly",
      "2 months free",
      "Priority support",
      "Early access to new resources",
      "Exclusive study guides",
    ],
  },
}

// Single resource price
export const SINGLE_RESOURCE_PRICE = 499 // $4.99 in cents

// Plan types
export type PlanInterval = "month" | "year"
export type PlanName = keyof typeof PLANS
