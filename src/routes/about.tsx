import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { buildSeo } from '#/lib/seo'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () =>
    buildSeo({
      title: 'Methodology and data integrity',
      description:
        'Learn how Travel Intelligence handles provider data, uncertainty, provenance, and verification.',
      path: '/about',
    }),
})

function AboutPage() {
  return (
    <main className="page-shell inner-page prose-page">
      <p className="script-kicker">Methodology</p>
      <h1>Useful intelligence, honest limits.</h1>
      <p>
        Travel Intelligence turns provider responses into a consistent product
        model without hiding uncertainty. Visa categories remain distinct,
        unknown values stay unknown, and missing fields are never presented as
        known facts.
      </p>
      <section>
        <ShieldCheck />
        <div>
          <h2>What to expect</h2>
          <p>
            Requirements are organized around a passport and destination. Where
            available, we show allowed stay, documents, process, provenance, and
            freshness. Every consequential result should still be checked with
            the relevant immigration authority before travel.
          </p>
        </div>
      </section>
    </main>
  )
}
