# Ethanol + Caffeine PK/PD Sandbox 1.5.0

A browser application for constructing exposure schedules, inspecting the retained PK/PD model, comparing explicit analytical states and exporting reproducible sessions and reports.

Production: https://ethanol-caffeine-pk-pd-sandbox.pages.dev/

## Using the application

Open **How to use** in the main navigation. Choose **Default**, **Detailed** or **Expert** to read the operating sequence at that scope. Every walkthrough step gives an action, an expected result and a check. The guide selector and application detail selector can be changed independently. Three worked examples cover coffee absorption, repeated ethanol episodes and overnight calendar inspection.

The same guide is available in [docs/HOW_TO_USE.md](docs/HOW_TO_USE.md). It includes calendar and daylight-saving instructions, units, snapshot interpretation, saving, comparison, reporting, installation, glossary and troubleshooting.

## What 1.5 adds

The Session workspace combines intakes, meals, analysis markers, model-zero chronology and calendar display. Explicit IANA time-zone resolution handles ambiguous clock times and rejected clock-change gaps. Editing an intake preserves model zero. Reanchoring explicitly chooses whether elapsed offsets or absolute event instants are preserved.

Shared editing history supports 60 committed states, undo, redo and history restoration across the original calculator and the added workspaces. Saved states, opt-in browser recovery, portable session JSON and legacy scenario import preserve editable input states. Recovery retains the latest valid committed document; portable session files include bounded editing history. Browser storage is specific to the current origin, browser and device.

Explain shows accepted compartment amounts, local rate estimates and defined functional indices. Intake-removal counterfactuals run through the existing calculation runtime. Compare captures A and B inputs, displays changed fields and behavioural profiles, and reports accepted deltas, threshold intervals and calendar identities. Refresh B explicitly copies subsequent working edits. Comparison aligns elapsed hours from each scenario's model zero.

Reports freeze the accepted numerical state, chronology, markers and any accepted comparison into a self-contained printable HTML document. Default, Detailed and Expert report depths control the included material. Expert depth retains the complete constants and input state.

Hosted delivery includes an offline cache, installation support where exposed by the browser, a waiting-update action and recovery before activation. Standalone delivery is one HTML file with embedded JavaScript, CSS and calculation kernel. The archived original release remains available in the repository and hosted archive path.

## Model identity

Application 1.5.0 retains engine **0.4.4**, constants **0.3.0**, scenario schema **0.8.2** and the retained behavioural model. The new session wrapper schema is **1.0.0**. PK equations, defaults and parameter values remain those shipped in 1.0.1. Flux displays are local finite-difference estimates derived from the accepted dense trajectory. Functional and behavioural indices retain their defined heuristic meanings, including the retained zero-valued no-exposure encoding.

The original Expert and About workspaces retain model sources, assumptions, diagnostics and coefficient provenance. This release adds no sleep prediction, individualized calibration, measured-data fitting or new substance model.

## Development and verification

Use Node.js 24 and npm. Dependencies are pinned in package-lock.json.

    npm ci
    npm run build
    npm test
    npx playwright install --with-deps
    npm run test:browser
    node test/pwa-browser.mjs
    npm run preview

The local preview URL is http://127.0.0.1:8765/. To select another Playwright engine, set TEST_BROWSER to firefox or webkit. The default is chromium. The test harness requires successful native downloads. An explicit ALLOW_BLOCKED_DOWNLOADS=1 diagnostic setting permits payload verification in constrained hosts and records the limitation in its results; CI leaves that setting unset.

Regenerate the portable guide with node scripts/export-guide.mjs after changing the in-app guide. CI runs the deterministic build, numerical/state/release suites and all three browser engines. Committed public outputs must exactly match a clean build.

## Source layout

| Path | Purpose |
| --- | --- |
| src/legacy | Recovered 1.0.1 interface, styles and calculation kernel |
| src/session | Calendar, history, persistence, comparison controller and offline lifecycle |
| src/ui | Added React workspaces and report generator |
| src/content | Three-level operating guide |
| src/bridge.js | Guarded integration with the original store and simulation runtime |
| build.mjs | Deterministic hosted and standalone generation |
| public | Committed Cloudflare Pages output |
| test | Numerical regressions, state tests and mounted browser workflows |

The build patches explicit integration seams and fails when a required seam is absent. It reuses the embedded React runtime and the existing simulation runtime. No CDN request or server-side calculation is required. The source fingerprint normalizes text line endings and includes all src files; public/build.json records both HTML SHA-256 values.

## Deployment

The existing Cloudflare Pages project remains connected to this repository. Production branch is main, root directory is blank, build command is exit 0 and output directory is public. Because this deployment publishes committed output directly, every release must include a freshly generated public directory.

Review the release branch and passing checks, inspect its Cloudflare branch preview, then merge its pull request into main to replace production. Confirm public/build.json appVersion and both served HTML hashes after deployment. Users with a previously cached release can choose Check for update, then Save session and update.

Reverting the release commit on main restores the prior hosted output. The service worker remains reachable at the same path; test rollback on the preview origin and retain an exported session before moving between releases with different session support.

See [docs/RELEASE-VERIFICATION.md](docs/RELEASE-VERIFICATION.md) for measured checks and execution limits.
