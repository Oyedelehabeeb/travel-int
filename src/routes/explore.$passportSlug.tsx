import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, BarChart3, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AccessMapPreview } from '#/components/AccessMapPreview'
import { AccessStatus } from '#/components/AccessStatus'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import type { AccessCategory } from '#/domain/travel'
import { getPassportAccess } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/explore/$passportSlug')({
  loader: ({ params }) =>
    getPassportAccess({ data: { passportSlug: params.passportSlug } }),
  component: ExplorePage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `Explore with a ${loaderData?.passport.name ?? ''} passport — Travel Intelligence`,
      },
    ],
  }),
})

function ExplorePage() {
  const snapshot = Route.useLoaderData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<AccessCategory | null>(null)
  const metrics: Array<[string, number, AccessCategory]> = [
    ['Visa free', snapshot.summary.visaFree, 'visa_free'],
    ['On arrival', snapshot.summary.visaOnArrival, 'visa_on_arrival'],
    ['eVisa', snapshot.summary.eVisa, 'e_visa'],
    ['ETA', snapshot.summary.eta, 'eta'],
    ['Visa required', snapshot.summary.visaRequired, 'visa_required'],
  ]
  const destinations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return snapshot.destinations.filter((item) => {
      const matchesCategory =
        !category || item.classification.category === category
      const searchable =
        `${item.country.name} ${item.country.region} ${item.country.continent}`.toLocaleLowerCase()
      return (
        matchesCategory &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      )
    })
  }, [category, query, snapshot.destinations])
  const filteredSnapshot = { ...snapshot, destinations }
  return (
    <main className="page-shell inner-page">
      <Link to="/" className="back-link">
        <ArrowLeft /> Back to discover
      </Link>
      <header className="passport-hero">
        <div>
          <p className="script-kicker">Your world view</p>
          <h1>
            {snapshot.passport.flag} Where can a{' '}
            {snapshot.passport.passportDemonym} passport take you?
          </h1>
          <p>
            Explore access by destination, then open any route for its detailed
            requirements.
          </p>
        </div>
        <Link
          to="/passports/$passportSlug"
          params={{ passportSlug: snapshot.passport.slug }}
          className="score-seal"
        >
          <BarChart3 />
          <span>Mobility score</span>
          <strong>{snapshot.score.score}</strong>
          <small>rank #{snapshot.score.rank}</small>
        </Link>
      </header>
      <DataSourceNotice provider={snapshot.provider} compact />
      <div className="filter-bar">
        <label>
          <Search />
          <span className="sr-only">Search destinations</span>
          <input
            type="search"
            placeholder="Search destinations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {metrics.map(([label, value, metricCategory]) => (
          <button
            type="button"
            key={label}
            aria-pressed={category === metricCategory}
            onClick={() =>
              setCategory((current) =>
                current === metricCategory ? null : metricCategory,
              )
            }
          >
            <strong>{value}</strong> {label}
          </button>
        ))}
      </div>
      <p className="filter-result" aria-live="polite">
        {snapshot.destinationCoverage === 'plan_gated'
          ? 'Live category totals are shown. Country-by-country access is unavailable on the configured Orizn plan.'
          : `Showing ${destinations.length} of ${snapshot.destinations.length} preview destinations${category || query ? ' · select the active filter again to clear it' : ''}.`}
      </p>
      <AccessMapPreview snapshot={filteredSnapshot} limit={10} />
      <section className="all-destinations">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Accessible alternative</p>
            <h2>Browse available preview destinations</h2>
          </div>
        </div>
        <div className="destination-table">
          {destinations.map((item) => (
            <Link
              key={item.country.code}
              to="/visa/$passportSlug/$destinationSlug"
              params={{
                passportSlug: snapshot.passport.slug,
                destinationSlug: item.country.slug,
              }}
            >
              <span>{item.country.flag}</span>
              <div>
                <strong>{item.country.name}</strong>
                <small>{item.country.continent}</small>
              </div>
              <AccessStatus
                category={item.classification.category}
                label={item.classification.label}
              />
            </Link>
          ))}
          {destinations.length === 0 ? (
            <div className="destination-empty">
              <strong>
                {snapshot.destinationCoverage === 'plan_gated'
                  ? 'Destination list unavailable on this plan'
                  : 'No matching destinations'}
              </strong>
              <span>
                {snapshot.destinationCoverage === 'plan_gated'
                  ? 'Individual passport-to-destination checks still use live Orizn data.'
                  : 'Try a different search or clear the active access filter.'}
              </span>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
