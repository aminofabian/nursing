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
  SlidersHorizontal,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
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

export const metadata = {
  title: "Resources",
  description: "Browse nursing study resources, practice exams, care plans, and more",
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  FileText,
  ClipboardList,
  Pill,
  GraduationCap,
  Stethoscope,
}

async function getResources(searchParams: {
  type?: string
  category?: string
  difficulty?: string
  search?: string
  page?: string
}) {
  const where: Record<string, unknown> = {}

  if (searchParams.type) {
    where.resourceType = searchParams.type.toUpperCase().replace(/-/g, "_")
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

  return { resources, total, categories, page, perPage }
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string
    category?: string
    difficulty?: string
    search?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const session = await auth()
  const { resources, total, categories, page, perPage } = await getResources(params)
  const totalPages = Math.ceil(total / perPage)

  const resourceTypeColors: Record<string, string> = {
    STUDY_GUIDE: "bg-blue-500/10 text-blue-600 border-blue-200",
    NOTES: "bg-blue-500/10 text-blue-600 border-blue-200",
    PRACTICE_EXAM: "bg-purple-500/10 text-purple-600 border-purple-200",
    CARE_PLAN: "bg-red-500/10 text-red-600 border-red-200",
    NCLEX_PREP: "bg-green-500/10 text-green-600 border-green-200",
    DRUG_GUIDE: "bg-orange-500/10 text-orange-600 border-orange-200",
    CLINICAL: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
    CHEAT_SHEET: "bg-pink-500/10 text-pink-600 border-pink-200",
    FLASHCARD: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
  }

  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-700",
    INTERMEDIATE: "bg-yellow-100 text-yellow-700",
    ADVANCED: "bg-red-100 text-red-700",
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Resources...</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Browse our comprehensive library of nursing study materials, practice exams,
          care plans, and more.
        </p>
      </div>

      {/* Resource Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {Object.entries(RESOURCE_TYPES).map(([key, type]) => {
          const Icon = iconMap[type.icon] || BookOpen
          const isActive = params.type === type.slug
          return (
            <Link
              key={key}
              href={isActive ? "/resources" : `/resources?type=${type.slug}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:shadow-md ${
                isActive
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-transparent bg-muted/50 hover:bg-muted"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  isActive ? "bg-primary text-white" : "bg-background"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-center">{type.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            defaultValue={params.search}
            className="pl-10"
          />
        </div>
        <div className="flex gap-3">
          <Select defaultValue={params.category || "all"}>
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
          <Select defaultValue={params.difficulty || "all"}>
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
          of <span className="font-medium text-foreground">{total}</span> resources
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
                <FileText className="h-12 w-12 text-primary/40" />
                {resource.isPremium && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    Premium
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className={
                      resourceTypeColors[resource.resourceType] ||
                      "bg-gray-100 text-gray-600"
                    }
                  >
                    {resource.resourceType.replace(/_/g, " ")}
                  </Badge>
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
            <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search term
            </p>
            <Button asChild variant="outline">
              <Link href="/resources">Clear Filters</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <Button
            variant="outline"
            disabled={page <= 1}
            asChild={page > 1}
          >
            {page > 1 ? (
              <Link
                href={`/resources?page=${page - 1}${params.type ? `&type=${params.type}` : ""}${params.search ? `&search=${params.search}` : ""}`}
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
                href={`/resources?page=${page + 1}${params.type ? `&type=${params.type}` : ""}${params.search ? `&search=${params.search}` : ""}`}
              >
                Next
              </Link>
            ) : (
              "Next"
            )}
          </Button>
        </div>
      )}

      {/* CTA Section */}
      {!session?.user?.hasActiveSubscription && (
        <div className="mt-16">
          <Card className="border-none shadow-lg gradient-hero text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Unlock All Resources
                </h3>
                <p className="text-white/80 max-w-md">
                  Get unlimited access to our entire library of nursing study materials,
                  practice exams, and more with a premium subscription.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shrink-0"
              >
                <Link href="/pricing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
