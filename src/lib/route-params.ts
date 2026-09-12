import { z } from 'zod'

export const countrySlugSchema = z
  .string()
  .min(2)
  .max(64)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Country routes must use a lowercase, hyphenated slug.',
  )

export const passportRouteSchema = z.object({
  passportSlug: countrySlugSchema,
})

export const visaRouteSchema = passportRouteSchema.extend({
  destinationSlug: countrySlugSchema,
})

export const comparisonRouteSchema = z
  .object({
    firstPassportSlug: countrySlugSchema,
    secondPassportSlug: countrySlugSchema,
  })
  .refine(
    ({ firstPassportSlug, secondPassportSlug }) =>
      firstPassportSlug !== secondPassportSlug,
    { message: 'Choose two different passports.' },
  )
