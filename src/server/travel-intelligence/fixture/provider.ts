import type { TravelIntelligenceProvider } from '../provider'
import { fixtureAccess, fixtureScore, fixtureVisa } from './fixtures'

export class FixtureTravelProvider implements TravelIntelligenceProvider {
  async getPassportAccess(passportSlug: string) {
    return fixtureAccess(passportSlug)
  }

  async getPassportScore(passportSlug: string) {
    return fixtureScore(passportSlug)
  }

  async getVisaIntelligence(passportSlug: string, destinationSlug: string) {
    return fixtureVisa(passportSlug, destinationSlug)
  }

  async comparePassports(
    firstPassportSlug: string,
    secondPassportSlug: string,
  ) {
    const first = fixtureScore(firstPassportSlug)
    const second = fixtureScore(secondPassportSlug)
    const nigeriaAndGhana = new Set([first.passport.code, second.passport.code])
    const isNigeriaAndGhana =
      nigeriaAndGhana.has('NGA') && nigeriaAndGhana.has('GHA')

    return {
      first,
      second,
      combinedScore: isNigeriaAndGhana
        ? 593
        : Math.max(first.score, second.score),
      accessibleTogether: isNigeriaAndGhana
        ? 118
        : Math.max(first.visaFreeCount, second.visaFreeCount),
      onlyFirst: isNigeriaAndGhana
        ? first.passport.code === 'NGA'
          ? 4
          : 31
        : 0,
      onlySecond: isNigeriaAndGhana
        ? second.passport.code === 'GHA'
          ? 31
          : 4
        : 0,
      both: isNigeriaAndGhana
        ? 83
        : Math.min(first.visaFreeCount, second.visaFreeCount),
      neither: isNigeriaAndGhana
        ? 132
        : 250 - Math.max(first.visaFreeCount, second.visaFreeCount),
      provider: 'fixture' as const,
    }
  }
}
