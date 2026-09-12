import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Clock3,
  ExternalLink,
  FileText,
  HeartPulse,
  Info,
  Landmark,
  Plane,
  ShieldCheck,
} from 'lucide-react'
import { AccessStatus } from '#/components/AccessStatus'
import { DataSourceNotice } from '#/components/DataSourceNotice'
import type { IntelligenceField } from '#/domain/travel'
import { getVisaIntelligence } from '#/server/travel-intelligence/functions'
import {
  TravelDataErrorState,
  TravelDataPending,
} from '#/components/TravelDataState'

export const Route = createFileRoute('/visa/$passportSlug/$destinationSlug')({
  loader: ({ params }) => getVisaIntelligence({ data: params }),
  component: VisaPage,
  pendingComponent: TravelDataPending,
  errorComponent: ({ error, reset }) => (
    <TravelDataErrorState error={error} onRetry={reset} />
  ),
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.passport.name ?? ''} to ${loaderData?.destination.name ?? ''} visa requirements`,
      },
    ],
  }),
})

function FieldNotice({ field }: { field: IntelligenceField<unknown> }) {
  if (field.status === 'available' && !field.note) return null
  return (
    <p className={`field-notice notice-${field.status}`}>
      {field.status === 'available' ? <Info /> : <AlertTriangle />}
      {field.note ?? 'This information is not currently available.'}
    </p>
  )
}

function ScalarFact({
  label,
  field,
}: {
  label: string
  field: IntelligenceField<string | number>
}) {
  return (
    <div className="visa-fact">
      <dt>{label}</dt>
      <dd>{field.value ?? 'Not available'}</dd>
      <FieldNotice field={field} />
    </div>
  )
}

function ListFact({
  label,
  field,
}: {
  label: string
  field: IntelligenceField<string[]>
}) {
  return (
    <div className="visa-fact list-fact">
      <dt>{label}</dt>
      <FieldNotice field={field} />
      {field.value?.length ? (
        <dd>
          <ul>
            {field.value.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </dd>
      ) : null}
    </div>
  )
}

function VisaPage() {
  const visa = Route.useLoaderData()
  const provider = visa.provider
  const hasPassportPreview = visa.passport.fixturePassportCoverage
  return (
    <main className="page-shell inner-page visa-page">
      {hasPassportPreview ? (
        <Link
          to="/explore/$passportSlug"
          params={{ passportSlug: visa.passport.slug }}
          className="back-link"
        >
          <ArrowLeft /> Back to {visa.passport.name} access
        </Link>
      ) : (
        <Link
          to="/destinations/$destinationSlug"
          params={{ destinationSlug: visa.destination.slug }}
          className="back-link"
        >
          <ArrowLeft /> Back to {visa.destination.name}
        </Link>
      )}
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
            {visa.stayDays
              ? `${visa.stayDays} days`
              : (visa.maximumStay.value ?? 'Confirm with authority')}
          </strong>
        </div>
      </header>
      <DataSourceNotice provider={provider} compact />

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
          <section className="intelligence-section">
            <div className="section-icon">
              <CalendarClock />
            </div>
            <div>
              <p className="eyebrow">Timing</p>
              <h2>Validity and processing</h2>
              <dl className="visa-facts">
                <ScalarFact
                  label="Processing time"
                  field={visa.processingTime}
                />
                <ScalarFact label="Visa validity" field={visa.validity} />
                <ScalarFact label="Maximum stay" field={visa.maximumStay} />
                <ScalarFact
                  label="Passport validity"
                  field={
                    visa.passportValidityMonths.status === 'available'
                      ? {
                          ...visa.passportValidityMonths,
                          value: `${visa.passportValidityMonths.value} months`,
                        }
                      : visa.passportValidityMonths
                  }
                />
                <ScalarFact
                  label="Best time to apply"
                  field={visa.bestApplyPeriod}
                />
              </dl>
            </div>
          </section>
          <section className="intelligence-section">
            <div className="section-icon">
              <Plane />
            </div>
            <div>
              <p className="eyebrow">Conditions</p>
              <h2>Travel and application details</h2>
              <dl className="visa-facts">
                <ScalarFact label="Fees" field={visa.fees} />
                <ScalarFact label="Transit" field={visa.transit} />
                <ScalarFact label="Insurance" field={visa.insurance} />
                <ScalarFact label="Extensions" field={visa.extension} />
                <ListFact label="Entry by mode" field={visa.entryByMode} />
              </dl>
            </div>
          </section>
          <section className="intelligence-section">
            <div className="section-icon">
              <HeartPulse />
            </div>
            <div>
              <p className="eyebrow">Health and support</p>
              <h2>Before you depart</h2>
              <dl className="visa-facts">
                <ListFact label="Health requirements" field={visa.health} />
                <ListFact label="Embassy information" field={visa.embassy} />
              </dl>
            </div>
          </section>
        </div>
        <aside className="trust-panel">
          <ShieldCheck />
          <p className="eyebrow">Data confidence</p>
          <h2>
            {visa.provenance.verified
              ? 'Official source verified'
              : provider === 'fixture'
                ? 'Fixture provenance'
                : 'Provider-supplied intelligence'}
          </h2>
          <p>
            {visa.provenance.verified
              ? 'This route was confirmed against an official source.'
              : provider === 'fixture'
                ? 'This illustrative record is not verified travel advice.'
                : 'The Orizn response did not include a directly citable official source.'}
          </p>
          {visa.safety.status === 'available' && visa.safety.value ? (
            <div className="safety-summary">
              <Landmark />
              <div>
                <span>
                  Travel advisory
                  {visa.safety.value.level
                    ? ` · level ${visa.safety.value.level}`
                    : ''}
                </span>
                <strong>{visa.safety.value.advisory}</strong>
                {visa.safety.value.source ? (
                  <small>
                    {visa.safety.value.source}
                    {visa.safety.value.updatedAt
                      ? ` · updated ${visa.safety.value.updatedAt}`
                      : ''}
                  </small>
                ) : null}
              </div>
            </div>
          ) : (
            <FieldNotice field={visa.safety} />
          )}
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
