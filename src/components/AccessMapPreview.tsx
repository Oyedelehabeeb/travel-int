import { Link } from '@tanstack/react-router'
import { Globe2, ListFilter } from 'lucide-react'
import type { PassportAccessSnapshot } from '#/domain/travel'
import { AccessStatus } from './AccessStatus'

const positions = [
  ['18%', '34%'],
  ['45%', '48%'],
  ['68%', '31%'],
  ['78%', '55%'],
  ['57%', '68%'],
  ['33%', '67%'],
  ['88%', '36%'],
  ['12%', '58%'],
  ['63%', '46%'],
  ['39%', '27%'],
] as const

export function AccessMapPreview({
  snapshot,
  limit = 6,
}: {
  snapshot: PassportAccessSnapshot
  limit?: number
}) {
  const visible = snapshot.destinations.slice(0, limit)

  return (
    <section className="map-explorer" aria-labelledby="map-title">
      <div className="map-toolbar">
        <div>
          <p className="eyebrow">Global access preview</p>
          <h2 id="map-title">The world through {snapshot.passport.name}</h2>
        </div>
        <span className="map-mode">
          <Globe2 aria-hidden="true" /> Map preview
        </span>
      </div>

      <div className="map-layout">
        <div
          className="map-canvas"
          role="img"
          aria-label={`Abstract world access preview for ${snapshot.passport.name}. Use the destination list for complete accessible information.`}
        >
          <div className="map-grid" aria-hidden="true" />
          <span className="continent continent-americas" aria-hidden="true" />
          <span className="continent continent-europe" aria-hidden="true" />
          <span className="continent continent-africa" aria-hidden="true" />
          <span className="continent continent-asia" aria-hidden="true" />
          <span className="continent continent-oceania" aria-hidden="true" />
          {visible.map((item, index) => (
            <Link
              key={item.country.code}
              to="/visa/$passportSlug/$destinationSlug"
              params={{
                passportSlug: snapshot.passport.slug,
                destinationSlug: item.country.slug,
              }}
              className={`map-pin status-${item.classification.category}`}
              style={{
                left: positions[index]?.[0],
                top: positions[index]?.[1],
              }}
              aria-label={`${item.country.name}: ${item.classification.label}`}
            >
              <span>{item.country.flag}</span>
            </Link>
          ))}
          <div className="map-caption">
            <strong>
              {snapshot.summary.visaFree + snapshot.summary.visaOnArrival}
            </strong>
            <span>low-friction destinations</span>
          </div>
        </div>

        <div className="destination-list" aria-label="Destination access list">
          <div className="list-heading">
            <ListFilter aria-hidden="true" />
            <span>Accessible list view</span>
          </div>
          {visible.map((item) => (
            <Link
              key={item.country.code}
              to="/visa/$passportSlug/$destinationSlug"
              params={{
                passportSlug: snapshot.passport.slug,
                destinationSlug: item.country.slug,
              }}
              className="destination-row"
            >
              <span className="destination-flag" aria-hidden="true">
                {item.country.flag}
              </span>
              <span className="destination-copy">
                <strong>{item.country.name}</strong>
                <small>
                  {item.country.region}
                  {item.stayDays ? ` · up to ${item.stayDays} days` : ''}
                </small>
              </span>
              <AccessStatus
                category={item.classification.category}
                label={item.classification.label}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
