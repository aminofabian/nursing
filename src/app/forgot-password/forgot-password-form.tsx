"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => null)
        toast.error(json?.error ?? "Could not start password reset. Please try again.")
        return
      }

      toast.success(
        "If an account exists for this email, you’ll receive a password reset link shortly.",
      )
      router.push("/login")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="text-sm text-muted-foreground">
          Enter the email associated with your account and we&apos;ll send you a link to reset
          your password.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 text-left">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending link..." : "Send reset link"}
          </Button>

          <Button asChild variant="ghost" className="w-full">
            <Link href="/login" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

