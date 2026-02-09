import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"

export const metadata = {
  title: "Forgot Password",
  description: `Reset your ${APP_NAME} password.`,
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Forgot password?</h1>
            <p className="text-sm text-muted-foreground">
              Password reset is not yet available. Please contact us and we’ll
              help you regain access to your account.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/contact">Contact support</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
