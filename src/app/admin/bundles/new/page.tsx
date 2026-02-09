import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BundleForm } from "../bundle-form"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Admin - Add Bundle",
  description: "Create a new bundle",
}

export default async function AdminNewBundlePage() {
  const resources = await prisma.resource.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true },
  })

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/bundles" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to bundles
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Add Bundle</h1>
      <BundleForm resources={resources} />
    </div>
  )
}
