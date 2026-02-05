import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PRICING,
  SUBSCRIPTION_BENEFITS,
  SINGLE_RESOURCE_PRICES,
  formatPrice,
} from "@/lib/constants"

export const metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for nursing study resources. Subscribe for unlimited access or purchase individual resources.",
}

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that works for your study goals
          </p>
        </div>

        {/* Subscription plans */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Monthly</h2>
              <div>
                <span className="text-4xl font-bold">
                  {formatPrice(PRICING.MONTHLY)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Billed monthly. Cancel anytime.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {SUBSCRIPTION_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <Check className="size-5 shrink-0 text-primary" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/login?subscribe=monthly">Subscribe</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="relative border-primary">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
              Recommended
            </Badge>
            <Badge variant="secondary" className="absolute -top-3 right-4">
              Save 33%
            </Badge>
            <CardHeader>
              <h2 className="text-xl font-semibold">Yearly</h2>
              <div>
                <span className="text-4xl font-bold">
                  {formatPrice(PRICING.YEARLY)}
                </span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Billed annually. Best value.
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {SUBSCRIPTION_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <Check className="size-5 shrink-0 text-primary" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full" size="lg">
                <Link href="/login?subscribe=yearly">Subscribe</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pay-per-resource */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold">Pay Per Resource</h2>
          <p className="mt-2 text-muted-foreground">
            Not ready for a subscription? Purchase individual resources.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Card className="min-w-[200px]">
              <CardContent className="pt-6">
                <p className="font-medium">Single past exam</p>
                <p className="text-2xl font-bold">
                  {formatPrice(SINGLE_RESOURCE_PRICES.PRACTICE_EXAM)}
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/resources">Browse Exams</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="min-w-[200px]">
              <CardContent className="pt-6">
                <p className="font-medium">Care plan bundle</p>
                <p className="text-2xl font-bold">
                  {formatPrice(SINGLE_RESOURCE_PRICES.CARE_PLAN_BUNDLE)}
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/resources/care-plans">Browse Care Plans</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="min-w-[200px]">
              <CardContent className="pt-6">
                <p className="font-medium">Exam prep kit</p>
                <p className="text-2xl font-bold">
                  {formatPrice(SINGLE_RESOURCE_PRICES.EXAM_PREP_KIT)}
                </p>
                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href="/resources/nclex">Browse NCLEX Prep</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-16 rounded-lg border bg-muted/30 p-6 text-center">
          <p className="font-medium">30-Day Money-Back Guarantee</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Not satisfied? Contact us within 30 days for a full refund. No
            questions asked.
          </p>
        </div>

        {/* FAQ link */}
        <p className="mt-8 text-center">
          <Link
            href="/#faq"
            className="text-sm font-medium text-primary hover:underline"
          >
            Have questions? Check our FAQ
          </Link>
        </p>
      </div>
    </div>
  )
}
