import { redirect } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  GraduationCap,
  Heart,
  Download,
  Clock,
  TrendingUp,
  Bookmark,
  Settings,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata = {
  title: "Dashboard",
  description: "Your NurseHub dashboard",
}

async function getDashboardData(userId: string) {
  const [
    savedResources,
    downloads,
    recentResources,
  ] = await Promise.all([
    prisma.savedResource.count({ where: { userId } }),
    prisma.download.count({ where: { userId } }),
    prisma.savedResource.findMany({
      where: { userId },
      include: { resource: { include: { category: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ])

  return {
    savedResources,
    downloads,
    recentResources,
  }
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const { savedResources, downloads, recentResources } = await getDashboardData(
    session.user.id
  )

  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  const quickActions = [
    {
      icon: BookOpen,
      label: "Study Guides",
      href: "/resources/study-guides",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: FileText,
      label: "Practice Exams",
      href: "/resources/practice-exams",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: Heart,
      label: "Care Plans",
      href: "/resources/care-plans",
      color: "bg-red-500/10 text-red-600",
    },
    {
      icon: GraduationCap,
      label: "NCLEX Prep",
      href: "/resources/nclex-prep",
      color: "bg-green-500/10 text-green-600",
    },
  ]

  const stats = [
    {
      label: "Saved Resources",
      value: savedResources,
      icon: Bookmark,
      color: "text-primary",
    },
    {
      label: "Downloads",
      value: downloads,
      icon: Download,
      color: "text-blue-600",
    },
    {
      label: "Study Streak",
      value: "3 days",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "This Week",
      value: "12h",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="container py-8 md:py-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {session.user.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Continue your nursing education journey
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session.user.hasActiveSubscription ? (
            <Badge className="gradient-primary text-white gap-1">
              <Crown className="h-3 w-3" />
              Premium
            </Badge>
          ) : (
            <Button asChild variant="outline" className="gap-2">
              <Link href="/pricing">
                <Sparkles className="h-4 w-4 text-primary" />
                Upgrade to Premium
              </Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="icon">
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions + Saved Resources */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump right into your studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, idx) => (
                  <Link
                    key={idx}
                    href={action.href}
                    className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all"
                  >
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-center">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Saved */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recently Saved</CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href="/library">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentResources.length > 0 ? (
                <div className="space-y-3">
                  {recentResources.map((saved) => (
                    <Link
                      key={saved.id}
                      href={`/resources/${saved.resource.slug}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {saved.resource.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {saved.resource.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {saved.resource.resourceType}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No saved resources yet
                  </p>
                  <Button asChild>
                    <Link href="/resources">Browse Resources</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Premium CTA (for non-subscribers) */}
          {!session.user.hasActiveSubscription && (
            <Card className="border-none shadow-sm gradient-hero text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5" />
                  <span className="font-semibold">Go Premium</span>
                </div>
                <p className="text-white/90 mb-4">
                  Unlock unlimited access to all resources, practice exams, and
                  exclusive content.
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-primary hover:bg-white/90"
                >
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Study Tips */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Study Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Break your study sessions into 25-minute focused blocks with
                5-minute breaks. This Pomodoro technique helps improve retention
                and reduce burnout.
              </p>
            </CardContent>
          </Card>

          {/* Account Quick Links */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href="/library">
                  <Bookmark className="h-4 w-4 mr-2" />
                  My Library
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start"
              >
                <Link href="/downloads">
                  <Download className="h-4 w-4 mr-2" />
                  Downloads
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
