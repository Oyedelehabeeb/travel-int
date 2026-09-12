import { TravelDataError } from '#/domain/travel'
import {
  oriznCompareResponseSchema,
  oriznScoreResponseSchema,
  oriznStatsResponseSchema,
  oriznVisaResponseSchema,
} from './schemas'

const BASE_URL = 'https://visa.orizn.app/api/v1'

export class OriznClient {
  constructor(private readonly apiKey: string) {}

  private async request<T>(
    url: URL,
    schema: {
      safeParse: (
        value: unknown,
      ) => { success: true; data: T } | { success: false }
    },
    authenticated = false,
  ): Promise<T> {
    let response: Response
    try {
      response = await fetch(url, {
        headers: {
          ...(authenticated ? { 'x-api-key': this.apiKey } : {}),
          accept: 'application/json',
        },
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
        'No provider record exists for this request.',
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
    if (response.status === 401)
      throw new TravelDataError(
        'provider_unavailable',
        'The visa provider rejected the configured credentials.',
      )
    if (!response.ok)
      throw new TravelDataError(
        'unknown_provider_error',
        `The visa provider returned ${response.status}.`,
      )

    const parsed = schema.safeParse(await response.json())
    if (!parsed.success) {
      throw new TravelDataError(
        'malformed_response',
        'The visa provider returned an unexpected response.',
      )
    }
    return parsed.data
  }

  getStats() {
    return this.request(
      new URL(`${BASE_URL}/visa/stats`),
      oriznStatsResponseSchema,
    )
  }

  getScore(passport: string) {
    const url = new URL(`${BASE_URL}/visa/score`)
    url.searchParams.set('passport', passport)
    return this.request(url, oriznScoreResponseSchema)
  }

  compareScores(firstPassport: string, secondPassport: string) {
    const url = new URL(`${BASE_URL}/visa/score/compare`)
    url.searchParams.set('passport1', firstPassport)
    url.searchParams.set('passport2', secondPassport)
    return this.request(url, oriznCompareResponseSchema)
  }

  async getVisa(passport: string, destination: string) {
    const url = new URL(`${BASE_URL}/visa`)
    url.searchParams.set('passport', passport)
    url.searchParams.set('destination', destination)
    url.searchParams.set('lang', 'en')

    return this.request(url, oriznVisaResponseSchema, true)
  }
}
