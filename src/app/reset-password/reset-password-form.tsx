"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    const t = searchParams.get("token")
    if (t) {
      setToken(t)
      setValue("token", t)
    } else {
      toast.error("Reset link is missing or invalid.")
      router.push("/forgot-password")
    }
  }, [router, searchParams, setValue])

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json().catch(() => null)

      if (!res.ok) {
        toast.error(json?.error ?? "Could not reset password. Please request a new link.")
        return
      }

      toast.success("Your password has been reset. You can now sign in.")
      router.push("/login")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Set a new password</h1>
        <p className="text-sm text-muted-foreground">
          Choose a strong password you don&apos;t use elsewhere.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("token")} />

          <div className="space-y-2 text-left">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !token}>
            {isSubmitting ? "Updating password..." : "Update password"}
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

