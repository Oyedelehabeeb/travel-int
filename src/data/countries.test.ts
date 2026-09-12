import { describe, expect, it } from 'vitest'
import {
  countries,
  fixturePassportCountries,
  getCountryByCode,
  getCountryBySlug,
} from './countries'

describe('country catalogue', () => {
  it('contains a complete ISO-derived catalogue with unique routes', () => {
    expect(countries.length).toBeGreaterThanOrEqual(249)
    expect(new Set(countries.map((country) => country.code)).size).toBe(
      countries.length,
    )
    expect(new Set(countries.map((country) => country.slug)).size).toBe(
      countries.length,
    )
  })

  it('looks up both alpha-2 and alpha-3 country codes', () => {
    expect(getCountryByCode('NG')?.slug).toBe('nigeria')
    expect(getCountryByCode('NGA')?.slug).toBe('nigeria')
    expect(getCountryBySlug('japan')?.code).toBe('JPN')
  })

  it('keeps fixture passport coverage explicit and limited', () => {
    expect(fixturePassportCountries).toHaveLength(6)
    expect(
      fixturePassportCountries.every(
        (country) => country.fixturePassportCoverage,
      ),
    ).toBe(true)
    expect(getCountryBySlug('canada')?.oriznSupport).toBe('unknown')
  })
})
