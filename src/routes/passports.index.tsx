import { createFileRoute } from '@tanstack/react-router'
import { CountryDirectory } from '#/components/CountryDirectory'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import { countries, fixturePassportCountries } from '#/data/countries'

export const Route = createFileRoute('/passports/')({
  component: PassportDirectoryPage,
  head: () => ({
    meta: [{ title: 'Passport directory — Travel Intelligence' }],
  }),
})

function PassportDirectoryPage() {
  return (
    <main className="page-shell inner-page directory-page">
      <header className="directory-hero">
        <p className="script-kicker">Passport directory</p>
        <h1>Every passport starts with a country.</h1>
        <p>
          Browse {countries.length} catalogue entries. Preview mobility data is
          currently available for {fixturePassportCountries.length}; Orizn
          support remains unverified until the live provider is connected.
        </p>
      </header>
      <DataSourceNotice provider="fixture" />
      <CountryDirectory kind="passport" />
    </main>
  )
}
