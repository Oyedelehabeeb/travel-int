import { createFileRoute } from '@tanstack/react-router'
import { CountryDirectory } from '#/components/CountryDirectory'
import { countries } from '#/data/countries'

export const Route = createFileRoute('/destinations/')({
  component: DestinationDirectoryPage,
  head: () => ({
    meta: [{ title: 'Destination directory — Travel Intelligence' }],
  }),
})

function DestinationDirectoryPage() {
  return (
    <main className="page-shell inner-page directory-page">
      <header className="directory-hero">
        <p className="script-kicker">Destination directory</p>
        <h1>The world—not a default destination.</h1>
        <p>
          Search {countries.length} countries and territories, open a
          destination profile, then choose the passport you travel with.
        </p>
      </header>
      <CountryDirectory kind="destination" />
    </main>
  )
}
