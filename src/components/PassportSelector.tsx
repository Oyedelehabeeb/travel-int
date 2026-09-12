import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { passportCountries } from '#/data/countries'

export function PassportSelector({
  compact = false,
  destinationSlug,
}: {
  compact?: boolean
  destinationSlug?: string
}) {
  const navigate = useNavigate()
  const [passportSlug, setPassportSlug] = useState('nigeria')

  return (
    <form
      className={compact ? 'passport-picker compact' : 'passport-picker'}
      onSubmit={(event) => {
        event.preventDefault()
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
      <label htmlFor={compact ? 'passport-compact' : 'passport'}>
        Passport
        <span>Choose the passport you travel with</span>
      </label>
      <div className="passport-control">
        <select
          id={compact ? 'passport-compact' : 'passport'}
          value={passportSlug}
          onChange={(event) => setPassportSlug(event.target.value)}
        >
          {passportCountries.map((country) => (
            <option key={country.code} value={country.slug}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
        <button type="submit">
          {destinationSlug ? 'Check requirement' : 'Explore access'}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
