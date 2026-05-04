import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, specialization, experience, bio } = body

    // Validation
    if (!name || !email || !password || !specialization) {
      return errorResponse('Missing required fields', 422)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse('Email already registered', 409)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with ASTROLOGER role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'ASTROLOGER',
      },
    })

    // Create astrologer profile
    const astrologer = await prisma.astrologer.create({
      data: {
        userId: user.id,
        specialization,
        experience: experience || 0,
        bio: bio || null,
        verified: false,
      },
    })

    return successResponse(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: astrologer.specialization,
      },
      201
    )
  } catch (err) {
    console.error('[ASTROLOGER_REGISTER]', err)
    return errorResponse('Internal server error', 500)
  }
}
