# AstroSure — GitHub Copilot Instructions

You are an expert Next.js 14 developer working on **AstroSure**, a full-stack Vedic astrology platform.
Read this entire file before generating any code. These instructions are non-negotiable.

---

## 1. Project Identity

- **Product name:** AstroSure
- **Purpose:** A complete Vedic astrology ecosystem — Kundali generation, Kundali matching, Panchang, Horoscopes, Puja booking, Astrologer consultations, Donations, and an Astrology Shop.
- **Architecture:** Next.js 14 App Router — web frontend + admin panel + REST API in one codebase. Flutter will connect to the API layer later.
- **Deployment:** Vercel (serverless). Every API route must be serverless-safe.
- **Database:** Remote MySQL via Prisma ORM. Connection pooling pattern is mandatory (see Section 6).

---

## 2. Tech Stack — Use Only These

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | No Pages Router. App Router only. |
| Language | TypeScript | Strict mode. No `any`. |
| Database | MySQL (remote) | Via Prisma ORM only. No raw SQL unless Prisma cannot do it. |
| ORM | Prisma | Schema-first. Always regenerate client after schema changes. |
| Auth | NextAuth.js v5 | JWT strategy. Supports web session + API token for Flutter. |
| Styling | Tailwind CSS | No inline styles. No CSS modules unless absolutely necessary. |
| UI Components | shadcn/ui | Use existing components before building custom ones. |
| Validation | Zod | Every API input. Every form. No exceptions. |
| API Shape | Custom REST | Under `/api/v1/` prefix always. |
| Astrology Engine | `swisseph` (Swiss Ephemeris) | For Kundali, Panchang calculations. |
| Geocoding | OpenCage API | Convert place name → lat/lng for Swiss Ephemeris. |
| File Storage | Vercel Blob or Cloudinary | For user uploads, report PDFs. |
| Email | Resend | Transactional emails only. |
| Payment | Razorpay | India-first. Puja booking + shop checkout + donations. |
| PDF Generation | `@react-pdf/renderer` | Kundali reports, compatibility reports. |
| Charts/SVG | Custom SVG components | North Indian Kundali chart. No third-party chart component. |

**Do not introduce any library not listed here without a comment explaining why.**

---

## 3. Project Structure — Strict

```
astrosure/
├── app/
│   ├── (marketing)/              # Public landing pages
│   │   ├── page.tsx              # Home
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   │
│   ├── (auth)/                   # Login, register, forgot password
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (dashboard)/              # Authenticated user area
│   │   ├── layout.tsx            # Auth guard here
│   │   ├── kundali/
│   │   │   ├── page.tsx          # List user's charts
│   │   │   ├── new/page.tsx      # Create chart form
│   │   │   └── [id]/page.tsx     # View single chart
│   │   ├── matching/
│   │   ├── horoscope/
│   │   ├── panchang/
│   │   ├── puja/
│   │   ├── shop/
│   │   ├── consultations/
│   │   └── donations/
│   │
│   ├── (admin)/                  # Admin panel — role-gated
│   │   ├── layout.tsx            # Admin auth guard
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── astrologers/page.tsx
│   │   ├── pujas/page.tsx
│   │   ├── orders/page.tsx
│   │   └── products/page.tsx
│   │
│   ├── (astrologer)/             # Astrologer portal — role-gated
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── consultations/page.tsx
│   │
│   └── api/
│       └── v1/                   # ALL API routes under v1
│           ├── auth/
│           │   ├── register/route.ts
│           │   ├── login/route.ts
│           │   └── me/route.ts
│           ├── kundali/
│           │   ├── generate/route.ts
│           │   ├── route.ts       # GET list, POST create
│           │   └── [id]/route.ts  # GET, DELETE single
│           ├── matching/
│           │   └── route.ts
│           ├── panchang/
│           │   └── route.ts
│           ├── horoscope/
│           │   └── route.ts
│           ├── puja/
│           ├── shop/
│           ├── astrologers/
│           ├── consultations/
│           └── donations/
│
├── components/
│   ├── ui/                       # shadcn/ui components (auto-generated)
│   ├── kundali/
│   │   ├── NorthIndianChart.tsx  # SVG chart component
│   │   ├── ChartForm.tsx
│   │   └── ReportView.tsx
│   ├── admin/
│   ├── astrologer/
│   └── shared/                   # Used across multiple sections
│
├── lib/
│   ├── db.ts                     # Prisma client (singleton pattern)
│   ├── auth.ts                   # NextAuth config
│   ├── astrology/
│   │   ├── kundali.ts            # Swiss Ephemeris wrapper
│   │   ├── panchang.ts
│   │   ├── matching.ts           # Gun Milan calculation
│   │   └── geocoding.ts          # OpenCage wrapper
│   ├── validations/
│   │   ├── kundali.ts            # Zod schemas
│   │   ├── auth.ts
│   │   └── puja.ts
│   ├── api-response.ts           # Standardized response helpers
│   ├── razorpay.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── types/
│   └── index.ts                  # Global TypeScript types
│
├── middleware.ts                  # Route protection
├── .env.local                    # Never commit this
└── .github/
    └── copilot-instructions.md   # This file
```

---

## 4. API Design Rules

### Always version routes
```
/api/v1/kundali/generate     ✅
/api/kundali/generate        ❌
```

### Always return this exact shape
```typescript
// lib/api-response.ts
// Use these helpers in every route — never construct responses manually

export function successResponse<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status })
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ success: false, error: message }, { status })
}
```

Every single API route must return one of these two shapes. Flutter depends on this contract.

### Route structure pattern
```typescript
// app/api/v1/kundali/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { kundaliSchema } from '@/lib/validations/kundali'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse('Unauthorized', 401)

    const charts = await prisma.kundaliChart.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return successResponse(charts)
  } catch (err) {
    console.error('[KUNDALI_GET]', err)
    return errorResponse('Internal server error', 500)
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return errorResponse('Unauthorized', 401)

    const body = await req.json()
    const parsed = kundaliSchema.safeParse(body)
    if (!parsed.success) return errorResponse(parsed.error.message, 422)

    // business logic here
    return successResponse(result, 201)
  } catch (err) {
    console.error('[KUNDALI_POST]', err)
    return errorResponse('Internal server error', 500)
  }
}
```

---

## 5. Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ASTROLOGER
  ADMIN
}

enum ChartStyle {
  NORTH_INDIAN
  SOUTH_INDIAN
}

model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  password      String   // bcrypt hashed
  role          Role     @default(USER)
  phone         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  birthProfiles BirthProfile[]
  kundaliCharts KundaliChart[]
  pujaBookings  PujaBooking[]
  orders        Order[]
  donations     Donation[]
  consultations Consultation[]

  @@map("users")
}

model BirthProfile {
  id          String      @id @default(cuid())
  userId      String
  name        String
  dob         DateTime    // Store as UTC
  tob         String?     // "HH:MM" — null if unknown
  tobUnknown  Boolean     @default(false)
  place       String      // raw place string from user
  latitude    Float
  longitude   Float
  timezone    String      // e.g. "Asia/Kolkata"
  createdAt   DateTime    @default(now())

  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  kundaliCharts KundaliChart[]

  @@map("birth_profiles")
}

model KundaliChart {
  id              String     @id @default(cuid())
  userId          String
  birthProfileId  String
  chartStyle      ChartStyle @default(NORTH_INDIAN)
  chartData       Json       // Raw planetary positions from Swiss Ephemeris
  reportData      Json?      // Processed interpretations
  pdfUrl          String?    // Vercel Blob / Cloudinary URL
  createdAt       DateTime   @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  birthProfile BirthProfile @relation(fields: [birthProfileId], references: [id])

  @@map("kundali_charts")
}

model MatchingReport {
  id          String   @id @default(cuid())
  userId      String
  profile1Id  String   // BirthProfile id
  profile2Id  String   // BirthProfile id
  gunScore    Int      // out of 36
  reportData  Json     // All 8 Ashtakoot factors
  pdfUrl      String?
  createdAt   DateTime @default(now())

  @@map("matching_reports")
}

model Astrologer {
  id            String   @id @default(cuid())
  userId        String   @unique
  bio           String?  @db.Text
  specialties   Json     // string[]
  experience    Int      // years
  languages     Json     // string[]
  rating        Float    @default(0)
  isVerified    Boolean  @default(false)
  isActive      Boolean  @default(true)
  perMinuteRate Int      // in paise (Indian currency smallest unit)
  createdAt     DateTime @default(now())

  consultations Consultation[]

  @@map("astrologers")
}

model Consultation {
  id            String   @id @default(cuid())
  userId        String
  astrologerId  String
  type          String   // "vedic", "tarot", "palmistry", etc.
  status        String   // "pending", "active", "completed", "cancelled"
  scheduledAt   DateTime?
  durationMins  Int?
  amount        Int      // in paise
  notes         String?  @db.Text
  createdAt     DateTime @default(now())

  user       User       @relation(fields: [userId], references: [id])
  astrologer Astrologer @relation(fields: [astrologerId], references: [id])

  @@map("consultations")
}

model PujaCategory {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  description String? @db.Text
  imageUrl    String?
  isActive    Boolean @default(true)

  pujas Puja[]

  @@map("puja_categories")
}

model Puja {
  id          String   @id @default(cuid())
  categoryId  String
  name        String
  slug        String   @unique
  description String?  @db.Text
  imageUrl    String?
  startPrice  Int      // in paise
  isActive    Boolean  @default(true)
  isGroup     Boolean  @default(false)
  createdAt   DateTime @default(now())

  category     PujaCategory  @relation(fields: [categoryId], references: [id])
  bookings     PujaBooking[]

  @@map("pujas")
}

model PujaBooking {
  id          String   @id @default(cuid())
  userId      String
  pujaId      String
  scheduledAt DateTime
  amount      Int      // in paise
  status      String   // "pending", "confirmed", "completed", "cancelled"
  paymentId   String?  // Razorpay payment id
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  puja Puja @relation(fields: [pujaId], references: [id])

  @@map("puja_bookings")
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  price       Int      // in paise
  imageUrl    String?
  stock       Int      @default(0)
  category    String   // "yantra", "gemstone", "rudraksha", "book", etc.
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  orderItems OrderItem[]

  @@map("products")
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  totalAmount Int         // in paise
  status      String      // "pending", "paid", "shipped", "delivered", "cancelled"
  paymentId   String?
  address     Json        // shipping address snapshot
  createdAt   DateTime    @default(now())

  user  User        @relation(fields: [userId], references: [id])
  items OrderItem[]

  @@map("orders")
}

model OrderItem {
  id        String @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Int    // price at time of purchase, in paise

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Donation {
  id          String   @id @default(cuid())
  userId      String?  // nullable — anonymous donations allowed
  amount      Int      // in paise
  message     String?
  paymentId   String?
  createdAt   DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])

  @@map("donations")
}

model BlogPost {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.LongText
  excerpt     String?
  imageUrl    String?
  authorId    String
  isPublished Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())

  @@map("blog_posts")
}
```

---

## 6. Prisma Client — Singleton Pattern (Mandatory)

```typescript
// lib/db.ts
// NEVER create PrismaClient anywhere else in the codebase

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

This is mandatory. Vercel serverless functions would open a new DB connection on every request without this. With remote MySQL, that will crash your database.

---

## 7. Authentication Rules

- Use **NextAuth.js v5** with JWT strategy
- Three roles: `USER`, `ASTROLOGER`, `ADMIN`
- Session includes: `id`, `email`, `name`, `role`
- API routes for mobile (Flutter) must accept Bearer token in Authorization header
- Web uses session cookies

```typescript
// middleware.ts — protect routes at edge
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const role = req.nextauth.token?.role

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (pathname.startsWith('/astrologer-portal') && role !== 'ASTROLOGER' && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  { callbacks: { authorized: ({ token }) => !!token } }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/astrologer-portal/:path*']
}
```

---

## 8. Astrology Engine Rules

### Swiss Ephemeris Integration
```typescript
// lib/astrology/kundali.ts

// swisseph requires file path to ephemeris data files
// Store ephe/ data files in public/ephe/ or a persistent volume
// On Vercel: bundle the minimal ephemeris files needed

import swisseph from 'swisseph'

export interface BirthInput {
  year: number
  month: number   // 1-12
  day: number
  hour: number    // decimal — e.g. 14.5 = 2:30 PM
  latitude: number
  longitude: number
  timezone: number // UTC offset in hours, e.g. 5.5 for IST
}

export interface PlanetPosition {
  planet: string
  longitude: number   // 0–360
  sign: number        // 0–11
  signName: string
  house: number       // 1–12
  isRetrograde: boolean
  nakshatra: string
  pada: number        // 1–4
}

// Always convert local time to Julian Day Number for Swiss Ephemeris
export function toJulianDay(input: BirthInput): number {
  const utcHour = input.hour - input.timezone
  return swisseph.swe_julday(
    input.year, input.month, input.day,
    utcHour,
    swisseph.SE_GREG_CAL
  )
}
```

### Geocoding — Always required before calculation
```typescript
// lib/astrology/geocoding.ts

export async function geocodePlace(place: string): Promise<{
  lat: number
  lng: number
  timezone: string
  formattedPlace: string
}> {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${process.env.OPENCAGE_API_KEY}&language=en&limit=1`
  const res = await fetch(url)
  const data = await res.json()

  if (!data.results.length) throw new Error(`Place not found: ${place}`)

  const result = data.results[0]
  return {
    lat: result.geometry.lat,
    lng: result.geometry.lng,
    timezone: result.annotations.timezone.name,
    formattedPlace: result.formatted
  }
}
```

### Timezone handling — Critical
- **Always store dates in UTC** in the database
- **Never store local time** — store the offset separately
- Use `date-fns-tz` for all timezone conversions
- IST = UTC+5:30 = 5.5 hours offset

---

## 9. Kundali Chart Rendering Rules

The North Indian Kundali chart is a **diamond-shaped grid** — 12 houses arranged geometrically. There is no library for this. Build it as SVG.

```typescript
// components/kundali/NorthIndianChart.tsx
// This is a pure SVG component — no canvas, no third-party chart lib

// House positions in North Indian style (fixed, not zodiac-based):
// House 1 (Lagna) is always top-center diamond
// Houses go clockwise: 1(top) → 2(top-right) → 3(right) → 4(bottom-right)
//                    → 5(bottom) → 6(bottom-left) → 7(left) → 8(top-left)
//                    → 9, 10, 11, 12 (inner quadrants)

// Each house is a triangle/quadrilateral path in SVG
// Planets are rendered as text inside their respective house paths
// Must be responsive — accept a `size` prop
```

---

## 10. Environment Variables

```bash
# .env.local — never commit, never log these

# Database
DATABASE_URL="mysql://user:password@host:3306/astrosure"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Astrology
OPENCAGE_API_KEY=""

# Payments
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# Storage
BLOB_READ_WRITE_TOKEN=""        # Vercel Blob

# Email
RESEND_API_KEY=""

# App
NEXT_PUBLIC_APP_NAME="AstroSure"
NEXT_PUBLIC_APP_URL="https://astrosure.in"
```

---

## 11. Coding Standards

### TypeScript
- `strict: true` in tsconfig — no exceptions
- No `any` — use `unknown` and narrow properly
- All API response types defined in `types/index.ts`
- All Zod schemas in `lib/validations/`

### Components
- Server Components by default — add `"use client"` only when needed (event handlers, hooks, browser APIs)
- Never fetch data in Client Components — use Server Components or React Server Actions
- All forms use `react-hook-form` + Zod resolver

### Money
- **All monetary values stored in paise (smallest unit)** — never store rupees as floats
- Display: divide by 100, format with `Intl.NumberFormat`
- `₹1,500` = stored as `150000` paise

### Error handling
- Every API route wrapped in try/catch
- Log errors with context: `console.error('[ROUTE_NAME]', err)`
- Never expose raw error messages to client in production

### Naming
- Files: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Functions/variables: `camelCase`
- DB tables: `snake_case` (via `@@map`)
- Constants: `SCREAMING_SNAKE_CASE`

---

## 12. What Not to Do

- ❌ Do not use Pages Router — App Router only
- ❌ Do not use `getServerSideProps` or `getStaticProps`
- ❌ Do not write raw SQL — use Prisma
- ❌ Do not create a new PrismaClient instance outside `lib/db.ts`
- ❌ Do not store money as floats — always paise
- ❌ Do not use `any` in TypeScript
- ❌ Do not build API routes without Zod validation
- ❌ Do not use a third-party Kundali chart component — build SVG
- ❌ Do not hardcode API keys — always `process.env`
- ❌ Do not return inconsistent API shapes — always `{ success, data }` or `{ success, error }`
- ❌ Do not add libraries outside the approved stack without a comment explaining why
- ❌ Do not store local time in DB — always UTC
- ❌ Do not create too much documentation and md files — use comments — write clean, self-explanatory code instead

---

## 13. Module Build Order

Build in this sequence. Do not skip ahead.

```
Phase 1 — Foundation
  [ ] Prisma schema + DB connection
  [ ] NextAuth setup (register, login, JWT, roles)
  [ ] Middleware (route protection)
  [ ] API response helpers
  [ ] Zod validation schemas

Phase 2 — Kundali Core (First Feature)
  [ ] Geocoding service (OpenCage)
  [ ] Swiss Ephemeris integration
  [ ] Kundali calculation logic
  [ ] /api/v1/kundali routes (CRUD)
  [ ] North Indian SVG chart component
  [ ] Kundali form + chart display page
  [ ] PDF report generation

Phase 3 — Kundali Matching
  [ ] Gun Milan calculation (Ashtakoot 8 factors)
  [ ] /api/v1/matching route
  [ ] Matching report UI + PDF

Phase 4 — Panchang & Horoscope
  [ ] Panchang calculation (Tithi, Nakshatra, Yoga, Karana)
  [ ] /api/v1/panchang route
  [ ] Horoscope content + /api/v1/horoscope route

Phase 5 — Puja Booking
  [ ] Puja categories + listings
  [ ] Booking flow + Razorpay integration
  [ ] Group puja participation

Phase 6 — Astrologer System
  [ ] Astrologer registration + profile
  [ ] Consultation booking
  [ ] Astrologer portal (role-gated)

Phase 7 — Shop + Donations
  [ ] Product listing + cart
  [ ] Order flow + Razorpay
  [ ] Donations module

Phase 8 — Admin Panel
  [ ] User management
  [ ] Astrologer verification
  [ ] Orders + bookings overview
  [ ] Content management (blog, pujas, products)

Phase 9 — Polish
  [ ] Blog (MDX or DB-driven)
  [ ] Static pages (About, Contact, Policies)
  [ ] SEO (metadata, sitemap, robots.txt)
  [ ] Performance audit
```

---

## 14. Flutter API Contract (Future-Proofing)

When Flutter connects later, it will:
- Hit `/api/v1/*` endpoints
- Send `Authorization: Bearer <jwt_token>` header
- Expect `{ success: boolean, data: T }` or `{ success: boolean, error: string }`

Every API route you build now must handle the Bearer token auth path, not just session cookies.

```typescript
// lib/auth-helpers.ts
// Use this in API routes to support both web session AND Flutter Bearer token

export async function getAuthUser(req: Request) {
  // Try Bearer token first (Flutter)
  const authHeader = req.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    // verify JWT token
    // return user
  }
  // Fall back to NextAuth session (web)
  const session = await getServerSession(authOptions)
  return session?.user ?? null
}
```

