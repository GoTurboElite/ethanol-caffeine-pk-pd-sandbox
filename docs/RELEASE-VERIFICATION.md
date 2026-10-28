# v2.0 release verification

Application 2.0.0 retains PK engine 0.4.4, constants 0.3.0 and scenario schema 0.8.2. Session wrapper 1.1.0 adds the scientific document and result archives. Reference profile reference-1.60 preserves the earlier equations.

## Automated release gates

The retained numerical suite includes complete trajectory compatibility with v1.5, analytic oral-caffeine checks, dense schedules, exact event boundaries, mass conservation, convergence, multiple threshold episodes and right-censored returns. State/session checks cover accepted-result identity, supersession, recovery, clock changes, history and legacy imports. New checks cover schema-1.0 migration, undoable scientific edits, atomic invalid imports and archived results requiring recomputation.

The scientific suite verifies CSV units/times/matrices, held-out exclusion, explicit upper-limit penalties, caffeine and ethanol parameter recovery on synthetic data, inactive parameters, deterministic sampling, paired results, dependence/bounds, censored outcomes, cancellation, work limits and published-summary provenance. Synthetic recovery tests establish the tested algorithmic properties.

Browser verification runs Chromium, Firefox and WebKit. Existing mounted workflows, accessibility/responsive checks and five offline lifecycle groups remain required. Scientific browser workflows cover real-worker fitting, calibration application and Undo, seeded sampling/plots, session/recovery archives, benchmarks, evidence search, atomic CSV errors, 320-pixel containment, sampled accessibility scans, cooperative fallback and cancellation.

Hosted checks test the exact Cloudflare preview before promotion and both production hostnames after promotion. They require a matching fingerprint, worker control, two successful cached reloads, hosted and standalone aliases, and absence of page/request failures. Byte verification compares hosted HTML, standalone HTML and the service worker against the checked release on each production hostname.

Machine-readable results and screenshots are generated under test/artifacts and attached to CI jobs. The release PR and completed main-branch workflow provide final measured counts and deployment evidence. Local Chromium scientific workflows and sampled accessibility checks passed before preview promotion.

## Scientific interpretation limits

The empirical built-in corpus contains four group-level Cmax summaries from two studies, with explicit reconstruction assumptions. The mean +/- 2 SD screen is a descriptive summary-discrepancy criterion. It establishes neither individual predictive accuracy nor full concentration-time validation. The fed-elimination hypothesis worsens the standardized fed Cmax discrepancy and remains a benchmark-only comparator. User measurements can be assigned a separate evaluation role for trajectory errors.

Sampling intervals are conditional on the supplied parameter distributions and latent dependence. Calibration error scales, matrix factors and objective-support assumptions are exported. Physical-device installation, screen-reader task sessions and observed cognitive-load improvements require separate evaluation. Automated rule scans provide sampled accessibility evidence.

## Deployment contract

The project retains production branch main, blank root directory, exit 0 build command and public output. pkpd.goturbo.one is the official hostname; the pages.dev alias remains accessible. Domain registration, nameservers, routes and custom-domain configuration are unchanged by this release. A revert of the release merge restores previous committed output through the same connection.
