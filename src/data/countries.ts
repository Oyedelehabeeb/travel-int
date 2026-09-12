import { continents, getCountryDataList, getEmojiFlag } from 'countries-list'
import type { Country } from '#/domain/travel'

type CountryEnrichment = Partial<
  Pick<Country, 'description' | 'passportDemonym' | 'region'>
>

const fixturePassportCodes = new Set(['NGA', 'GHA', 'FRA', 'GBR', 'USA', 'IND'])
const fixtureDestinationCodes = new Set([
  'GHA',
  'RWA',
  'KEN',
  'JPN',
  'SGP',
  'IND',
  'FRA',
  'GBR',
  'BRA',
  'ARE',
])

const enrichments: Record<string, CountryEnrichment> = {
  NGA: {
    passportDemonym: 'Nigerian',
    region: 'Western Africa',
    description:
      'A gateway to West Africa with a passport story shaped by regional mobility and fast-growing eVisa access.',
  },
  GHA: {
    passportDemonym: 'Ghanaian',
    region: 'Western Africa',
    description:
      'A coastal West African destination known for warm hospitality, heritage, and creative culture.',
  },
  KEN: {
    passportDemonym: 'Kenyan',
    region: 'Eastern Africa',
    description:
      'Savannah, coast, and highlands meet in one of East Africa’s most connected destinations.',
  },
  RWA: {
    passportDemonym: 'Rwandan',
    region: 'Eastern Africa',
    description:
      'A compact, green destination with strong regional connections and thoughtful urban design.',
  },
  JPN: {
    passportDemonym: 'Japanese',
    region: 'Eastern Asia',
    description:
      'Layered cities, quiet landscapes, and a culture where precision and tradition coexist.',
  },
  SGP: {
    passportDemonym: 'Singaporean',
    region: 'South-eastern Asia',
    description:
      'A dense garden city and major global crossroads for culture, food, and commerce.',
  },
  IND: {
    passportDemonym: 'Indian',
    region: 'Southern Asia',
    description:
      'A vast, vivid destination of distinct regions, languages, landscapes, and histories.',
  },
  FRA: {
    passportDemonym: 'French',
    region: 'Western Europe',
    description:
      'An enduring centre of art, food, landscape, and continental connection.',
  },
  GBR: {
    passportDemonym: 'British',
    region: 'Northern Europe',
    description:
      'Four nations connected by layered histories, distinctive landscapes, and global cities.',
  },
  USA: {
    passportDemonym: 'American',
    region: 'Northern America',
    description:
      'A continent-scale destination spanning iconic cities, open roads, and dramatic landscapes.',
  },
  BRA: {
    passportDemonym: 'Brazilian',
    region: 'South America',
    description:
      'Immense biodiversity, energetic cities, and a long Atlantic coastline.',
  },
  ARE: {
    passportDemonym: 'Emirati',
    region: 'Western Asia',
    description:
      'A fast-moving Gulf crossroads connecting Africa, Asia, and Europe.',
  },
}

function toSlug(name: string) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export const countries: Country[] = getCountryDataList()
  .map((country): Country => {
    const enrichment = enrichments[country.iso3] ?? {}
    const continent = continents[country.continent]
    return {
      iso2: country.iso2,
      code: country.iso3,
      slug: toSlug(country.name),
      name: country.name,
      passportDemonym: enrichment.passportDemonym ?? country.name,
      flag: getEmojiFlag(country.iso2),
      region: enrichment.region ?? continent,
      continent,
      description:
        enrichment.description ??
        `Explore passport and destination entry context for ${country.name}, part of ${continent}.`,
      fixturePassportCoverage: fixturePassportCodes.has(country.iso3),
      fixtureDestinationCoverage: fixtureDestinationCodes.has(country.iso3),
      oriznSupport: 'unknown',
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

export const passportCountries = countries
export const fixturePassportCountries = countries.filter(
  (country) => country.fixturePassportCoverage,
)
export const catalogueContinents = [
  ...new Set(countries.map((country) => country.continent)),
]

export function getCountryBySlug(slug: string) {
  return countries.find((country) => country.slug === slug)
}

export function getCountryByCode(code: string) {
  const normalizedCode = code.toUpperCase()
  return countries.find(
    (country) =>
      country.code === normalizedCode || country.iso2 === normalizedCode,
  )
}
