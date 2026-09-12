# AGENTS.md

## 1. Project Identity

This project is a **Travel / Visa Intelligence platform**.

The working product concept is:

> **Explore the world through your passport.**

The product helps users understand where they can travel, what entry requirements apply to them, and how their passport changes their access to the world.

The central experience is not merely:

> Select passport → Select destination → See visa status.

Instead:

> **The user selects a passport and the world transforms around that passport.**

The application should make global mobility visual, explorable, understandable, and useful.

The product combines:

- passport mobility intelligence
- visa requirement intelligence
- destination exploration
- geographic exploration
- comparison
- filtering
- data visualization
- travel-entry information
- source/freshness transparency

This is intended to feel like a real consumer travel product, not a portfolio demo or generic API frontend.

---

# 2. Core Product Principle

Users should see meaningful content immediately.

Do not make the homepage depend entirely on the user completing a form before anything useful appears.

The product should support two major behavioral modes.

### Intent-driven

The user already knows what they want.

Examples:

- Can I travel from Nigeria to Japan?
- Do Nigerians need a visa for Kenya?
- How long can a Ghanaian stay in Singapore?
- Does my passport qualify for an eVisa?
- What documents do I need?

### Discovery-driven

The user does not yet know where they want to go.

Examples:

- Where can my passport take me?
- What countries can Nigerians visit visa-free?
- Where can I get visa on arrival?
- Which Asian countries offer eVisas to my passport?
- Which passport gives better global mobility?
- What destinations are easiest for me to visit?

Both modes are first-class product experiences.

---

# 3. Core Experience

The defining interaction is the **Global Access Map**.

A user selects a passport.

The world should immediately become classified according to the access available to that passport.

Possible normalized categories include:

- freedom of movement
- visa free
- electronic travel authorization / ETA
- visa on arrival
- eVisa
- conditional access
- visa required
- admission restricted / unavailable
- unknown / unavailable data

Exact terminology must be mapped from the data provider and should not be invented independently.

The map is not decorative.

It is a primary navigation and exploration interface.

A user should be able to select a country on the map and move naturally into its visa intelligence.

---

# 4. Primary User Journey

The conceptual relationship is:

**Passport → World → Destination → Entry Requirement → Conditions → Process → Related destinations**

A typical journey might be:

1. User lands on the homepage.
2. User chooses Nigeria as their passport.
3. The global map transforms according to Nigerian passport access.
4. Summary metrics appear:
   - visa-free destinations
   - visa-on-arrival destinations
   - eVisa destinations
   - ETA destinations
   - visa-required destinations
5. User filters to Asia.
6. User selects Japan.
7. The application opens the Nigeria → Japan visa intelligence page.
8. The user sees:
   - requirement
   - allowed stay where available
   - passport requirements
   - documents
   - application process
   - fees where available
   - transit information where available
   - health or insurance information where available
   - official/application links where available
   - source and freshness information where available
9. User can explore related destinations or compare access elsewhere.

Navigation should feel interconnected rather than page-isolated.

---

# 5. V1 Information Architecture

## 5.1 Homepage / Explore

The homepage must immediately communicate the product's purpose.

The primary call to action should revolve around selecting the user's passport.

However, the homepage must not consist only of a passport/destination form.

Possible content includes:

- passport selector
- global access preview
- passport mobility highlights
- featured destinations
- regional exploration
- visa-free discovery
- eVisa discovery
- visa-on-arrival discovery
- passport mobility rankings where supported
- comparison entry point
- destination discovery
- clear explanation of visa-access categories

The homepage should invite exploration.

---

# 5.2 Global Access Map

This is a flagship feature.

Given a selected passport, visualize destination access around the world.

The user should be able to:

- inspect countries
- filter by access type
- filter by region or continent
- search destinations
- see summary counts
- select a destination
- navigate to detailed visa information

The map must have a usable non-map equivalent.

Users who cannot interact comfortably with the map must still be able to explore the same information through accessible lists, filters, search, and/or tables.

Do not make critical functionality map-only.

---

# 5.3 Passport Explorer

Example route concept:

`/passports/nigeria`

A passport page may include:

- country/passport identity
- mobility score and rank where supported
- accessible-destination summary
- access-category breakdown
- global access map
- visa-free destinations
- visa-on-arrival destinations
- eVisa destinations
- ETA destinations
- visa-required destinations
- regional breakdown
- related passport comparisons
- discovery/filtering tools

This should be a rich public page and an important SEO surface.

---

# 5.4 Destination Explorer

Example route concept:

`/destinations/japan`

The destination is explored independently of a single passport.

Possible content includes:

- country identity
- region
- flag and appropriate imagery
- general destination metadata
- entry-access context
- passport lookup for that destination
- travel requirement discovery
- related destinations
- useful geographic/contextual information

A user should be able to choose their passport directly from a destination page and immediately see their entry requirement.

---

# 5.5 Visa Intelligence Detail

Example route concept:

`/visa/nigeria/japan`

This page represents a specific:

**passport → destination**

relationship.

It is one of the most important pages in the product.

Depending on data availability and plan access, information may include:

- visa requirement classification
- visa-free duration
- maximum stay
- description
- passport validity requirements
- documents required
- application process
- eVisa information
- ETA information
- visa-on-arrival information
- application links
- visa fees
- processing information
- embassy/consular information
- transit requirements
- entry-by-mode information
- vaccination information
- insurance requirements
- safety information
- overstay information
- extension rules
- conditions and exceptions
- source/provenance information
- last verified date

Never invent fields that are unavailable.

If an Orizn field is plan-gated, unavailable, null, or represented by an upgrade stub, the application must handle that gracefully.

Do not show fake placeholders that imply known information.

---

# 5.6 Passport Comparison

Users should be able to compare passports.

Examples:

- Nigeria vs Ghana
- Nigeria vs South Africa
- UK vs US

Possible comparison dimensions include:

- mobility score
- global rank
- visa-free access
- eVisa access
- visa-on-arrival access
- ETA access
- regional access
- overlapping destinations
- destinations available to one passport but not another

Comparison should prioritize useful differences rather than merely placing two long lists side by side.

---

# 5.7 Search and Discovery

Search should eventually understand entities such as:

- passports
- destinations
- countries
- regions

Filters should allow exploration such as:

- visa-free destinations
- eVisa destinations
- visa-on-arrival destinations
- ETA destinations
- continent
- region
- access category

Examples of product questions the interface should make easy to answer:

> Where can a Nigerian travel visa-free?

> Which Asian countries offer eVisa access to Nigerians?

> What countries in Africa offer visa on arrival to Ghanaian passport holders?

---

# 6. V1 Scope Boundaries

The following are NOT core V1 requirements unless explicitly approved later:

- flight booking
- flight search
- hotel booking
- accommodation marketplace
- itinerary generation
- weather
- currency conversion
- travel blogging
- travel social network
- AI travel assistant
- user-generated visa reports
- immigration/legal consultation
- permanent-residency guidance
- work-permit marketplace
- travel insurance marketplace
- trip booking
- real-time flight tracking

Do not allow adjacent travel features to dilute the passport and entry-intelligence product.

---

# 7. Primary Visa Data Provider

The primary V1 visa intelligence provider is:

**Orizn Visa API**

Official Orizn documentation is the source of truth for:

- endpoints
- authentication
- request parameters
- response structures
- plan restrictions
- quota behavior
- supported fields
- supported countries
- enum values
- rate limits
- bulk behavior
- caching permissions
- licensing
- changes/deprecations

Never invent an Orizn response shape.

Never rely on assumptions from memory when the official documentation can be consulted.

Orizn's API version may evolve.

Parse responses defensively and tolerate additive fields.

---

# 8. Orizn Integration Architecture

UI components must NEVER directly depend on Orizn.

Use an application-owned domain/data layer.

Conceptually:

Browser

→ TanStack Start route/server function

→ Travel Intelligence service

→ Provider interface

→ Orizn provider

The application should expose domain-oriented operations such as:

- `getVisaRequirement`
- `getPassportScore`
- `comparePassports`
- `getPassportAccess`
- `getDestinationVisaInfo`
- `getCoverageStats`

Exact implementation names may differ.

The objective is architectural separation.

If the provider changes in the future, the product UI should not need a rewrite.

---

# 9. API Key Security

The Orizn API key must never be exposed to untrusted browser code.

Authenticated provider calls must happen server-side.

Do not:

- place API keys in public environment variables
- send keys to browser bundles
- commit keys
- expose keys through HTML
- expose keys through client fetch calls
- print secrets in logs

Use server-side environment variables.

---

# 10. API Request Discipline

The current evaluation plan has a very small monthly request allowance.

Development must therefore be intentionally API-efficient.

Do not repeatedly call live Orizn endpoints while working on:

- layout
- typography
- styling
- responsive behavior
- animations
- component composition
- unrelated UI work

Use representative development fixtures/mocks that conform to documented or previously observed real response structures.

Live API calls should be used deliberately for:

- understanding real responses
- validating provider mappings
- integration testing
- verifying edge cases

Do not reconstruct or scrape the Orizn dataset.

Do not systematically enumerate passport/destination combinations.

Do not attempt to bypass plan restrictions or quotas.

Do not create architecture that violates Orizn's licensing or terms.

---

# 11. Development Data Strategy

The application should support at least two provider modes during development:

### Development fixture provider

Used for routine UI development and testing.

### Orizn provider

Used for deliberate integration testing and production/live data.

Both should map into the same internal domain model.

Fixtures must represent realistic states including:

- visa free
- visa required
- eVisa
- visa on arrival
- ETA
- conditional access
- unavailable information
- partial records
- plan-gated fields
- API errors
- quota errors

Do not assume every record is complete.

---

# 12. Database Strategy

Do not create a database merely to duplicate Orizn's dataset.

Orizn remains the visa-data provider for V1.

A database may be introduced later for application-owned data such as:

- users
- saved passports
- favourite destinations
- saved trips
- alerts
- recently viewed destinations
- personal preferences
- application analytics

Any database decision should be driven by actual product requirements.

Do not persist or bulk-cache Orizn data beyond what its licensing and documentation permit.

---

# 13. Caching

Caching should be evidence-driven.

Before implementing caching:

- inspect Orizn's current terms
- inspect endpoint cache headers
- inspect provider recommendations
- understand whether responses may legally be persisted
- understand freshness requirements

Use the simplest compliant caching strategy.

Do not introduce Redis or other infrastructure merely because it is common.

---

# 14. Technology Stack

The web application should use:

- TanStack Start
- React
- TypeScript
- TanStack Router
- TanStack Query where appropriate
- Tailwind CSS
- shadcn/ui as a component foundation

Do not use Next.js.

Do not replace the agreed stack without explicit approval.

Additional libraries should be selected only when justified.

---

# 15. SSR Strategy

SSR is a core requirement.

Public content-rich routes should render meaningful content on the server where practical.

Especially important:

- homepage
- passport pages
- destination pages
- visa-detail pages
- comparison/discovery pages where appropriate

SSR should improve:

- first meaningful render
- SEO
- link previews
- perceived performance
- crawlability

SSR does NOT mean calling Orizn unnecessarily on every request.

Rendering strategy, caching, and API-fetching strategy are separate concerns.

---

# 16. SEO

This product has substantial programmatic SEO potential.

Potential route families include:

`/passports/nigeria`

`/destinations/japan`

`/visa/nigeria/japan`

Potential discovery routes may later include structures such as:

`/explore/nigeria/visa-free`

`/explore/nigeria/asia/evisa`

Route design should be human-readable where practical.

Public pages should support:

- unique titles
- unique descriptions
- canonical URLs
- social metadata
- appropriate structured data where relevant
- indexable meaningful content

Do not create thousands of thin pages merely for SEO.

A route should provide genuine user value.

---

# 17. Trust and Information Integrity

Visa information is consequential and changes over time.

The interface must communicate this responsibly.

Where available, expose:

- last verified date
- official source
- application/authority link
- data freshness

The product should encourage users to verify requirements with the relevant immigration authority before making consequential travel decisions.

Do not make legal guarantees.

Do not transform uncertain data into confident claims.

Do not fabricate missing requirements.

---

# 18. Visa Requirement Normalization

Provider-specific statuses should map into an internal normalized model.

The internal taxonomy should be capable of representing concepts such as:

- freedom of movement
- visa free
- ETA
- visa on arrival
- eVisa
- conditional access
- visa required
- no admission
- unknown

Do not flatten meaningful distinctions merely to simplify UI code.

Conditions and exceptions must remain representable.

---

# 19. Design Philosophy

The desired visual direction is:

> **Premium cartography + travel editorial + sophisticated data visualization + modern consumer product design.**

The application must NOT feel like:

- a generic SaaS dashboard
- an admin panel
- an airline booking site
- a government immigration portal
- a travel agency template
- a generic Tailwind template
- an unmodified shadcn application
- a clone of another visa website

The product should feel exploratory, global, intelligent, polished, and trustworthy.

---

# 20. Global Map Design

The world map is a product surface, not background decoration.

It should help communicate:

- geography
- access categories
- regional differences
- destination selection
- mobility

Do not select a mapping library prematurely.

Evaluate options based on:

- React compatibility
- SSR implications
- bundle size
- accessibility
- interaction quality
- geographic data requirements
- customization
- licensing
- performance

Major map-library selection should be discussed before implementation.

---

# 21. Visual Identity

Exact branding, colors, typeface, illustration style, map treatment, and motion language are not yet locked.

They must be developed after design-reference analysis.

Do not default to:

- generic travel blue
- airplane icons everywhere
- gradient-heavy SaaS design
- predictable travel stock imagery

Travel imagery may be used where it genuinely improves destination discovery.

Data and geography should remain central to the visual identity.

---

# 22. Data Presentation

Use the appropriate visualization for the information.

Possible forms include:

- maps
- lists
- tables
- comparison matrices
- summary metrics
- badges
- charts
- timelines
- region breakdowns
- editorial destination modules

Do not turn every piece of information into a card.

Information hierarchy should determine component choice.

---

# 23. Responsive Design

The complete core product must work across:

- mobile
- tablet
- laptop
- desktop

Mobile must be designed intentionally.

Do not merely compress the desktop UI.

The Global Access Map, filters, comparison surfaces, visa details, and navigation all need deliberate mobile behaviors.

- light & dark mode: light mode features white and sky blue while dark mode features dark(not too black) and beige
-font: features sans-serif and dancing script

---

# 24. Accessibility

Accessibility is required.

Pay attention to:

- semantic HTML
- keyboard navigation
- visible focus states
- color contrast
- accessible forms
- screen-reader labeling
- map alternatives
- table semantics
- motion preferences
- non-color indicators for visa status

Visa categories must never be communicated by color alone.

---

# 25. Loading, Empty and Error States

Every data-driven surface must consider:

- loading
- partial data
- no data
- malformed/unexpected data
- provider outage
- API timeout
- quota exhaustion
- plan-gated fields
- invalid passport
- invalid destination
- unsupported combination

Error states should remain useful.

Do not expose raw provider errors directly to users.

---

# 26. Performance

The application should feel fast even though its core product is data-heavy.

Prioritize:

- appropriate SSR
- route-level loading
- request deduplication
- minimal unnecessary client JavaScript
- image optimization
- sensible map loading
- avoiding duplicate API requests
- progressive enhancement where useful

Do not optimize prematurely with unnecessary infrastructure.

Measure first.

---

# 27. Testing Expectations

Important business/data logic should be testable independently from the UI.

At minimum, test:

- provider → domain mapping
- normalized visa statuses
- partial data
- plan-gated fields
- unknown enum values
- malformed provider responses
- quota failures
- network errors
- invalid passport/destination input
- comparison logic
- URL/route parameter handling

Use live Orizn calls sparingly in tests.

Normal test suites should not consume live quota.

---

# 28. Design Reference Workflow

Reference products and screenshots are inspiration, not specifications.

Analyze them for:

- composition
- hierarchy
- typography
- map treatment
- geographic navigation
- information density
- cards
- lists
- comparison patterns
- search
- filtering
- motion
- responsive behavior
- imagery
- whitespace
- data visualization

Do not copy individual products.

The objective is to synthesize principles into an original visual language.

---

# 29. Development Workflow

Work collaboratively and feature-by-feature.

For every major feature:

1. Understand the product requirement.
2. Inspect relevant documentation.
3. Inspect actual provider response structures when necessary.
4. Identify ambiguity.
5. Ask targeted questions when the answer materially changes the product.
6. Propose the approach.
7. Get approval for major architectural/design decisions.
8. Implement.
9. Test.
10. Review API efficiency.
11. Review TypeScript correctness.
12. Review responsive behavior.
13. Review accessibility.
14. Review visual consistency.
15. Fix issues.
16. Continue to the next feature.

Do not autonomously build the entire application in one uncontrolled pass.

---

# 30. Questions Before Assumptions

When a major product decision is ambiguous, ask.

Examples:

- map provider/library
- caching policy
- persistent storage
- authentication
- analytics
- major new dependency
- alternate data provider
- route architecture
- monetization
- major design direction

Do not ask questions about trivial implementation details that can be resolved safely from established conventions.

---

# 31. Scope Discipline

Do not introduce:

- unnecessary backend services
- unnecessary databases
- WebSockets
- realtime infrastructure
- Redis
- queues
- workers
- authentication
- payment infrastructure
- AI features

unless an approved requirement justifies them.

Architecture should remain as simple as possible while supporting product quality.

---

# 32. Provider Independence

Although Orizn is the V1 provider, the product should not become permanently coupled to Orizn.

Provider-specific types belong inside the provider integration layer.

Application components should consume product-domain types.

The architecture should make future options possible:

- higher Orizn plan
- alternate provider
- hybrid providers
- internal travel datasets
- application-owned enrichment data

without rebuilding the entire UI.

---

# 33. Future Possibilities

These are NOT automatically V1 scope, but the architecture should avoid unnecessarily blocking them:

- saved destinations
- saved passport
- user accounts
- travel alerts
- visa-policy change alerts
- recent visa changes
- mobility history
- passport mobility trends
- personalized travel discovery
- favourite destinations
- multi-passport profiles
- residency-based exceptions
- travel itinerary intelligence
- mobile application
- commercial subscription features

Do not implement them until requested.

---

# 34. Product Quality Standard

This is intended to become a **production-quality public product**, not merely a demonstration repository.

Prioritize:

- trust
- clarity
- visual quality
- excellent information architecture
- responsiveness
- accessibility
- API efficiency
- maintainability
- thoughtful interaction design

Feature count is less important than execution quality.

The target is:

> **A product someone would genuinely choose to use when deciding where their passport can take them.**