import { prisma } from "@/lib/prisma"
import { AdminUsersTable } from "./users-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Admin - Users",
  description: "User management",
}

async function getInitialUsers() {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.user.count(),
  ])
  const userIds = users.map((u) => u.id)
  const activeSubs = await prisma.subscription.findMany({
    where: {
      userId: { in: userIds },
      status: "ACTIVE",
      endsAt: { gte: new Date() },
    },
    select: { userId: true },
  })
  const subByUser = new Map(activeSubs.map((s) => [s.userId, true]))
  return {
    users: users.map((u) => ({
      ...u,
      hasActiveSubscription: subByUser.get(u.id) ?? false,
    })),
    total,
  }
}

export default async function AdminUsersPage() {
  const { users, total } = await getInitialUsers()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">User Management</h1>
      <p className="text-muted-foreground mb-6">
        View users, change roles, and manage access.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            {total} user{total !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminUsersTable initialUsers={users} total={total} />
        </CardContent>
      </Card>
    </div>
  )
}
