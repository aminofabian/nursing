"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CreditCard, Crown, ExternalLink, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Subscription {
  id: string
  plan: string
  status: string
  startsAt: Date
  endsAt: Date
  cancelledAt: Date | null
}

interface SubscriptionSettingsProps {
  subscription: Subscription | null
  hasStripeCustomer: boolean
}

export function SubscriptionSettings({
  subscription,
  hasStripeCustomer,
}: SubscriptionSettingsProps) {
  const [loading, setLoading] = useState(false)

  const handleManageSubscription = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to open billing portal")
      }

      // Redirect to Stripe billing portal
      window.location.href = data.url
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>
      case "EXPIRED":
        return <Badge variant="destructive">Expired</Badge>
      case "CANCELLED":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // No subscription
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>
            You don&apos;t have an active subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Crown className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Go Premium</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Unlock unlimited access to all nursing resources, practice exams,
              and exclusive study materials.
            </p>
            <Button asChild>
              <Link href="/subscribe">
                View Plans
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Has subscription
  return (
    <div className="space-y-6">
      {/* Past Due Warning */}
      {subscription.status === "PENDING" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Payment Pending</AlertTitle>
          <AlertDescription>
            Your payment is pending. Please complete the payment to activate
            your subscription.
          </AlertDescription>
        </Alert>
      )}

      {/* Cancellation Notice */}
      {subscription.cancelledAt && subscription.status === "ACTIVE" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Subscription Cancelled</AlertTitle>
          <AlertDescription>
            Your subscription will end on{" "}
            {format(new Date(subscription.endsAt), "MMMM d, yyyy")}. You can
            reactivate anytime before then.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <CardTitle>Premium Subscription</CardTitle>
            </div>
            {getStatusBadge(subscription.status)}
          </div>
          <CardDescription>
            {subscription.plan === "YEARLY" ? "Annual" : "Monthly"} plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Period</p>
              <p className="font-medium">
                {format(new Date(subscription.startsAt), "MMM d, yyyy")} -{" "}
                {format(new Date(subscription.endsAt), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="font-medium">
                {subscription.plan === "YEARLY"
                  ? "$79.99/year"
                  : "$9.99/month"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Your Benefits</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Unlimited access to all resources</li>
              <li>✓ New content added weekly</li>
              <li>✓ Download in PDF format</li>
              <li>✓ Priority support</li>
              {subscription.plan === "YEARLY" && (
                <>
                  <li>✓ Early access to new content</li>
                  <li>✓ Exclusive study guides</li>
                </>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleManageSubscription}
            disabled={loading || !hasStripeCustomer}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Manage Subscription
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            Update payment method, change plan, or cancel
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
