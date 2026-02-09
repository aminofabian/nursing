import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ResourceForm } from "../resource-form"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Admin - Add Resource",
  description: "Create a new resource",
}

export default async function AdminNewResourcePage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

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
      <h1 className="text-2xl font-bold mb-6">Add Resource</h1>
      <ResourceForm categories={categories} />
    </div>
  )
}
