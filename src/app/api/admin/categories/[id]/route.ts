import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

// PATCH - Update category
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  try {
    const body = await request.json()

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.parentId !== undefined && { parentId: body.parentId }),
        ...(body.order !== undefined && { order: parseInt(body.order) }),
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Admin update category error:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin()
  if (authError) return authError

  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { resources: true, children: true } } },
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    if (category._count.resources > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete: ${category._count.resources} resource(s) use this category. Move or delete them first.`,
        },
        { status: 400 }
      )
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete: Category has subcategories. Delete them first.",
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin delete category error:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
