"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Sparkles, Shield, Clock, Download, HeadphonesIcon } from "lucide-react"
import { PLANS } from "@/lib/stripe-config"
import { toast } from "sonner"

export default function SubscribePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null)

  const handleSubscribe = async (plan: "monthly" | "yearly") => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/subscribe")
      return
    }

    setLoading(plan)

    try {
      const response = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Something went wrong. Please try again.")
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Limited Time Offer
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get unlimited access to all nursing study resources. Start studying smarter today.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <Card className="relative border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl">Monthly</CardTitle>
              <CardDescription>Perfect for short-term studying</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{PLANS.monthly.priceDisplay}</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PLANS.monthly.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                size="lg"
                onClick={() => handleSubscribe("monthly")}
                disabled={loading !== null}
              >
                {loading === "monthly" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Monthly"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Yearly Plan */}
          <Card className="relative border-2 border-blue-500 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-500 hover:bg-blue-600">
                {PLANS.yearly.savings}
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Yearly</CardTitle>
              <CardDescription>Best value for dedicated students</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{PLANS.yearly.priceDisplay}</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                That&apos;s only $6.67/month!
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {PLANS.yearly.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
                onClick={() => handleSubscribe("yearly")}
                disabled={loading !== null}
              >
                {loading === "yearly" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Yearly"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <span>Instant Access</span>
          </div>
          <div className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            <span>24/7 Support</span>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions?</h2>
          <p className="text-gray-600 mb-4">
            Check out our{" "}
            <Link href="/pricing#faq" className="text-blue-600 hover:underline">
              Pricing FAQ
            </Link>{" "}
            or{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-8 max-w-2xl mx-auto text-center p-6 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-green-700 text-sm">
            Not satisfied? Get a full refund within 30 days, no questions asked.
            We&apos;re confident you&apos;ll love our resources.
          </p>
        </div>
      </div>
    </div>
  )
}
