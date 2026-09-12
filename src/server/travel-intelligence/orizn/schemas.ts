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

const iso3Schema = z.string().length(3)

export const oriznStatsResponseSchema = z
  .object({
    coverage: z
      .object({
        visa_details: z.number().int().nonnegative(),
        passports: z.number().int().nonnegative(),
        destinations: z.number().int().nonnegative(),
      })
      .loose(),
    passports: z.array(iso3Schema),
    destinations: z.array(iso3Schema),
  })
  .loose()

export const oriznScoreResponseSchema = z
  .object({
    passport: iso3Schema,
    score: z.number(),
    rank: z.number().int().positive(),
    total_ranked: z.number().int().positive(),
    percentile: z.number(),
    visa_free_count: z.number().int().nonnegative(),
    breakdown: z
      .object({
        access: z
          .object({
            detail: z
              .object({
                visa_free: z.number().int().nonnegative(),
                visa_on_arrival: z.number().int().nonnegative(),
                e_visa: z.number().int().nonnegative(),
                eta: z.number().int().nonnegative(),
                visa_required: z.number().int().nonnegative(),
              })
              .loose(),
          })
          .loose(),
      })
      .loose(),
  })
  .loose()

const comparedPassportSchema = z
  .object({
    code: iso3Schema,
    score: z.number(),
    rank: z.number().int().positive(),
  })
  .loose()

export const oriznCompareResponseSchema = z
  .object({
    passport1: comparedPassportSchema,
    passport2: comparedPassportSchema,
    combined: z
      .object({
        score: z.number(),
        total_accessible: z.number().int().nonnegative(),
        only_passport1_count: z.number().int().nonnegative(),
        only_passport2_count: z.number().int().nonnegative(),
        both_count: z.number().int().nonnegative(),
        neither_count: z.number().int().nonnegative(),
      })
      .loose(),
  })
  .loose()

export type OriznStatsResponse = z.infer<typeof oriznStatsResponseSchema>
export type OriznScoreResponse = z.infer<typeof oriznScoreResponseSchema>
export type OriznCompareResponse = z.infer<typeof oriznCompareResponseSchema>
