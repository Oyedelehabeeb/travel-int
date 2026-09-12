import { afterEach, describe, expect, it } from 'vitest'
import { buildSeo } from './seo'

const originalServerUrl = process.env.SERVER_URL

afterEach(() => {
  if (originalServerUrl === undefined) delete process.env.SERVER_URL
  else process.env.SERVER_URL = originalServerUrl
})

describe('buildSeo', () => {
  it('builds canonical and social metadata from the configured server URL', () => {
    process.env.SERVER_URL = 'https://travel.example.com/'
    const result = buildSeo({
      title: 'Japan entry requirements',
      description: 'Check entry requirements for Japan.',
      path: '/destinations/japan',
    })

    expect(result.links).toEqual([
      {
        rel: 'canonical',
        href: 'https://travel.example.com/destinations/japan',
      },
    ])
    expect(result.meta).toContainEqual({
      property: 'og:title',
      content: 'Japan entry requirements — Travel Intelligence',
    })
    expect(result.meta).toContainEqual({
      property: 'og:url',
      content: 'https://travel.example.com/destinations/japan',
    })
  })

  it('does not duplicate the product name and can prevent indexing', () => {
    const result = buildSeo({
      title: 'Travel Intelligence — Explore the world through your passport',
      description: 'Passport-led travel intelligence.',
      path: '/',
      noIndex: true,
    })

    expect(result.meta).toContainEqual({
      title: 'Travel Intelligence — Explore the world through your passport',
    })
    expect(result.meta).toContainEqual({
      name: 'robots',
      content: 'noindex, nofollow',
    })
  })
})
