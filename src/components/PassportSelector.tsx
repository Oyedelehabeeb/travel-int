import { useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { fixturePassportCountries } from '#/data/countries'

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

  useEffect(() => {
    const savedPassport = window.localStorage.getItem(savedPassportKey)
    if (
      savedPassport &&
      fixturePassportCountries.some((country) => country.slug === savedPassport)
    ) {
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
            ? 'Choose a passport available in this preview'
            : 'Six passport previews available'}
        </span>
      </label>
      <div className="passport-control">
        <Select value={passportSlug} onValueChange={setPassportSlug}>
          <SelectTrigger id={inputId} className="passport-select-trigger">
            <SelectValue placeholder="Choose your passport" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            align="start"
            className="travel-select-content"
          >
            {fixturePassportCountries.map((country) => (
              <SelectItem key={country.code} value={country.slug}>
                {country.flag} {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="submit"
          className="passport-submit"
          disabled={!passportSlug}
        >
          {destinationSlug ? 'Check requirement' : 'Explore access'}
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
