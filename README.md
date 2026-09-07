# Ethanol + Caffeine PK/PD Sandbox

A self-contained, non-commercial educational and analytical sandbox for exploring modelled ethanol and caffeine pharmacokinetics, pharmacodynamic proxies, parameter sensitivity, behavioural-state heuristics, and scenario comparison.

The application runs entirely in the browser as a static HTML document. Calculations, scenario handling, behavioural interpretation, comparison workflows, and exports are performed locally without a server-side computational backend.

## Current release

**v1.0.0 -- Stable**

Version 1.0 establishes the first stable standalone release contract following the v0.x development series. The numerical and behavioural engines, scenario schema, model constants, provenance registries, persistence layer, comparison architecture, and export pipeline are independently versioned within the application.

The stable release is distributed as a single self-contained HTML artifact:

```text
index-v1.0.0.html
```

A SHA-256 checksum and release-verification record accompany the frozen release artifact.

## Purpose

The sandbox is designed for education, mechanistic exploration, hypothesis generation, model inspection, parameter sensitivity analysis, and comparison of hypothetical exposure scenarios.

It models ethanol and caffeine trajectories from user-supplied scenario parameters using literature-derived population parameters, explicit engineering assumptions, and locally defined heuristic transformations.

Outputs include pharmacokinetic trajectories, pharmacodynamic proxy indices, dose accounting, concentration thresholds, sensitivity analyses, comparison views, and optional behavioural-state interpretations.

## Scope and intended use

Ethanol + Caffeine PK/PD Sandbox is a non-commercial educational and analytical tool.

Outputs are simulated estimates. They do not constitute measurements of an individual’s blood ethanol concentration, caffeine concentration, physiological state, cognitive performance, behavioural state, or degree of impairment.

The software is not intended for diagnosis, clinical management, legal determination of blood alcohol concentration, determination of actual intoxication, or assessment of fitness to drive, operate machinery, or undertake another safety-critical activity.

Behavioural and temperament outputs are exploratory model constructs. They are non-diagnostic and do not predict individual clinical outcomes or harmful conduct.

A modelled BAC threshold crossing represents a numerical property of the simulated trajectory. It does not establish physiological recovery or fitness for a safety-critical activity.

## Model architecture

The application combines ethanol and caffeine pharmacokinetic modelling with derived pharmacodynamic and behavioural-state layers.

Ethanol modelling includes configurable distribution assumptions, gastric and intestinal absorption, first-pass handling, food-state effects, zero-order or Michaelis–Menten elimination, dose accounting, body-composition-sensitive distribution modes, historical exposure states, and parameter sensitivity analysis.

Caffeine modelling includes absorption, effective or reference half-life formulations, CYP1A2-related parameterisation, paraxanthine approximation, and optional ethanol-linked clearance interaction.

The behavioural layer operates downstream of the PK/PD state. It represents functional reliability, activation, self-calibration, continuation pressure, protective regulation, social expression, affective volatility, and related dimensions through bounded heuristic transformations with explicit provenance and versioning.

Caffeine-linked activation is represented independently from ethanol-linked impairment; alertness does not imply restored functional competence.

## Scenario analysis

The application supports single-scenario analysis, A/B comparison, parameter refinement, sensitivity envelopes, configurable simulation horizons, initial conditions, meal events, repeated or temporally distributed doses, and optional temperament/context inputs.

Scenario state can be exported and re-imported using the application’s versioned JSON schema.

Generated numerical and behavioural outputs can also be exported for further inspection.

## Local-first execution

The application is designed to operate without a computational backend.

Model execution occurs locally in the browser, including the off-main-thread numerical execution path where supported. Scenario data, autosave state, interface preferences, and related persistence remain within browser-local storage unless the user explicitly exports them.

The standalone HTML artifact can also be retained locally for offline use.

## Running locally

No build process or package installation is required for the stable standalone artifact.

Open:

```text
index-v1.0.0.html
```

directly in a modern browser.

For HTTP-origin testing or local development, the directory can also be served using any static web server. For example:

```bash
python -m http.server 8000
```

and opened through:

```text
http://localhost:8000/
```

## Browser support

The application targets current standards-compliant desktop and mobile browsers.

The v1.0.0 release has been qualified against Chromium across desktop, responsive, worker, persistence, comparison, export, numerical-equivalence, and embedded-regression workflows. Firefox and Safari/WebKit remain part of deployment-origin qualification.

## Release verification

The v1.0.0 artifact passed the embedded regression suite, worker/fallback parity checks, cancellation and request-deduplication checks, numerical-integrity tests, responsive-layout qualification, and direct numerical-equivalence testing against the frozen v0.9.1 baseline.

The v0.9.1 → v1.0.0 release transition intentionally preserves the established numerical and behavioural engines. Release-surface changes concern stable-version promotion, intended-use communication, deployment semantics, and BAC reference-threshold terminology.

The release checksum is distributed separately as:

```text
index-v1.0.0.html.sha256
```

The corresponding verification record is distributed as:

```text
v1.0.0-release-verification.txt
```

## Versioning

The public application follows semantic versioning from v1.0.0 onward.

`1.0.x` releases are reserved for compatible defect corrections and narrowly scoped hardening.

`1.x.0` releases may introduce additive functionality while preserving the stable application contract.

Major-version changes are reserved for materially incompatible changes to architecture, schemas, model contracts, or application behaviour.

Internal model components retain independent version identifiers so application releases do not imply simultaneous revisions of every scientific or behavioural subsystem.

## Deployment

The canonical deployment target is a top-level static web origin.

Embedding the application inside nested site containers is intentionally avoided because the interface relies on direct access to the browser viewport for responsive layout, sticky and fixed positioning, modal geometry, charts, mobile navigation, and container-query behaviour.

The standalone versioned HTML artifact remains the authoritative immutable release representation.

## Privacy

The stable application contains no requirement for user accounts, remote calculation services, or server-side storage of scenario inputs.

Local browser persistence is optional and is confined to the browser environment. Exported scenario or result files are created only through explicit user actions.

## Repository status

**Stable release: v1.0.0**

Further development should occur on subsequent version branches or preview deployments while the tagged v1.0.0 release artifact remains immutable.
