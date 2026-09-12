import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Compass, Globe2, ShieldCheck, Sparkles } from 'lucide-react'
import { AccessMapPreview } from '#/components/AccessMapPreview'
import { PassportSelector } from '#/components/PassportSelector'
import { fixtureAccess } from '#/server/travel-intelligence/fixture/fixtures'

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => ({
    meta: [
      { title: 'Travel Intelligence — Explore the world through your passport' },
      { name: 'description', content: 'See where your passport can take you, compare access, and understand entry requirements.' },
    ],
  }),
})

const preview = fixtureAccess('nigeria')

function HomePage() {
  return (
    <main>
      <section className="hero page-shell">
        <div className="hero-copy">
          <p className="script-kicker">The world, made personal</p>
          <h1>Explore the world through <em>your passport.</em></h1>
          <p className="hero-lede">Visa intelligence shaped around where you’re from—so you can see what is open, what needs planning, and where to go next.</p>
          <PassportSelector />
          <div className="trust-line"><ShieldCheck aria-hidden="true" /><span>Clear requirements</span><span>Source-aware guidance</span><span>No booking noise</span></div>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <div className="orbit-globe"><Globe2 /><span className="orbit-ring ring-one" /><span className="orbit-ring ring-two" /></div>
          <div className="floating-note note-one"><span>🇯🇵</span><div><small>Japan</small><strong>Visa required</strong></div></div>
          <div className="floating-note note-two"><span>🇰🇪</span><div><small>Kenya</small><strong>ETA access</strong></div></div>
          <div className="floating-note note-three"><span>🇷🇼</span><div><small>Rwanda</small><strong>On arrival</strong></div></div>
        </div>
      </section>

      <section className="page-shell metric-strip" aria-label="Nigerian passport access preview">
        <div><strong>29</strong><span>visa-free</span></div>
        <div><strong>15</strong><span>on arrival</span></div>
        <div><strong>41</strong><span>eVisa</span></div>
        <div><strong>2</strong><span>ETA</span></div>
        <p>Example fixture data for the current design phase.</p>
      </section>

      <div className="page-shell section-space"><AccessMapPreview snapshot={preview} /></div>

      <section className="page-shell editorial-section">
        <div className="section-heading"><div><p className="eyebrow">Choose your way in</p><h2>Know where—or discover what’s possible.</h2></div><p>The experience works whether you already have a destination in mind or are still looking for inspiration.</p></div>
        <div className="journey-grid">
          <Link to="/visa/$passportSlug/$destinationSlug" params={{ passportSlug: 'nigeria', destinationSlug: 'japan' }} className="journey-card intent-card">
            <BookOpen aria-hidden="true" /><span className="eyebrow">I know where I’m going</span><h3>Nigeria → Japan</h3><p>See the requirement, documents, process, and evidence behind the answer.</p><span className="text-link">Check a route <ArrowRight /></span>
          </Link>
          <Link to="/explore/$passportSlug" params={{ passportSlug: 'nigeria' }} className="journey-card discover-card">
            <Compass aria-hidden="true" /><span className="eyebrow">Show me what’s possible</span><h3>Open the world view</h3><p>Filter destinations by access type and move naturally from the map into detail.</p><span className="text-link">Explore access <ArrowRight /></span>
          </Link>
        </div>
      </section>

      <section className="page-shell principles-section">
        <div><Sparkles aria-hidden="true" /><h2>Clarity for consequential travel decisions.</h2></div>
        <div className="principle-list">
          <article><span>01</span><div><h3>See the whole picture</h3><p>Access categories, regional patterns, and destination detail stay connected.</p></div></article>
          <article><span>02</span><div><h3>Understand uncertainty</h3><p>Missing, restricted, or unverified information is stated plainly.</p></div></article>
          <article><span>03</span><div><h3>Verify before you travel</h3><p>Official sources and freshness appear when the provider supplies them.</p></div></article>
        </div>
      </section>
    </main>
  )
}
