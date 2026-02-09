import type { Metadata } from "next"
import { Mail } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${APP_NAME} team. We're here to help.`,
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          Have a question or feedback? We&apos;d love to hear from you...
        </p>

        <Card className="mt-8">
          <CardHeader>
            <h2 className="font-semibold">Send a message</h2>
            <p className="text-sm text-muted-foreground">
              Note: Form submission is not yet connected. For now, reach out
              directly at{" "}
              <a
                href="mailto:contact@nursehub.com"
                className="font-medium text-primary hover:underline"
              >
                contact@nursehub.com
              </a>
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={5}
                />
              </div>
              <Button type="button" disabled>
                Send (coming in Phase 4)
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center gap-4 rounded-lg border p-4">
          <Mail className="size-6 text-primary" />
          <div>
            <p className="font-medium">Email us directly</p>
            <a
              href="mailto:contact@nursehub.com"
              className="text-primary hover:underline"
            >
              contact@nursehub.com
            </a>
          </div>
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
