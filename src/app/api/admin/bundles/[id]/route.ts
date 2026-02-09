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
  const bundle = await prisma.bundle.findUnique({
    where: { id },
    include: {
      resources: { include: { resource: true } },
      _count: { select: { resources: true } },
    },
  })
  if (!bundle) {
    return NextResponse.json({ error: "Bundle not found" }, { status: 404 })
  }
  return NextResponse.json(bundle)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  const body = await request.json()

  const updateData: {
    name?: string
    slug?: string
    description?: string | null
    price?: number
    isActive?: boolean
  } = {}
  if (body.name !== undefined) updateData.name = body.name
  if (body.slug !== undefined) updateData.slug = body.slug
  if (body.description !== undefined) updateData.description = body.description
  if (body.price !== undefined) updateData.price = parseInt(body.price)
  if (body.isActive !== undefined) updateData.isActive = body.isActive

  const bundle = await prisma.bundle.update({
    where: { id },
    data: updateData,
  })

  if (Array.isArray(body.resourceIds)) {
    await prisma.bundleResource.deleteMany({ where: { bundleId: id } })
    for (const resourceId of body.resourceIds) {
      try {
        await prisma.bundleResource.create({
          data: { bundleId: id, resourceId },
        })
      } catch {
        // skip duplicate
      }
    }
  }

  const updated = await prisma.bundle.findUnique({
    where: { id },
    include: { _count: { select: { resources: true } } },
  })
  return NextResponse.json(updated ?? bundle)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params
  await prisma.bundleResource.deleteMany({ where: { bundleId: id } })
  await prisma.bundle.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
