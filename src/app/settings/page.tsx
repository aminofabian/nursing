import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { SubscriptionSettings } from "./subscription-settings"
import { SecuritySettings } from "./security-settings"

export const metadata = {
  title: "Settings",
  description: "Manage your NurseHub account settings",
}

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: {
          OR: [
            { status: "ACTIVE" },
            { status: "PENDING" },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })

  return user
}

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login?redirect=/settings")
  }

  const user = await getUserData(session.user.id)

  if (!user) {
    redirect("/login")
  }

  const activeSubscription = user.subscriptions[0] || null

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and subscription
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings user={user} />
        </TabsContent>

        <TabsContent value="subscription">
          <SubscriptionSettings 
            subscription={activeSubscription}
            hasStripeCustomer={!!user.stripeCustomerId}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
