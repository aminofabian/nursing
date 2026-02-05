import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id: resourceId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    })

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }

    // Check if user has access to premium content
    if (resource.isPremium) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          subscriptions: {
            where: {
              status: "ACTIVE",
              endsAt: { gte: new Date() },
            },
            take: 1,
          },
        },
      })

      const hasActiveSubscription = user?.subscriptions && user.subscriptions.length > 0
      const isAdmin = user?.role === "ADMIN"

      if (!hasActiveSubscription && !isAdmin) {
        return NextResponse.json(
          { error: "Premium subscription required" },
          { status: 403 }
        )
      }
    }

    // Record download
    await prisma.download.create({
      data: {
        userId: session.user.id,
        resourceId,
      },
    })

    // Return download URL (in a real app, this would be a signed URL to the actual file)
    return NextResponse.json({
      message: "Download recorded",
      downloadUrl: resource.fileUrl || `/api/resources/${resourceId}/file`,
    })
  } catch (error) {
    console.error("Download resource error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id: resourceId } = await params

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get download history for this resource
    const downloads = await prisma.download.findMany({
      where: {
        userId: session.user.id,
        resourceId,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json({ downloads })
  } catch (error) {
    console.error("Get downloads error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
