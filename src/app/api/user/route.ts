import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Delete user and all related data (cascades based on schema)
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    return NextResponse.json({
      message: "Account deleted successfully",
    })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
