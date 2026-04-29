import { z } from 'zod'

export const birthProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  tob: z.string().regex(/^([01]?\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)').optional(),
  tobUnknown: z.boolean().default(false),
  place: z.string().min(2, 'Place must be at least 2 characters'),
})

export const kundaliGenerateSchema = z.object({
  birthProfileId: z.string().min(1, 'Birth profile is required'),
  chartStyle: z.enum(['NORTH_INDIAN', 'SOUTH_INDIAN']).default('NORTH_INDIAN'),
})

export type BirthProfileInput = z.infer<typeof birthProfileSchema>
export type KundaliGenerateInput = z.infer<typeof kundaliGenerateSchema>
