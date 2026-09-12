import { Database, Radio } from 'lucide-react'

export function DataSourceNotice({
  provider,
  compact = false,
}: {
  provider: 'fixture' | 'orizn'
  compact?: boolean
}) {
  const isFixture = provider === 'fixture'
  return (
    <aside
      className={`data-source-notice ${isFixture ? 'is-fixture' : 'is-live'}${compact ? ' compact' : ''}`}
      aria-label="Data source"
    >
      {isFixture ? (
        <Database aria-hidden="true" />
      ) : (
        <Radio aria-hidden="true" />
      )}
      <div>
        <strong>{isFixture ? 'Preview data' : 'Live Orizn data'}</strong>
        <span>
          {isFixture
            ? 'Illustrative fixtures for product testing—not current travel advice.'
            : 'Returned by the configured Orizn provider. Always review source and freshness.'}
        </span>
      </div>
    </aside>
  )
}
