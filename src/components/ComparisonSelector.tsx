import { useNavigate } from '@tanstack/react-router'
import { ArrowRightLeft } from 'lucide-react'
import { useState } from 'react'
import { fixturePassportCountries } from '#/data/countries'

export function ComparisonSelector() {
  const navigate = useNavigate()
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
      <label>
        First passport
        <select
          required
          value={firstPassportSlug}
          onChange={(event) => setFirstPassportSlug(event.target.value)}
        >
          <option value="">Choose a passport</option>
          {fixturePassportCountries.map((country) => (
            <option key={country.code} value={country.slug}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </label>
      <ArrowRightLeft aria-hidden="true" />
      <label>
        Second passport
        <select
          required
          value={secondPassportSlug}
          onChange={(event) => setSecondPassportSlug(event.target.value)}
        >
          <option value="">Choose a passport</option>
          {fixturePassportCountries.map((country) => (
            <option key={country.code} value={country.slug}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={!canCompare}>
        Compare access
      </button>
      {firstPassportSlug && firstPassportSlug === secondPassportSlug ? (
        <p role="alert">Choose two different passports.</p>
      ) : null}
    </form>
  )
}
