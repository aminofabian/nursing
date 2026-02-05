import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Search,
  Filter,
  BookOpen,
  FileText,
  ClipboardList,
  Pill,
  GraduationCap,
  Stethoscope,
  Download,
  Bookmark,
  ChevronRight,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { RESOURCE_TYPES, DIFFICULTY_LEVELS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Metadata } from "next"

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  FileText,
  ClipboardList,
  Pill,
  GraduationCap,
  Stethoscope,
}

type PageParams = Promise<{ type: string }>
type SearchParams = Promise<{
  category?: string
  difficulty?: string
  search?: string
  page?: string
}>

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { type } = await params
  const typeConfig = Object.values(RESOURCE_TYPES).find((t) => t.slug === type)

  return {
    title: typeConfig?.label || "Resources",
    description: `Browse nursing ${typeConfig?.label?.toLowerCase() || "resources"} - study guides, practice materials, and more`,
  }
}

async function getResourcesByType(
  type: string,
  searchParams: {
    category?: string
    difficulty?: string
    search?: string
    page?: string
  }
) {
  const typeConfig = Object.values(RESOURCE_TYPES).find((t) => t.slug === type)
  if (!typeConfig) return null

  const typeKey = Object.entries(RESOURCE_TYPES).find(
    ([, config]) => config.slug === type
  )?.[0]

  const where: Record<string, unknown> = {
    resourceType: typeKey,
  }

  if (searchParams.category) {
    where.categoryId = searchParams.category
  }

  if (searchParams.difficulty) {
    where.difficulty = searchParams.difficulty.toUpperCase()
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }

  const page = parseInt(searchParams.page || "1")
  const perPage = 12

  const [resources, total, categories] = await Promise.all([
    prisma.resource.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: { downloads: true, savedBy: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.resource.count({ where }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  return { resources, total, categories, page, perPage, typeConfig }
}

export default async function ResourceTypePage({
  params,
  searchParams,
}: {
  params: PageParams
  searchParams: SearchParams
}) {
  const { type } = await params
  const search = await searchParams
  const data = await getResourcesByType(type, search)

  if (!data) {
    notFound()
  }

  const { resources, total, categories, page, perPage, typeConfig } = data
  const totalPages = Math.ceil(total / perPage)
  const Icon = iconMap[typeConfig.icon] || BookOpen

  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-700",
    INTERMEDIATE: "bg-yellow-100 text-yellow-700",
    ADVANCED: "bg-red-100 text-red-700",
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/resources" className="hover:text-foreground transition-colors">
          Resources
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{typeConfig.label}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="p-4 rounded-xl bg-primary/10">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{typeConfig.label}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Browse our collection of {typeConfig.label.toLowerCase()} to help you succeed
            in your nursing studies.
          </p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${typeConfig.label.toLowerCase()}...`}
            defaultValue={search.search}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select defaultValue={search.category || "all"}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue={search.difficulty || "all"}>
            <SelectTrigger className="w-[140px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {DIFFICULTY_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Showing <span className="font-medium text-foreground">{resources.length}</span>{" "}
          of <span className="font-medium text-foreground">{total}</span>{" "}
          {typeConfig.label.toLowerCase()}
        </p>
        <Select defaultValue="recent">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="downloads">Most Downloads</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resource Grid */}
      {resources.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {resources.map((resource) => (
            <Card
              key={resource.id}
              className="group border-none shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Card Image/Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="h-12 w-12 text-primary/40" />
                {resource.isPremium && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    Premium
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  {resource.difficulty && (
                    <Badge
                      variant="secondary"
                      className={
                        difficultyColors[resource.difficulty] || "bg-gray-100"
                      }
                    >
                      {resource.difficulty.toLowerCase()}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                  <Link href={`/resources/${resource.slug}`}>
                    {resource.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {resource.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                    {resource._count.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-3.5 w-3.5" />
                    {resource._count.savedBy}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/resources/${resource.slug}`}>
                    View Resource
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-none shadow-sm">
          <CardContent className="text-center py-16">
            <Icon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No {typeConfig.label.toLowerCase()} found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or check back later for new content
            </p>
            <Button asChild variant="outline">
              <Link href={`/resources/${type}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Clear Filters
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button variant="outline" disabled={page <= 1} asChild={page > 1}>
            {page > 1 ? (
              <Link
                href={`/resources/${type}?page=${page - 1}${search.search ? `&search=${search.search}` : ""}`}
              >
                Previous
              </Link>
            ) : (
              "Previous"
            )}
          </Button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            asChild={page < totalPages}
          >
            {page < totalPages ? (
              <Link
                href={`/resources/${type}?page=${page + 1}${search.search ? `&search=${search.search}` : ""}`}
              >
                Next
              </Link>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
