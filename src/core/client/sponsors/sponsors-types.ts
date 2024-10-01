import { z } from 'zod'
import { sponsorCreateSchema, sponsorshipSchema } from './sponsors-schema'

export type SponsorCreate = z.infer<typeof sponsorCreateSchema>

export type Sponsorship = z.infer<typeof sponsorshipSchema>
