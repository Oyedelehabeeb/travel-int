import { getCountryByCode } from '#/data/countries'
import { TravelDataError } from '#/domain/travel'
import type {
  AccessCategory,
  AccessClassification,
  IntelligenceField,
  PassportComparison,
  PassportScore,
  TravelCoverageStats,
  VisaIntelligence,
} from '#/domain/travel'
import type {
  OriznCompareResponse,
  OriznScoreResponse,
  OriznStatsResponse,
  OriznVisaResponse,
} from './schemas'

const requirementMap: Record<string, AccessCategory> = {
  visa_free: 'visa_free',
  visa_required: 'visa_required',
  e_visa: 'e_visa',
  visa_on_arrival: 'visa_on_arrival',
  eta: 'eta',
  no_admission: 'no_admission',
  admission_refused: 'no_admission',
  partial_restrictions: 'conditional',
}

const labels: Record<AccessCategory, string> = {
  freedom_of_movement: 'Freedom of movement',
  visa_free: 'Visa free',
  eta: 'ETA',
  visa_on_arrival: 'Visa on arrival',
  e_visa: 'eVisa',
  conditional: 'Conditional access',
  visa_required: 'Visa required',
  no_admission: 'Admission restricted',
  unknown: 'Unknown',
}

export function normalizeRequirement(raw: string): AccessClassification {
  const category = requirementMap[raw] ?? 'unknown'
  return {
    category,
    providerValue: raw,
    label: labels[category],
    requiresFormality:
      category === 'visa_free' || category === 'freedom_of_movement'
        ? false
        : category === 'unknown'
          ? null
          : true,
  }
}

export function mapOriznScore(response: OriznScoreResponse): PassportScore {
  const passport = getCountryByCode(response.passport)
  if (!passport) {
    throw new TravelDataError(
      'unsupported_country',
      'Orizn returned an unsupported passport code.',
    )
  }
  return {
    passport,
    score: response.score,
    rank: response.rank,
    totalRanked: response.total_ranked,
    percentile: response.percentile,
    visaFreeCount: response.visa_free_count,
  }
}

export function mapOriznComparison(
  response: OriznCompareResponse,
  first: PassportScore,
  second: PassportScore,
): PassportComparison {
  if (
    response.passport1.code !== first.passport.code ||
    response.passport2.code !== second.passport.code
  ) {
    throw new TravelDataError(
      'malformed_response',
      'Orizn returned a comparison for different passports.',
    )
  }
  return {
    first,
    second,
    combinedScore: response.combined.score,
    accessibleTogether: response.combined.total_accessible,
    onlyFirst: response.combined.only_passport1_count,
    onlySecond: response.combined.only_passport2_count,
    both: response.combined.both_count,
    neither: response.combined.neither_count,
    provider: 'orizn',
  }
}

export function mapOriznCoverage(
  response: OriznStatsResponse,
): TravelCoverageStats {
  return {
    passportCount: response.coverage.passports,
    destinationCount: response.coverage.destinations,
    visaDetailCount: response.coverage.visa_details,
    supportedPassportCodes: response.passports,
    supportedDestinationCodes: response.destinations,
    provider: 'orizn',
  }
}

function optionalArray<T>(value: T[] | undefined): IntelligenceField<T[]> {
  return value ? { status: 'available', value } : { status: 'unavailable' }
}

export function mapOriznVisa(response: OriznVisaResponse): VisaIntelligence {
  const data = response.data
  const passport = getCountryByCode(data.passport)
  const destination = getCountryByCode(data.destination)
  if (!passport || !destination) {
    throw new TravelDataError(
      'unsupported_country',
      'Orizn returned an unsupported country code.',
    )
  }

  return {
    passport,
    destination,
    classification: normalizeRequirement(data.requirement),
    stayDays: data.visa_free_days ?? null,
    description: data.description,
    passportValidityMonths:
      data.passport_validity_months === undefined
        ? { status: 'unavailable' }
        : { status: 'available', value: data.passport_validity_months },
    documents: optionalArray(data.documents_required),
    process: optionalArray(data.process),
    fees:
      data.visa_fee === undefined
        ? { status: 'unavailable' }
        : {
            status: 'available',
            value: 'Fee details supplied by the provider.',
          },
    transit:
      data.transit_visa === undefined
        ? { status: 'unavailable' }
        : {
            status: 'uncertain',
            note: 'Confirm transit rules with the carrier.',
          },
    health: optionalArray(data.vaccinations_required),
    insurance:
      data.insurance_required === undefined
        ? { status: 'unavailable' }
        : {
            status: 'available',
            value: 'Insurance details supplied by the provider.',
          },
    tips: data.tips ?? [],
    provenance: {
      verified: data.verified,
      source: data.source ?? null,
      sourceUrl: data.source_url ?? null,
      lastVerifiedAt: data.last_verified_at ?? null,
    },
  }
}
