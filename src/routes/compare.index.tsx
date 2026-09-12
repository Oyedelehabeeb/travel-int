import { createFileRoute } from '@tanstack/react-router'
import { ComparisonSelector } from '#/components/ComparisonSelector'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import { countries } from '#/data/countries'
import { getTravelCoverage } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/compare/')({
  loader: () => getTravelCoverage(),
  component: CompareLandingPage,
  head: () => ({
    meta: [{ title: 'Compare passports — Travel Intelligence' }],
  }),
})

function CompareLandingPage() {
  const coverage = Route.useLoaderData()
  const supportedCodes = new Set(coverage.supportedPassportCodes)
  const passportCountries = countries.filter((country) =>
    supportedCodes.has(country.code),
  )
  return (
    <main className="page-shell inner-page directory-page">
      <header className="directory-hero">
        <p className="script-kicker">Passport comparison</p>
        <h1>Choose the passports worth comparing.</h1>
        <p>
          No pair is assumed. Start with two explicitly selected passports and
          focus on the differences that change where you can travel.
        </p>
      </header>
      <DataSourceNotice provider={coverage.provider} />
      <ComparisonSelector passportCountries={passportCountries} />
    </main>
  )
}
