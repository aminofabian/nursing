import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { resetPasswordSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const { password, token } = parsed.data

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    })

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
          id: { not: resetToken.id },
        },
      }),
    ])

    return NextResponse.json(
      { message: "Your password has been reset successfully." },
      { status: 200 },
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

