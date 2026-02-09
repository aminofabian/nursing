import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { ResourceType } from "@prisma/client"

// GET - List all resources (admin)
export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.resource.count(),
    ])

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Admin get resources error:", error)
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    )
  }
}

// POST - Create resource
export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description || null,
        slug,
        resourceType: body.resourceType as ResourceType,
        categoryId: body.categoryId || null,
        yearLevel: body.yearLevel ? parseInt(body.yearLevel) : null,
        difficulty: body.difficulty || null,
        fileUrl: body.fileUrl || null,
        previewUrl: body.previewUrl || null,
        thumbnailUrl: body.thumbnailUrl || null,
        fileSize: body.fileSize ? parseInt(body.fileSize) : null,
        isPremium: body.isPremium ?? false,
        price: body.price ? parseInt(body.price) : null,
        isPublished: body.isPublished ?? true,
      },
      include: { category: true },
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Admin create resource error:", error)
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    )
  }
}
