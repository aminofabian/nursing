import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

// GET - List all categories
export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { resources: true } },
        parent: true,
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Admin get categories error:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

// POST - Create category
export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const body = await request.json()

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug,
        description: body.description || null,
        parentId: body.parentId || null,
        order: body.order ?? 0,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Admin create category error:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}
