import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { passportCountries } from '#/data/countries'

const savedPassportKey = 'travel-intelligence:passport'

export function PassportSelector({
  compact = false,
  destinationSlug,
}: {
  compact?: boolean
  destinationSlug?: string
}) {
  const navigate = useNavigate()
  const inputId = useId()
  const [passportSlug, setPassportSlug] = useState('')

  const canUsePassport = (slug: string) => {
    const country = passportCountries.find((item) => item.slug === slug)
    return Boolean(
      country && (destinationSlug || country.fixturePassportCoverage),
    )
  }

  useEffect(() => {
    const savedPassport = window.localStorage.getItem(savedPassportKey)
    if (savedPassport && canUsePassport(savedPassport)) {
      setPassportSlug(savedPassport)
    }
  }, [destinationSlug])

  return (
    <form
      className={compact ? 'passport-picker compact' : 'passport-picker'}
      onSubmit={(event) => {
        event.preventDefault()
        if (!passportSlug) return
        window.localStorage.setItem(savedPassportKey, passportSlug)
        if (destinationSlug) {
          void navigate({
            to: '/visa/$passportSlug/$destinationSlug',
            params: { passportSlug, destinationSlug },
          })
          return
        }
        void navigate({
          to: '/explore/$passportSlug',
          params: { passportSlug },
        })
      }}
    >
      <label htmlFor={inputId}>
        Passport
        <span>
          {destinationSlug
            ? 'Choose any passport; unavailable coverage is shown honestly'
            : 'Preview access is currently available for six passports'}
        </span>
      </label>
      <div className="passport-control">
        <select
          id={inputId}
          value={passportSlug}
          required
          onChange={(event) => setPassportSlug(event.target.value)}
        >
          <option value="">Choose your passport</option>
          {passportCountries.map((country) => {
            const unavailable =
              !destinationSlug && !country.fixturePassportCoverage
            return (
              <option
                key={country.code}
                value={country.slug}
                disabled={unavailable}
              >
                {country.flag} {country.name}
                {unavailable ? ' — preview pending' : ''}
              </option>
            )
          })}
        </select>
        <button type="submit" disabled={!passportSlug}>
          {destinationSlug ? 'Check requirement' : 'Explore access'}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
