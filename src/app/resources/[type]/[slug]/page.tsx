import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  ClipboardList,
  Pill,
  GraduationCap,
  Stethoscope,
  Download,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Clock,
  Tag,
  Share2,
  Crown,
  Lock,
  CheckCircle,
} from "lucide-react"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { APP_URL, RESOURCE_TYPES } from "@/lib/constants"
import { formatDistanceToNow } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen,
  FileText,
  ClipboardList,
  Pill,
  GraduationCap,
  Stethoscope,
}

type PageParams = Promise<{ type: string; slug: string }>

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { type, slug } = await params
  const resource = await prisma.resource.findUnique({
    where: { slug },
    select: { title: true, description: true },
  })

  if (!resource) {
    return { title: "Resource Not Found" }
  }

  const base = APP_URL.replace(/\/$/, "")
  const path = `/resources/${type}/${slug}`
  const url = `${base}${path}`

  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      url,
      type: "article",
    },
    alternates: {
      canonical: path,
    },
  }
}

async function getResource(slug: string, userId?: string) {
  const resource = await prisma.resource.findUnique({
    where: { slug },
    include: {
      category: true,
      _count: {
        select: { downloads: true, savedBy: true },
      },
    },
  })

  if (!resource) return null

  let isSaved = false
  if (userId) {
    const saved = await prisma.savedResource.findUnique({
      where: {
        userId_resourceId: {
          userId,
          resourceId: resource.id,
        },
      },
    })
    isSaved = !!saved
  }

  // Get related resources
  const relatedResources = await prisma.resource.findMany({
    where: {
      categoryId: resource.categoryId,
      id: { not: resource.id },
    },
    include: {
      _count: {
        select: { downloads: true },
      },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  return { resource, isSaved, relatedResources }
}

export default async function ResourcePage({
  params,
}: {
  params: PageParams
}) {
  const { type, slug } = await params
  const session = await auth()
  const data = await getResource(slug, session?.user?.id)

  if (!data) {
    notFound()
  }

  const { resource, isSaved, relatedResources } = data

  const typeConfig = Object.values(RESOURCE_TYPES).find((t) => t.slug === type)
  const Icon = typeConfig ? iconMap[typeConfig.icon] || FileText : FileText

  const resourceTypeColors: Record<string, string> = {
    STUDY_GUIDE: "bg-blue-500/10 text-blue-600 border-blue-200",
    NOTES: "bg-blue-500/10 text-blue-600 border-blue-200",
    PRACTICE_EXAM: "bg-purple-500/10 text-purple-600 border-purple-200",
    CARE_PLAN: "bg-red-500/10 text-red-600 border-red-200",
    NCLEX_PREP: "bg-green-500/10 text-green-600 border-green-200",
    DRUG_GUIDE: "bg-orange-500/10 text-orange-600 border-orange-200",
    CLINICAL: "bg-cyan-500/10 text-cyan-600 border-cyan-200",
  }

  const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-700",
    INTERMEDIATE: "bg-yellow-100 text-yellow-700",
    ADVANCED: "bg-red-100 text-red-700",
  }

  const canAccess =
    !resource.isPremium ||
    session?.user?.hasActiveSubscription ||
    session?.user?.role === "ADMIN"

  return (
    <div className="container py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/resources" className="hover:text-foreground transition-colors">
          Resources
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/resources/${type}`}
          className="hover:text-foreground transition-colors"
        >
          {typeConfig?.label || type}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {resource.title}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Resource Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
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
                  className={difficultyColors[resource.difficulty] || "bg-gray-100"}
                >
                  {resource.difficulty.toLowerCase()}
                </Badge>
              )}
              {resource.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{resource.title}</h1>

            <p className="text-lg text-muted-foreground">{resource.description}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {resource.category?.name || "Uncategorized"}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {formatDistanceToNow(resource.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="h-4 w-4" />
                {resource._count.downloads} downloads
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="h-4 w-4" />
                {resource._count.savedBy} saves
              </span>
            </div>
          </div>

          {/* Preview Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center relative">
              <Icon className="h-24 w-24 text-primary/30" />
              {!canAccess && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Premium Content</h3>
                  <p className="text-muted-foreground mb-4 text-center max-w-sm">
                    Subscribe to unlock this resource and access our entire library
                  </p>
                  <Button asChild>
                    <Link href="/pricing">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Content Section */}
          {canAccess && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>What&apos;s Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Comprehensive study material",
                    "Clear explanations and examples",
                    "Practice questions with answers",
                    "Printable PDF format",
                    "Regular updates",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card className="border-none shadow-sm sticky top-24">
            <CardContent className="p-6 space-y-4">
              {canAccess ? (
                <>
                  <Button className="w-full gap-2" size="lg">
                    <Download className="h-4 w-4" />
                    Download Resource
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                        Saved to Library
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" />
                        Save to Library
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <Crown className="h-10 w-10 mx-auto text-amber-500 mb-3" />
                    <h3 className="font-semibold mb-1">Premium Resource</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Subscribe to access this resource
                    </p>
                  </div>
                  <Button asChild className="w-full gradient-primary" size="lg">
                    <Link href="/pricing">View Plans</Link>
                  </Button>
                  {!session?.user && (
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <Link href="/login">Sign In</Link>
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resource Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{resource.category?.name || "Uncategorized"}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  {resource.resourceType.replace(/_/g, " ")}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium">
                  {resource.difficulty?.toLowerCase() || "All levels"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">
                  {formatDistanceToNow(resource.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedResources.map((related) => (
              <Card
                key={related.id}
                className="group border-none shadow-sm hover:shadow-lg transition-all"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={
                        resourceTypeColors[related.resourceType] ||
                        "bg-gray-100 text-gray-600"
                      }
                    >
                      {related.resourceType.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
                    <Link href={`/resources/${type}/${related.slug}`}>
                      {related.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {related.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {related._count.downloads}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
