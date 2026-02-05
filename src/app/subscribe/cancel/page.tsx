import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, MessageCircle, HelpCircle } from "lucide-react"

export default function SubscribeCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Cancel Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <XCircle className="h-12 w-12 text-gray-400" />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Checkout Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            No worries! Your payment was not processed. You can always come back when you&apos;re ready.
          </p>

          {/* Options Card */}
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle>Not sure yet?</CardTitle>
              <CardDescription>
                Here are some things that might help
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Check our FAQ</h3>
                  <p className="text-gray-600 text-sm">
                    Find answers to common questions about our plans and resources.
                  </p>
                  <Link href="/pricing#faq" className="text-blue-600 text-sm hover:underline">
                    View FAQ →
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold">Talk to us</h3>
                  <p className="text-gray-600 text-sm">
                    Have questions? We&apos;re happy to help you decide.
                  </p>
                  <Link href="/contact" className="text-blue-600 text-sm hover:underline">
                    Contact support →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/subscribe">
              <Button size="lg" className="w-full sm:w-auto">
                Try Again
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Free Resources
              </Button>
            </Link>
          </div>

          {/* Note about free resources */}
          <p className="mt-8 text-sm text-gray-500">
            You can still browse and access our free resources without a subscription.
          </p>
        </div>
      </div>
    </div>
  )
}
