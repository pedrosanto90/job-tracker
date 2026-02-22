# AGENTS PLAYBOOK
Project-specific reference for agentic contributors working in this repo.

## Quick Facts
- Stack: Angular 21 standalone components, TypeScript strict mode, SCSS styling.
- Testing: Vitest via `@angular/build:unit-test` (Angular CLI `ng test`).
- UI libs: Angular Material (toolbar, button, icon). Forms are Reactive Forms.
- State: Signals are available (see `src/app/app.ts`), otherwise DI-driven services.
- Data: Supabase client wrapper in `src/app/services/supabase/supabase.ts` and `src/app/core/supabase/*`.
- Routing: Standalone route definitions in `src/app/app.routes.ts`.
- No Cursor/Copilot repo rules present.
- Prettier config lives in `package.json` (printWidth 100, singleQuote true, Angular parser for HTML).
- Default style language: SCSS (set in `angular.json`).
- Package manager: npm (packageManager npm@10.9.4).

## Setup
- Use Node compatible with npm 10.x (Node 20+ is safe for Angular 21 CLI).
- Install dependencies: `npm install`.
- Environment file is committed at `src/environments/environment.ts`; treat secrets with care.
- Angular CLI commands are available via `npx ng <command>` or package scripts.
- Generated artifacts go to `dist/` (build) and `out-tsc/` (TS emit for tests/app).

## Core Commands
- Dev server: `npm start` (alias `ng serve`) → http://localhost:4200/.
- Production build: `npm run build` (defaults to production config with output hashing and budgets).
- Dev build/watch: `npm run watch` (builds in watch mode with dev config).
- Unit tests (watch mode): `npm test` or `ng test` (Vitest + jsdom).
- Single test by file: `npx vitest run src/app/components/home/home.spec.ts` (fast path without CLI wrapper).
- Single test by name: `ng test -- --testNamePattern="should create the app"` (for Vitest name filtering).
- Collect coverage (Vitest): `npx vitest run --coverage` (works against the same Vitest setup).
- Lint: no ESLint setup; rely on Prettier + TypeScript strictness. Run `npx prettier --check "src/**/*.{ts,html,scss}"`.

## Formatting & Style
- Prettier rules: width 100, single quotes for TS/SCSS, Angular parser for HTML templates.
- Prefer multi-line objects/arrays when readability improves within 100 columns.
- Keep SCSS consistent with existing nesting and variables; avoid inline styles in templates.
- Do not reflow strings solely for width if they are URLs or error messages.

## TypeScript/Angular Conventions
- Strict TS is enabled (`strict`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, etc.). Add explicit types for public API surfaces and injected deps.
- Use `readonly` where possible; prefer `private readonly` for injected services and constants.
- Standalone components: declare `imports` array in `@Component` metadata instead of NgModules.
- Selector prefix is `app-`; keep filenames kebab-cased matching selector (e.g., `create-account`).
- Prefer `signal` for simple local state (see `App` title) and DI services for shared state.
- Use Angular DI helpers: `inject(...)` for functional style or constructor injection; keep DI side-effect free.

## Imports
- Ordering convention (follow existing files): Angular/Angular Material first, third-party libs next, project-relative modules last.
- Use relative paths within `src/app` rather than deep aliasing; keep path depth shallow and consistent.
- Avoid unused imports; prune when touching files.

## Routing
- Routes live in `src/app/app.routes.ts`; components are referenced directly via `component` (standalone).
- Default route is home (`'' → Home`); auth flows at `create-account` and `login` paths.
- Add guards/resolvers alongside route definitions if needed; keep route objects terse.

## Components & Templates
- Keep `@Component` metadata minimal: `selector`, `imports`, `templateUrl`, `styleUrl`.
- Expose template-facing properties/methods as `protected` to limit surface area.
- Avoid logic in templates; prefer small helper methods in the component class.
- Structure templates with semantic elements; Angular Material components already imported where used.

## Styling (SCSS)
- Global styles: `src/styles.scss`; component styles co-located (`styleUrl`).
- Maintain BEM-like class naming already present; avoid deep selectors when possible.
- Color palette reference in README (`coolors.co` link); reuse existing variables/mixins when added.

## Forms & Validation
- Reactive Forms are standard (`NonNullableFormBuilder` in `CreateAccount`).
- Use `updateOn: 'blur'` when deferring validation (as done in create-account form).
- Keep validators declarative and extracted when reused (e.g., move password matcher into helpers when shared).
- Prefer `form.getRawValue()` for full value extraction; guard with `form.invalid` early return.
- Surface validation errors in UI instead of console-only handling when expanding features.

## Data & Supabase
- Supabase client wrapper: `Supabase` service (`src/app/services/supabase/supabase.ts`) exposes `client` getter.
- Another lightweight client is in `src/app/core/supabase/supabase.client.ts`; pick one and avoid duplicate clients per feature.
- Auth: `Auth` service proxies `supabase.auth.signUp`; returns Supabase response; expand with sign-in/reset as needed.
- User profile creation: `User.addUser` inserts into `public.user_profiles` via Supabase RPC.
- Always handle `{ data, error }` from Supabase; log with context and return typed results.
- Keep Supabase keys in environment; do not hardcode outside `environment.ts`.

## Error Handling & Logging
- Current pattern is console logging (`console.log`/`console.error`). Prefer typed error objects and user-facing messaging.
- Early-return on invalid form state and nullish IDs (see `CreateAccount.onSubmitCreateAccount`).
- Wrap async calls with try/catch when adding side effects (navigation, storage) and provide fallbacks.
- Avoid swallowing errors; return structured results (e.g., `{ ok: boolean; error?: string }`).

## Naming
- Classes and components: PascalCase (`Home`, `CreateAccount`, `Supabase`).
- Files: kebab-case matching component/service purpose (`header.ts`, `auth.service.ts`).
- Inputs/outputs: explicit types; narrow union types for options (e.g., button `type: 'button' | 'submit' | 'reset'`).
- Functions are verb-led (`addUser`, `onSubmitCreateAccount`); validators named descriptively.

## Testing Guidance
- Specs live next to source with `.spec.ts` suffix; Vitest globals are typed via `tsconfig.spec.json` (`vitest/globals`).
- Use Angular TestBed for standalone components: `TestBed.configureTestingModule({ imports: [Component] }).compileComponents()`.
- When using fixtures, await `fixture.whenStable()` before DOM assertions (see `app.spec.ts`, `home.spec.ts`).
- Prefer focused tests per component/service; mock Supabase responses rather than hitting network.
- Use `ng test -- --testNamePattern="..."` for name filtering; `npx vitest run path/to/spec.ts -t "name"` for direct Vitest usage.
- Keep specs small and deterministic; avoid relying on console logs for assertions.

## Performance & Change Detection
- Standalone components default to `ChangeDetectionStrategy.Default`; consider `OnPush` if adding data-heavy views.
- Memoize derived values with signals/computed properties instead of recomputing in template.
- Avoid unnecessary async pipes when values are already available via signals or DI services.

## Accessibility
- Use semantic headings and labels; buttons already wrapped in a shared `Button` component—ensure `type` is set correctly.
- Provide aria-labels for icon-only buttons (Angular Material icons in header).
- Keep form inputs labeled and error messages screen-reader friendly.

## Repo Hygiene
- No lint config—run Prettier manually and keep TS strict errors at zero.
- Respect existing user changes; avoid reverting committed environment keys unless instructed.
- Do not introduce new secrets; prefer `.env` style if future secrets are needed (none present now).
- Keep new files ASCII unless a dependency demands otherwise.

## How to Extend
- Add new routes by updating `app.routes.ts` and importing standalone components.
- For new services, decorate with `@Injectable({ providedIn: 'root' })` and inject via constructor or `inject()`.
- For shared UI, add standalone components under `src/app/components/<feature>/` with matching HTML/SCSS/TS.
- When adding database features, centralize Supabase access in a single service to avoid duplicate clients.

## Build/Test Debugging Tips
- If `ng test` fails silently, run `npx vitest --runInBand` to surface errors without watch mode.
- Use `ng test -- --ui` for Vitest UI (if desired) to rerun specific specs interactively.
- For build size issues, review budgets in `angular.json` (initial 500kB warn/1MB error; component style 4kB/8kB).
- Enable dev build with source maps via `ng build --configuration development` for easier debugging.

## File Reference Map
- App shell: `src/app/app.ts`, template `src/app/app.html`, styles `src/app/app.scss`.
- Routing: `src/app/app.routes.ts`; config `src/app/app.config.ts`.
- Components: header/home/login/create-account/button under `src/app/components/`.
- Services: `src/app/services/*`; Supabase core in `src/app/core/supabase/*`.
- Interfaces: `src/app/interfaces/user/*` (user DTOs).
- Environments: `src/environments/environment.ts`.
- Database SQL snippets: `src/db/query.sql`, `src/db/rls_policies.sql` (reference only).

## Pulling It Together
- Follow the command set above for builds/tests; prefer Vitest direct CLI for focused runs.
- Keep code small, typed, and signal/DI friendly; align with existing file layout and naming.
- Format with Prettier rules before proposing changes; keep SCSS and HTML tidy.
- Handle Supabase responses explicitly and avoid leaking secrets beyond `environment.ts`.
- When in doubt, mirror existing patterns from `CreateAccount`, `Home`, and `Supabase` services.
