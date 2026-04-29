import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { errorResponse, successResponse } from "@/lib/api-response"
import { SERVICE_BY_SLUG } from "@/lib/services/free-services"

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return errorResponse("Unauthorized. Please sign in to view saved services.", 401)
    }

    const saved = await prisma.savedService.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    return successResponse(saved)
  } catch (error) {
    console.error("[SERVICES_SAVED_GET]", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return errorResponse("Unauthorized. Please sign in to save services.", 401)
    }

    const body = await req.json()
    const slug = typeof body?.slug === "string" ? body.slug.trim() : ""

    if (!slug) {
      return errorResponse("Service slug is required.", 422)
    }

    const service = SERVICE_BY_SLUG[slug]
    if (!service) {
      return errorResponse("Invalid service.", 404)
    }

    const saved = await prisma.savedService.upsert({
      where: {
        userId_serviceSlug: {
          userId: session.user.id,
          serviceSlug: slug,
        },
      },
      create: {
        userId: session.user.id,
        serviceSlug: slug,
        serviceName: service.title,
      },
      update: {
        serviceName: service.title,
      },
    })

    return successResponse(saved, 201)
  } catch (error) {
    console.error("[SERVICES_SAVED_POST]", error)
    return errorResponse("Internal server error", 500)
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return errorResponse("Unauthorized. Please sign in to remove saved services.", 401)
    }

    const url = new URL(req.url)
    const slug = (url.searchParams.get("slug") || "").trim()

    if (!slug) {
      return errorResponse("Service slug is required.", 422)
    }

    await prisma.savedService.deleteMany({
      where: {
        userId: session.user.id,
        serviceSlug: slug,
      },
    })

    return successResponse({ removed: true })
  } catch (error) {
    console.error("[SERVICES_SAVED_DELETE]", error)
    return errorResponse("Internal server error", 500)
  }
}
