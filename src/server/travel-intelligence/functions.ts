import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { TravelCoverageStats } from '#/domain/travel'
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

const passportInput = z.object({ passportSlug: z.string().min(2).max(64) })
const visaInput = passportInput.extend({
  destinationSlug: z.string().min(2).max(64),
})
const comparisonInput = z.object({
  firstPassportSlug: z.string().min(2).max(64),
  secondPassportSlug: z.string().min(2).max(64),
})

export const getPassportAccess = createServerFn({ method: 'GET' })
  .validator(passportInput)
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
  .validator(passportInput)
  .handler(({ data }) => getProvider().getPassportScore(data.passportSlug))

export const getVisaIntelligence = createServerFn({ method: 'GET' })
  .validator(visaInput)
  .handler(({ data }) =>
    getProvider().getVisaIntelligence(data.passportSlug, data.destinationSlug),
  )

export const comparePassports = createServerFn({ method: 'GET' })
  .validator(comparisonInput)
  .handler(({ data }) =>
    getProvider().comparePassports(
      data.firstPassportSlug,
      data.secondPassportSlug,
    ),
  )
