import { TravelDataError } from '#/domain/travel'
import { oriznVisaResponseSchema } from './schemas'

const BASE_URL = 'https://visa.orizn.app/api/v1'

export class OriznClient {
  constructor(private readonly apiKey: string) {}

  async getVisa(passport: string, destination: string) {
    const url = new URL(`${BASE_URL}/visa`)
    url.searchParams.set('passport', passport)
    url.searchParams.set('destination', destination)
    url.searchParams.set('lang', 'en')

    let response: Response
    try {
      response = await fetch(url, {
        headers: { 'x-api-key': this.apiKey, accept: 'application/json' },
        signal: AbortSignal.timeout(10_000),
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new TravelDataError(
          'provider_timeout',
          'The visa provider timed out.',
        )
      }
      throw new TravelDataError(
        'provider_unavailable',
        'The visa provider is unavailable.',
      )
    }

    if (response.status === 404)
      throw new TravelDataError(
        'unsupported_pair',
        'No visa record exists for this route.',
      )
    if (response.status === 429)
      throw new TravelDataError(
        'quota_exhausted',
        'The monthly provider quota is exhausted.',
      )
    if (response.status === 403)
      throw new TravelDataError(
        'plan_restricted',
        'The provider plan does not allow this request.',
      )
    if (!response.ok)
      throw new TravelDataError(
        'unknown_provider_error',
        `The visa provider returned ${response.status}.`,
      )

    const parsed = oriznVisaResponseSchema.safeParse(await response.json())
    if (!parsed.success) {
      throw new TravelDataError(
        'malformed_response',
        'The visa provider returned an unexpected response.',
      )
    }
    return parsed.data
  }
}
