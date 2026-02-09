import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { RESOURCE_TYPES } from "@/lib/constants"
import { AdminResourceActions } from "./resource-actions"

export const metadata = {
  title: "Admin - Resources",
  description: "Manage resources",
}

export default async function AdminResourcesPage() {
  const resources = await prisma.resource.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground">
            Manage study resources and content
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Resource
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
          <CardDescription>
            {resources.length} resource{resources.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resources.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell className="font-medium">{resource.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {RESOURCE_TYPES[resource.resourceType]?.label ||
                          resource.resourceType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {resource.category?.name || "—"}
                    </TableCell>
                    <TableCell>
                      {resource.isPublished ? (
                        <Badge variant="default" className="gap-1">
                          <Eye className="h-3 w-3" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{resource.downloadCount}</TableCell>
                    <TableCell className="text-right">
                      <AdminResourceActions resource={resource} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No resources yet. Add your first resource to get started.
              </p>
              <Button asChild>
                <Link href="/admin/resources/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
