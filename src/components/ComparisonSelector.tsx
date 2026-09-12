import { useNavigate } from '@tanstack/react-router'
import { ArrowRightLeft } from 'lucide-react'
import { useId, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { fixturePassportCountries } from '#/data/countries'

export function ComparisonSelector() {
  const navigate = useNavigate()
  const firstId = useId()
  const secondId = useId()
  const [firstPassportSlug, setFirstPassportSlug] = useState('')
  const [secondPassportSlug, setSecondPassportSlug] = useState('')
  const canCompare =
    Boolean(firstPassportSlug && secondPassportSlug) &&
    firstPassportSlug !== secondPassportSlug

  return (
    <form
      className="comparison-selector"
      onSubmit={(event) => {
        event.preventDefault()
        if (!canCompare) return
        window.localStorage.setItem(
          'travel-intelligence:passport',
          firstPassportSlug,
        )
        void navigate({
          to: '/compare/$firstPassportSlug/$secondPassportSlug',
          params: { firstPassportSlug, secondPassportSlug },
        })
      }}
    >
      <div className="comparison-field">
        <label htmlFor={firstId}>First passport</label>
        <Select value={firstPassportSlug} onValueChange={setFirstPassportSlug}>
          <SelectTrigger id={firstId} className="comparison-select-trigger">
            <SelectValue placeholder="Choose a passport" />
          </SelectTrigger>
          <SelectContent position="popper" className="travel-select-content">
            {fixturePassportCountries.map((country) => (
              <SelectItem key={country.code} value={country.slug}>
                {country.flag} {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ArrowRightLeft aria-hidden="true" />
      <div className="comparison-field">
        <label htmlFor={secondId}>Second passport</label>
        <Select
          value={secondPassportSlug}
          onValueChange={setSecondPassportSlug}
        >
          <SelectTrigger id={secondId} className="comparison-select-trigger">
            <SelectValue placeholder="Choose a passport" />
          </SelectTrigger>
          <SelectContent position="popper" className="travel-select-content">
            {fixturePassportCountries.map((country) => (
              <SelectItem key={country.code} value={country.slug}>
                {country.flag} {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <button
        type="submit"
        className="comparison-submit"
        disabled={!canCompare}
      >
        Compare access
      </button>
      {firstPassportSlug && firstPassportSlug === secondPassportSlug ? (
        <p role="alert">Choose two different passports.</p>
      ) : null}
    </form>
  )
}
