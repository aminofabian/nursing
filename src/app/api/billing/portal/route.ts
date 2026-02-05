import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createPortalSession } from "@/lib/stripe"

export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No subscription found. Please subscribe first." },
        { status: 400 }
      )
    }

    // Create Stripe billing portal session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const portalSession = await createPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${baseUrl}/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Billing portal error:", error)
    return NextResponse.json(
      { error: "Failed to create billing portal session" },
      { status: 500 }
    )
  }
}
