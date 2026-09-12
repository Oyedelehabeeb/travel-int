export type AccessCategory =
  | 'freedom_of_movement'
  | 'visa_free'
  | 'eta'
  | 'visa_on_arrival'
  | 'e_visa'
  | 'conditional'
  | 'visa_required'
  | 'no_admission'
  | 'unknown'

export type FieldState =
  | 'available'
  | 'unavailable'
  | 'plan_gated'
  | 'uncertain'

export interface Country {
  code: string
  slug: string
  name: string
  passportDemonym: string
  flag: string
  region: string
  continent: string
  description: string
}

export interface AccessClassification {
  category: AccessCategory
  providerValue: string
  label: string
  requiresFormality: boolean | null
}

export interface DestinationAccess {
  country: Country
  classification: AccessClassification
  stayDays: number | null
  note?: string
}

export interface AccessSummary {
  visaFree: number
  visaOnArrival: number
  eVisa: number
  eta: number
  visaRequired: number
}

export interface PassportScore {
  passport: Country
  score: number
  rank: number
  totalRanked: number
  percentile: number
  visaFreeCount: number
}

export interface PassportAccessSnapshot {
  passport: Country
  score: PassportScore
  summary: AccessSummary
  destinations: DestinationAccess[]
  generatedAt: string
  provider: 'fixture' | 'orizn'
}

export interface IntelligenceField<T> {
  status: FieldState
  value?: T
  note?: string
}

export interface DataProvenance {
  verified: boolean
  source: string | null
  sourceUrl: string | null
  lastVerifiedAt: string | null
}

export interface VisaIntelligence {
  passport: Country
  destination: Country
  classification: AccessClassification
  stayDays: number | null
  description: string
  passportValidityMonths: IntelligenceField<number>
  documents: IntelligenceField<string[]>
  process: IntelligenceField<string[]>
  fees: IntelligenceField<string>
  transit: IntelligenceField<string>
  health: IntelligenceField<string[]>
  insurance: IntelligenceField<string>
  tips: string[]
  provenance: DataProvenance
}

export interface PassportComparison {
  first: PassportScore
  second: PassportScore
  combinedScore: number
  accessibleTogether: number
  onlyFirst: number
  onlySecond: number
  both: number
  neither: number
}

export type TravelDataErrorCode =
  | 'invalid_input'
  | 'unsupported_country'
  | 'unsupported_pair'
  | 'quota_exhausted'
  | 'plan_restricted'
  | 'provider_unavailable'
  | 'provider_timeout'
  | 'malformed_response'
  | 'unknown_provider_error'

export class TravelDataError extends Error {
  constructor(
    public readonly code: TravelDataErrorCode,
    message: string,
  ) {
    super(message)
    this.name = 'TravelDataError'
  }
}
