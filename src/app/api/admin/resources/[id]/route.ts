import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { ResourceType } from "@prisma/client"

// GET - Single resource
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  const resource = await prisma.resource.findUnique({
    where: { id },
    include: { category: true, tags: { include: { tag: true } } },
  })

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 })
  }

  return NextResponse.json(resource)
}

// PATCH - Update resource
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  try {
    const body = await request.json()

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.resourceType !== undefined && {
          resourceType: body.resourceType as ResourceType,
        }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.yearLevel !== undefined && {
          yearLevel: body.yearLevel ? parseInt(body.yearLevel) : null,
        }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
        ...(body.fileUrl !== undefined && { fileUrl: body.fileUrl }),
        ...(body.previewUrl !== undefined && { previewUrl: body.previewUrl }),
        ...(body.thumbnailUrl !== undefined && {
          thumbnailUrl: body.thumbnailUrl,
        }),
        ...(body.fileSize !== undefined && {
          fileSize: body.fileSize ? parseInt(body.fileSize) : null,
        }),
        ...(body.isPremium !== undefined && { isPremium: body.isPremium }),
        ...(body.price !== undefined && {
          price: body.price ? parseInt(body.price) : null,
        }),
        ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      },
      include: { category: true },
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Admin update resource error:", error)
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    )
  }
}

// DELETE - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  try {
    await prisma.resource.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin delete resource error:", error)
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    )
  }
}
