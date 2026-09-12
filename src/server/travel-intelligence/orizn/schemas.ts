import { z } from 'zod'

export const oriznRequirementSchema = z.string()

const countryInfoSchema = z
  .object({
    currency: z.string().optional(),
    language: z.string().optional(),
    timezone: z.string().optional(),
    capital: z.string().optional(),
  })
  .loose()

export const oriznVisaResponseSchema = z
  .object({
    data: z
      .object({
        passport: z.string().length(3),
        destination: z.string().length(3),
        requirement: oriznRequirementSchema,
        visa_free_days: z.number().int().nullable().optional(),
        visa_required: z.boolean(),
        description: z.string(),
        documents_required: z.array(z.string()).optional(),
        process: z.array(z.string()).optional(),
        tips: z.array(z.string()).optional(),
        country_info: countryInfoSchema,
        verified: z.boolean(),
        source: z.string().nullable().optional(),
        source_url: z.string().nullable().optional(),
        last_verified_at: z.string().nullable().optional(),
        requirement_status: z.string().optional(),
        requirement_status_note: z.string().nullable().optional(),
        passport_validity_months: z.number().int().optional(),
        visa_fee: z.unknown().optional(),
        transit_visa: z.unknown().optional(),
        vaccinations_required: z.array(z.string()).optional(),
        health_requirements: z.unknown().optional(),
        insurance_required: z.unknown().optional(),
      })
      .loose(),
    meta: z
      .object({
        lang: z.string().optional(),
        api_version: z.string().optional(),
      })
      .loose(),
  })
  .loose()

export type OriznVisaResponse = z.infer<typeof oriznVisaResponseSchema>
