import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSubscriptionCheckout, STRIPE_PRICES, getOrCreateCustomer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      )
    }

    // Get the price ID for the selected plan
    const priceId = plan === "monthly" ? STRIPE_PRICES.monthly : STRIPE_PRICES.yearly

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID not configured. Please contact support." },
        { status: 500 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await getOrCreateCustomer({
        userId: user.id,
        email: user.email,
        name: user.name,
      })
      stripeCustomerId = customer.id

      // Save customer ID to user
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const checkoutSession = await createSubscriptionCheckout({
      customerId: stripeCustomerId,
      customerEmail: user.email,
      priceId,
      userId: user.id,
      successUrl: `${baseUrl}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/subscribe/cancel`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
