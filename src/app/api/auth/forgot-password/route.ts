import { NextResponse } from "next/server"
import crypto from "crypto"

import { prisma } from "@/lib/prisma"
import { forgotPasswordSchema } from "@/lib/validations/auth"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      )
    }

    const { email } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    })

    // Always respond with success to avoid email enumeration
    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists for this email, you will receive a password reset link shortly.",
        },
        { status: 200 },
      )
    }

    // Invalidate existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    })

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })

    // Send email (best-effort)
    await sendPasswordResetEmail({
      name: user.name,
      email: user.email,
      token,
    })

    return NextResponse.json(
      {
        message:
          "If an account exists for this email, you will receive a password reset link shortly.",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}

