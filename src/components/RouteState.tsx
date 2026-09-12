import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, Compass, RefreshCw } from 'lucide-react'

export function NotFoundPage() {
  return (
    <main className="page-shell inner-page data-state-page">
      <section className="data-state-card">
        <Compass aria-hidden="true" />
        <p className="eyebrow">Route not found</p>
        <h1>This path is not on the map.</h1>
        <p>
          The passport, destination, or page may not exist. Return to discovery
          without making any travel assumptions.
        </p>
        <div className="data-state-actions">
          <Link to="/">
            Return home <ArrowRight aria-hidden="true" />
          </Link>
          <Link to="/destinations">Browse destinations</Link>
        </div>
      </section>
    </main>
  )
}

export function RootErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page-shell inner-page data-state-page">
      <section className="data-state-card" role="alert">
        <AlertTriangle aria-hidden="true" />
        <p className="eyebrow">Application notice</p>
        <h1>We could not open this page safely.</h1>
        <p>
          Nothing uncertain has been substituted. Try the page again or return
          to the destination catalogue.
        </p>
        <div className="data-state-actions">
          <button type="button" onClick={reset}>
            <RefreshCw aria-hidden="true" /> Try again
          </button>
          <Link to="/destinations">Browse destinations</Link>
        </div>
      </section>
    </main>
  )
}
