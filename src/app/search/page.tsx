import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { RESOURCE_TYPES, DIFFICULTY_LEVELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search as SearchIcon, BookOpen, FileText, ChevronRight } from "lucide-react"
import { formatPrice } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Search",
  description: "Search nursing study resources",
  alternates: {
    canonical: "/search",
  },
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  FileText,
  ClipboardList: FileText,
  Pill: FileText,
  GraduationCap: FileText,
  Stethoscope: FileText,
}

async function getSearchResults(params: {
  q?: string
  type?: string
  category?: string
  difficulty?: string
  page?: string
}) {
  const where: Record<string, unknown> = {}
  if (params.type && params.type !== "all") {
    where.resourceType = params.type.toUpperCase().replace(/-/g, "_")
  }
  if (params.category && params.category !== "all") {
    where.categoryId = params.category
  }
  if (params.difficulty && params.difficulty !== "all") {
    where.difficulty = params.difficulty.toUpperCase()
  }
  if (params.q?.trim()) {
    where.OR = [
      { title: { contains: params.q.trim() } },
      { description: { contains: params.q.trim() } },
    ]
  }

  const page = parseInt(params.page || "1")
  const perPage = 12

  const [resources, total, categories] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: {
        category: true,
        _count: { select: { downloads: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.resource.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ])

  return { resources, total, categories, page, perPage }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; category?: string; difficulty?: string; page?: string }>
}) {
  const params = await searchParams
  const { resources, total, categories, page, perPage } = await getSearchResults(params)
  const totalPages = Math.ceil(total / perPage)
  const query = params.q?.trim() || ""

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Search Resources</h1>
        <p className="text-muted-foreground">
          {query
            ? `Results for "${query}"`
            : "Use the filters below or search from the header."}
        </p>
      </div>

      {/* Filters - GET form */}
      <div className="flex flex-wrap gap-3 mb-8">
        <form method="GET" action="/search" className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center w-full sm:w-auto">
            <input
              type="search"
              name="q"
              defaultValue={params.q}
              placeholder="Search..."
              className="h-11 sm:h-10 px-4 rounded-md border border-input bg-background text-base sm:text-sm w-full sm:w-48 md:w-64 min-h-[44px]"
            />
          <select
            name="type"
            defaultValue={params.type || "all"}
            className="h-11 sm:h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 text-base sm:text-sm min-h-[44px]"
          >
            <option value="all">All types</option>
            {Object.entries(RESOURCE_TYPES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={params.category || "all"}
            className="h-11 sm:h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 text-base sm:text-sm min-h-[44px]"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="difficulty"
            defaultValue={params.difficulty || "all"}
            className="h-11 sm:h-10 w-full sm:w-[140px] rounded-md border border-input bg-background px-3 text-base sm:text-sm min-h-[44px]"
          >
            <option value="all">All</option>
            {DIFFICULTY_LEVELS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <Button type="submit">
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {resources.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-4">
              Try different keywords or filters.
            </p>
            <Button asChild variant="outline">
              <Link href="/resources">Browse all resources</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {total} result{total !== 1 ? "s" : ""}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const typeSlug =
                RESOURCE_TYPES[resource.resourceType as keyof typeof RESOURCE_TYPES]?.slug ?? "notes"
              const Icon =
                iconMap[
                  RESOURCE_TYPES[resource.resourceType as keyof typeof RESOURCE_TYPES]?.icon ?? "BookOpen"
                ] ?? BookOpen
              return (
                <Card key={resource.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <Badge variant="outline">
                        {RESOURCE_TYPES[resource.resourceType as keyof typeof RESOURCE_TYPES]?.label ??
                          resource.resourceType}
                      </Badge>
                      {resource.isPremium && (
                        <Badge variant="secondary">Premium</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {resource.title}
                    </CardTitle>
                    {resource.description && (
                      <CardDescription className="line-clamp-2">
                        {resource.description}
                      </CardDescription>
                    )}
                    {resource.category && (
                      <p className="text-xs text-muted-foreground">
                        {resource.category.name}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 pb-2">
                    <p className="text-sm text-muted-foreground">
                      {resource.downloadCount} downloads
                      {resource.isPremium && resource.price != null && (
                        <> · {formatPrice(resource.price)}</>
                      )}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button asChild size="sm" className="w-full">
                      <Link
                        href={`/resources/${typeSlug}/${resource.slug}`}
                        className="gap-1"
                      >
                        View
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(params.q && { q: params.q }),
                      ...(params.type && params.type !== "all" && { type: params.type }),
                      ...(params.category && params.category !== "all" && { category: params.category }),
                      ...(params.difficulty && params.difficulty !== "all" && { difficulty: params.difficulty }),
                      page: String(page - 1),
                    }).toString()}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/search?${new URLSearchParams({
                      ...(params.q && { q: params.q }),
                      ...(params.type && params.type !== "all" && { type: params.type }),
                      ...(params.category && params.category !== "all" && { category: params.category }),
                      ...(params.difficulty && params.difficulty !== "all" && { difficulty: params.difficulty }),
                      page: String(page + 1),
                    }).toString()}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
