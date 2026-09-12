const PRODUCT_NAME = 'Travel Intelligence'
const DEFAULT_ORIGIN = 'http://localhost:3000'

export interface SeoInput {
  title: string
  description: string
  path: string
  noIndex?: boolean
}

function getSiteOrigin() {
  const configuredOrigin =
    typeof window === 'undefined'
      ? process.env.SERVER_URL
      : window.location.origin

  return (configuredOrigin || DEFAULT_ORIGIN).replace(/\/$/, '')
}

export function buildSeo({ title, description, path, noIndex }: SeoInput) {
  const fullTitle = title.includes(PRODUCT_NAME)
    ? title
    : `${title} — ${PRODUCT_NAME}`
  const canonicalUrl = `${getSiteOrigin()}${path === '/' ? '' : path}`

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: PRODUCT_NAME },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonicalUrl },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      ...(noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    ],
    links: [{ rel: 'canonical', href: canonicalUrl }],
  }
}
