import type {
  PassportAccessSnapshot,
  PassportComparison,
  PassportScore,
  TravelCoverageStats,
  VisaIntelligence,
} from '#/domain/travel'

export interface TravelIntelligenceProvider {
  getPassportAccess: (passportSlug: string) => Promise<PassportAccessSnapshot>
  getPassportScore: (passportSlug: string) => Promise<PassportScore>
  getCoverageStats: () => Promise<TravelCoverageStats>
  getVisaIntelligence: (
    passportSlug: string,
    destinationSlug: string,
  ) => Promise<VisaIntelligence>
  comparePassports: (
    firstPassportSlug: string,
    secondPassportSlug: string,
  ) => Promise<PassportComparison>
}
