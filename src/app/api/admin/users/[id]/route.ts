import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      yearOfStudy: true,
      programType: true,
      school: true,
      createdAt: true,
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          plan: true,
          status: true,
          startsAt: true,
          endsAt: true,
        },
      },
      _count: { select: { downloads: true, purchases: true, savedResources: true } },
    },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  return NextResponse.json(user)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()
  if (body.role !== undefined && body.role !== "ADMIN" && body.role !== "STUDENT") {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }
  const user = await prisma.user.update({
    where: { id },
    data: { role: body.role },
    select: { id: true, email: true, role: true },
  })
  return NextResponse.json(user)
}
