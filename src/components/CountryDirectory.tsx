import { Link } from '@tanstack/react-router'
import { CheckCircle2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { catalogueContinents, countries } from '#/data/countries'

export function CountryDirectory({
  kind,
}: {
  kind: 'passport' | 'destination'
}) {
  const [query, setQuery] = useState('')
  const [continent, setContinent] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return countries.filter((country) => {
      const matchesContinent =
        continent === 'all' || country.continent === continent
      const matchesQuery =
        !normalizedQuery ||
        `${country.name} ${country.code} ${country.iso2} ${country.continent}`
          .toLocaleLowerCase()
          .includes(normalizedQuery)
      return matchesContinent && matchesQuery
    })
  }, [continent, query])
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
        <label>
          <span className="sr-only">Filter by continent</span>
          <select
            value={continent}
            onChange={(event) => setContinent(event.target.value)}
          >
            <option value="all">All continents</option>
            {catalogueContinents.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="directory-count" aria-live="polite">
        {matches.length} catalogue {matches.length === 1 ? 'entry' : 'entries'}
      </p>
      {visible.length ? (
        <div className="country-directory">
          {visible.map((country) => {
          const hasPreview =
            kind === 'passport'
              ? country.fixturePassportCoverage
              : country.fixtureDestinationCoverage
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
                {hasPreview
                  ? 'Preview available'
                  : kind === 'destination'
                    ? 'Catalogue profile'
                    : 'Coverage pending'}
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
          ) : hasPreview ? (
            <Link
              key={country.code}
              to="/passports/$passportSlug"
              params={{ passportSlug: country.slug }}
              className="country-card"
            >
              {content}
            </Link>
          ) : (
            <div
              key={country.code}
              className="country-card is-pending"
              aria-disabled="true"
            >
              {content}
            </div>
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
