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
import { Plus, Pencil, Package } from "lucide-react"
import { formatPrice } from "@/lib/constants"
import { AdminBundleActions } from "./bundle-actions"

export const metadata = {
  title: "Admin - Bundles",
  description: "Bundle management",
}

export default async function AdminBundlesPage() {
  const bundles = await prisma.bundle.findMany({
    include: { _count: { select: { resources: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bundles</h1>
          <p className="text-muted-foreground">
            Create and manage resource bundles
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/bundles/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Bundle
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Bundles
          </CardTitle>
          <CardDescription>
            {bundles.length} bundle{bundles.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bundles.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell className="font-medium">{bundle.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {bundle.slug}
                      </TableCell>
                      <TableCell>{formatPrice(bundle.price)}</TableCell>
                      <TableCell>{bundle._count.resources}</TableCell>
                      <TableCell>
                        <Badge
                          variant={bundle.isActive ? "default" : "secondary"}
                        >
                          {bundle.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AdminBundleActions bundle={bundle} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                No bundles yet. Create your first bundle.
              </p>
              <Button asChild>
                <Link href="/admin/bundles/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bundle
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
