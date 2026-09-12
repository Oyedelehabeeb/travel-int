import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Globe2, Trophy } from 'lucide-react'
import { AccessMapPreview } from '#/components/AccessMapPreview'
import { getPassportAccess } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/passports/$passportSlug')({
  loader: ({ params }) =>
    getPassportAccess({ data: { passportSlug: params.passportSlug } }),
  component: PassportPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.passport.name ?? ''} passport access — Travel Intelligence`,
      },
    ],
  }),
})

function PassportPage() {
  const snapshot = Route.useLoaderData()
  return (
    <main className="page-shell inner-page">
      <header className="entity-hero">
        <div className="entity-flag" aria-hidden="true">
          {snapshot.passport.flag}
        </div>
        <div>
          <p className="eyebrow">Passport intelligence</p>
          <h1>{snapshot.passport.name}</h1>
          <p>{snapshot.passport.description}</p>
        </div>
        <div className="rank-card">
          <Trophy />
          <span>Global rank</span>
          <strong>#{snapshot.score.rank}</strong>
          <small>of {snapshot.score.totalRanked} passports</small>
        </div>
      </header>
      <section className="score-panel">
        <div>
          <p className="script-kicker">Mobility at a glance</p>
          <h2>
            {snapshot.score.score}
            <small>/1000</small>
          </h2>
          <p>
            A composite provider score. The category breakdown below is more
            useful than the number alone.
          </p>
        </div>
        <div
          className="score-ring"
          style={
            {
              '--score': `${snapshot.score.score / 10}%`,
            } as React.CSSProperties
          }
        >
          <Globe2 />
          <strong>{snapshot.score.percentile}%</strong>
          <span>percentile</span>
        </div>
        <div className="score-breakdown">
          {Object.entries(snapshot.summary).map(([key, value]) => (
            <div key={key}>
              <span>{key.replace(/([A-Z])/g, ' $1')}</span>
              <strong>{value}</strong>
              <i style={{ width: `${Math.min(Number(value) / 2, 100)}%` }} />
            </div>
          ))}
        </div>
      </section>
      <AccessMapPreview snapshot={snapshot} limit={8} />
      <div className="route-cta">
        <div>
          <p className="eyebrow">Go deeper</p>
          <h2>Filter the world around this passport.</h2>
        </div>
        <Link
          to="/explore/$passportSlug"
          params={{ passportSlug: snapshot.passport.slug }}
        >
          Explore all access <ArrowRight />
        </Link>
      </div>
    </main>
  )
}
