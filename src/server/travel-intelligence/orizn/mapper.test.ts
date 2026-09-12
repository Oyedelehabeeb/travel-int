import { describe, expect, it } from 'vitest'
import { mapOriznVisa, normalizeRequirement } from './mapper'
import { oriznVisaResponseSchema } from './schemas'

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
