import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  ExternalLink,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { AccessStatus } from '#/components/AccessStatus'
import type { IntelligenceField } from '#/domain/travel'
import { getVisaIntelligence } from '#/server/travel-intelligence/functions'

export const Route = createFileRoute('/visa/$passportSlug/$destinationSlug')({
  loader: ({ params }) => getVisaIntelligence({ data: params }),
  component: VisaPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.passport.name ?? ''} to ${loaderData?.destination.name ?? ''} visa requirements`,
      },
    ],
  }),
})

function FieldNotice({ field }: { field: IntelligenceField<unknown> }) {
  if (field.status === 'available') return null
  return (
    <p className={`field-notice notice-${field.status}`}>
      <AlertTriangle />
      {field.note ?? 'This information is not currently available.'}
    </p>
  )
}

function VisaPage() {
  const visa = Route.useLoaderData()
  return (
    <main className="page-shell inner-page visa-page">
      <Link
        to="/explore/$passportSlug"
        params={{ passportSlug: visa.passport.slug }}
        className="back-link"
      >
        <ArrowLeft /> Back to {visa.passport.name} access
      </Link>
      <header className="visa-hero">
        <div className="route-flags">
          <span>{visa.passport.flag}</span>
          <i />
          <span>{visa.destination.flag}</span>
        </div>
        <div>
          <p className="eyebrow">Entry intelligence</p>
          <h1>
            {visa.passport.name} <span>to</span> {visa.destination.name}
          </h1>
          <AccessStatus
            category={visa.classification.category}
            label={visa.classification.label}
          />
          <p>{visa.description}</p>
        </div>
        <div className="stay-card">
          <Clock3 />
          <span>Typical allowance</span>
          <strong>
            {visa.stayDays ? `${visa.stayDays} days` : 'Confirm with authority'}
          </strong>
        </div>
      </header>

      <div className="visa-layout">
        <div className="visa-main">
          <section className="intelligence-section">
            <div className="section-icon">
              <FileText />
            </div>
            <div>
              <p className="eyebrow">Prepare</p>
              <h2>Documents to carry</h2>
              <FieldNotice field={visa.documents} />
              {visa.documents.value && (
                <ul className="check-list">
                  {visa.documents.value.map((item) => (
                    <li key={item}>
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          <section className="intelligence-section">
            <div className="section-icon">
              <ArrowRight />
            </div>
            <div>
              <p className="eyebrow">Process</p>
              <h2>How to approach entry</h2>
              <FieldNotice field={visa.process} />
              {visa.process.value && (
                <ol className="process-list">
                  {visa.process.value.map((item, index) => (
                    <li key={item}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
          <section className="detail-grid">
            <article>
              <h3>Passport validity</h3>
              <FieldNotice field={visa.passportValidityMonths} />
              {visa.passportValidityMonths.value && (
                <strong>{visa.passportValidityMonths.value} months</strong>
              )}
            </article>
            <article>
              <h3>Visa fees</h3>
              <FieldNotice field={visa.fees} />
              {visa.fees.value && <strong>{visa.fees.value}</strong>}
            </article>
            <article>
              <h3>Transit</h3>
              <FieldNotice field={visa.transit} />
            </article>
            <article>
              <h3>Health & insurance</h3>
              <FieldNotice field={visa.health} />
              <FieldNotice field={visa.insurance} />
            </article>
          </section>
        </div>
        <aside className="trust-panel">
          <ShieldCheck />
          <p className="eyebrow">Data confidence</p>
          <h2>
            {visa.provenance.verified
              ? 'Official source verified'
              : 'Provider intelligence'}
          </h2>
          <p>
            {visa.provenance.verified
              ? 'This route was confirmed against an official source.'
              : 'No directly citable official source was supplied for this fixture record.'}
          </p>
          {visa.provenance.lastVerifiedAt && (
            <dl>
              <dt>Last verified</dt>
              <dd>{visa.provenance.lastVerifiedAt}</dd>
            </dl>
          )}
          {visa.provenance.sourceUrl && (
            <a
              href={visa.provenance.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open official source <ExternalLink />
            </a>
          )}
          <div className="verify-callout">
            <AlertTriangle />
            <p>
              <strong>Verify before travel.</strong> Entry rules can change and
              may depend on personal circumstances.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
