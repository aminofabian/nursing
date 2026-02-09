import { prisma } from "@/lib/prisma"
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
import { AdminCategoryActions } from "./category-actions"
import { CategoryFormDialog } from "./category-form-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Admin - Categories",
  description: "Manage categories",
}

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { resources: true, children: true } },
      parent: true,
    },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Organize resources by category
          </p>
        </div>
        <CategoryFormDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </CategoryFormDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell>
                      {category.parent?.name || "—"}
                    </TableCell>
                    <TableCell>{category._count.resources}</TableCell>
                    <TableCell>{category.order}</TableCell>
                    <TableCell className="text-right">
                      <AdminCategoryActions
                        category={category}
                        categories={categories.filter((c) => c.id !== category.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No categories yet. Add your first category.
              </p>
              <CategoryFormDialog>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CategoryFormDialog>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
