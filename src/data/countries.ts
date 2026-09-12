import type { Country } from '#/domain/travel'

export const countries = [
  {
    code: 'NGA', slug: 'nigeria', name: 'Nigeria', passportDemonym: 'Nigerian', flag: '🇳🇬', region: 'Western Africa', continent: 'Africa',
    description: 'A gateway to West Africa with a passport story shaped by regional mobility and fast-growing eVisa access.',
  },
  {
    code: 'GHA', slug: 'ghana', name: 'Ghana', passportDemonym: 'Ghanaian', flag: '🇬🇭', region: 'Western Africa', continent: 'Africa',
    description: 'A coastal West African destination known for warm hospitality, heritage, and creative culture.',
  },
  {
    code: 'KEN', slug: 'kenya', name: 'Kenya', passportDemonym: 'Kenyan', flag: '🇰🇪', region: 'Eastern Africa', continent: 'Africa',
    description: 'Savannah, coast, and highlands meet in one of East Africa’s most connected destinations.',
  },
  {
    code: 'RWA', slug: 'rwanda', name: 'Rwanda', passportDemonym: 'Rwandan', flag: '🇷🇼', region: 'Eastern Africa', continent: 'Africa',
    description: 'A compact, green destination with strong regional connections and thoughtful urban design.',
  },
  {
    code: 'JPN', slug: 'japan', name: 'Japan', passportDemonym: 'Japanese', flag: '🇯🇵', region: 'Eastern Asia', continent: 'Asia',
    description: 'Layered cities, quiet landscapes, and a culture where precision and tradition coexist.',
  },
  {
    code: 'SGP', slug: 'singapore', name: 'Singapore', passportDemonym: 'Singaporean', flag: '🇸🇬', region: 'South-eastern Asia', continent: 'Asia',
    description: 'A dense garden city and major global crossroads for culture, food, and commerce.',
  },
  {
    code: 'IND', slug: 'india', name: 'India', passportDemonym: 'Indian', flag: '🇮🇳', region: 'Southern Asia', continent: 'Asia',
    description: 'A vast, vivid destination of distinct regions, languages, landscapes, and histories.',
  },
  {
    code: 'FRA', slug: 'france', name: 'France', passportDemonym: 'French', flag: '🇫🇷', region: 'Western Europe', continent: 'Europe',
    description: 'An enduring centre of art, food, landscape, and continental connection.',
  },
  {
    code: 'GBR', slug: 'united-kingdom', name: 'United Kingdom', passportDemonym: 'British', flag: '🇬🇧', region: 'Northern Europe', continent: 'Europe',
    description: 'Four nations connected by layered histories, distinctive landscapes, and global cities.',
  },
  {
    code: 'USA', slug: 'united-states', name: 'United States', passportDemonym: 'American', flag: '🇺🇸', region: 'Northern America', continent: 'North America',
    description: 'A continent-scale destination spanning iconic cities, open roads, and dramatic landscapes.',
  },
  {
    code: 'BRA', slug: 'brazil', name: 'Brazil', passportDemonym: 'Brazilian', flag: '🇧🇷', region: 'South America', continent: 'South America',
    description: 'Immense biodiversity, energetic cities, and a long Atlantic coastline.',
  },
  {
    code: 'ARE', slug: 'united-arab-emirates', name: 'United Arab Emirates', passportDemonym: 'Emirati', flag: '🇦🇪', region: 'Western Asia', continent: 'Asia',
    description: 'A fast-moving Gulf crossroads connecting Africa, Asia, and Europe.',
  },
] satisfies Country[]

export const passportCountries = countries.filter((country) =>
  ['NGA', 'GHA', 'FRA', 'GBR', 'USA', 'IND'].includes(country.code),
)

export function getCountryBySlug(slug: string) {
  return countries.find((country) => country.slug === slug)
}

export function getCountryByCode(code: string) {
  return countries.find((country) => country.code === code.toUpperCase())
}
