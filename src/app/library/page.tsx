import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Bookmark,
  FileText,
  Trash2,
  Download,
  Clock,
  Search,
  SortAsc,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "@/lib/utils"

export const metadata = {
  title: "My Library",
  description: "Your saved nursing resources",
}

async function getSavedResources(userId: string) {
  return prisma.savedResource.findMany({
    where: { userId },
    include: {
      resource: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

async function getDownloadHistory(userId: string) {
  return prisma.download.findMany({
    where: { userId },
    include: {
      resource: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export default async function LibraryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const [savedResources, downloads] = await Promise.all([
    getSavedResources(session.user.id),
    getDownloadHistory(session.user.id),
  ])

  const resourceTypeColors: Record<string, string> = {
    STUDY_GUIDE: "bg-blue-500/10 text-blue-600",
    PRACTICE_EXAM: "bg-purple-500/10 text-purple-600",
    CARE_PLAN: "bg-red-500/10 text-red-600",
    NCLEX_PREP: "bg-green-500/10 text-green-600",
    CHEAT_SHEET: "bg-orange-500/10 text-orange-600",
    FLASHCARD: "bg-pink-500/10 text-pink-600",
    VIDEO: "bg-cyan-500/10 text-cyan-600",
    AUDIO: "bg-indigo-500/10 text-indigo-600",
  }

  return (
    <div className="container py-8 md:py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-primary" />
            My Library
          </h1>
          <p className="text-muted-foreground mt-1">
            {savedResources.length} saved resource{savedResources.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search library..."
              className="pl-10 w-[200px] md:w-[250px]"
            />
          </div>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[130px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="saved" className="space-y-6">
        <TabsList>
          <TabsTrigger value="saved" className="gap-2">
            <Bookmark className="h-4 w-4" />
            Saved ({savedResources.length})
          </TabsTrigger>
          <TabsTrigger value="downloads" className="gap-2">
            <Download className="h-4 w-4" />
            Downloads ({downloads.length})
          </TabsTrigger>
        </TabsList>

        {/* Saved Resources Tab */}
        <TabsContent value="saved">
          {savedResources.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResources.map((saved) => (
                <Card
                  key={saved.id}
                  className="border-none shadow-sm hover:shadow-md transition-shadow group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          resourceTypeColors[saved.resource.resourceType] ||
                          "bg-gray-500/10 text-gray-600"
                        }
                      >
                        {saved.resource.resourceType.replace(/_/g, " ")}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      <Link
                        href={`/resources/${saved.resource.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {saved.resource.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {saved.resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {saved.resource.category?.name || "Uncategorized"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(saved.createdAt)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-sm">
              <CardContent className="text-center py-16">
                <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved resources yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Save resources to your library to access them quickly later.
                  Click the bookmark icon on any resource to save it.
                </p>
                <Button asChild>
                  <Link href="/resources">Browse Resources</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Downloads Tab */}
        <TabsContent value="downloads">
          {downloads.length > 0 ? (
            <Card className="border-none shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y">
                  {downloads.map((download) => (
                    <div
                      key={download.id}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0">
                        <Download className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/resources/${download.resource.slug}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-1"
                        >
                          {download.resource.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {download.resource.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground text-right shrink-0">
                        <p>{formatDistanceToNow(download.createdAt)}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        <Download className="h-4 w-4 mr-2" />
                        Re-download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-sm">
              <CardContent className="text-center py-16">
                <Download className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No downloads yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Your download history will appear here. Download study materials
                  to access them offline.
                </p>
                <Button asChild>
                  <Link href="/resources">Browse Resources</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
