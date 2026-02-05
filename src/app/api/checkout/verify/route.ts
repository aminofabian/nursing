import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        customerId: session.customer,
        subscriptionId: session.subscription,
      })
    }

    return NextResponse.json({
      success: false,
      status: session.payment_status,
    })
  } catch (error) {
    console.error("Verify session error:", error)
    return NextResponse.json(
      { error: "Failed to verify session" },
      { status: 500 }
    )
  }
}
