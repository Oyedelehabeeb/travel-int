# Travel Intelligence

Explore the world through your passport. This TanStack Start application turns visa-provider responses into an accessible, source-aware travel discovery experience.

## Development

```bash
npm install
npm run dev
```

The application uses the fixture provider by default. Copy `.env.example` to `.env` only when local overrides are needed.

```env
TRAVEL_DATA_PROVIDER=fixture
```

Live Orizn requests are server-only:

```env
TRAVEL_DATA_PROVIDER=orizn
ORIZN_API_KEY=your-server-only-key
```

Never prefix `ORIZN_API_KEY` with `VITE_`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Normal development and tests use realistic fixtures and do not consume Orizn quota.

## Data boundaries

- The country and territory directory comes from a bundled ISO catalogue. It is not a claim of Orizn coverage.
- Fixture mode contains illustrative visa data for six passports and ten destinations. The interface labels that data as a preview rather than current travel advice.
- Live Orizn mode powers individual passport-to-destination lookups, public mobility scores, coverage, and passport comparisons through application-owned domain contracts.
- Orizn's Free plan exposes score-category totals but not the country-by-country bulk dataset. The application labels the global map and destination list as plan-gated instead of substituting fixture data.
- Provider upgrade stubs are mapped to explicit plan-gated field states and are never presented as known travel requirements.
- The application does not infer or assume a visitor's location. A passport is remembered locally only after the visitor explicitly selects and submits it.
