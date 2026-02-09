import type { Metadata } from "next"

import { APP_NAME } from "@/lib/constants"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: `Choose a new ${APP_NAME} password.`,
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  )
}

