import { getCountryBySlug } from '#/data/countries'
import { TravelDataError } from '#/domain/travel'
import type {
  PassportAccessSnapshot,
  PassportComparison,
  PassportScore,
} from '#/domain/travel'
import type { TravelIntelligenceProvider } from '../provider'
import { OriznClient } from './client'
import {
  mapOriznComparison,
  mapOriznCoverage,
  mapOriznScore,
  mapOriznVisa,
} from './mapper'

export class OriznTravelProvider implements TravelIntelligenceProvider {
  private readonly client: OriznClient

  constructor(apiKey: string) {
    this.client = new OriznClient(apiKey)
  }

  async getCoverageStats() {
    return mapOriznCoverage(await this.client.getStats())
  }

  async getVisaIntelligence(passportSlug: string, destinationSlug: string) {
    const passport = getCountryBySlug(passportSlug)
    const destination = getCountryBySlug(destinationSlug)
    if (!passport || !destination)
      throw new TravelDataError('unsupported_country', 'Unknown country.')
    return mapOriznVisa(
      await this.client.getVisa(passport.code, destination.code),
    )
  }

  async getPassportAccess(
    passportSlug: string,
  ): Promise<PassportAccessSnapshot> {
    const passport = getCountryBySlug(passportSlug)
    if (!passport)
      throw new TravelDataError('unsupported_country', 'Unknown country.')
    const response = await this.client.getScore(passport.code)
    const score = mapOriznScore(response)
    const detail = response.breakdown.access.detail
    return {
      passport,
      score,
      summary: {
        visaFree: detail.visa_free,
        visaOnArrival: detail.visa_on_arrival,
        eVisa: detail.e_visa,
        eta: detail.eta,
        visaRequired: detail.visa_required,
      },
      destinations: [],
      generatedAt: new Date().toISOString(),
      provider: 'orizn',
      destinationCoverage: 'plan_gated',
    }
  }

  async getPassportScore(passportSlug: string): Promise<PassportScore> {
    const passport = getCountryBySlug(passportSlug)
    if (!passport)
      throw new TravelDataError('unsupported_country', 'Unknown country.')
    return mapOriznScore(await this.client.getScore(passport.code))
  }

  async comparePassports(
    firstPassportSlug: string,
    secondPassportSlug: string,
  ): Promise<PassportComparison> {
    const firstPassport = getCountryBySlug(firstPassportSlug)
    const secondPassport = getCountryBySlug(secondPassportSlug)
    if (!firstPassport || !secondPassport)
      throw new TravelDataError('unsupported_country', 'Unknown country.')

    const [firstResponse, secondResponse, comparisonResponse] =
      await Promise.all([
        this.client.getScore(firstPassport.code),
        this.client.getScore(secondPassport.code),
        this.client.compareScores(firstPassport.code, secondPassport.code),
      ])
    return mapOriznComparison(
      comparisonResponse,
      mapOriznScore(firstResponse),
      mapOriznScore(secondResponse),
    )
  }
}
