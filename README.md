# Ethanol + Caffeine PK/PD Sandbox 1.60

A browser application for constructing exposure schedules, inspecting the retained PK/PD model, comparing captured analytical states and exporting reproducible sessions and reports.

Production: https://ethanol-caffeine-pk-pd-sandbox.pages.dev/

## Using the application

The application opens **Analysis → Overview** with aligned BAC and caffeine plots, one inspection time and a compact summary of the reference person and intakes. Choose **+ Add intake** for direct amounts per serving. **Session → Inputs** retains the complete beverage, physiology and preset editors; **Session → Schedule** contains calendar and grouped event operations.

The main workspaces are **Session**, **Analysis**, **Compare** and **Saved sessions**. **Find control** searches tasks and parameters; Ctrl+K or Command+K opens it. **Report**, **Export**, **Help** and **Settings** are always in the toolbar. The footer opens model sources and release identity.

Open **Help** for Default, Detailed or Expert instructions. Each step states an action, expected result and check. The help level is independent of scientific depth. The portable copy is [docs/HOW_TO_USE.md](docs/HOW_TO_USE.md).

## What 1.60 changes

The unified shell removes duplicate headers, navigation and current-result announcements. Default analysis uses separate concentration scales, stable solid/dashed trace identities, shared event positions and a single inspection control. Optional context and threshold tables are disclosed on demand. Scientific depth exposes additional analytical material independently of explanation support and reading density.

**Settings** separates Reading, Appearance, Interaction, Units and Profiles. Reading supports concise, expanded or step-by-step explanations, comfortable or compact spacing, three text sizes, relaxed line spacing and Focus layout. Appearance controls theme, contrast, trace palette and plot layout. Motion follows the device or can be reduced explicitly. Profiles can be exported, imported and reset without changing analytical inputs. Standard and Focus layouts remember optional panel states separately.

The parameter index accepts names, field paths, abbreviations and units. Selecting a result opens its committed value, unit and validation limits. Direct intake, person/horizon and parameter dialogs validate before committing and create an undoable edit. Previous accepted calculations remain labelled while changes await recalculation. BAC units are converted consistently in the added interactive analysis views; exports and reports explicitly declare canonical units.

The release retains v1.5 chronology, time-zone and clock-change resolution, analysis markers, bounded history, named states, opt-in recovery, session JSON, legacy import, captured A/B comparison, intake-removal analysis, reports, offline caching and the standalone HTML build. Reports now use aligned separate concentration plots as well.

See [docs/V1.60-DESIGN.md](docs/V1.60-DESIGN.md) for the implemented scope and [docs/RELEASE-VERIFICATION.md](docs/RELEASE-VERIFICATION.md) for measured validation and its limits.

## Model identity and compatibility

Application **1.6.0**, displayed as **1.60**, retains engine **0.4.4**, constants **0.3.0**, scenario schema **0.8.2** and session wrapper schema **1.0.0**. PK equations, scientific defaults and coefficient values are retained. Numerical compatibility fixtures compare the complete accepted trajectories and threshold outcomes against the archived v1.5 standalone build.

The interface-profile schema is separate: `pkpd-interface-profile`, version **1.0.0**. Existing v1.5 sessions and legacy scenarios use their existing import paths. Browser-local saved states and recovery remain specific to the origin, browser and device. Export session JSON for a portable copy.

Scientific fitting, empirical benchmark expansion, individualized calibration, new uncertainty models and additional substances remain future scientific release work.

## Development and verification

Use Node.js 24 and the pinned dependencies in package-lock.json.

    npm ci
    npm run build
    npm test
    npx playwright install --with-deps
    npm run test:browser
    npm run test:ui
    node test/pwa-browser.mjs
    npm run preview

The local preview is http://127.0.0.1:8765/. Set `TEST_BROWSER` to `chromium`, `firefox` or `webkit` for browser checks. The original mounted workflow suite verifies native downloads. `ALLOW_BLOCKED_DOWNLOADS=1` is a diagnostic fallback for restricted local hosts; CI leaves it unset.

Regenerate the guide with `node scripts/export-guide.mjs` after changing `src/content/guide.mjs`. CI verifies deterministic committed output, numerical/state/session/release tests, mounted workflows, keyboard/accessibility/responsive checks and offline/update recovery in all three browser engines. Automated accessibility checks are one part of verification; physical-device and assistive-technology testing remain distinct checks.

## Source layout

| Path | Purpose |
| --- | --- |
| src/legacy | Recovered 1.0.1 interface, styles and unchanged calculation kernel |
| src/session | Chronology, history, persistence, comparison, interface profiles and offline lifecycle |
| src/ui | Unified shell, analytical views, dialogs, plots, preferences and reports |
| src/content | Three-level operating guide and release history |
| src/bridge.js | Integration with the retained store and simulation runtime |
| build.mjs | Deterministic hosted and standalone generation |
| public | Committed Cloudflare Pages output |
| test | Numerical, state, compatibility, mounted workflow and accessibility verification |

The guarded build fails when an integration seam is missing. The legacy component remains mounted to preserve its calculation and worker lifecycle. New views reuse the embedded React runtime, canonical store and simulation runtime. Scripts, styles and the calculation kernel are embedded without a required CDN request. The normalized source fingerprint covers all src files; public/build.json records hosted and standalone SHA-256 values.

## Deployment and updates

The existing Cloudflare Pages project uses production branch **main**, a blank root directory, build command **exit 0** and output directory **public**. Releases therefore include regenerated and verified public output. A release-branch push provides a Cloudflare preview; merging the verified pull request into main replaces production.

An existing cached application can check for an update through **Settings → Interaction → Check for update** and choose **Save session and update**. Update activation writes a recoverable valid document before reloading. A portable session export remains available independently.

Verify production build.json, hosted HTML and standalone HTML against the checked commit. `node scripts/verify-deployment.mjs` performs those checks over HTTPS; main-branch CI repeats them after the build/browser gates. Reverting the release merge commit restores prior committed output through the same Pages connection.
