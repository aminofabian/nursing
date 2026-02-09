import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, FileText, CreditCard, UserPlus } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Admin Dashboard",
  description: "NurseHub admin dashboard",
}

async function getAdminStats() {
  const [
    totalUsers,
    activeSubscribers,
    totalResources,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
        endsAt: { gte: new Date() },
      },
    }),
    prisma.resource.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    }),
  ])

  // Revenue from completed purchases (simplified - no Stripe API call)
  const revenueResult = await prisma.purchase.aggregate({
    where: { paymentStatus: "COMPLETED" },
    _sum: { amount: true },
  })
  const totalRevenue = revenueResult._sum.amount || 0

  return {
    totalUsers,
    activeSubscribers,
    totalResources,
    totalRevenue,
    recentSignups,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Active Subscribers",
      value: stats.activeSubscribers.toLocaleString(),
      icon: CreditCard,
    },
    {
      title: "Total Resources",
      value: stats.totalResources.toLocaleString(),
      icon: FileText,
      href: "/admin/resources",
    },
    {
      title: "Revenue",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(stats.totalRevenue / 100),
      icon: CreditCard,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your NurseHub platform
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href || "#"}>
            <Card
              className={
                stat.href
                  ? "transition-colors hover:bg-gray-50 cursor-pointer"
                  : ""
              }
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent signups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Recent Signups
          </CardTitle>
          <CardDescription>Latest registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentSignups.length > 0 ? (
            <div className="space-y-4">
              {stats.recentSignups.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-4">No users yet</p>
          )}
          <Link
            href="/admin/users"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            View all users →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
