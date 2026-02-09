import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { BundleForm } from "../../bundle-form"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Admin - Edit Bundle",
  description: "Edit bundle",
}

export default async function AdminEditBundlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [bundle, resources] = await Promise.all([
    prisma.bundle.findUnique({ where: { id } }),
    prisma.resource.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true },
    }),
  ])

  if (!bundle) notFound()

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
      <h1 className="text-2xl font-bold mb-6">Edit Bundle</h1>
      <BundleForm
        bundle={{
          id: bundle.id,
          name: bundle.name,
          slug: bundle.slug,
          description: bundle.description,
          price: bundle.price,
          isActive: bundle.isActive,
        }}
        resources={resources}
      />
    </div>
  )
}
