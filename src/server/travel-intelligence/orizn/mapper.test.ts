import { describe, expect, it } from 'vitest'
import {
  mapOriznComparison,
  mapOriznCoverage,
  mapOriznScore,
  mapOriznVisa,
  normalizeRequirement,
} from './mapper'
import {
  oriznCompareResponseSchema,
  oriznScoreResponseSchema,
  oriznStatsResponseSchema,
  oriznVisaResponseSchema,
} from './schemas'

describe('normalizeRequirement', () => {
  it.each([
    ['visa_free', 'visa_free'],
    ['visa_required', 'visa_required'],
    ['e_visa', 'e_visa'],
    ['visa_on_arrival', 'visa_on_arrival'],
    ['eta', 'eta'],
    ['no_admission', 'no_admission'],
    ['partial_restrictions', 'conditional'],
  ] as const)('maps %s to %s', (providerValue, category) => {
    expect(normalizeRequirement(providerValue).category).toBe(category)
  })

  it('preserves an unknown provider value', () => {
    expect(normalizeRequirement('future_status')).toMatchObject({
      category: 'unknown',
      providerValue: 'future_status',
      requiresFormality: null,
    })
  })
})

describe('mapOriznVisa', () => {
  it('maps a partial response without inventing optional fields', () => {
    const response = oriznVisaResponseSchema.parse({
      data: {
        passport: 'NGA',
        destination: 'JPN',
        requirement: 'visa_required',
        visa_required: true,
        description: 'A visa is required.',
        country_info: {},
        verified: false,
        source_url: null,
        last_verified_at: null,
      },
      meta: { lang: 'en', api_version: '1.1' },
    })

    const mapped = mapOriznVisa(response)
    expect(mapped.classification.category).toBe('visa_required')
    expect(mapped.documents.status).toBe('unavailable')
    expect(mapped.passportValidityMonths.status).toBe('unavailable')
    expect(mapped.provenance).toMatchObject({
      verified: false,
      sourceUrl: null,
      lastVerifiedAt: null,
    })
  })
})

describe('Orizn aggregate mapping', () => {
  const scoreResponse = oriznScoreResponseSchema.parse({
    passport: 'NGA',
    score: 427,
    rank: 186,
    total_ranked: 199,
    percentile: 6.5,
    visa_free_count: 29,
    breakdown: {
      access: {
        detail: {
          visa_free: 29,
          eta: 2,
          visa_on_arrival: 15,
          e_visa: 41,
          visa_required: 162,
        },
      },
    },
  })

  it('maps the observed live score fields', () => {
    expect(mapOriznScore(scoreResponse)).toMatchObject({
      score: 427,
      rank: 186,
      totalRanked: 199,
      percentile: 6.5,
      visaFreeCount: 29,
    })
  })

  it('maps count-based comparison data without inventing destination arrays', () => {
    const first = mapOriznScore(scoreResponse)
    const second = mapOriznScore({ ...scoreResponse, passport: 'GHA' })
    const response = oriznCompareResponseSchema.parse({
      passport1: { code: 'NGA', score: 427, rank: 186 },
      passport2: { code: 'GHA', score: 512, rank: 132 },
      combined: {
        score: 593,
        total_accessible: 118,
        only_passport1_count: 4,
        only_passport2_count: 31,
        both_count: 83,
        neither_count: 132,
      },
    })
    expect(mapOriznComparison(response, first, second)).toMatchObject({
      combinedScore: 593,
      accessibleTogether: 118,
      onlyFirst: 4,
      onlySecond: 31,
      both: 83,
      neither: 132,
      provider: 'orizn',
    })
  })

  it('maps the canonical supported-country lists from stats', () => {
    const response = oriznStatsResponseSchema.parse({
      coverage: { passports: 199, destinations: 250, visa_details: 49_750 },
      passports: ['NGA', 'GHA'],
      destinations: ['JPN', 'GHA'],
    })
    expect(mapOriznCoverage(response)).toEqual({
      passportCount: 199,
      destinationCount: 250,
      visaDetailCount: 49_750,
      supportedPassportCodes: ['NGA', 'GHA'],
      supportedDestinationCodes: ['JPN', 'GHA'],
      provider: 'orizn',
    })
  })
})
