import { Link } from '@tanstack/react-router'
import { AlertTriangle, RefreshCw } from 'lucide-react'

function safeErrorCopy(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  if (message.includes('quota'))
    return {
      title: 'The monthly data allowance has been reached',
      body: 'Live visa intelligence cannot be requested again until the Orizn quota resets or the plan changes.',
    }
  if (message.includes('timed out') || message.includes('unavailable'))
    return {
      title: 'Live travel data is temporarily unavailable',
      body: 'The provider did not respond successfully. Wait a moment and try the request again.',
    }
  if (
    message.includes('no provider record') ||
    message.includes('unknown country')
  )
    return {
      title: 'This travel route is not supported',
      body: 'No verified provider record is available for that passport and destination combination.',
    }
  if (message.includes('plan'))
    return {
      title: 'This information is not included in the current plan',
      body: 'Other public scores and individual visa fields may still be available.',
    }
  return {
    title: 'We could not load this visa intelligence',
    body: 'The response could not be safely interpreted. No unverified requirement has been shown.',
  }
}

export function TravelDataErrorState({
  error,
  onRetry,
}: {
  error: unknown
  onRetry: () => void
}) {
  const copy = safeErrorCopy(error)
  return (
    <main className="page-shell inner-page data-state-page">
      <section className="data-state-card" role="alert">
        <AlertTriangle aria-hidden="true" />
        <p className="eyebrow">Travel data notice</p>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="data-state-actions">
          <button type="button" onClick={onRetry}>
            <RefreshCw aria-hidden="true" /> Try again
          </button>
          <Link to="/destinations">Browse destinations</Link>
        </div>
      </section>
    </main>
  )
}

export function TravelDataPending() {
  return (
    <main
      className="page-shell inner-page data-state-page"
      aria-live="polite"
      aria-busy="true"
    >
      <section className="data-state-card is-loading">
        <div className="loading-orbit" aria-hidden="true" />
        <p className="eyebrow">Checking live travel data</p>
        <h1>Reading the latest available entry intelligence…</h1>
        <p>Passport, destination, and provider coverage are being verified.</p>
      </section>
    </main>
  )
}
