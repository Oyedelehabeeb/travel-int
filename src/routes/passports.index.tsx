import { createFileRoute } from '@tanstack/react-router'
import { CountryDirectory } from '#/components/CountryDirectory'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import { fixturePassportCountries } from '#/data/countries'

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
          Browse the {fixturePassportCountries.length} passports with complete
          mobility previews in the current development dataset.
        </p>
      </header>
      <DataSourceNotice provider="fixture" />
      <CountryDirectory kind="passport" />
    </main>
  )
}
