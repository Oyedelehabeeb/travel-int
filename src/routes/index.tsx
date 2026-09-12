import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Compass,
  Globe2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { CountryCatalogueMap } from '#/components/CountryCatalogueMap'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import { PassportSelector } from '#/components/PassportSelector'
import { countries, fixturePassportCountries } from '#/data/countries'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      {
        title: 'Travel Intelligence — Explore the world through your passport',
      },
      {
        name: 'description',
        content:
          'See where your passport can take you, compare access, and understand entry requirements.',
      },
    ],
  }),
})

function HomePage() {
  return (
    <main>
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="script-kicker">The world, made personal</p>
          <h1>
            Explore the world through <em>your passport.</em>
          </h1>
          <p className="hero-lede">
            Visa intelligence shaped around the passport you choose—so you can
            see what is open, what needs planning, and where to go next.
          </p>
          <PassportSelector />
          <div className="trust-line">
            <ShieldCheck aria-hidden="true" />
            <span>No location detection</span>
            <span>Explicit passport choice</span>
            <span>Source-aware guidance</span>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-globe">
            <Globe2 />
            <span className="orbit-ring ring-one" />
            <span className="orbit-ring ring-two" />
          </div>
          <div className="floating-note note-one">
            <span>🇯🇵</span>
            <div>
              <small>Japan</small>
              <strong>Destination profile</strong>
            </div>
          </div>
          <div className="floating-note note-two">
            <span>🇰🇪</span>
            <div>
              <small>Kenya</small>
              <strong>Passport lookup</strong>
            </div>
          </div>
          <div className="floating-note note-three">
            <span>🇷🇼</span>
            <div>
              <small>Rwanda</small>
              <strong>Entry intelligence</strong>
            </div>
          </div>
        </div>
      </section>

      <section
        className="page-shell metric-strip product-state-strip"
        aria-label="Current product data coverage"
      >
        <div>
          <strong>{countries.length}</strong>
          <span>catalogue entries</span>
        </div>
        <div>
          <strong>{fixturePassportCountries.length}</strong>
          <span>passport previews</span>
        </div>
        <div>
          <strong>0</strong>
          <span>location assumptions</span>
        </div>
        <div>
          <strong>Off</strong>
          <span>live Orizn mode</span>
        </div>
        <p>
          Country discovery is complete; travel metrics appear only after an
          explicit passport selection.
        </p>
      </section>

      <div className="page-shell source-notice-wrap">
        <DataSourceNotice provider="fixture" />
      </div>
      <div className="page-shell section-space">
        <CountryCatalogueMap />
      </div>

      <section className="page-shell editorial-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Choose your way in</p>
            <h2>Know where—or discover what’s possible.</h2>
          </div>
          <p>
            The experience works whether you already have a destination in mind
            or are still looking for inspiration.
          </p>
        </div>
        <div className="journey-grid">
          <Link to="/destinations" className="journey-card intent-card">
            <BookOpen aria-hidden="true" />
            <span className="eyebrow">I know where I’m going</span>
            <h3>Find a destination</h3>
            <p>
              Search the complete catalogue, then choose the passport you will
              travel with.
            </p>
            <span className="text-link">
              Browse destinations <ArrowRight />
            </span>
          </Link>
          <Link to="/explore" className="journey-card discover-card">
            <Compass aria-hidden="true" />
            <span className="eyebrow">Show me what’s possible</span>
            <h3>Choose your world view</h3>
            <p>
              Select a fixture-supported passport and explore its clearly
              labelled preview.
            </p>
            <span className="text-link">
              Choose a passport <ArrowRight />
            </span>
          </Link>
        </div>
      </section>

      <section className="page-shell principles-section">
        <div>
          <Sparkles aria-hidden="true" />
          <h2>Clarity for consequential travel decisions.</h2>
        </div>
        <div className="principle-list">
          <article>
            <span>01</span>
            <div>
              <h3>See the whole picture</h3>
              <p>Country discovery is independent from provider coverage.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Understand uncertainty</h3>
              <p>
                Preview, unavailable, and live information are stated plainly.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Verify before you travel</h3>
              <p>
                Official sources and freshness appear when the provider supplies
                them.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
