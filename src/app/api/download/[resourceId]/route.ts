import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { checkResourceAccess } from "@/lib/access"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    const session = await auth()

    // Get the resource
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    })

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      )
    }

    if (!resource.fileUrl) {
      return NextResponse.json(
        { error: "Resource file not available" },
        { status: 404 }
      )
    }

    // Check access
    const access = await checkResourceAccess(session?.user?.id, resourceId)

    if (!access.hasAccess) {
      return NextResponse.json(
        { 
          error: "Access denied",
          message: resource.isPremium 
            ? "This is a premium resource. Please subscribe or purchase to download."
            : "You don't have access to this resource.",
        },
        { status: 403 }
      )
    }

    // Track the download
    if (session?.user?.id) {
      await prisma.download.create({
        data: {
          userId: session.user.id,
          resourceId,
        },
      })

      // Increment download count
      await prisma.resource.update({
        where: { id: resourceId },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      })
    }

    // For Vercel Blob storage, we can return the URL directly
    // In production, you might want to generate a signed URL with expiration
    // For now, we'll return the file URL
    
    // If using Vercel Blob, you can generate a signed URL like this:
    // import { getDownloadUrl } from '@vercel/blob'
    // const downloadUrl = await getDownloadUrl(resource.fileUrl)
    
    return NextResponse.json({
      success: true,
      downloadUrl: resource.fileUrl,
      filename: `${resource.slug}.pdf`,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    )
  }
}

// GET endpoint for direct download (with redirect)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params
    const session = await auth()

    // Get the resource
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    })

    if (!resource) {
      return NextResponse.redirect(new URL("/404", request.url))
    }

    if (!resource.fileUrl) {
      return NextResponse.json(
        { error: "Resource file not available" },
        { status: 404 }
      )
    }

    // Check access
    const access = await checkResourceAccess(session?.user?.id, resourceId)

    if (!access.hasAccess) {
      // Redirect to resource page if no access
      return NextResponse.redirect(
        new URL(`/resources/${resource.slug}?access=denied`, request.url)
      )
    }

    // Track the download
    if (session?.user?.id) {
      await prisma.download.create({
        data: {
          userId: session.user.id,
          resourceId,
        },
      })

      await prisma.resource.update({
        where: { id: resourceId },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      })
    }

    // Redirect to the file URL
    return NextResponse.redirect(resource.fileUrl)
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    )
  }
}
