import Link from "next/link"

import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${APP_NAME}.`,
}

export default function PrivacyPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">
          Last updated: February 2025
        </p>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We collect information you provide when registering (name, email,
              password), information about your subscription and purchases, and
              usage data such as which resources you access and download.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. How We Use Your Information
            </h2>
            <p className="mt-2">
              We use your information to provide and improve the Service,
              process payments, send important account notifications, and
              comply with legal obligations. We do not sell your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Payment Information
            </h2>
            <p className="mt-2">
              Payment processing is handled by Stripe. We do not store your full
              credit card details. Stripe&apos;s privacy policy applies to
              payment data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Data Security
            </h2>
            <p className="mt-2">
              We implement appropriate security measures to protect your
              personal information. Passwords are hashed and never stored in
              plain text.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Your Rights
            </h2>
            <p className="mt-2">
              You may access, update, or delete your account data at any time
              through your account settings. You may also request a copy of your
              data or withdraw consent where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Cookies
            </h2>
            <p className="mt-2">
              We use cookies and similar technologies for authentication,
              session management, and analytics. You can control cookie
              preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              7. Contact
            </h2>
            <p className="mt-2">
              For privacy-related questions, contact us at{" "}
              <a
                href="mailto:contact@nursehub.com"
                className="text-primary hover:underline"
              >
                contact@nursehub.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
