import { createFileRoute } from '@tanstack/react-router'
import { CountryDirectory } from '#/components/CountryDirectory'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import { countries } from '#/data/countries'
import { getTravelCoverage } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/passports/')({
  loader: () => getTravelCoverage(),
  component: PassportDirectoryPage,
  head: () => ({
    meta: [{ title: 'Passport directory — Travel Intelligence' }],
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
