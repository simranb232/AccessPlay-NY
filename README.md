# AccessPlay NY

**Accessibility is more than an entrance.** An initiative of Speak Up Swing High — **PLAY HAS NO LIMITS.**

A responsive, accessible playground discovery and community documentation application for New York State. Records intentionally distinguish confirmed feature observations from unknown information; the app makes no legal ADA-compliance or individual-suitability guarantees.

## Run locally

- Install Node.js 20+.
- `npm install`
- `cp .env.example .env` (Supabase settings are optional for UI development; without them the directory is empty and community submissions are stored in that browser only.)
- `npm run dev`
- `npm run build`

No invented playground or equipment records are bundled. Connect an official data source to populate live public records.

## Free deployment

Deploy the static Vite build to GitHub Pages, Cloudflare Pages, or Netlify on their free plans. Build command: `npm run build`; output directory: `dist`. For Cloudflare Pages, set the three `VITE_*` variables described below in build environment settings. Vite's hash navigation works on static hosting without rewrite rules. OpenStreetMap tile use is subject to the tile service usage policy; production deployments at scale should select a provider and plan consistent with its terms.

## Supabase free-tier backend

1. Create a Supabase project on its free tier.
2. Run `supabase/schema.sql` in the SQL editor. This creates relational tables, the feature catalog, indexes, RLS policies and role checks. It seeds feature definitions only; no fabricated playground data is included.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as frontend build variables. Set `VITE_ADMIN_EMAILS` only if you later use it for display; authorization is enforced by `user_roles` and RLS, not this client-side variable.
4. Create an administrator through Supabase Auth, then have the first project owner insert their user UUID and role into `public.user_roles` from the trusted SQL editor. Do not enable public sign-up or put a service-role key in the browser.
5. Community submissions are private pending rows. Anonymous visitors may insert, but cannot select them or alter reviewed records. Add moderator/admin roles in the backend.

Supabase free-plan quotas and availability are subject to Supabase's current terms. LocalStorage mode is a development fallback, not shared or durable public hosting storage.

## Official NYC import

The app's admin page can preview and import the official NYC Parks Dedicated Children's Areas dataset. It uses the public Socrata endpoint with pagination and duplicate-safe upserts. For larger/repeatable operations, use `scripts/import-nyc.mjs` from a trusted local shell with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The service-role key is privileged: never commit it, put it in `VITE_*`, or expose it to browsers. The importer logs observed schema fields, validates NY coordinates, attributes the source, records import outcomes, and leaves equipment observations unknown. Review the current source schema and its terms before use. Source: https://data.cityofnewyork.us/Recreation/Playgrounds-with-Dedicated-Children-s-Areas-DCAs-/j55h-3upk

The directory also links / prepares for NYC Parks Properties, NYC's playground directory, New York State GIS Clearinghouse, Nassau/Suffolk county parks, and Central Park Conservancy. Additional sources must be inspected and attributed before importing; the app does not scrape restricted sites.

## Application areas

- Home with database-derived live counts and an honest empty state.
- Search and detailed multi-select feature filters; unknown observations never satisfy filters.
- Leaflet/OpenStreetMap map, list, map bounds, coordinates, profile popups and verification-status markers. Green indicates independently verified records; gray indicates other records. There is deliberately no orange/red general rating because overall status cannot responsibly be assigned from incomplete feature data.
- Playground profile panels, feature statuses, quantities, sources, barriers, and verification details.
- Public dashboard with present / absent / unknown counts, denominators, coverage and CSV export.
- Moderated playground, barrier, contact, and volunteer survey forms; personal information is not shown publicly. Children’s diagnoses are not requested. This initial client does not accept image uploads.
- Admin sign-in, submission moderation and NYC source import, gated by Supabase roles and RLS.
- Methodology, about, and contact pages; responsive layouts, keyboard skip link, focus styles, labels, reduced-motion support.

## Scope and implementation notes

A national map of the 62 NY counties and NYC borough locations is represented through the map and county/borough filters. Geographic coverage statistics count only counties with actual records, never imply complete statewide coverage. County-level map boundaries are not bundled because no boundary dataset has been imported. Profiles remain distinct per playground, even where one park contains multiple play areas.

The first release does not claim implementation of every requested advanced operation: photo upload and EXIF stripping, CSV/GeoJSON admin imports, volunteer assignments, printable reports, moderator management UI, full audit triggers, and broad non-NYC government-data ingestion need follow-up engineering. Schema tables support audit/import/history and photos; RLS is the security boundary. Do not treat demo/localStorage use as an operational moderation system. Public detail fields and forms should be enhanced with verified agency sources and structured feature records before claiming statewide completeness.

## Test

`npm run build` validates the production bundle. Manually configure Supabase to verify anonymous reads, pending submission insertion, moderator queue visibility/update, admin-only writes, feature queries, and duplicate-safe official imports. In local fallback, test responsive navigation, filters, empty states, submit/report flows, and client-side CSV. Never test with fabricated public records.
