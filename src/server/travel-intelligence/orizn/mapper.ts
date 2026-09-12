import { getCountryByCode } from '#/data/countries'
import { TravelDataError } from '#/domain/travel'
import type {
  AccessCategory,
  AccessClassification,
  IntelligenceField,
  PassportComparison,
  PassportScore,
  SafetyInformation,
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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function blockedField<T>(value: unknown): IntelligenceField<T> | null {
  if (value === undefined || value === null) return { status: 'unavailable' }
  const record = asRecord(value)
  if (!record) return null
  if (typeof record.upgrade === 'string') {
    return { status: 'plan_gated', note: record.upgrade }
  }
  if (record.status === 'unavailable') {
    const scope =
      typeof record.granularity === 'string'
        ? ` at ${record.granularity} level`
        : ''
    return {
      status: 'unavailable',
      note: `Orizn marks this information as unavailable${scope}.`,
    }
  }
  return null
}

function stringField(value: unknown): IntelligenceField<string> {
  const blocked = blockedField<string>(value)
  if (blocked) return blocked
  return typeof value === 'string' && value.trim()
    ? { status: 'available', value }
    : { status: 'unavailable' }
}

function labelKey(key: string) {
  return key
    .replaceAll('_', ' ')
    .replace(/^./, (letter) => letter.toUpperCase())
}

function recordFacts(value: unknown): string[] {
  const record = asRecord(value)
  if (!record) return []
  return Object.entries(record).flatMap(([key, item]) => {
    if (
      ['upgrade', 'status', 'granularity', 'as_of'].includes(key) ||
      item === null ||
      item === undefined ||
      typeof item === 'object'
    )
      return []
    const rendered =
      typeof item === 'boolean' ? (item ? 'Yes' : 'No') : String(item)
    return [`${labelKey(key)}: ${rendered}`]
  })
}

function recordField(value: unknown): IntelligenceField<string[]> {
  const blocked = blockedField<string[]>(value)
  if (blocked) return blocked
  const facts = recordFacts(value)
  return facts.length
    ? { status: 'available', value: facts }
    : { status: 'unavailable' }
}

function joinedRecordField(value: unknown): IntelligenceField<string> {
  const field = recordField(value)
  return field.status === 'available' && field.value
    ? { status: 'available', value: field.value.join(' · ') }
    : { status: field.status, note: field.note }
}

function healthField(
  vaccinations: unknown,
  requirements: unknown,
): IntelligenceField<string[]> {
  const requirementsBlocked = blockedField<string[]>(requirements)
  if (requirementsBlocked?.status === 'plan_gated') return requirementsBlocked
  const vaccinationBlocked = blockedField<string[]>(vaccinations)
  const vaccinationFacts = Array.isArray(vaccinations)
    ? vaccinations.filter((item): item is string => typeof item === 'string')
    : []
  const requirementFacts = recordFacts(requirements)
  const facts = [...vaccinationFacts, ...requirementFacts]
  if (facts.length) return { status: 'available', value: facts }
  return requirementsBlocked ?? vaccinationBlocked ?? { status: 'unavailable' }
}

function extensionField(
  extension: unknown,
  rules: unknown,
): IntelligenceField<string> {
  const blocked = blockedField<string>(extension)
  if (blocked) return blocked
  const record = asRecord(extension)
  const details = record?.details
  if (typeof details === 'string' && details.trim()) {
    const rulesBlocked = blockedField<string>(rules)
    return {
      status: 'available',
      value: details,
      note:
        rulesBlocked?.status === 'plan_gated'
          ? `Detailed extension rules: ${rulesBlocked.note}`
          : undefined,
    }
  }
  return joinedRecordField(extension)
}

function safetyField(value: unknown): IntelligenceField<SafetyInformation> {
  const blocked = blockedField<SafetyInformation>(value)
  if (blocked) return blocked
  const record = asRecord(value)
  if (!record || typeof record.advisory !== 'string')
    return { status: 'unavailable' }
  return {
    status: 'available',
    value: {
      level: typeof record.level === 'number' ? record.level : null,
      advisory: record.advisory,
      source: typeof record.source === 'string' ? record.source : null,
      updatedAt:
        typeof record.updated_at === 'string' ? record.updated_at : null,
    },
  }
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
  const visaFeeRestriction = blockedField<string>(data.visa_fee)

  return {
    passport,
    destination,
    classification: normalizeRequirement(data.requirement),
    stayDays: data.visa_free_days ?? null,
    description: data.description,
    passportValidityMonths:
      data.passport_validity_months === undefined ||
      data.passport_validity_months <= 0
        ? {
            status: 'unavailable',
            note: 'No additional passport-validity period was specified.',
          }
        : { status: 'available', value: data.passport_validity_months },
    documents: optionalArray(data.documents_required),
    process: optionalArray(data.process),
    processingTime:
      typeof data.processing_time === 'string' && data.processing_time.trim()
        ? { status: 'available', value: data.processing_time }
        : joinedRecordField(data.processing_days),
    validity: stringField(data.validity),
    maximumStay: stringField(data.max_stay),
    fees:
      typeof data.cost === 'string' && data.cost.trim()
        ? {
            status: 'available',
            value: data.cost,
            note:
              visaFeeRestriction?.status === 'plan_gated'
                ? `Detailed fee breakdown: ${visaFeeRestriction.note}`
                : undefined,
          }
        : joinedRecordField(data.visa_fee),
    transit: joinedRecordField(data.transit_visa),
    health: healthField(data.vaccinations_required, data.health_requirements),
    insurance: joinedRecordField(data.insurance_required),
    extension: extensionField(data.extension, data.extension_rules),
    embassy: recordField(data.embassy),
    entryByMode: recordField(data.entry_by_mode),
    safety: safetyField(data.safety),
    bestApplyPeriod: stringField(data.best_apply_period),
    tips: data.tips ?? [],
    provenance: {
      verified: data.verified,
      source: data.source ?? null,
      sourceUrl: data.source_url ?? null,
      lastVerifiedAt: data.last_verified_at ?? null,
    },
    provider: 'orizn',
  }
}
