import { Link } from '@tanstack/react-router'
import { ArrowRight, Globe2, ListFilter } from 'lucide-react'
import { countries, getCountryBySlug } from '#/data/countries'

const featured = [
  ['ghana', 48, 49],
  ['japan', 82, 31],
  ['brazil', 27, 70],
  ['france', 49, 29],
  ['india', 69, 47],
  ['canada', 19, 22],
] as const

export function CountryCatalogueMap() {
  const featuredCountries = featured.flatMap(([slug, left, top]) => {
    const country = getCountryBySlug(slug)
    return country ? [{ country, left, top }] : []
  })

  return (
    <section className="map-explorer" aria-labelledby="catalogue-map-title">
      <div className="map-toolbar">
        <div>
          <p className="eyebrow">Global country catalogue</p>
          <h2 id="catalogue-map-title">Start with the world. Make it yours.</h2>
        </div>
        <span className="map-mode">
          <Globe2 aria-hidden="true" /> Catalogue view
        </span>
      </div>
      <div className="map-layout">
        <div className="map-canvas">
          <div className="map-grid" />
          <span className="continent continent-americas" />
          <span className="continent continent-europe" />
          <span className="continent continent-africa" />
          <span className="continent continent-asia" />
          <span className="continent continent-oceania" />
          {featuredCountries.map(({ country, left, top }) => (
            <Link
              key={country.code}
              to="/destinations/$destinationSlug"
              params={{ destinationSlug: country.slug }}
              className="map-pin catalogue-pin"
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={`Explore ${country.name}`}
            >
              <span>{country.flag}</span>
            </Link>
          ))}
          <div className="map-caption">
            <strong>{countries.length}</strong>
            <span>countries and territories to discover</span>
          </div>
        </div>
        <div
          className="destination-list"
          aria-label="Featured destination list"
        >
          <div className="list-heading">
            <ListFilter aria-hidden="true" /> Featured destinations
          </div>
          {featuredCountries.map(({ country }) => (
            <Link
              key={country.code}
              to="/destinations/$destinationSlug"
              params={{ destinationSlug: country.slug }}
              className="destination-row catalogue-row"
            >
              <span className="destination-flag">{country.flag}</span>
              <span className="destination-copy">
                <strong>{country.name}</strong>
                <small>{country.continent}</small>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
