"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>
        <Button onClick={() => reset()} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  )
}
