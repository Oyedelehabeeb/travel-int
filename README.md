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
