import { Link, notFound, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, MapPin } from 'lucide-react'
import { PassportSelector } from '#/components/PassportSelector'
import { getCountryBySlug } from '#/data/countries'

export const Route = createFileRoute('/destinations/$destinationSlug')({
  loader: ({ params }) => {
    const destination = getCountryBySlug(params.destinationSlug)
    if (!destination) throw notFound()
    return destination
  },
  component: DestinationPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.name ?? ''} entry requirements — Travel Intelligence`,
      },
    ],
  }),
})

function DestinationPage() {
  const destination = Route.useLoaderData()
  return (
    <main className="page-shell inner-page">
      <Link to="/destinations" className="back-link">
        <ArrowLeft /> Back to all destinations
      </Link>
      <header className="destination-hero">
        <div className="destination-visual">
          <span>{destination.flag}</span>
          <div className="topographic-lines" />
        </div>
        <div className="destination-intro">
          <p className="script-kicker">Destination intelligence</p>
          <h1>{destination.name}</h1>
          <p>{destination.description}</p>
          <div className="location-line">
            <MapPin />
            {destination.region} · {destination.continent}
          </div>
        </div>
      </header>
      <section className="destination-lookup">
        <div>
          <p className="eyebrow">Check your access</p>
          <h2>What does {destination.name} require from you?</h2>
          <p>
            Select the passport you travel with to see the relevant entry
            intelligence.
          </p>
        </div>
        <PassportSelector compact destinationSlug={destination.slug} />
      </section>
      <section className="editorial-grid">
        <article>
          <span>01</span>
          <h3>Requirement first</h3>
          <p>
            We lead with the entry classification and allowed stay before
            supporting detail.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Conditions in context</h3>
          <p>
            Documents, process, transit, and exceptions appear only when
            information is available.
          </p>
        </article>
        <article>
          <span>03</span>
          <h3>Evidence visible</h3>
          <p>
            Source and freshness are attached to the claim, not hidden in a
            generic footer.
          </p>
        </article>
      </section>
      <div className="catalogue-disclosure">
        <strong>Catalogue profile</strong>
        <span>
          {destination.fixtureDestinationCoverage
            ? 'This destination has representative fixture coverage for supported preview passports.'
            : 'No fixture intelligence is available for this destination. Selecting a passport will show an explicit unavailable-data state until live Orizn coverage is verified.'}
        </span>
      </div>
    </main>
  )
}
