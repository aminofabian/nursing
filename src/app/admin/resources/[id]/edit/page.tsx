import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ResourceForm } from "../../resource-form"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Admin - Edit Resource",
  description: "Edit resource",
}

export default async function AdminEditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [resource, categories] = await Promise.all([
    prisma.resource.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ])

  if (!resource) notFound()

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/resources" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>
      <ResourceForm resource={resource} categories={categories} />
    </div>
  )
}
