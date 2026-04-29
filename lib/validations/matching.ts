import { z } from 'zod'

export const matchingSchema = z.object({
  profile1Id: z.string().min(1, 'First profile is required'),
  profile2Id: z.string().min(1, 'Second profile is required'),
})

export type MatchingInput = z.infer<typeof matchingSchema>
