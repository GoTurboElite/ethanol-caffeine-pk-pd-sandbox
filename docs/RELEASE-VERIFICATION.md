# v1.5.0 release verification

Verification date: 2026-10-27. The release retains the 1.0.1 calculation model and adds session, explanation, comparison, reporting, offline delivery and three-level operating guidance.

## Numerical, state and build checks

| Suite | Passed | Failed |
| --- | ---: | ---: |
| Session, chronology, history, storage and import validation | 17 | 0 |
| Numerical regression scenarios | 19 | 0 |
| Canonical store, snapshot and asynchronous state transitions | 10 | 0 |
| Release identity, deterministic build and schema compatibility | 4 | 0 |
| Embedded model diagnostics | 104 | 0 |
| Total | 154 | 0 |

The repeated-exposure fixture retains two vehicle-reference intervals and the final return of approximately 17.860446 h. Worker and main-thread fallback calculations agree in the mounted application. PK equations, constants and defaults are retained from engine 0.4.4.

The deterministic build runs twice and compares bytes. The embedded application identity, source fingerprint and HTML SHA-256 agree with public/build.json. The build contains its calculation kernel, scripts and styles. There is no required CDN script.

## Mounted browser workflows

Chromium passed 17 workflow groups covering workspace mounting, all three guides, a worked example, bulk retiming, immutable model zero, undo/redo, explicit DST overlap selection, analysis markers, named states, captured A/B comparison, portable session round-trip, legacy import, frozen report content, intake-removal comparison, recovery, responsive layout, offline reload, mounted diagnostics and worker fallback.

Responsive checks covered widths of 320, 390, 430, 768, 1024 and 1440 pixels, with no document overflow in the sampled workspaces. Desktop and mobile screenshots were visually inspected. A native-select sizing overflow found in Linux WebKit at 320 pixels was corrected by bounding the collapsed control and preserving the full option text in its menu. The fix was also checked with several font families.

Three additional Chromium lifecycle checks passed: standalone calculation without service-worker registration; waiting-update activation after recovery has been saved, with title and markers restored; and a failed new installation leaving the existing offline cache usable.

## Execution limits and remaining checks

Chromium in the local restricted Windows host cancels native attachment downloads, including a minimal ordinary attachment unrelated to this application. The test-only diagnostic fallback inspected the application's actual JSON and HTML Blob payloads and their dispatched download events. It verified session re-import and report content. This is recorded in the test results and does not establish native disk-transfer success in Chromium on this host. WebKit completed both native exports.

The local Windows Firefox process terminated during headless startup before application navigation. Linux Firefox subsequently passed the mounted workflows and offline/update lifecycle checks. Local WebKit passed all 17 workflow groups and all three lifecycle checks with native downloads. The pinned Playwright WebKit build has a documented [offline-emulation navigation defect](https://github.com/microsoft/playwright/issues/42775). The shared outage harness now stops the origin server, verifies that an uncached context cannot connect, and reloads the controlled application from its cache. This checks cached operation during an actual origin outage across all engines. The three-engine Linux CI configuration runs strict native-download checks without the diagnostic fallback. Current CI outcomes are recorded on [pull request #2](https://github.com/GoTurboElite/ethanol-caffeine-pk-pd-sandbox/pull/2).

A physical iPhone/iPad installation and home-screen relaunch have not been verified. Browser-local storage can be cleared by browser settings or operating-system storage management. The portable session export is the user-controlled recovery artifact.

## Reproduction

Run npm ci, npm run build and npm test with Node.js 24. Install Playwright browsers with npx playwright install --with-deps. Run npm run test:browser and node test/pwa-browser.mjs for each TEST_BROWSER value chromium, firefox and webkit. CI leaves ALLOW_BLOCKED_DOWNLOADS unset.

Generated test output is written under test/artifacts and excluded from git. The in-app guide is the source for docs/HOW_TO_USE.md; regenerate it with node scripts/export-guide.mjs.

## Deployment identity

public/build.json contains application, engine, constants, scenario-schema and session-schema versions, the normalized source fingerprint, and hosted/standalone SHA-256 values. Cloudflare publishes the committed public directory using the existing exit 0 build configuration. The release branch preview is https://release-v1-5-0.ethanol-caffeine-pk-pd-sandbox.pages.dev/. Its served hosted and standalone bytes are checked against the build manifest after deployment.

Production promotion consists of merging the verified release pull request into main. After deployment, compare the served build.json and both HTML hashes against the commit. Keep an exported session when moving between application versions.
