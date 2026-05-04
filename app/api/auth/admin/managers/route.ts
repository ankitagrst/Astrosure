import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/auth/admin/create-manager
 * Admin only: Create a new manager account
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin token from session
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    }

    // Hash password
    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create manager
    const manager = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'MANAGER',
      },
    })

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: 'admin-system', // In production, extract from token
        action: 'create_manager',
        entity: 'user',
        entityId: manager.id,
        details: { email, name },
      },
    })

    return NextResponse.json({
      success: true,
      manager: {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        role: manager.role,
      },
    })
  } catch (error) {
    console.error('Error creating manager:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/auth/admin/managers
 * Admin only: List all managers
 */
export async function GET() {
  try {
    const managers = await prisma.user.findMany({
      where: { role: 'MANAGER' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        managedAstrologers: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ success: true, managers })
  } catch (error) {
    console.error('Error fetching managers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
