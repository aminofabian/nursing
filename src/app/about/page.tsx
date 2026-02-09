import type { Metadata } from "next"
import { Stethoscope } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { APP_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${APP_NAME} - the nursing study resource platform built for students, by students.`,
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="size-6" />
          </div>
          <h1 className="text-3xl font-bold">About {APP_NAME}</h1>
        </div>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p className="text-lg">
            {APP_NAME} was created to solve a simple problem: nursing students
            deserve access to quality, organized study materials without the
            overwhelm.
          </p>
          <p>
            We&apos;re a team of nursing graduates and educators who remember
            what it was like—scattered PDFs, outdated hand-me-down notes, and
            never knowing what to study first. We built {APP_NAME} to change
            that.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p>
            To provide nursing students with curated, exam-focused content that
            helps them study smarter—not harder. One login, everything you need
            to pass.
          </p>
          <h2 className="text-xl font-semibold text-foreground">What We Offer</h2>
          <ul className="list-inside list-disc space-y-2">
            <li>Study notes organized by topic and year level</li>
            <li>NCLEX-style practice exams with rationales</li>
            <li>Care plan templates for clinical rotations</li>
            <li>Drug guides and dosage calculations</li>
            <li>NCLEX prep materials and strategies</li>
            <li>Clinical rotation survival guides</li>
          </ul>
          <div className="pt-4">
            <Button asChild>
              <Link href="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
