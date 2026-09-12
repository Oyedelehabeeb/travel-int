import { describe, expect, it } from 'vitest'
import {
  comparisonRouteSchema,
  countrySlugSchema,
  visaRouteSchema,
} from './route-params'

describe('public route parameters', () => {
  it('accepts canonical country slugs', () => {
    expect(countrySlugSchema.safeParse('nigeria').success).toBe(true)
    expect(countrySlugSchema.safeParse('bosnia-and-herzegovina').success).toBe(
      true,
    )
    expect(
      visaRouteSchema.safeParse({
        passportSlug: 'nigeria',
        destinationSlug: 'japan',
      }).success,
    ).toBe(true)
  })

  it.each(['Nigeria', ' japan', 'united_kingdom', '../japan', 'a'])(
    'rejects a non-canonical or unsafe slug: %s',
    (slug) => {
      expect(countrySlugSchema.safeParse(slug).success).toBe(false)
    },
  )

  it('rejects comparing a passport with itself', () => {
    expect(
      comparisonRouteSchema.safeParse({
        firstPassportSlug: 'ghana',
        secondPassportSlug: 'ghana',
      }).success,
    ).toBe(false)
  })
})
