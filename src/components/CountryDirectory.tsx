import { Link } from '@tanstack/react-router'
import { CheckCircle2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { countries, fixturePassportCountries } from '#/data/countries'

export function CountryDirectory({
  kind,
}: {
  kind: 'passport' | 'destination'
}) {
  const [query, setQuery] = useState('')
  const [continent, setContinent] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const sourceCountries =
    kind === 'passport' ? fixturePassportCountries : countries
  const continents = useMemo(
    () => [...new Set(sourceCountries.map((country) => country.continent))],
    [sourceCountries],
  )
  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return sourceCountries.filter((country) => {
      const matchesContinent =
        continent === 'all' || country.continent === continent
      const matchesQuery =
        !normalizedQuery ||
        `${country.name} ${country.code} ${country.iso2} ${country.continent}`
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      return matchesContinent && matchesQuery
    })
  }, [continent, query, sourceCountries])
  const visible =
    showAll || query || continent !== 'all' ? matches : matches.slice(0, 36)

  return (
    <>
      <div className="directory-filters">
        <label>
          <Search aria-hidden="true" />
          <span className="sr-only">Search countries</span>
          <input
            type="search"
            placeholder={`Search ${kind === 'passport' ? 'passports' : 'destinations'}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="directory-select-field">
          <span className="sr-only">Filter by continent</span>
          <Select value={continent} onValueChange={setContinent}>
            <SelectTrigger
              aria-label="Filter by continent"
              className="directory-select-trigger"
            >
              <SelectValue>
                {continent === 'all' ? 'All continents' : continent}
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="travel-select-content">
              <SelectItem value="all">All continents</SelectItem>
              {continents.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="directory-count" aria-live="polite">
        {matches.length}{' '}
        {kind === 'passport'
          ? matches.length === 1
            ? 'available passport'
            : 'available passports'
          : `catalogue ${matches.length === 1 ? 'entry' : 'entries'}`}
      </p>
      {visible.length ? (
        <div className="country-directory">
          {visible.map((country) => {
            const hasPreview =
              kind === 'passport' || country.fixtureDestinationCoverage
            const content = (
              <>
                <span className="country-card-flag">{country.flag}</span>
                <span className="country-card-copy">
                  <strong>{country.name}</strong>
                  <small>
                    {country.continent} · {country.code}
                  </small>
                </span>
                <span
                  className={
                    hasPreview ? 'coverage-badge available' : 'coverage-badge'
                  }
                >
                  {hasPreview ? <CheckCircle2 aria-hidden="true" /> : null}
                  {hasPreview ? 'Preview available' : 'Catalogue profile'}
                </span>
              </>
            )
            return kind === 'destination' ? (
              <Link
                key={country.code}
                to="/destinations/$destinationSlug"
                params={{ destinationSlug: country.slug }}
                className="country-card"
              >
                {content}
              </Link>
            ) : (
              <Link
                key={country.code}
                to="/passports/$passportSlug"
                params={{ passportSlug: country.slug }}
                className="country-card"
              >
                {content}
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="directory-empty" role="status">
          <strong>No catalogue entries match those filters.</strong>
          <span>Try another country name or choose a different continent.</span>
        </div>
      )}
      {!showAll &&
      !query &&
      continent === 'all' &&
      matches.length > visible.length ? (
        <button
          type="button"
          className="show-all-button"
          onClick={() => setShowAll(true)}
        >
          Show all {matches.length} entries
        </button>
      ) : null}
    </>
  )
}
