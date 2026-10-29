# Ethanol + Caffeine PK/PD Sandbox 2.1.1

Official public application: https://pkpd.goturbo.one/

Retained deployment alias: https://ethanol-caffeine-pk-pd-sandbox.pages.dev/

Version 2.1 consolidates scenario construction, concentration inspection and scientific task navigation around the retained v2.0 workbench. Fresh launches open Session → Inputs with the original BAC rings and input graph. Default, Detailed and Expert remain the three scientific-depth settings, independent of reading and accessibility preferences.

## v2.1.1 integrity and workflow refinement

Accepted-result context identifies captured inputs separately from the committed editing draft; inspection uses the accepted horizon. Bulk CSV import requires validation, review and explicit replacement confirmation. The review reports roles, analytes, times, matrices, error assumptions, censoring and conversion provenance. Clear/synthetic replacement actions identify the entire affected dataset and preserve Undo.

Scientific document schema 1.1.0 adds validated observation-level conversionSource and dataset-level legacyConversionNotes. Existing scientific documents migrate without changing their numerical measurements or model inputs. Recognised generated conversion lines are preserved as historical notes, with matching active assumptions copied to their row. The session wrapper remains 1.1.0; engine 0.4.4, constants 0.3.0, scenario schema 0.8.2 and workbench algorithms 1.0.0 are unchanged. See [docs/V2.1.1-DESIGN.md](docs/V2.1.1-DESIGN.md).

## UX consolidation

Analysis provides keyboard/pointer inspection, shared cursor values, direct peaks and explicitly labelled overlay scales. A compact scenario/action region precedes graphs on mobile/tablet. Input context exposes accepted half-life and horizon values, contextual parameter editing and routes to deeper analysis. Scientific navigation, search and dataset-role counts connect Observations with Evaluation, Calibration, Uncertainty and Evidence. Structured observation add/edit/remove uses the existing scientific schema, error semantics, validation and Undo; CSV remains the bulk path. Ring normalisation and heuristic interpretation are explained contextually.

See [docs/V2.1-DESIGN.md](docs/V2.1-DESIGN.md) for the audit, implementation decisions, verification scope and prioritised follow-up backlog.

## Scientific workbench

Session > Observations accepts structured rows and imports bulk concentration measurements from CSV with elapsed or absolute timestamps, analyte, units, matrix, dataset role, optional measurement SD and censoring qualifier. Supported alternative matrices require an explicit conversion factor. Data remain local to the browser and portable session files.

Analysis > Scientific workbench provides Evaluation, Calibration, Uncertainty and Evidence. Evaluation separates calibration and held-out rows and reports canonical-unit bias, MAE and RMSE. The built-in published corpus contains four group-level Cmax summaries from two studies. It reports cohort reconstruction assumptions and descriptive discrepancies. Individual predictive validity and full empirical trajectory validation remain unevaluated by that summary corpus.

Calibration uses bounded weighted least squares for one or two registered parameters. It reports local sensitivity dependence, parameter-bound contact, objective support and error assumptions. Application requires a current, locally identifiable interior solution. Fitted values are applied in one undoable edit with a named record. Upper limits use an explicitly stated one-sided squared penalty. Coarse one-parameter profile support is emitted only with quantified rows and supplied SDs.

Uncertainty uses a reproducible 32-bit seed, 16-256 parameter draws, uniform/triangular/truncated-lognormal distributions and a positive-definite Gaussian-copula dependence matrix. Paired A/B sampling shares absolute draws for equal parameter baselines and horizons. P05/P50/P95 quantiles, conditional threshold fractions and unresolved final returns retain their defined sampling semantics. Work budgets bound computation, workers support cancellation, and a cooperative fallback remains available.

Evidence exposes the existing 39-entry source registry, parameter derivations and population/model limits. The fed-elimination benchmark comparator is an explicit 1.39-fold hypothesis and changes no main-scenario defaults. The standardized ethanol benchmark scenarios underpredict reported peaks; increasing fed elimination lowers that benchmark prediction further. The reference equations are retained.

Help provides action/result/check walkthroughs at Default, Detailed and Expert levels. The portable guide is [docs/HOW_TO_USE.md](docs/HOW_TO_USE.md).

## Reproducibility and compatibility

Application 2.1.1 uses reference profile reference-1.60, PK engine 0.4.4, constants 0.3.0, scenario schema 0.8.2, session wrapper 1.1.0, scientific workbench algorithms 1.0.0, scientific document schema 1.1.0 and evidence revision 2026-10-28.1. Scientific and behavioural component identities remain independent.

Session wrapper 1.0.0 and legacy scenarios remain importable. Earlier documents receive empty scientific defaults while retaining their scenario. Wrapper 1.1.0 preserves observations, fitting/sampling configuration, applied calibration records and the latest three captured scientific result archives. Imported result archives require recomputation before application. Scientific edits use the existing bounded history; update recovery and named states include them. Frozen reports include captured scientific summaries and provenance, with additional source records at Expert depth.

Browser storage is origin-specific. Export and import session JSON to move data between the official hostname and the retained alias. A self-contained standalone-v2.1.0.html provides local operation; archived standalone releases remain available.

## Development and tests

Use Node.js 24 and the dependencies pinned in package-lock.json. Run npm ci, npm run build and npm test. Install Playwright browsers with npx playwright install --with-deps, then run npm run test:browser, npm run test:ui, node test/pwa-browser.mjs node test/science-browser.mjs and node test/ux-browser.mjs for TEST_BROWSER values chromium, firefox and webkit.

Regenerate the portable guide with node scripts/export-guide.mjs after changing guide content. Run node test/live-browser.mjs with DEPLOYMENT_URL for hosted checks. CI discovers the exact Cloudflare preview for a PR and verifies both production hostnames after promotion. Generated test evidence is under test/artifacts and excluded from git.

The Node suite covers retained numerical/state/session behaviour, analytic anchors, deterministic builds, scientific input validation, synthetic recovery, held-out exclusion, joint sampling, cancellation, censorship and empirical-summary provenance. Browser gates cover existing workflows, interface accessibility, offline/update lifecycle and scientific workflows in three engines. See [docs/V2.0-DESIGN.md](docs/V2.0-DESIGN.md) and [docs/RELEASE-VERIFICATION.md](docs/RELEASE-VERIFICATION.md).

## Source and delivery

src/legacy retains the recovered interface/runtime and calculation kernel. src/session provides chronology, history and persistence. src/science contains the versioned scientific document, observations, fitting, sampling, benchmark/evidence data, report projection and worker. src/ui retains the unified shell and adds scientific views. build.mjs embeds the application, kernel and scientific worker into deterministic hosted and standalone HTML.

Cloudflare retains the existing GitHub connection, production branch main, blank root, build command exit 0 and output public. Generated public files are committed with each release. A release branch supplies a preview; merging the verified PR updates both configured production hostnames. The pages.dev address remains independently accessible. DNS, registration and Worker routes are unchanged.

Settings > Interaction > Check for update discovers a waiting release. Save session and update writes a valid recoverable document before activation. Production verification checks manifest identity, exact hosted/standalone/worker bytes and real service-worker-controlled browser reloads. Reverting the release merge restores the previous committed delivery through the same Pages project.
