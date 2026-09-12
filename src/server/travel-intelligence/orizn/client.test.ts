import { afterEach, describe, expect, it, vi } from 'vitest'
import { OriznClient } from './client'

describe('OriznClient errors', () => {
  afterEach(() => vi.unstubAllGlobals())

  it.each([
    [401, 'provider_unavailable'],
    [403, 'plan_restricted'],
    [404, 'unsupported_pair'],
    [429, 'quota_exhausted'],
    [500, 'unknown_provider_error'],
  ] as const)('maps HTTP %s to %s', async (status, code) => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status })),
    )
    await expect(
      new OriznClient('test-key').getVisa('NGA', 'JPN'),
    ).rejects.toMatchObject({ code })
  })

  it('rejects malformed successful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ unexpected: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      ),
    )
    await expect(
      new OriznClient('test-key').getVisa('NGA', 'JPN'),
    ).rejects.toMatchObject({ code: 'malformed_response' })
  })

  it('maps timeouts without exposing implementation details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new DOMException('timed out', 'TimeoutError')),
    )
    await expect(
      new OriznClient('test-key').getVisa('NGA', 'JPN'),
    ).rejects.toMatchObject({ code: 'provider_timeout' })
  })

  it('maps other network failures to provider unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    await expect(
      new OriznClient('test-key').getVisa('NGA', 'JPN'),
    ).rejects.toMatchObject({ code: 'provider_unavailable' })
  })
})
