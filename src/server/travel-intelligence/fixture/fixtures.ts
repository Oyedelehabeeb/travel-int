import { getCountryByCode, getCountryBySlug } from '#/data/countries'
import { TravelDataError } from '#/domain/travel'
import type {
  AccessCategory,
  AccessClassification,
  DestinationAccess,
  PassportAccessSnapshot,
  PassportScore,
  VisaIntelligence,
} from '#/domain/travel'

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

export function classification(
  category: AccessCategory,
  providerValue = category,
): AccessClassification {
  return {
    category,
    providerValue,
    label: labels[category],
    requiresFormality:
      category === 'visa_free' || category === 'freedom_of_movement'
        ? false
        : category === 'unknown'
          ? null
          : true,
  }
}

function destination(
  code: string,
  category: AccessCategory,
  stayDays: number | null,
  note?: string,
): DestinationAccess {
  const country = getCountryByCode(code)
  if (!country) throw new TravelDataError('unsupported_country', code)
  return { country, classification: classification(category), stayDays, note }
}

const nigeriaDestinations = [
  destination(
    'GHA',
    'freedom_of_movement',
    90,
    'Regional access may carry conditions.',
  ),
  destination('RWA', 'visa_on_arrival', 30),
  destination('KEN', 'eta', 90),
  destination('JPN', 'visa_required', null),
  destination('SGP', 'e_visa', 30),
  destination('IND', 'e_visa', 60),
  destination('FRA', 'visa_required', null),
  destination('GBR', 'visa_required', null),
  destination('BRA', 'visa_required', null),
  destination('ARE', 'visa_on_arrival', 30),
]

const scoreData: Partial<Record<string, Omit<PassportScore, 'passport'>>> = {
  nigeria: {
    score: 427,
    rank: 186,
    totalRanked: 199,
    percentile: 6.5,
    visaFreeCount: 29,
  },
  ghana: {
    score: 512,
    rank: 132,
    totalRanked: 199,
    percentile: 33.7,
    visaFreeCount: 47,
  },
  france: {
    score: 892,
    rank: 4,
    totalRanked: 199,
    percentile: 98,
    visaFreeCount: 158,
  },
  'united-kingdom': {
    score: 878,
    rank: 6,
    totalRanked: 199,
    percentile: 97,
    visaFreeCount: 154,
  },
  'united-states': {
    score: 849,
    rank: 9,
    totalRanked: 199,
    percentile: 95,
    visaFreeCount: 150,
  },
  india: {
    score: 486,
    rank: 151,
    totalRanked: 199,
    percentile: 24,
    visaFreeCount: 37,
  },
}

export function fixtureScore(passportSlug: string): PassportScore {
  const passport = getCountryBySlug(passportSlug)
  const score = scoreData[passportSlug]
  if (!passport || !score) {
    throw new TravelDataError(
      'unsupported_country',
      'Passport is not available in the fixture provider.',
    )
  }
  return { passport, ...score }
}

export function fixtureAccess(passportSlug: string): PassportAccessSnapshot {
  const score = fixtureScore(passportSlug)
  const destinations =
    passportSlug === 'nigeria'
      ? nigeriaDestinations
      : nigeriaDestinations.map((item, index) => ({
          ...item,
          classification: classification(
            index < 4 ? 'visa_free' : index < 7 ? 'e_visa' : 'visa_required',
          ),
        }))

  return {
    passport: score.passport,
    score,
    summary:
      passportSlug === 'nigeria'
        ? {
            visaFree: 29,
            visaOnArrival: 15,
            eVisa: 41,
            eta: 2,
            visaRequired: 162,
          }
        : {
            visaFree: score.visaFreeCount,
            visaOnArrival: 20,
            eVisa: 28,
            eta: 7,
            visaRequired: 54,
          },
    destinations,
    generatedAt: '2026-09-12T00:00:00.000Z',
    provider: 'fixture',
    destinationCoverage: 'preview',
  }
}

export function fixtureVisa(
  passportSlug: string,
  destinationSlug: string,
): VisaIntelligence {
  const passport = getCountryBySlug(passportSlug)
  const destinationCountry = getCountryBySlug(destinationSlug)
  if (!passport || !destinationCountry) {
    throw new TravelDataError(
      'unsupported_country',
      'Passport or destination is unavailable.',
    )
  }

  const access = scoreData[passportSlug]
    ? fixtureAccess(passportSlug).destinations.find(
        (item) => item.country.slug === destinationSlug,
      )
    : undefined
  const accessClassification =
    access?.classification ?? classification('unknown')

  if (!access) {
    return {
      passport,
      destination: destinationCountry,
      classification: accessClassification,
      stayDays: null,
      description:
        'This country pair is present in the catalogue, but no fixture or live Orizn intelligence is available for it.',
      passportValidityMonths: { status: 'unavailable' },
      documents: { status: 'unavailable' },
      process: { status: 'unavailable' },
      processingTime: { status: 'unavailable' },
      validity: { status: 'unavailable' },
      maximumStay: { status: 'unavailable' },
      fees: { status: 'unavailable' },
      transit: { status: 'unavailable' },
      health: { status: 'unavailable' },
      insurance: { status: 'unavailable' },
      extension: { status: 'unavailable' },
      embassy: { status: 'unavailable' },
      entryByMode: { status: 'unavailable' },
      safety: { status: 'unavailable' },
      bestApplyPeriod: { status: 'unavailable' },
      tips: [
        'Select a fixture-supported passport and destination, or connect Orizn for live coverage.',
      ],
      provenance: {
        verified: false,
        source: 'development fixture',
        sourceUrl: null,
        lastVerifiedAt: null,
      },
      provider: 'fixture',
    }
  }

  return {
    passport,
    destination: destinationCountry,
    classification: accessClassification,
    stayDays: access.stayDays,
    description:
      accessClassification.category === 'visa_required'
        ? `${passport.passportDemonym} passport holders should arrange the appropriate entry permission before travelling to ${destinationCountry.name}.`
        : `${destinationCountry.name} offers ${accessClassification.label.toLowerCase()} access to ${passport.passportDemonym} passport holders, subject to the conditions shown.`,
    passportValidityMonths: { status: 'available', value: 6 },
    documents: {
      status: 'available',
      value: [
        'Passport valid beyond the intended stay',
        'Proof of onward travel',
        'Evidence of sufficient funds',
      ],
    },
    process:
      accessClassification.category === 'visa_required'
        ? {
            status: 'available',
            value: [
              'Confirm the correct visa category',
              'Prepare the required documents',
              'Apply through the relevant authority',
              'Wait for a decision before travel',
            ],
          }
        : {
            status: 'available',
            value: [
              'Check passport validity',
              'Complete any required arrival form',
              'Carry supporting travel documents',
            ],
          },
    processingTime: {
      status: 'available',
      value:
        accessClassification.category === 'visa_required'
          ? '5–10 business days'
          : 'Not applicable for this preview',
    },
    validity: { status: 'unavailable' },
    maximumStay:
      access.stayDays === null
        ? { status: 'unavailable' }
        : { status: 'available', value: `Up to ${access.stayDays} days` },
    fees: {
      status: 'plan_gated',
      note: 'Fee information is not available in this development fixture.',
    },
    transit: {
      status: 'uncertain',
      note: 'Transit rules can depend on airport, carrier, and itinerary.',
    },
    health: {
      status: 'unavailable',
      note: 'No verified health requirement was supplied.',
    },
    insurance: {
      status: 'unavailable',
      note: 'No verified insurance requirement was supplied.',
    },
    extension: {
      status: 'unavailable',
      note: 'No verified extension information was supplied.',
    },
    embassy: {
      status: 'unavailable',
      note: 'No verified embassy information was supplied.',
    },
    entryByMode: {
      status: 'unavailable',
      note: 'No verified entry-by-mode information was supplied.',
    },
    safety: {
      status: 'unavailable',
      note: 'No verified safety advisory was supplied.',
    },
    bestApplyPeriod: {
      status: 'unavailable',
      note: 'No verified application timing was supplied.',
    },
    tips: [
      'Check requirements again shortly before departure.',
      'Keep copies of supporting documents accessible while travelling.',
    ],
    provenance: {
      verified: false,
      source: 'development fixture',
      sourceUrl: null,
      lastVerifiedAt: null,
    },
    provider: 'fixture',
  }
}
