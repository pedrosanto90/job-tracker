# AGENTS PLAYBOOK (job-tracker)
Project-specific guidance for agentic contributors. Keep it terse, actionable, and aligned with existing patterns.

## Quick Facts
- Stack: Angular 21 (standalone components), TypeScript strict, SCSS.
- UI: Angular Material (toolbar, button, icon). Shared button component at `src/app/components/button`.
- State: Signals allowed (see `App`), services via Angular DI.
- Data: Supabase JS client via `Supabase` service (`src/app/services/supabase/supabase.ts`); another thin client lives in `src/app/core/supabase/supabase.client.ts` (avoid duplicating clients per feature).
- Routing: Standalone routes in `src/app/app.routes.ts`.
- Environments: `src/environments/environment.ts` (committed; contains anon key—do NOT add new secrets elsewhere).
- No Cursor rules (`.cursor/`, `.cursorrules`) or Copilot rules found.
- Formatter: Prettier config in `package.json` (printWidth 100, singleQuote true, Angular parser for HTML). No ESLint config; rely on TS strict + Prettier.

## Setup
- Node 20+ recommended (npm 10.x). Install: `npm install`.
- Angular CLI via `npx ng ...` (scripts wrap it).
- Build outputs: `dist/`; TS emit for tests/app: `out-tsc/`.

## Core Commands
- Dev server: `npm start` (alias `ng serve`) → http://localhost:4200/
- Prod build: `npm run build` (uses production config/budgets).
- Dev build watch: `npm run watch`.
- Tests (watch): `npm test` or `ng test` (Vitest + jsdom via Angular CLI builder).
- Single test by file (fast path): `npx vitest run src/app/components/home/home.spec.ts`
- Single test by name: `ng test -- --testNamePattern="should create the app"` or `npx vitest run src/app/components/home/home.spec.ts -t "should create the app"`
- Coverage: `npx vitest run --coverage`
- Format check: `npx prettier --check "src/**/*.{ts,html,scss}"`
- Format write: `npx prettier --write "src/**/*.{ts,html,scss}"`

## App Shell & Layout
- App shell files: `src/app/app.ts`, `app.html`, `app.scss`.
- Layout uses flex column: `:host { min-height: 100vh; display: flex; flex-direction: column; }` with `<main class="app-main">` flex: `1 0 auto`.
- Footer appears only on routes `'' | '/' | '/login' | '/create-account'` via `showFooter` signal hooked to Router NavigationEnd (see `app.ts`). Keep this contract when adding routes: default is hidden unless whitelisted.
- Sticky footer behavior: footer sits at bottom on short pages, flows after content on long pages. Do not reintroduce `height: 100vh` on pages; prefer `min-height: 100%` or padding.

## Routing
- Routes: `src/app/app.routes.ts`. Default: `'' -> Home`; auth: `/login`, `/create-account`.
- When adding routes, remember footer visibility rule. If a new route must show footer, add it to `shouldShowFooter` in `app.ts`.

## Styling (SCSS)
- Global theme in `src/styles.scss` (Angular Material theming, Roboto). Body/html set to height 100%, background from Material system vars.
- Header styles: `src/app/components/header/header.scss` (blue `#004777`, sticky top, max-width 1200px).
- Footer styles: `src/app/components/footer/footer.scss` mirrors header colors; responsive stack at <=640px.
- Component styles co-located via `styleUrl`. Maintain nesting; avoid deep selectors. Keep within 100 cols when possible.
- `create-account.scss`: uses centered card, `min-height: 100%` (not 100vh). Preserve this to avoid fighting the sticky footer.

## TypeScript/Angular Conventions
- Strict TS enforced. Provide explicit return types for public methods/services. Use `readonly` for injected deps/consts.
- Standalone components: declare `imports` in `@Component` metadata (no NgModules). Selector prefix `app-`; filenames kebab-case.
- Prefer `inject()` for DI where idiomatic; keep DI side-effect free.
- Template-facing members should be `protected` (current pattern) to limit API.
- Use signals for simple local state; keep shared state in services.

## Imports Ordering
1) Angular/Angular Material
2) Third-party libs
3) Project-relative modules (short relative paths). Remove unused imports when touching a file.

## Forms & Validation
- Reactive Forms default. Use `NonNullableFormBuilder`. Validators declared inline; cross-field validators extracted when reused (see `passwordsMatch`).
- Use `updateOn: 'blur'` when deferring validation (done in Create Account).
- Guard on `form.invalid` early; use `form.getRawValue()` to read values.
- Surface errors in UI; console logs are acceptable only as stopgaps.

## Supabase & Data
- Client wrapper: `src/app/services/supabase/supabase.ts` exposes `.client` (Supabase JS v2). Avoid multiple client instances per feature.
- Auth service: `src/app/services/auth/auth.ts` `signUp` sends `options.data.username` to Supabase; returns `AuthResponse`. Handle `{ data, error }` in callers.
- Profile creation is now DB-driven: trigger `handle_new_user` (see `src/db/user_profiles_trigger.sql`) creates `public.user_profiles` row after Auth signup, requires non-empty `username`, and enforces `unique(user_id)`. Signup fails if username missing/blank.
- Old `User.addUser` service exists but is not used in signup; if reusing, always check `{ data, error }` and align with RLS.
- RLS policies in `src/db/rls_policies.sql`; general schema in `src/db/query.sql`.
- Never add Supabase secrets beyond `environment.ts` (anon key only). No service-role key in frontend.

## Error Handling
- Pattern: early returns on invalid form or missing IDs. Log with context: `console.error('Auth signUp error', error)`.
- When adding flows, prefer typed results: `{ ok: boolean; error?: string; data?: T }`.
- Wrap side-effectful async ops in try/catch (navigation, storage). Do not swallow errors; propagate or show UI message.

## Naming
- PascalCase for components/services (`CreateAccount`, `Supabase`).
- Kebab-case filenames and selectors (`create-account`).
- Functions verb-first (`onSubmitCreateAccount`, `addUser`).
- Types/interfaces: nouns, PascalCase (`NewUser`, `User`). Narrow unions where relevant (e.g., button types).

## Formatting
- Prettier: printWidth 100, singleQuote true. Run formatter before commit suggestions.
- Keep object/array literals multi-line if it aids readability; avoid gratuitous reflow of long strings/URLs.
- Prefer `private readonly` for injected services/consts; keep member order: injected deps, signals/state, form/group definitions, lifecycle, methods.

## Testing
- Framework: Vitest (via Angular CLI builder). Specs live adjacent with `.spec.ts`.
- TestBed setup for standalone components: `TestBed.configureTestingModule({ imports: [Component] }).compileComponents();` then `fixture.whenStable()` before DOM asserts.
- Focused test commands:
  - By file: `npx vitest run path/to/spec.ts`
  - By name: `npx vitest run path/to/spec.ts -t "name"` or `ng test -- --testNamePattern="name"`
- Avoid networked Supabase calls in tests; mock client responses.

## Accessibility
- Use semantic labels/headings. Buttons must have `type` set. Add `aria-label` to icon-only buttons.
- Form errors should be descriptive; keep label+input associations intact.

## Performance
- Default CD is `Default`; switch to `OnPush` only if you manage immutable inputs/observables/signals.
- Use signals/computed for derived values instead of recomputing in templates. Avoid unnecessary async pipes when data already available.

## Repo Hygiene
- Respect existing user changes; do not revert environment keys. No destructive git commands.
- Keep new files ASCII unless required. Match existing SCSS/TS/HTML style.
- No lint config—use Prettier and TS errors as your guardrails.

## File Map (common targets)
- App shell: `src/app/app.ts`, `app.html`, `app.scss`.
- Routing: `src/app/app.routes.ts`; config: `src/app/app.config.ts`.
- Components: `src/app/components/*` (header, footer, home, login, create-account, button).
- Services: `src/app/services/*` (auth, users, supabase). Core supabase client: `src/app/core/supabase/*`.
- Interfaces: `src/app/interfaces/user/*`.
- Styles: `src/styles.scss` (global), component SCSS co-located.
- DB SQL: `src/db/query.sql`, `src/db/rls_policies.sql`, `src/db/user_profiles_trigger.sql` (trigger ensures profile on signup).
- Environments: `src/environments/environment.ts` (anon key). Do not add service-role keys.

## Build/Test Debugging Tips
- If `ng test` hangs, run `npx vitest --runInBand` to surface errors.
- For coverage in CI-like runs, prefer `npx vitest run --coverage`.
- For build size/budgets, check `angular.json` (initial bundle warn 500kB / error 1MB; component style 4kB/8kB).
- Dev build with source maps: `ng build --configuration development`.

## When Extending
- Add new routes carefully: update `shouldShowFooter` if footer should appear there.
- Keep Supabase interactions centralized; reuse the existing client and handle `{ data, error }` explicitly.
- For new forms, follow create-account patterns: `NonNullableFormBuilder`, validators, `updateOn: 'blur'`, early invalid return.
- For new shared UI, make standalone components under `src/app/components/<name>/` with matching HTML/SCSS/TS.

## Final Reminders
- Follow the command set above for build/test/format. Prefer direct Vitest for focused runs.
- Mirror existing patterns from `CreateAccount`, header/footer, and Supabase services.
- Keep code small, typed, and consistent with Prettier + TS strict.
- Never commit secrets; environment already contains anon key only.

## UI/Design Notes
- Header/Footer share the same blue brand color (`#004777`) and 1200px max-width container. Keep consistency if restyling.
- Avoid bland defaults; if adding new UI, define purposeful spacing/typography (Roboto base from Material vars).
- Background defaults to Material surface; avoid forcing full-height sections that break sticky footer.

## Known Gotchas
- `create-account` page must not set `height: 100vh`; use `min-height` to avoid fighting the shell layout.
- Footer visibility is opt-in by route whitelist; new routes will hide footer unless added to `shouldShowFooter`.
- No ESLint: breaking TS strict will surface during build/test instead—fix type errors before commits.
- Supabase trigger enforces username; signup fails if metadata `username` is empty/blank.

## Supabase SQL Usage
- SQL migrations/snippets live under `src/db/`. Apply manually via Supabase SQL editor or migration tool; they are not auto-run.
- Trigger file `user_profiles_trigger.sql` enables RLS, uniqueness, `NOT NULL`, and creates `user_profiles` after auth signup.
- RLS policies currently include select for `user_profiles` only; expand with insert/update/delete policies if needed.
