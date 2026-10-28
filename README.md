# Ethanol + Caffeine PK/PD Sandbox 2.0

Official public application: https://pkpd.goturbo.one/

Retained deployment alias: https://ethanol-caffeine-pk-pd-sandbox.pages.dev/

Version 2.0 adds a local scientific workbench around the retained v1.60 reference PK equations. The four main workspaces and independent scientific-depth, explanation, density and appearance settings remain available.

## Scientific workbench

Session > Observations imports concentration measurements from CSV with elapsed or absolute timestamps, analyte, units, matrix, dataset role, optional measurement SD and censoring qualifier. Supported alternative matrices require an explicit conversion factor. Data remain local to the browser and portable session files.

Analysis > Scientific workbench provides Evaluation, Calibration, Uncertainty and Evidence. Evaluation separates calibration and held-out rows and reports canonical-unit bias, MAE and RMSE. The built-in published corpus contains four group-level Cmax summaries from two studies. It reports cohort reconstruction assumptions and descriptive discrepancies. Individual predictive validity and full empirical trajectory validation remain unevaluated by that summary corpus.

Calibration uses bounded weighted least squares for one or two registered parameters. It reports local sensitivity dependence, parameter-bound contact, objective support and error assumptions. Application requires a current, locally identifiable interior solution. Fitted values are applied in one undoable edit with a named record. Upper limits use an explicitly stated one-sided squared penalty. Coarse one-parameter profile support is emitted only with quantified rows and supplied SDs.

Uncertainty uses a reproducible 32-bit seed, 16-256 parameter draws, uniform/triangular/truncated-lognormal distributions and a positive-definite Gaussian-copula dependence matrix. Paired A/B sampling shares absolute draws for equal parameter baselines and horizons. P05/P50/P95 quantiles, conditional threshold fractions and unresolved final returns retain their defined sampling semantics. Work budgets bound computation, workers support cancellation, and a cooperative fallback remains available.

Evidence exposes the existing 39-entry source registry, parameter derivations and population/model limits. The fed-elimination benchmark comparator is an explicit 1.39-fold hypothesis and changes no main-scenario defaults. The standardized ethanol benchmark scenarios underpredict reported peaks; increasing fed elimination lowers that benchmark prediction further. The reference equations are retained.

Help provides action/result/check walkthroughs at Default, Detailed and Expert levels. The portable guide is [docs/HOW_TO_USE.md](docs/HOW_TO_USE.md).

## Reproducibility and compatibility

Application 2.0.0 uses reference profile reference-1.60, PK engine 0.4.4, constants 0.3.0, scenario schema 0.8.2, session wrapper 1.1.0, scientific workbench schema 1.0.0 and evidence revision 2026-10-28.1. Scientific and behavioural component identities remain independent.

Session wrapper 1.0.0 and legacy scenarios remain importable. Earlier documents receive empty scientific defaults while retaining their scenario. Wrapper 1.1.0 preserves observations, fitting/sampling configuration, applied calibration records and the latest three captured scientific result archives. Imported result archives require recomputation before application. Scientific edits use the existing bounded history; update recovery and named states include them. Frozen reports include captured scientific summaries and provenance, with additional source records at Expert depth.

Browser storage is origin-specific. Export and import session JSON to move data between the official hostname and the retained alias. A self-contained standalone-v2.0.0.html provides local operation; archived standalone releases remain available.

## Development and tests

Use Node.js 24 and the dependencies pinned in package-lock.json. Run npm ci, npm run build and npm test. Install Playwright browsers with npx playwright install --with-deps, then run npm run test:browser, npm run test:ui, node test/pwa-browser.mjs and node test/science-browser.mjs for TEST_BROWSER values chromium, firefox and webkit.

Regenerate the portable guide with node scripts/export-guide.mjs after changing guide content. Run node test/live-browser.mjs with DEPLOYMENT_URL for hosted checks. CI discovers the exact Cloudflare preview for a PR and verifies both production hostnames after promotion. Generated test evidence is under test/artifacts and excluded from git.

The Node suite covers retained numerical/state/session behaviour, analytic anchors, deterministic builds, scientific input validation, synthetic recovery, held-out exclusion, joint sampling, cancellation, censorship and empirical-summary provenance. Browser gates cover existing workflows, interface accessibility, offline/update lifecycle and scientific workflows in three engines. See [docs/V2.0-DESIGN.md](docs/V2.0-DESIGN.md) and [docs/RELEASE-VERIFICATION.md](docs/RELEASE-VERIFICATION.md).

## Source and delivery

src/legacy retains the recovered interface/runtime and calculation kernel. src/session provides chronology, history and persistence. src/science contains the versioned scientific document, observations, fitting, sampling, benchmark/evidence data, report projection and worker. src/ui retains the unified shell and adds scientific views. build.mjs embeds the application, kernel and scientific worker into deterministic hosted and standalone HTML.

Cloudflare retains the existing GitHub connection, production branch main, blank root, build command exit 0 and output public. Generated public files are committed with each release. A release branch supplies a preview; merging the verified PR updates both configured production hostnames. The pages.dev address remains independently accessible. DNS, registration and Worker routes are unchanged.

Settings > Interaction > Check for update discovers a waiting release. Save session and update writes a valid recoverable document before activation. Production verification checks manifest identity, exact hosted/standalone/worker bytes and real service-worker-controlled browser reloads. Reverting the release merge restores the previous committed delivery through the same Pages project.
