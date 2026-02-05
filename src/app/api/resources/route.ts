import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")

    const where: Record<string, unknown> = {}

    if (type) {
      where.resourceType = type.toUpperCase().replace(/-/g, "_")
    }

    if (category) {
      where.categoryId = category
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { downloads: true, savedBy: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.resource.count({ where }),
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
    console.error("Get resources error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
