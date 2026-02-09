import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError

  const bundles = await prisma.bundle.findMany({
    include: {
      _count: { select: { resources: true } },
    },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(bundles)
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin()
  if (authError) return authError

  const body = await request.json()
  const { name, description, price, resourceIds } = body

  const slug =
    body.slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const bundle = await prisma.bundle.create({
    data: {
      name,
      slug,
      description: description || null,
      price: parseInt(price) || 0,
      isActive: body.isActive ?? true,
    },
  })

  if (Array.isArray(resourceIds) && resourceIds.length > 0) {
    for (const resourceId of resourceIds) {
      try {
        await prisma.bundleResource.create({
          data: { bundleId: bundle.id, resourceId },
        })
      } catch {
        // skip duplicate
      }
    }
  }

  const withResources = await prisma.bundle.findUnique({
    where: { id: bundle.id },
    include: { _count: { select: { resources: true } } },
  })
  return NextResponse.json(withResources ?? bundle)
}
