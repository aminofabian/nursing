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

    // Check if already saved
    const existingSave = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId: session.user.id,
          resourceId,
        },
      },
    })

    if (existingSave) {
      return NextResponse.json(
        { error: "Resource already saved" },
        { status: 409 }
      )
    }

    // Save resource
    const savedResource = await prisma.savedResource.create({
      data: {
        userId: session.user.id,
        resourceId,
      },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "Resource saved successfully",
      savedResource,
    })
  } catch (error) {
    console.error("Save resource error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Check if saved
    const existingSave = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId: session.user.id,
          resourceId,
        },
      },
    })

    if (!existingSave) {
      return NextResponse.json(
        { error: "Resource not saved" },
        { status: 404 }
      )
    }

    // Remove from saved
    await prisma.savedResource.delete({
      where: {
        userId_resourceId: {
          userId: session.user.id,
          resourceId,
        },
      },
    })

    return NextResponse.json({
      message: "Resource removed from library",
    })
  } catch (error) {
    console.error("Unsave resource error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
