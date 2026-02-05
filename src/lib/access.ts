import { prisma } from "@/lib/prisma"

export interface AccessCheck {
  hasAccess: boolean
  reason: "subscribed" | "purchased" | "free" | "no_access"
}

/**
 * Check if a user has access to a resource
 */
export async function checkResourceAccess(
  userId: string | undefined,
  resourceId: string
): Promise<AccessCheck> {
  // Get the resource
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  })

  if (!resource) {
    return { hasAccess: false, reason: "no_access" }
  }

  // Free resources are accessible to everyone
  if (!resource.isPremium) {
    return { hasAccess: true, reason: "free" }
  }

  // For premium resources, user must be logged in
  if (!userId) {
    return { hasAccess: false, reason: "no_access" }
  }

  // Check for active subscription
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["ACTIVE"],
      },
      endsAt: {
        gte: new Date(),
      },
    },
  })

  if (activeSubscription) {
    return { hasAccess: true, reason: "subscribed" }
  }

  // Check for individual purchase
  const purchase = await prisma.purchase.findFirst({
    where: {
      userId,
      resourceId,
      paymentStatus: "COMPLETED",
    },
  })

  if (purchase) {
    return { hasAccess: true, reason: "purchased" }
  }

  return { hasAccess: false, reason: "no_access" }
}

/**
 * Check if a user has an active subscription
 */
export async function hasActiveSubscription(
  userId: string | undefined
): Promise<boolean> {
  if (!userId) return false

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["ACTIVE"],
      },
      endsAt: {
        gte: new Date(),
      },
    },
  })

  return !!subscription
}

/**
 * Get user's subscription details
 */
export async function getUserSubscription(userId: string) {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["ACTIVE", "PENDING"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

/**
 * Get user's purchased resources
 */
export async function getUserPurchasedResources(userId: string) {
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      paymentStatus: "COMPLETED",
      resourceId: { not: null },
    },
    include: {
      resource: true,
    },
  })

  return purchases.map((p) => p.resource).filter(Boolean)
}
