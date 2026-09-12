import { createServerFn } from '@tanstack/react-start'
import type { TravelCoverageStats } from '#/domain/travel'
import {
  comparisonRouteSchema,
  passportRouteSchema,
  visaRouteSchema,
} from '#/lib/route-params'
import { FixtureTravelProvider } from './fixture/provider'
import { OriznTravelProvider } from './orizn/provider'
import type { TravelIntelligenceProvider } from './provider'

function getProvider(): TravelIntelligenceProvider {
  if (process.env.TRAVEL_DATA_PROVIDER === 'orizn') {
    const apiKey = process.env.ORIZN_API_KEY
    if (!apiKey)
      throw new Error(
        'ORIZN_API_KEY is required when TRAVEL_DATA_PROVIDER=orizn.',
      )
    return new OriznTravelProvider(apiKey)
  }
  return new FixtureTravelProvider()
}

export const getPassportAccess = createServerFn({ method: 'GET' })
  .validator(passportRouteSchema)
  .handler(({ data }) => getProvider().getPassportAccess(data.passportSlug))

let coverageCache: { expiresAt: number; value: TravelCoverageStats } | undefined

export const getTravelCoverage = createServerFn({ method: 'GET' }).handler(
  async () => {
    if (coverageCache && coverageCache.expiresAt > Date.now())
      return coverageCache.value
    const value = await getProvider().getCoverageStats()
    coverageCache = { value, expiresAt: Date.now() + 60 * 60 * 1000 }
    return value
  },
)

export const getPassportScore = createServerFn({ method: 'GET' })
  .validator(passportRouteSchema)
  .handler(({ data }) => getProvider().getPassportScore(data.passportSlug))

export const getVisaIntelligence = createServerFn({ method: 'GET' })
  .validator(visaRouteSchema)
  .handler(({ data }) =>
    getProvider().getVisaIntelligence(data.passportSlug, data.destinationSlug),
  )

export const comparePassports = createServerFn({ method: 'GET' })
  .validator(comparisonRouteSchema)
  .handler(({ data }) =>
    getProvider().comparePassports(
      data.firstPassportSlug,
      data.secondPassportSlug,
    ),
  )
