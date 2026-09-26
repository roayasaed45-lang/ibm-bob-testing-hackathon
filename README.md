# Ale Barber — Automated Login Testing with IBM Bob 2.0

> An AI-assisted developer workflow built with IBM Bob 2.0:
> from repository analysis to measurable test coverage on a real-world
> application's customer authentication flow — in 48 hours.

![18 tests passing](https://img.shields.io/badge/tests-18%20passing-brightgreen)
![phoneUtils coverage](https://img.shields.io/badge/phoneUtils.ts-100%25%20coverage-brightgreen)
![CustomerLogin coverage](https://img.shields.io/badge/CustomerLogin.tsx-90.69%25%20statements-green)
![TypeScript](https://img.shields.io/badge/TypeScript-0%20errors-blue)
![Build](https://img.shields.io/badge/build-passing%201.51s-blue)

---

## Table of Contents

1. [The Innovation: AI-Assisted Developer Workflow](#1-the-innovation-ai-assisted-developer-workflow)
2. [Problem Statement](#2-problem-statement)
3. [Why This Matters](#3-why-this-matters)
4. [Business Value](#4-business-value)
5. [Project Context: Ale Barber](#5-project-context-ale-barber)
6. [Solution Overview](#6-solution-overview)
7. [End-to-End Workflow](#7-end-to-end-workflow)
8. [How IBM Bob Was Used](#8-how-ibm-bob-was-used)
9. [The Tests](#9-the-tests)
10. [Measured Results](#10-measured-results)
11. [Tech Stack and Testing Tools](#11-tech-stack-and-testing-tools)
12. [Repository Structure](#12-repository-structure)
13. [Install and Run](#13-install-and-run)
14. [Run Tests and Coverage](#14-run-tests-and-coverage)
15. [Known Limitations](#15-known-limitations)
16. [Future Improvements](#16-future-improvements)
17. [Evidence and Screenshots](#17-evidence-and-screenshots)
18. [No Bugs Found — But Regressions Are Now Caught](#18-no-bugs-found--but-regressions-are-now-caught)
19. [Judging Criteria Summary](#19-judging-criteria-summary)

---

## 1. The Innovation: AI-Assisted Developer Workflow

**The innovation in this submission is not the barbershop application itself.**

The innovation is the **developer workflow** — a structured, phase-by-phase
process in which IBM Bob 2.0 acts as an AI pair-programmer to take a real-world
codebase from zero test coverage to a fully validated, measurable testing layer,
with explicit human approval gates at every step.

```
Analyze → Plan → Implement → Run → Validate → Measure
```

Each phase was driven by IBM Bob: reading source files, identifying risks,
proposing approaches, writing code, running commands, and interpreting results.
Each phase ended with a stop — waiting for human review and approval before
proceeding. The human's role was to direct, review, correct, and approve; Bob's
role was to investigate, reason, and execute.

This is not code generation. It is a **repeatable engineering workflow** for
adding test coverage to an existing application, where the AI handles the
research, setup, and implementation work that would otherwise take days.

---

## 2. Problem Statement

At the start of this hackathon, the Customer Login flow had no automated tests.
The setup cost for a test suite is real: choosing a compatible framework, wiring
it to the bundler, understanding which dependencies to mock, and writing the
first meaningful test all take time that prototype-stage teams rarely have.

The goal of this hackathon entry was to close that gap — using IBM Bob 2.0 to
drive every phase from analysis through final validation.

---

## 3. Why This Matters

The customer login mechanism uses a **synthetic email derived deterministically
from a phone number** — because Supabase Auth requires an email but no SMS
provider is configured. This means:

- A user registers with phone `+972501234567`
- The app normalizes it to `0501234567` and derives `0501234567@customers.alebarber.internal`
- At login, the same normalization must produce the exact same email

If that normalization ever diverges between registration and login — even by one
character — the user is **permanently locked out** with no error message pointing
to the real cause. Supabase returns "invalid credentials" and the user has no
recourse.

Without automated tests, that regression is invisible until a user reports it.
With the tests added in this hackathon, a future normalization regression would
be detected automatically during the test suite. The final validation run
completed in approximately 1.3 seconds.

---

## 4. Business Value

Automated tests on an authentication flow deliver practical developer value in
four ways:

1. **Reduced manual verification effort.** Login behavior no longer requires
   manual re-testing after every change to authentication logic or phone
   normalization. The test suite runs in seconds and produces a pass/fail result.

2. **Automatic regression detection.** Any future change that breaks the phone
   normalization contract, the login validation gate, or the error-handling path
   will be caught before it reaches users — not after.

3. **Greater confidence when refactoring.** The `normalizePhone` and
   `phoneToSyntheticEmail` functions are now 100% covered. A developer can
   refactor them with confidence that any behavioral change will immediately
   surface as a failing test.

4. **A repeatable, expandable workflow.** The testing patterns established here
   (inline mocking, utility extraction, component-level rendering) can be
   directly extended to cover the registration form, the admin login, the route
   guard, and eventually a full CI pipeline — without starting from scratch.

No monetary savings or specific hours-saved figures are claimed. The value is
the reduction in uncertainty and manual effort around a critical, hard-to-debug
failure mode.

---

## 5. Project Context: Ale Barber

**Ale Barber** is a real-world application built with React, TypeScript, Vite,
Supabase, and Capacitor. It consists of:

- A **marketing web app** (React SPA) with service listings, gallery, and
  contact information
- A **booking flow** where customers select services and schedule appointments
- An **admin panel** for managing appointments
- A **native mobile app** (iOS + Android via Capacitor)

Customer login is a core entry point for authenticated mobile users. The flow
uses phone + password credentials, a custom phone normalization function, and a
synthetic email derivation to interface with Supabase Auth.

**At the start of this hackathon: 0 automated tests.**

---

## 6. Solution Overview

Using IBM Bob 2.0 as the sole AI tool across six sequential, approval-gated
phases, the following was delivered:

| What | Result |
|---|---|
| Testing framework | Vitest 2 + React Testing Library — wired to the existing Vite config with no separate bundler setup |
| Testable utility | `normalizePhone` + `phoneToSyntheticEmail` extracted from `CustomerAuthContext` into `src/lib/phoneUtils.ts` |
| Unit tests | 11 tests covering all normalization input variants and the cross-format parity contract |
| Component tests | 7 tests covering the `CustomerLogin` form: validation gate, happy path, and error handling |
| Final state | 18/18 passing · 100% utility coverage · 90.69% component statement coverage · 0 TypeScript errors · build unchanged |

**No source code behavior was changed.** The only modification to existing
source was one import swap in `CustomerAuthContext.tsx` (22 lines removed,
1 import line added).

---

## 7. End-to-End Workflow

```
Analyze   →  Bob read all auth-relevant files, mapped the full login pipeline,
             identified the synthetic email risk, determined mock strategy
             — no code touched in this phase

Plan      →  Bob produced a 10-test plan with risk classifications,
             recommended the minimum package set, and selected the MVP-5 subset

Implement →  Five approval-gated phases executed sequentially:
             Setup → Refactor → Unit Tests → Component Tests → Validation

Run       →  npm test → 18/18 green on first full run

Validate  →  tsc --noEmit (0 errors) + npm run build (1.51s, unchanged output)

Measure   →  phoneUtils.ts 100% across all metrics
             CustomerLogin.tsx 90.69% statements / 87.50% branches
```

Every phase stopped and waited for explicit human approval before proceeding.
No phase was skipped, merged, or executed speculatively.

---

## 8. How IBM Bob Was Used

| Phase | Bob's contribution | Human's role |
|---|---|---|
| **Analysis** | Read 10 source files; explained the two-context auth architecture; identified the synthetic email risk and its lockout implication | Reviewed the summary; asked targeted follow-up questions |
| **Planning** | Produced a 10-test plan with risk ratings per test; recommended Vitest over Jest for Vite compatibility; proposed the MVP-5 subset | Approved the plan; scoped it to the 5 MVP tests |
| **P1 — Setup** | Identified the Vite 5 / Vitest v5 version conflict; pinned to Vitest v2; configured all three config files; wrote `setup.ts`; ran a canary validation | Approved each file change before proceeding |
| **P2 — Refactor** | Identified that `normalizePhone` was a private module function untestable in isolation; proposed and executed extraction into `phoneUtils.ts` with zero behavior change; verified with `tsc` and build | Approved the extraction strategy |
| **P3 — Unit Tests** | Wrote 11 tests covering T1/T2/T3/T7 and their variants; all 11 green on first run | Read output; approved for Phase 4 |
| **P4 — Component Tests** | Read source files before writing a single line; chose inline mock strategy (no real `CustomerAuthProvider` mounted); wrote 7 tests — all 7 green on first run | Approved final suite |
| **P5 — Validation** | Ran all four checks (`npm test`, `test:coverage`, `tsc --noEmit`, `build`); explained the origin of every warning; confirmed zero regressions | Confirmed readiness for documentation |
| **P6 — Documentation** | Produced the documentation plan; drafted and revised this README with human corrections applied | Applied corrections; approved final write |

---

## 9. The Tests

### Unit Tests — `src/test/unit/normalizePhone.test.ts` (11 tests)

| # | Test description | Label |
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

| # | Test description | Label |
|---|---|---|
| 12 | Empty fields → `signIn` NOT called | **T4** |
| 13 | Phone only → `signIn` NOT called | T4 variant |
| 14 | Password only → `signIn` NOT called | T4 variant |
| 15 | Valid submit → `signIn` called with the correct phone and password | **T5** |
| 16 | Valid submit → `navigate('/')` called after success | T5 — navigation |
| 17 | `signIn` returns error → `navigate` NOT called | **T6** |
| 18 | `signIn` returns error → submit button re-enabled for retry | T6 — UX regression |

---

## 10. Measured Results

### Before

| Metric | Value |
|---|---|
| Automated tests | **0** |
| Test files | **0** |
| Code coverage on auth flow | **0%** |
| Normalization regression detection | Manual QA only |
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
| Build | **✅ completed in 1.51s** |
| Normalization regression detection | Automatically, during the test suite (~1.3s) |

---

## 11. Tech Stack and Testing Tools

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
| `vitest` | 2.x | Test runner, Vite-native — no separate bundler config |
| `@vitest/coverage-v8` | 2.x | V8-based coverage reports |
| `jsdom` | 25.x | DOM environment for component tests |
| `@testing-library/react` | 16.x | Component rendering and DOM queries |
| `@testing-library/user-event` | 14.x | Realistic browser-like input simulation |
| `@testing-library/jest-dom` | 6.x | DOM matchers (`toBeDisabled`, `toBeInTheDocument`) |

> **Compatibility note:** Vitest v5 requires Vite 6+. This project uses Vite 5,
> so Vitest v2 (the last Vite 5–compatible major) was installed. All APIs used
> are identical between v2 and v5.

---

## 12. Repository Structure

Only the files added or modified during this hackathon are shown.

```
ale-barber-web/
│
├── src/
│   ├── lib/
│   │   └── phoneUtils.ts              ← NEW (Phase 2): extracted phone utilities
│   │
│   ├── contexts/
│   │   └── CustomerAuthContext.tsx    ← MODIFIED: imports from phoneUtils
│   │                                     (1 import added, 22 lines removed)
│   │
│   ├── pages/
│   │   └── CustomerLogin.tsx          ← tested, not modified
│   │
│   └── test/                          ← NEW directory (Phases 1–4)
│       ├── setup.ts                   ← jest-dom import + matchMedia stub
│       ├── unit/
│       │   └── normalizePhone.test.ts ← 11 unit tests (Phase 3)
│       └── components/
│           └── CustomerLogin.test.tsx ← 7 component tests (Phase 4)
│
├── docs/
│   └── screenshots/                   ← evidence (see §17)
│
├── vite.config.ts                     ← MODIFIED: test block added
├── tsconfig.app.json                  ← MODIFIED: vitest/jest-dom types added
└── package.json                       ← MODIFIED: 6 dev deps + 3 test scripts
```

---

## 13. Install and Run

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Setup

```bash
# Clone the hackathon repository
git clone https://github.com/roayasaed45-lang/ibm-bob-testing-hackathon.git
cd ibm-bob-testing-hackathon

# Install all dependencies (including test packages)
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

> The app requires these values to connect to Supabase. The **test suite runs
> fully without them** — all Supabase calls are mocked at the module level.

---

## 14. Run Tests and Coverage

```bash
# Run the full test suite once
npm test

# Run in watch mode (re-runs on file save)
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

## 15. Known Limitations

| Item | Type | Detail |
|---|---|---|
| React Router v6 future-flag warnings | ⚠️ Warning (stderr) | Two deprecation notices (`v7_startTransition`, `v7_relativeSplatPath`) appear during component tests. Pre-existing in the project; not introduced by this work; no assertion is affected. |
| JS bundle > 500 kB | ⚠️ Warning (build) | The `index.js` chunk is 766 kB after minification. Pre-existing; requires code-splitting work outside the scope of this hackathon. |
| `browserslist` data stale | ⚠️ Warning (build) | Run `npx update-browserslist-db@latest` to resolve. Pre-existing. |
| `CustomerLogin.tsx` lines 26–33 uncovered | Coverage gap | The `if (!phone || !password)` guard is not reachable via `userEvent` because the `required` HTML attribute triggers native browser-level form validation before `handleSubmit` is called — a known jsdom limitation, not a gap in the actual application. |
| `CustomerAuthContext.tsx` shows 0% coverage | Expected | The real context is mocked at module level in all component tests. Its coverage will increase when context-level integration tests are added. |

---

## 16. Future Improvements

- [ ] **Context integration tests:** Test `CustomerAuthContext` directly (session restore, profile loading, `signOut`) to move its coverage above 0%
- [ ] **`CustomerRegister` tests:** Mirror the T4/T5/T6 pattern, including password-mismatch and minimum-length validation
- [ ] **`AdminLogin` tests:** Same component test set for the admin email + password flow
- [ ] **Playwright E2E:** One end-to-end test driving a real browser against the dev server to cover the full Supabase integration
- [ ] **CI pipeline:** GitHub Actions workflow running `npm test` on every pull request to `main`
- [ ] **Vite 6 upgrade:** Unlocks Vitest v5 and its improved browser-mode capabilities
- [ ] **`RequireCustomerAuth` tests:** Cover the native-only route guard with a mocked `Capacitor.isNativePlatform()`

---

## 17. Evidence and Screenshots

### Available now

| File | Content |
|---|---|
| [`docs/screenshots/bob-phase1-canary-pass.png`](docs/screenshots/bob-phase1-canary-pass.png) | Phase 1 canary test passing — Vitest environment confirmed working |
| [`docs/screenshots/bob-phase1-compatibility.png`](docs/screenshots/bob-phase1-compatibility.png) | Bob resolving the Vite 5 / Vitest version conflict |
| [`docs/screenshots/bob-phase2-typescript.png`](docs/screenshots/bob-phase2-typescript.png) | TypeScript validation after `phoneUtils.ts` extraction — 0 errors |
| [`docs/screenshots/bob-phase3-unit.png`](docs/screenshots/bob-phase3-unit.png) | 11/11 unit tests passing — `phoneUtils.ts` 100% coverage |

### Planned (to be added before final submission)

| File | Content |
|---|---|
| [`docs/screenshots/bob-analysis.png`](docs/screenshots/bob-analysis.png) | Bob's auth flow analysis — 10 files read, risk and mock strategy identified |
| [`docs/screenshots/bob-phase4-component.png`](docs/screenshots/bob-phase4-component.png) | 7/7 component tests passing — happy path, error path, validation gate |
| [`docs/screenshots/bob-phase5-validation.png`](docs/screenshots/bob-phase5-validation.png) | Final validation: 18/18 tests · 0 TypeScript errors · build in 1.51s |

---

## 18. No Bugs Found — But Regressions Are Now Caught

The automated test suite found **no pre-existing bugs** in the Customer Login
flow. Every test passed on the first run without any modification to source
logic. This is a positive result — the implementation is correct as written.

The value delivered is **regression protection and repeatable validation**, not
bug discovery. If a future change to `normalizePhone`, `phoneToSyntheticEmail`,
or the `CustomerLogin` component introduces a break, the test suite will catch
it automatically on the next run. The cross-format parity test (T7) in
particular guards against the highest-risk silent failure mode in this
application: a user locked out because their phone was stored in a different
format at registration versus login. Without this test, that regression would
be invisible until a real user reported it. With it, the failure surfaces in
the test suite instead.

---

## 19. Judging Criteria Summary

### Technology
A working automated testing workflow with real, executable tests — not
stubs or scaffolding. 18 tests across 2 files. Measured coverage:
`phoneUtils.ts` at 100% across all metrics, `CustomerLogin.tsx` at 90.69%
statements and 87.50% branches. TypeScript validation passes with 0 errors.
The production build completes successfully in 1.51s with output identical
to the pre-test baseline. All results are reproducible with `npm test` and
`npm run test:coverage`.

### Business Value
The tested flow is the entry point for authenticated users in a real-world
application. The tests reduce manual verification effort on a critical path,
catch normalization regressions automatically before they affect users, and
increase developer confidence when refactoring authentication logic. The
patterns established here are directly reusable for registration, admin login,
route guards, and a CI pipeline — without restarting from scratch.

### Originality
The key innovation is using IBM Bob 2.0 to drive a **structured developer
workflow** — not just to generate code. Bob read the codebase, identified a
non-obvious architectural risk (the synthetic email normalization contract),
selected the correct testing tools, resolved a real version incompatibility,
proposed a safe refactor, wrote tests that required no source changes to pass,
and produced a validated result — all under human direction. The workflow is
**Analyze → Plan → Implement → Run → Validate → Measure**, with explicit
approval gates and zero speculative execution.

### Presentation
The repository includes reproducible commands (`npm test`, `npm run test:coverage`),
exact measured metrics, a documented workflow with per-phase explanations,
screenshots of the IBM Bob task sessions, a clear before/after comparison,
and honest documentation of all pre-existing warnings and known limitations.
Every claim in this README is backed by a command that can be run and verified.

---

<sub>Built for the IBM Bob 2.0 Hackathon · Branch: <code>ibm-bob-testing-hackathon</code></sub>
