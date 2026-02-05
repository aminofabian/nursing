import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createResourceCheckout, getOrCreateCustomer } from "@/lib/stripe"

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
    const { resourceId } = body

    if (!resourceId) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      )
    }

    // Get the resource
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    })

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }

    if (!resource.isPremium) {
      return NextResponse.json(
        { error: "This resource is free. No purchase needed." },
        { status: 400 }
      )
    }

    // Check if user already purchased this resource
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.user.id,
        resourceId,
        paymentStatus: "COMPLETED",
      },
    })

    if (existingPurchase) {
      return NextResponse.json(
        { error: "You already own this resource." },
        { status: 400 }
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

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      })
    }

    // Get price (use resource price or default)
    const price = resource.price || 499 // $4.99 default

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const checkoutSession = await createResourceCheckout({
      customerId: stripeCustomerId,
      customerEmail: user.email,
      resourceId: resource.id,
      resourceTitle: resource.title,
      price,
      userId: user.id,
      successUrl: `${baseUrl}/resources/${resource.slug}?purchased=true`,
      cancelUrl: `${baseUrl}/resources/${resource.slug}`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Resource checkout error:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
