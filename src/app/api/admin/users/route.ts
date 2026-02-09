import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100)
    const role = searchParams.get("role")
    const search = searchParams.get("search")

    const where: { role?: string; OR?: { name: { contains: string }; email: { contains: string } }[] } = {}
    if (role && (role === "ADMIN" || role === "STUDENT")) {
      where.role = role
    }
    if (search?.trim()) {
      const term = search.trim()
      where.OR = [
        { name: { contains: term } },
        { email: { contains: term } },
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { subscriptions: true, downloads: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    const userIds = users.map((u) => u.id)
    const activeSubs = await prisma.subscription.findMany({
      where: {
        userId: { in: userIds },
        status: "ACTIVE",
        endsAt: { gte: new Date() },
      },
      select: { userId: true },
    })
    const subByUser = new Map(activeSubs.map((s) => [s.userId, true]))

    const usersWithSub = users.map((u) => ({
      ...u,
      hasActiveSubscription: subByUser.get(u.id) ?? false,
    }))

    return NextResponse.json({
      users: usersWithSub,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Admin get users error:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
