import Link from "next/link"

import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

export const metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${APP_NAME}.`,
}

export default function TermsPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Last updated: February 2025</p>

        <div className="mt-8 space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p className="mt-2">
              By accessing or using {APP_NAME} (&quot;the Service&quot;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              2. Use of Service
            </h2>
            <p className="mt-2">
              {APP_NAME} provides study materials for nursing students. You agree
              to use the Service only for lawful purposes and in accordance with
              these terms. You may not share account credentials, redistribute
              materials without permission, or use the content for commercial
              purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              3. Subscriptions and Payments
            </h2>
            <p className="mt-2">
              Subscription fees are billed in advance. You may cancel your
              subscription at any time; access will continue until the end of
              your billing period. Refunds are subject to our refund policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              4. Intellectual Property
            </h2>
            <p className="mt-2">
              All content on {APP_NAME} is protected by copyright. You receive a
              limited license to access and use materials for personal study
              purposes only. You may not copy, modify, or distribute our
              content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              5. Disclaimer
            </h2>
            <p className="mt-2">
              Our study materials are for educational purposes only. They do not
              substitute for formal nursing education or professional medical
              advice. Always follow your institution&apos;s guidelines and
              clinical protocols.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">
              6. Contact
            </h2>
            <p className="mt-2">
              For questions about these terms, please contact us at{" "}
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
