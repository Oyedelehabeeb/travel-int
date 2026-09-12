import { getCountryBySlug } from '#/data/countries'
import { TravelDataError } from '#/domain/travel'
import type {
  PassportAccessSnapshot,
  PassportComparison,
  PassportScore,
} from '#/domain/travel'
import type { TravelIntelligenceProvider } from '../provider'
import { OriznClient } from './client'
import { mapOriznVisa } from './mapper'

export class OriznTravelProvider implements TravelIntelligenceProvider {
  private readonly client: OriznClient

  constructor(apiKey: string) {
    this.client = new OriznClient(apiKey)
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
    _passportSlug: string,
  ): Promise<PassportAccessSnapshot> {
    throw new TravelDataError(
      'plan_restricted',
      'Live passport access requires the Orizn bulk endpoint.',
    )
  }

  async getPassportScore(_passportSlug: string): Promise<PassportScore> {
    throw new TravelDataError(
      'provider_unavailable',
      'Live scoring is not connected yet.',
    )
  }

  async comparePassports(
    _firstPassportSlug: string,
    _secondPassportSlug: string,
  ): Promise<PassportComparison> {
    throw new TravelDataError(
      'provider_unavailable',
      'Live comparison is not connected yet.',
    )
  }
}
