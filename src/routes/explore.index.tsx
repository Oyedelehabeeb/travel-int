import { createFileRoute } from '@tanstack/react-router'
import { Compass, Map, ShieldCheck } from 'lucide-react'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import { PassportSelector } from '#/components/PassportSelector'
import { countries } from '#/data/countries'
import { getTravelCoverage } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/explore/')({
  loader: () => getTravelCoverage(),
  component: ExploreLandingPage,
  head: () => ({
    meta: [{ title: 'Explore passport access — Travel Intelligence' }],
  }),
})

function ExploreLandingPage() {
  const coverage = Route.useLoaderData()
  const supportedCodes = new Set(coverage.supportedPassportCodes)
  const passportCountries = countries.filter((country) =>
    supportedCodes.has(country.code),
  )
  return (
    <main className="page-shell inner-page directory-page">
      <header className="directory-hero">
        <p className="script-kicker">Your world starts here</p>
        <h1>Choose a passport. Transform the map.</h1>
        <p>
          We do not infer your nationality or current location. Select the
          passport you actually travel with to begin.
        </p>
      </header>
      <PassportSelector passportCountries={passportCountries} />
      <DataSourceNotice provider={coverage.provider} />
      <section
        className="landing-steps"
        aria-label="How passport exploration works"
      >
        <article>
          <Compass />
          <span>01</span>
          <h2>Select deliberately</h2>
          <p>
            Your choice is remembered on this device only after you continue.
          </p>
        </article>
        <article>
          <Map />
          <span>02</span>
          <h2>Explore access</h2>
          <p>
            See category patterns with an accessible destination-list
            equivalent.
          </p>
        </article>
        <article>
          <ShieldCheck />
          <span>03</span>
          <h2>Verify the detail</h2>
          <p>
            Live records will show source and freshness when Orizn supplies
            them.
          </p>
        </article>
      </section>
    </main>
  )
}
