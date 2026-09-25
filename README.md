# Ale Barber — Automated Login Testing with IBM Bob 2.0

> Zero-to-tested in 48 hours: using IBM Bob as an AI pair-programmer to add a
> complete, measurable testing layer to the customer authentication flow of a
> real-world barbershop booking application.

![18 tests passing](https://img.shields.io/badge/tests-18%20passing-brightgreen)
![phoneUtils coverage](https://img.shields.io/badge/phoneUtils.ts-100%25%20coverage-brightgreen)
![CustomerLogin coverage](https://img.shields.io/badge/CustomerLogin.tsx-90.7%25%20statements-green)
![TypeScript](https://img.shields.io/badge/TypeScript-0%20errors-blue)
![Build](https://img.shields.io/badge/build-passing%201.51s-blue)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Why This Matters](#2-why-this-matters)
3. [Project Context: Ale Barber](#3-project-context-ale-barber)
4. [Solution Overview](#4-solution-overview)
5. [End-to-End Workflow](#5-end-to-end-workflow)
6. [How IBM Bob Was Used](#6-how-ibm-bob-was-used)
7. [The Tests](#7-the-tests)
8. [Measured Results](#8-measured-results)
9. [Tech Stack and Testing Tools](#9-tech-stack-and-testing-tools)
10. [Repository Structure](#10-repository-structure)
11. [Install and Run](#11-install-and-run)
12. [Run Tests and Coverage](#12-run-tests-and-coverage)
13. [Known Limitations](#13-known-limitations)
14. [Future Improvements](#14-future-improvements)
15. [Evidence and Screenshots](#15-evidence-and-screenshots)
16. [No Bugs Found — But Regressions Are Now Caught](#16-no-bugs-found--but-regressions-are-now-caught)
17. [Hackathon Impact Summary](#17-hackathon-impact-summary)

---

## 1. Problem Statement

This project started the hackathon with no automated tests covering its
customer authentication flow. When a bug lands in login, every authenticated
user is affected immediately and silently. The gap isn't unique to this
codebase — the setup cost is real: choosing a framework, wiring it to the
bundler, mocking third-party dependencies, and writing the first meaningful
test all take time that prototype-stage teams don't have.

The goal of this hackathon entry was to close that gap — using IBM Bob 2.0
as the AI pair-programmer to drive every phase from analysis through final
validation.

---

## 2. Why This Matters

The customer login mechanism in this app uses a **synthetic email derived
deterministically from a phone number** — because Supabase Auth requires an
email but no SMS provider is configured. This means:

- A user registers with phone `+972501234567`
- The app normalizes it to `0501234567` and derives `0501234567@customers.alebarber.internal`
- At login, the same normalization must produce the exact same email

If that normalization ever diverges between registration and login — even by
one character — the user is **permanently locked out** with no error message
pointing to the real cause. Supabase returns "invalid credentials" and the
user has no recourse.

Without automated tests, this regression can ship silently. With them, it
is caught automatically during the test suite (~1.3s in the final validation
run).

---

## 3. Project Context: Ale Barber

**Ale Barber** is a real-world barbershop booking application with:

- A **marketing web app** (React SPA) with service listings, gallery, and
  contact information
- A **booking flow** where customers select services and schedule appointments
- An **admin panel** for managing appointments
- A **native mobile app** (iOS + Android via Capacitor)

Customer login is a core entry point for authenticated mobile users. The flow
uses phone + password credentials, a custom phone normalization function, and
a synthetic email derivation to interface with Supabase Auth.

**At the start of this hackathon: 0 automated tests.**

---

## 4. Solution Overview

Using IBM Bob 2.0 as the sole AI tool across six sequential, approval-gated
phases, the following was delivered:

| What | Result |
|---|---|
| Testing framework | Vitest 2 + React Testing Library — zero extra config needed beyond `vite.config.ts` |
| Testable utility | `normalizePhone` + `phoneToSyntheticEmail` extracted from `CustomerAuthContext` into `src/lib/phoneUtils.ts` |
| Unit tests | 11 tests covering all normalization input formats and the cross-format parity contract |
| Component tests | 7 tests covering the `CustomerLogin` form: validation gate, happy path, and error handling |
| Final state | 18/18 passing · 100% utility coverage · 90.7% component coverage · 0 TypeScript errors · build unchanged |

**No production code behavior was changed.** All source modifications were
minimal and non-breaking (one import swap in `CustomerAuthContext.tsx`).

---

## 5. End-to-End Workflow

```
Analyze   →  Bob read all auth-relevant files, mapped the full login pipeline,
             identified mock strategy for each dependency — no code touched

Plan      →  Bob produced a 10-test plan with risk classifications and
             recommended the minimum package set

Implement →  Five approval-gated phases: Setup → Refactor → Unit Tests →
             Component Tests → Validation

Run       →  npm test → 18/18 green

Validate  →  tsc --noEmit (0 errors) + npm run build (1.51s, unchanged output)

Measure   →  phoneUtils.ts 100% · CustomerLogin.tsx 90.7% statements
```

Every phase stopped and waited for explicit human approval before proceeding.

---

## 6. How IBM Bob Was Used

| Phase | Bob's contribution | Human's role |
|---|---|---|
| **Analysis** | Read 10 source files; explained the two-context auth architecture; identified the synthetic email risk | Reviewed summary; asked follow-up questions |
| **Planning** | Produced a 10-test plan with risk ratings; recommended Vitest over Jest; selected MVP-5 subset | Approved plan; scoped to 5 MVP tests |
| **P1 — Setup** | Resolved Vite 5 / Vitest version conflict (pinned to v2); configured all three config files; ran canary validation | Approved each file change |
| **P2 — Refactor** | Identified that `normalizePhone` was a private module function; proposed and executed extraction with zero behavior change | Approved extraction strategy |
| **P3 — Unit Tests** | Wrote 11 tests covering T1/T2/T3/T7 variants; all green on first run | Read output; approved for Phase 4 |
| **P4 — Component Tests** | Read source files before writing a single line; chose inline mock strategy to avoid mounting real `CustomerAuthProvider`; wrote 7 tests — all green on first run | Approved final suite |
| **P5 — Validation** | Ran all four checks; explained origin of every warning; confirmed no regressions | Confirmed readiness for documentation |
| **P6 — Documentation** | Produced the documentation plan and this README | Applied corrections; approved final write |

---

## 7. The Tests

### Unit Tests — `src/test/unit/normalizePhone.test.ts` (11 tests)

| # | Test description | MVP label |
|---|---|---|
| 1 | `+972501234567` normalizes to `0501234567` | **T1** |
| 2 | `972501234567` (no `+`) normalizes to `0501234567` | T1 variant |
| 3 | `+972 50 123 4567` (spaces) normalizes correctly | T1 variant |
| 4 | `+972-50-123-4567` (dashes) normalizes correctly | T1 variant |
| 5 | `0501234567` is returned unchanged | **T2** — idempotency |
| 6 | `normalizePhone(normalizePhone(x)) === normalizePhone(x)` | T2 — idempotency proof |
| 7 | `phoneToSyntheticEmail` produces `@customers.alebarber.internal` | **T3** — domain contract |
| 8 | Email contains the exported `SYNTHETIC_EMAIL_DOMAIN` constant | T3 — constant not diverged |
| 9 | `+972501234567` and `0501234567` produce the **same** synthetic email | **T7** — critical parity |
| 10 | `972501234567` and `0501234567` produce the same email | T7 variant |
| 11 | Formatted international and local both produce the same email | T7 variant |

### Component Tests — `src/test/components/CustomerLogin.test.tsx` (7 tests)

| # | Test description | MVP label |
|---|---|---|
| 12 | Empty fields → `signIn` NOT called | **T4** |
| 13 | Phone only → `signIn` NOT called | T4 variant |
| 14 | Password only → `signIn` NOT called | T4 variant |
| 15 | Valid submit → `signIn` called with the correct phone and password | **T5** |
| 16 | Valid submit → `navigate('/')` called after success | T5 — navigation |
| 17 | `signIn` returns error → `navigate` NOT called | **T6** |
| 18 | `signIn` returns error → submit button re-enabled for retry | T6 — UX regression |

---

## 8. Measured Results

### Before

| Metric | Value |
|---|---|
| Automated tests | **0** |
| Test files | **0** |
| Code coverage on auth flow | **0%** |
| Time to detect a normalization regression | Never (manual QA only) |
| Confidence to refactor `normalizePhone` | None |

### After

| Metric | Value |
|---|---|
| Test files | **2** |
| Total tests | **18** |
| Tests passing | **18 / 18** |
| `src/lib/phoneUtils.ts` — Statements | **100%** |
| `src/lib/phoneUtils.ts` — Branches | **100%** |
| `src/lib/phoneUtils.ts` — Functions | **100%** |
| `src/lib/phoneUtils.ts` — Lines | **100%** |
| `src/pages/CustomerLogin.tsx` — Statements | **90.69%** |
| `src/pages/CustomerLogin.tsx` — Branches | **87.50%** |
| TypeScript errors | **0** |
| Production build | **✅ completed in 1.51s** |
| Time to detect a normalization regression | **Automatically, during test suite run (~1.3s)** |

---

## 9. Tech Stack and Testing Tools

### Application Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript + Vite 5 |
| Styling | Tailwind CSS + Radix UI (shadcn/ui) |
| Auth | Supabase Auth (synthetic email strategy) |
| Mobile | Capacitor (iOS + Android) |
| Routing | React Router v6 |
| State / queries | TanStack Query v5 |

### Testing Tools (added during this hackathon)

| Tool | Version | Purpose |
|---|---|---|
| `vitest` | 2.x | Test runner, Vite-native — no extra bundler config |
| `@vitest/coverage-v8` | 2.x | V8-based coverage reports |
| `jsdom` | 25.x | DOM environment for component tests |
| `@testing-library/react` | 16.x | Component rendering and DOM queries |
| `@testing-library/user-event` | 14.x | Realistic browser-like input simulation |
| `@testing-library/jest-dom` | 6.x | DOM matchers (`toBeDisabled`, `toBeInTheDocument`) |

> **Compatibility note:** Vitest v5 requires Vite 6+. This project uses Vite 5,
> so Vitest v2 (the last Vite 5–compatible major) was installed. All APIs used
> are identical between v2 and v5.

---

## 10. Repository Structure

Only the files added or modified during this hackathon are shown.

```
ale-barber-web/
│
├── src/
│   ├── lib/
│   │   └── phoneUtils.ts              ← NEW (Phase 2): extracted phone utils
│   │
│   ├── contexts/
│   │   └── CustomerAuthContext.tsx    ← MODIFIED: imports from phoneUtils
│   │                                     (one import line added, 22 lines removed)
│   │
│   ├── pages/
│   │   └── CustomerLogin.tsx          ← tested, not modified
│   │
│   └── test/                          ← NEW directory (Phase 1–4)
│       ├── setup.ts                   ← jest-dom + matchMedia stub
│       ├── unit/
│       │   └── normalizePhone.test.ts ← 11 unit tests (Phase 3)
│       └── components/
│           └── CustomerLogin.test.tsx ← 7 component tests (Phase 4)
│
├── docs/
│   └── screenshots/                   ← evidence placeholders (see §15)
│
├── vite.config.ts                     ← MODIFIED: test block added
├── tsconfig.app.json                  ← MODIFIED: vitest/jest-dom types added
└── package.json                       ← MODIFIED: 6 dev deps + 3 test scripts
```

---

## 11. Install and Run

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
# Clone the hackathon repository
git clone https://github.com/roayasaed45-lang/ibm-bob-testing-hackathon.git
cd ibm-bob-testing-hackathon

# Install all dependencies (including the new test packages)
npm install

# Start the development server
npm run dev
# → http://localhost:8080
```

### Environment Variables

Create a `.env.local` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

> The app will load without these values but Supabase calls will fail.
> The **test suite runs fully without them** — all Supabase calls are mocked.

---

## 12. Run Tests and Coverage

```bash
# Run the full test suite once (exit 0 = all passing)
npm test

# Run tests in watch mode (re-runs on file save — use during development)
npm run test:watch

# Run tests and generate a coverage report
npm run test:coverage
```

The coverage HTML report is written to `coverage/index.html`.
Open it in any browser for a line-by-line view.

**Expected output from `npm test`:**

```
Test Files  2 passed (2)
     Tests  18 passed (18)
  Duration  ~1.3s
```

---

## 13. Known Limitations

| Item | Type | Detail |
|---|---|---|
| React Router v6 future-flag warnings | ⚠️ Warning (stderr) | Two deprecation notices (`v7_startTransition`, `v7_relativeSplatPath`) appear during component tests. Pre-existing in the project; not introduced by this work; no assertion is affected. |
| JS bundle > 500 kB | ⚠️ Warning (build) | The `index.js` chunk is 766 kB after minification. Pre-existing; requires code-splitting work outside the scope of this hackathon. |
| `browserslist` data stale | ⚠️ Warning (build) | Run `npx update-browserslist-db@latest` to resolve. Pre-existing. |
| `CustomerLogin.tsx` lines 26–33 uncovered | Coverage gap | The `if (!phone || !password)` branch inside `handleSubmit` is not fully reachable via `userEvent` because the `required` HTML attribute triggers native browser-level form validation before `handleSubmit` is called — a known jsdom limitation. This is not a gap in production coverage. |
| `CustomerAuthContext.tsx` shows 0% coverage | Expected | The real context is mocked at module level in all component tests. Its coverage will increase when integration tests are added. |

---

## 14. Future Improvements

- [ ] **Context integration tests:** Add tests for `CustomerAuthContext` directly (session restore, profile loading, `signOut`) to bring its coverage above 0%
- [ ] **`CustomerRegister` tests:** Mirror the T4/T5/T6 pattern for the registration form, including password-mismatch and minimum-length validation
- [ ] **`AdminLogin` tests:** Add the same component test set for the admin email + password flow
- [ ] **Playwright E2E:** One end-to-end test driving a real browser against the dev server to cover the full Supabase integration path
- [ ] **CI pipeline:** Add a GitHub Actions workflow running `npm test` on every pull request to `main`
- [ ] **Vite 6 upgrade:** Unlock Vitest v5 and its improved browser-mode capabilities
- [ ] **`RequireCustomerAuth` tests:** Cover the native-only route guard with mocked `Capacitor.isNativePlatform()`

---

## 15. Evidence and Screenshots

> Screenshots of IBM Bob task sessions will be added to this directory before
> final submission.

| File | Content |
|---|---|
| [`docs/screenshots/bob-analysis.png`](docs/screenshots/bob-analysis.png) | Bob's analysis of the full auth flow — 10 files read, mock strategy identified |
| [`docs/screenshots/bob-phase1-compatibility.png`](docs/screenshots/bob-phase1-compatibility.png) | Bob resolving the Vite 5 / Vitest version conflict and running the canary test |
| [`docs/screenshots/bob-phase3-unit.png`](docs/screenshots/bob-phase3-unit.png) | 11/11 unit tests passing — `phoneUtils.ts` 100% coverage |
| [`docs/screenshots/bob-phase4-component.png`](docs/screenshots/bob-phase4-component.png) | 7/7 component tests passing — happy path, error path, validation gate |
| [`docs/screenshots/bob-phase5-validation.png`](docs/screenshots/bob-phase5-validation.png) | Final validation run: 18/18 tests · 0 TypeScript errors · build in 1.51s |

---

## 16. No Bugs Found — But Regressions Are Now Caught

The automated test suite found **no pre-existing bugs** in the Customer Login
flow. Every test passed on the first run without any modification to production
logic. This is a positive result — the implementation is correct as written.

What was added is **regression protection**. If a future change to
`normalizePhone`, `phoneToSyntheticEmail`, or the `CustomerLogin` component
introduces a break, the test suite will catch it automatically during the next
run. The cross-format parity test (T7) in particular guards against the
highest-risk silent failure mode in this application: a user permanently locked
out because their phone was stored in a different format at registration versus
login time. Without this test, that regression would be invisible until a real
user reported a login failure.

---

## 17. Hackathon Impact Summary

In 48 hours, using IBM Bob 2.0 as an AI pair-programmer, the customer
authentication flow of this real-world application went from **zero automated
tests** to **18 passing tests, 100% coverage on its core auth utility, and a
measurable regression safety net** — with zero changes to production behavior,
zero TypeScript errors, and a clean production build.

Every phase was planned, reviewed, and executed through a structured
conversation with Bob, with explicit approval gates between each step. The
workflow demonstrated that an AI-assisted developer can compress a multi-day
testing initiative into a focused 48-hour sprint without sacrificing
correctness or engineering discipline.

---

<sub>Built for the IBM Bob 2.0 Hackathon · Branch: <code>ibm-bob-testing-hackathon</code></sub>
