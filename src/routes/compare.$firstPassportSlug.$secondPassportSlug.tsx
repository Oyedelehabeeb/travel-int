import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Equal, Plus } from 'lucide-react'
import { comparePassports } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute(
  '/compare/$firstPassportSlug/$secondPassportSlug',
)({
  loader: ({ params }) => comparePassports({ data: params }),
  component: ComparePage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.first.passport.name ?? ''} vs ${loaderData?.second.passport.name ?? ''} passport comparison`,
      },
    ],
  }),
})

function ComparePage() {
  const comparison = Route.useLoaderData()
  const difference = Math.abs(comparison.first.score - comparison.second.score)
  const leader =
    comparison.first.score > comparison.second.score
      ? comparison.first
      : comparison.second
  return (
    <main className="page-shell inner-page">
      <header className="compare-hero">
        <p className="script-kicker">Passport comparison</p>
        <h1>
          {comparison.first.passport.name} <span>meets</span>{' '}
          {comparison.second.passport.name}
        </h1>
        <p>See the meaningful differences—not two endless country lists.</p>
      </header>
      <section className="passport-versus">
        {[comparison.first, comparison.second].map((passport) => (
          <article key={passport.passport.code}>
            <span>{passport.passport.flag}</span>
            <p className="eyebrow">{passport.passport.name}</p>
            <strong>{passport.score}</strong>
            <small>
              rank #{passport.rank} of {passport.totalRanked}
            </small>
            <div className="score-line">
              <i style={{ width: `${passport.score / 10}%` }} />
            </div>
            <Link
              to="/passports/$passportSlug"
              params={{ passportSlug: passport.passport.slug }}
            >
              Explore passport <ArrowRight />
            </Link>
          </article>
        ))}
        <div className="versus-mark">
          <Equal />
        </div>
      </section>
      <section className="comparison-insight">
        <div>
          <p className="eyebrow">The useful difference</p>
          <h2>
            {leader.passport.name} leads by {difference} points.
          </h2>
          <p>
            The score is only a summary. Access overlap shows how the passports
            complement one another.
          </p>
        </div>
        <div className="combined-score">
          <Plus />
          <strong>{comparison.combinedScore}</strong>
          <span>combined score</span>
        </div>
      </section>
      <section className="overlap-grid">
        <article>
          <strong>{comparison.both}</strong>
          <span>accessible to both</span>
        </article>
        <article>
          <strong>{comparison.onlyFirst}</strong>
          <span>only {comparison.first.passport.name}</span>
        </article>
        <article>
          <strong>{comparison.onlySecond}</strong>
          <span>only {comparison.second.passport.name}</span>
        </article>
        <article>
          <strong>{comparison.neither}</strong>
          <span>accessible to neither</span>
        </article>
      </section>
    </main>
  )
}
