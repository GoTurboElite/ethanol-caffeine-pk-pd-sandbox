# v1.60 release verification

Verification date: 2026-10-27. Application 1.6.0 retains engine 0.4.4, constants 0.3.0, scenario schema 0.8.2 and session wrapper 1.0.0. The release adds an interface/accessibility overhaul and independent reading preferences.

## Numerical, state and build checks

| Suite | Checks |
| --- | ---: |
| Session, chronology, history, storage and import validation | 17 |
| Interface preferences, units and v1.5 trajectory compatibility | 8 |
| Numerical regression scenarios | 19 |
| Canonical store, snapshot and asynchronous state transitions | 10 |
| Release identity, deterministic build and schema compatibility | 4 |
| Embedded model diagnostics | 104 |
| Total | 162 |

These checks pass on the release candidate. Compatibility fixtures compare complete analysis trajectories, peak values/times and threshold outcomes with the retained v1.5 standalone implementation for zero-input, coffee and repeated mixed schedules. The build checks normalized source identity and deterministic hosted/standalone bytes. The calculation kernel and scientific defaults are unchanged.

## Browser release gates

The original 17 mounted workflow groups remain in Chromium, Firefox and WebKit, with strict native attachment downloads in CI. They cover guides, numerical anchors, fixed model zero, grouped events, undo/redo, clock-change ambiguity, markers, named states, captured comparisons, session round-trips, legacy imports, reports, counterfactuals, recovery, responsive layouts, offline reload, diagnostics and worker fallback.

The added interface suite has 12 workflow groups: initial analysis and landmarks; first-field dialog focus and undo; search and invalid/valid parameter edits; independence of preferences and scientific state; BAC units and portable interface profiles; light/dark/system appearance and retained palette options across retained and new views; reset and direct bookmarks; remembered panels; keyboard search/Escape focus; automated accessibility scans at three scientific depths; responsive/large-text layouts; and unhandled errors.

Automated accessibility scans use axe with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags on the sampled analysis, settings and retained input states. Tests sample widths from 320 to 1440 pixels. CI retains JSON results and desktop/mobile screenshots as job artifacts. A first-run 320-pixel toolbar overflow was identified and corrected before promotion.

Five additional lifecycle groups verify redirected cached navigation and cache-read failure recovery as well as standalone calculation without service-worker registration, waiting-update recovery/restoration and interrupted installation preserving an existing offline cache. The outage fixture stops the origin and confirms that an uncached context cannot connect before reloading the cached application.

Current three-engine outcomes and any candidate corrections are recorded on [pull request #3](https://github.com/GoTurboElite/ethanol-caffeine-pk-pd-sandbox/pull/3). Production promotion requires these gates to pass.

## Execution limits

Local Playwright browser downloads were unavailable in the restricted implementation environment. Browser-engine verification therefore runs in GitHub Actions; visual interaction checks use the Cloudflare preview. The cloud browser harness blocked the preview's update activation, so that particular interaction is verified by the independent automated lifecycle suite.

Physical iPhone/iPad installation, screen-reader task testing, browser zoom with assistive technology and observed use by target experts have not been completed. Automated rule scans do not establish full WCAG conformance or measured reductions in cognitive effort.

## Reproduction and deployment

Run npm ci, npm run build and npm test with Node.js 24. Install Playwright browsers, then run npm run test:browser, npm run test:ui and node test/pwa-browser.mjs and node test/live-browser.mjs (with DEPLOYMENT_URL set) for each TEST_BROWSER value chromium, firefox and webkit. CI leaves ALLOW_BLOCKED_DOWNLOADS unset. Generated evidence is under test/artifacts and excluded from git.

Cloudflare retains its existing GitHub connection: main, blank root, exit 0 build command, public output. public/build.json contains versions, source fingerprint and hosted/standalone SHA-256 values. The branch preview is https://release-v1-6-0.ethanol-caffeine-pk-pd-sandbox.pages.dev/.

After the verified pull request is merged, main-branch CI runs scripts/verify-deployment.mjs. It checks the production manifest, exact hosted/standalone HTML bytes and exact service-worker bytes against the checked commit, retrying briefly for Pages propagation. The emitted verification record and Cloudflare deployment check identify the promoted release. Cached clients can use Settings → Interaction → Check for update, then Save session and update.

## Cached-navigation correction

Chrome could load the deployed application with service-worker network bypass enabled, but a controlled reload failed with net::ERR_FAILED. Cloudflare Pages redirects index.html to the directory URL and other HTML files to extensionless URLs. The worker had cached responses retaining that redirect history. Returning such a response for navigation caused the failure.

The correction creates a fresh Response from redirected cached content before returning it and falls back to the network when cache reads fail. A redirect-aware fixture reproduces the original failure; the corrected worker passes cached reloads. A separate cache-read failure fixture verifies saved-state continuity without deleting browser storage.

Earlier deployment byte checks did not exercise a controlled navigation, and the local fixture served index.html without the Pages redirect. CI now tests the actual Cloudflare preview before promotion and production after promotion in Chromium, Firefox and WebKit, including two controlled reloads and both hosted and standalone HTML aliases. Source fingerprint and deployed byte verification remain required. Calculation and session schemas are unchanged.
