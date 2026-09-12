import { describe, expect, it } from 'vitest'
import { fixtureVisa } from './fixtures'

describe('fixture visa intelligence', () => {
  it('does not invent requirements for an uncovered country pair', () => {
    const result = fixtureVisa('canada', 'australia')

    expect(result.classification.category).toBe('unknown')
    expect(result.stayDays).toBeNull()
    expect(result.documents.status).toBe('unavailable')
    expect(result.process.status).toBe('unavailable')
    expect(result.provenance.verified).toBe(false)
    expect(result.provenance.source).toBe('development fixture')
  })
})
