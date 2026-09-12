import { createFileRoute } from '@tanstack/react-router'
import { CountryDirectory } from '#/components/CountryDirectory'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import {
  TravelDataErrorState,
  TravelDataPending,
} from '#/components/TravelDataState'
import { countries } from '#/data/countries'
import { buildSeo } from '#/lib/seo'
import { getTravelCoverage } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/passports/')({
  loader: () => getTravelCoverage(),
  component: PassportDirectoryPage,
  pendingComponent: TravelDataPending,
  errorComponent: ({ error, reset }) => (
    <TravelDataErrorState error={error} onRetry={reset} />
  ),
  head: () =>
    buildSeo({
      title: 'Passport directory',
      description:
        'Browse supported passports and open live mobility scores, rankings, and access-category totals.',
      path: '/passports',
    }),
})

function PassportDirectoryPage() {
  const coverage = Route.useLoaderData()
  const supportedCodes = new Set(coverage.supportedPassportCodes)
  const passportCountries = countries.filter((country) =>
    supportedCodes.has(country.code),
  )
  return (
    <main className="page-shell inner-page directory-page">
      <header className="directory-hero">
        <p className="script-kicker">Passport directory</p>
        <h1>Every passport starts with a country.</h1>
        <p>
          Browse the {coverage.passportCount} passports supported by the
          configured travel data provider.
        </p>
      </header>
      <DataSourceNotice provider={coverage.provider} />
      <CountryDirectory kind="passport" passportCountries={passportCountries} />
    </main>
  )
}
