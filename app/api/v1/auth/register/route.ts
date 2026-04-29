import { prisma } from "@/lib/db"
import { successResponse, errorResponse } from "@/lib/api-response"
import { registerSchema } from "@/lib/validations/auth"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(parsed.error.message, 422)
    }

    const { name, email, password, phone } = parsed.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse("User with this email already exists", 409)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return successResponse(user, 201)
  } catch (err) {
    console.error("[REGISTER]", err)
    return errorResponse("Internal server error", 500)
  }
}
