# How to use v1.60

This is the portable copy of the instructions included in How to use inside the application. The guide level can be selected independently of the interface detail level.

## Default

Use this level for intake entry, the concentration timeline, selected-time inspection and saving. The model calculates the same trajectories at every detail level.

### Orient the interface before editing

#### 1. Choose the working area

Action. Use Session for complete input entry and scheduling; Analysis for plots, explanations and diagnostics; Compare for captured A/B states; Saved sessions for files and recovery.

Expected result. The selected workspace and its secondary views stay visible above the content.

Check. Report, Export, Help and Settings are always available in the top toolbar.

#### 2. Choose analytical depth independently

Action. Use Scientific depth above the workspace. Choose Default, Detailed or Expert according to the controls you need.

Expected result. The numerical model and entered scenario are retained.

Check. An experienced user can choose Expert and retain comfortable spacing and concise explanations.

#### 3. Set reading support

Action. Choose Settings → Reading. Select Explanation support, Spacing, Text size and Line spacing. Choose Done to close the dialog.

Expected result. The interface previews each selection immediately.

Check. These preferences apply to the interface. They do not edit physiological assumptions or intake amounts.

#### 4. Reduce optional context

Action. Choose Settings → Reading and enable Focus layout. Open an optional panel when needed. To return, disable Focus layout or reset remembered panels under Profiles.

Expected result. Optional panels begin collapsed. Errors, calculation status, units and horizon information remain available.

Check. Collapsed panels retain their headings. Standard and Focus layouts remember their open panels separately.

#### 5. Find an exact control

Action. Choose Find control, or press Ctrl+K on Windows/Linux or Command+K on macOS. Type a task, parameter name or unit. Select a result.

Expected result. A task opens its workspace; a parameter opens its value, units, applicability and supported range.

Check. A parameter change is applied only after validation and becomes one Undo operation. Escape closes the dialog.

#### 6. Keep a reading profile

Action. Choose Settings → Profiles → Export interface profile. Import that JSON later with Import interface profile.

Expected result. The profile preserves reading, appearance, interaction and unit preferences, plus scientific depth.

Check. Session JSON stores analytical inputs and history separately. Restore interface defaults preserves the working scenario.

### First complete calculation

#### 1. Open Session inputs

Action. Choose Session, then Inputs. Set Scientific depth to Default.

Expected result. The person and intake controls are visible.

Check. Scientific depth changes analytical controls. Explanation support and spacing are separate settings.

#### 2. Set the person

Action. For body mass and horizon, choose Analysis, then Edit person. Enter kilograms and hours, then choose Apply person and horizon. For physiology and composition, use Full person editor and finish its input controls.

Expected result. The person summary reflects your committed values.

Check. Use measured values where available. An empty optional composition field leaves the selected fallback model active.

#### 3. Define an intake

Action. Choose Analysis, then + Add intake. Enter a label, ethanol grams per serving, caffeine milligrams per serving and the number of servings. For beverage-volume recipes or presets, choose Full intake editor.

Expected result. The intake appears in the intake list.

Check. Ethanol is recorded as grams; caffeine is recorded as milligrams. Presets convert their volume and composition into those amounts.

#### 4. Set its start

Action. Enter the start relative to model zero, or use the clock entry controls. In Session, the anchor is the absolute instant corresponding to +0 h.

Expected result. The event is placed at its intended position on the timeline.

Check. A start of +2 h is two elapsed hours after model zero. A negative start represents historical intake before model zero.

#### 5. Set its duration

Action. Enter the number of minutes over which the amount is consumed. Use zero only for an instantaneous modelled administration.

Expected result. The timeline displays the full administration interval.

Check. The quick editor multiplies per-serving amounts by Number of servings. A 60-minute duration distributes that event total over one hour.

#### 6. Add the remaining events

Action. Repeat intake entry for each distinct consumption period. Review servings, amounts, start times and durations.

Expected result. The list contains the complete schedule you intend to calculate.

Check. Events after the configured horizon require an extended horizon to be observed.

#### 7. Wait for a current result

Action. Automatic recalculation is enabled by default. If you have disabled it, use Update calculation. Wait until the result status is Current calculation.

Expected result. The accepted snapshot matches the committed inputs.

Check. A previous-result or pending label means that a displayed result belongs to an earlier input state.

#### 8. Open Session

Action. Choose Session, then Schedule. Expand Calendar anchor. Read the model-zero anchor and time zone. The observation horizon is available through Analysis → Edit person.

Expected result. Intakes, curves and threshold intervals share one elapsed-time axis.

Check. The wall-clock labels derive from the saved anchor and time zone.

#### 9. Inspect one time

Action. Move Inspection time or enter an elapsed hour value inside the horizon.

Expected result. The inspection line and selected-time concentrations move together.

Check. The current-time marker is a separate clock reference. It may fall outside this hypothetical scenario.

#### 10. Read the units

Action. Choose Analysis → Overview. Read BAC and caffeine in the units written beside each plot. Read the selected-time value above each plot and the whole-session peak below it. To change BAC units, choose Settings → Units.

Expected result. You can identify the concentration at the selected time and the maximum across the full horizon.

Check. A peak time and a selected time refer to different questions.

#### 11. Read repeated exposure

Action. Under the concentration plots, expand Threshold intervals and horizon coverage. Read every interval and its final return with the schedule and horizon labels.

Expected result. Later re-exposure remains visible.

Check. An interval open at the horizon has no observed final return within this calculation.

#### 12. Save a portable copy

Action. Open Saved sessions. Enter a name and choose Save named state. Choose Export session JSON to retain an external copy.

Expected result. The named state appears in the list and the JSON file downloads.

Check. Browser-local saved states belong to this browser and origin. A downloaded session file can be imported elsewhere.

### Recovery and reopening

#### 1. Enable session recovery

Action. Open Saved sessions and enable Session recovery. Wait for the Saved status.

Expected result. A recoverable copy is stored after valid committed edits.

Check. Recovery waits while an input is incomplete or invalid. The status describes the last completed write.

#### 2. Restore deliberately

Action. After reopening, inspect the recovery timestamp and choose Restore recovery copy when that is the state you want.

Expected result. The saved input state is restored and recalculated.

Check. Restoration is an undoable operation. Export the current state first if you want an additional portable copy.

#### 3. Undo an edit

Action. Choose Undo after a committed scenario edit. Use Redo to return to the subsequent state.

Expected result. The document and its chronology return together.

Check. History covers committed values. Finish or correct incomplete text entry before using history.

#### 4. Create an analysis marker

Action. Choose Session → Schedule, then expand Analysis markers. Enter a label, a kind and an elapsed time; choose Add marker.

Expected result. A marker appears on the timeline with modelled concentrations.

Check. Bedtime and waking markers inspect concentration. They do not calculate sleep architecture.

## Detailed

Use this level for meal and physiology assumptions, compartment interpretation, selected-time rates, repeated episodes and comparisons. Begin with the Default walkthrough when entering the app for the first time.

### Calendar and schedule operations

#### 1. Choose the calendar anchor

Action. Choose Session → Schedule and expand Calendar anchor. Enter the local date and time for model zero and an IANA time zone, such as Europe/London.

Expected result. The form displays the corresponding absolute instant or a clock-change explanation.

Check. An anchor is model zero. Each intake retains a separate elapsed start.

#### 2. Resolve ambiguous clock time

Action. If the local time occurs twice, select Earlier occurrence or Later occurrence. If it falls in a clock-change gap, enter an existing local time.

Expected result. The chosen UTC instant is unambiguous.

Check. Two identical local clock labels can identify different absolute instants.

#### 3. Choose what the anchor change preserves

Action. Choose Preserve elapsed schedule to move the whole schedule with the anchor. Choose Preserve absolute event times to change model zero while retaining event instants. Then choose Apply anchor.

Expected result. The event positions and calendar labels reflect the selected policy.

Check. Preserving absolute times can move events into historical or future parts of the schedule. Review the resulting horizon coverage.

#### 4. Shift a group of events

Action. Choose Session → Schedule. Select the intake or meal checkboxes. Enter a signed shift in minutes and choose Shift selected.

Expected result. All selected starts move by the same elapsed interval.

Check. Positive minutes move events later. Negative minutes move them earlier.

#### 5. Duplicate a schedule segment

Action. Select the events, enter the desired offset and choose Duplicate selected.

Expected result. Distinct copied events are added at the shifted times.

Check. The copied events retain amounts and durations. Review total intake before calculating.

#### 6. Set meals explicitly

Action. Enter meals in the existing timeline editor or physiology controls. Review their start, duration, food state and motility assumptions.

Expected result. Meal intervals appear alongside intake events in Session.

Check. A subject-level food state and explicit meal events have model-defined roles; inspect the active assumptions in Explain.

### Concentrations, compartments and rates

#### 1. Inspect a current accepted snapshot

Action. Choose Analysis → Explain and select an inspection time. Wait for Current status.

Expected result. The panel identifies its snapshot, elapsed time and calendar instant.

Check. Stale panels retain their previous snapshot label. A current report requires current accepted results.

#### 2. Read the compartments

Action. Inspect gastric, intestinal and central ethanol, caffeine gut and central amounts, and paraxanthine when enabled.

Expected result. The amounts explain where material resides in the model.

Check. Compartment amounts use grams or milligrams; concentrations additionally depend on distribution volume.

#### 3. Read the local rates

Action. Inspect systemic appearance and elimination in g/h or mg/h.

Expected result. The panel displays finite-difference estimates from the accepted dense trajectory.

Check. The displayed rate is averaged over the stated nearby interval. A bolus or abrupt boundary limits its instantaneous interpretation.

#### 4. Inspect the PD definitions

Action. Read the definition beside each index, including its scale, baseline convention and relevant modifiers.

Expected result. Concentration quantities and heuristic functional quantities have explicit meanings.

Check. A 0–100 heuristic index is interpreted according to its transform and provenance.

#### 5. Evaluate an intake counterfactual

Action. Select one accepted intake and choose Evaluate removal.

Expected result. The original schedule is compared with the same schedule after that event is removed.

Check. This conditional difference includes shared nonlinear dynamics. Differences from several separate removal experiments need not add to the original total.

#### 6. Use analysis markers

Action. Add bedtime, waking or activity markers and compare their concentration values.

Expected result. Each marker reports the accepted trajectory at its own time.

Check. A marker outside the horizon is labelled outside coverage. Extend the horizon before requesting its result.

### A reproducible comparison

#### 1. Preserve a baseline

Action. Open Saved sessions, give the current valid scenario a name and choose Save named state.

Expected result. The baseline appears with its timestamp and release identity.

Check. Saving a named state retains the committed document and bounded editing history.

#### 2. Modify one assumption

Action. Change the event timing, food state, distribution assumption or selected parameter you intend to investigate.

Expected result. A new accepted result is calculated.

Check. One deliberate change makes the comparison easier to interpret. Several changes remain possible and are listed in the input difference table.

#### 3. Build the comparison

Action. Open Compare, select the saved baseline and choose Build comparison.

Expected result. Scenario A contains the saved baseline. Scenario B contains the current main scenario.

Check. The comparison uses the same calculation authority as the main calculator.

#### 4. Read differences and milestones

Action. Review the input-difference table, peak deltas, selected-time concentrations and final threshold returns.

Expected result. The panel makes the changed assumptions and resulting numerical differences explicit.

Check. Each final-return value applies to that scenario and its configured horizon.

#### 5. Generate a report

Action. Open Report, select the desired report depth and choose Download analysis report.

Expected result. A self-contained HTML report downloads with figures, inputs, assumptions, timestamps and model identity.

Check. Open the downloaded report in a browser and use Print to create a PDF if required.

#### 6. Distinguish sensitivity from sampling

Action. Use Compare → Sensitivity and its sweep controls to examine defined parameter perturbations.

Expected result. The selected output varies across the stated parameter range.

Check. The current sensitivity envelopes are deterministic explorations. A probability distribution requires a separately specified sampling model.

## Expert

Use this level for numerical configuration, model assumptions, provenance, conservation, structural comparisons and reproducibility. The same accepted calculation authority serves every expertise level.

### Define the calculation contract

#### 1. Record model identity

Action. Choose Analysis → Diagnostics and record the application, engine, constants, schema and behavioural-model versions. Inspect the source fingerprint.

Expected result. The analysis can be associated with a specific implementation and parameter set.

Check. Application features and scientific component versions advance independently.

#### 2. Choose distribution explicitly

Action. Inspect the selected demographic TBW, FFM-derived TBW, Watson estimate or apparent-Vd formulation. Enter only the inputs used by that formulation.

Expected result. The resolved distribution volume and its source are visible.

Check. A body-composition estimate carries assumptions about tissue water and measurement quality.

#### 3. Specify ethanol elimination

Action. Select the implemented zero-order or Michaelis–Menten formulation. Inspect Vmax, Km, reference-population scaling and any deliberate override.

Expected result. The chosen formulation and effective values appear in provenance and the report.

Check. Vmax is an amount rate; a concentration elimination slope additionally depends on distribution.

#### 4. Specify caffeine kinetics

Action. Choose direct effective half-life or the reference-half-life/CYP1A2 formulation. Inspect absorption and distribution assumptions.

Expected result. One documented caffeine kinetic configuration determines the trajectory.

Check. An entered effective half-life already represents its intended aggregate clearance assumption.

#### 5. Specify metabolite and interaction options

Action. Inspect paraxanthine enablement, formation fraction, distribution and elimination parameters, and the optional ethanol-linked caffeine-clearance interaction.

Expected result. The model records which optional assumptions are active.

Check. Optional metabolite contribution and clearance coupling require interpretation according to their stated approximation.

#### 6. Define historical state once

Action. Choose a documented history of events, explicit initial compartment amounts, or a clearly defined combination representing different material.

Expected result. The model ledger accounts for the starting state and subsequent administration.

Check. Re-entering the same residual material in both initial amounts and replayed history duplicates that exposure.

### Inspect execution and numerical integrity

#### 1. Separate display spacing and solver step

Action. Set the internal integration step independently from the displayed sampling interval.

Expected result. Summary calculations use the integration trajectory; the chart uses its declared sampling view.

Check. A smoother chart alone does not establish a more accurate integration.

#### 2. Check convergence

Action. Inspect requested and refined resolution, convergence diagnostics, tied peaks and any failure messages.

Expected result. Repeated practically equal peaks have explicit representative-time semantics.

Check. A global peak can be a set of near-equal episodes. Its selected time requires the reported tie policy.

#### 3. Check conservation

Action. Inspect ethanol and caffeine input-delivery and mass-balance residuals across the numerical data.

Expected result. Administered, remaining, metabolised and eliminated material have a consistent ledger.

Check. Endpoint events, negative-time history and overlapping administrations are useful adversarial cases.

#### 4. Check zero-exposure semantics

Action. Read each PD index definition at zero exposure and at very small exposure.

Expected result. Absolute-state conventions and pharmacological-change conventions are identifiable.

Check. The retained heuristic transforms have their own baseline rules. Inspect these before interpreting a low-exposure tail.

#### 5. Exercise the diagnostic suite

Action. Choose Model sources and release identity in the footer to open About and run its embedded diagnostics. Inspect integrity information through Analysis → Diagnostics. Retain the reported results with the release identity.

Expected result. Each assertion reports its own result and coverage.

Check. Regression success establishes the tested properties and fixtures. Empirical predictive error requires external observations.

#### 6. Audit a dense scenario

Action. Exercise the supported 72-hour, repeated-event case at the supported integration settings. Cancel and restart a calculation when testing execution behaviour.

Expected result. The run completes or returns its explicit failure state; previous snapshots retain provenance.

Check. Use named reference devices when recording performance budgets.

### Preserve and interpret an analysis

#### 1. Export the session document

Action. Choose Export session JSON in Saved sessions. Retain its schema, versions, anchor, time zone, markers and history.

Expected result. The exported session can reconstruct its committed state in a compatible release.

Check. Session wrapper schema 1.0.0 is separate from the retained 0.8.2 scenario schema.

#### 2. Import a legacy scenario

Action. In Saved sessions, choose Import session or legacy scenario and select the existing scenario JSON.

Expected result. The existing schema migration and validation path prepares the scenario.

Check. Review the resulting chronology, initial conditions and active optional models.

#### 3. Export analytical data

Action. Choose Export in the top toolbar, then Analytical data, for numerical or behavioural series. Select the full horizon when that is the intended coverage.

Expected result. The output identifies its accepted snapshot and coverage.

Check. Displayed-series exports follow the displayed window. Full numerical exports retain the specified analysis trajectory.

#### 4. Record a conditional comparison

Action. Retain both scenario inputs, their profiles, the differences and the accepted comparison results.

Expected result. Another analysis can reproduce the same question.

Check. A removal counterfactual is conditional on the rest of its schedule and the selected model structure.

#### 5. Evaluate evidence scope

Action. Read the source and assumptions associated with each parameter and response layer.

Expected result. Literature-derived parameters, engineering assumptions and heuristic transforms remain distinguishable.

Check. External evaluation concerns the combined model in the target conditions, including measurement matrix and population.

#### 6. Capture an accepted report

Action. Wait for the main snapshot to be current and any enabled comparison to finish. Download the Expert-depth report.

Expected result. The report includes numerical metadata, complete constants, chronology, selected-time inspection and comparison provenance.

Check. The report is a frozen document. Subsequent input changes create a new analytical state.

## Offline and installation

### 1. Open the hosted application online

Allow the footer to reach Offline ready before disconnecting.

Expected result. The current shell and required assets are cached.

### 2. Install when offered

Choose Settings → Interaction, then Install app when the browser exposes that action. On iPhone or iPad, use the browser sharing controls and Add to Home Screen.

Expected result. The installed application opens the same hosted origin.

### 3. Keep a recovery or exported copy

Enable Session recovery and wait for Saved, or export the session JSON.

Expected result. A documented input state is available for restoration.

### 4. Apply an available update

Finish incomplete input, then choose Save session and update.

Expected result. A recovery copy is written before update activation and reload.

### 5. Restore after an interrupted session

Open Saved sessions and inspect the recovery timestamp.

Expected result. You can explicitly restore the desired committed state.

## Glossary

**Model zero.** The absolute instant represented by elapsed time +0 h.

**Elapsed time.** Duration relative to model zero, measured continuously through midnight and clock changes.

**Calendar anchor.** The saved absolute instant used to display the scenario in a chosen time zone.

**Inspection time.** The manually selected point whose values are displayed in the analysis panels.

**Current time.** The present wall-clock instant, displayed separately from the inspection time.

**Horizon.** The end of the modelled observation window.

**Accepted snapshot.** An immutable calculation result associated with a specific input state.

**Current result.** An accepted snapshot whose input identity matches the committed draft.

**Sensitivity envelope.** Trajectories generated by specified parameter perturbations.

**Final return.** The last observed downward crossing within the configured schedule and horizon.

**Right-censored interval.** An above-threshold interval that remains open when the horizon ends.

**Session JSON.** The schema-1.0.0 document containing committed scenario state, calendar information, markers and bounded history.

## Troubleshooting

**A result says Previous or Pending** Wait for recalculation, or correct the indicated invalid input. Use the snapshot label to identify retained results.

**A clock time is rejected** Check the time zone and date. Resolve an ambiguous occurrence or choose a time outside a clock-change gap.

**A marker has no concentration** Its time is outside the accepted horizon. Extend the horizon or move the marker into coverage.

**A saved state is absent on another device** Import its exported session JSON. Browser-local storage is specific to the origin and browser environment.

**Session recovery reports a failure** Export a portable session file. Retry local storage after resolving the browser restriction or available-storage problem.

**A report button is unavailable** Complete invalid text entry, wait for Current status and finish an enabled comparison.

**The installed app shows an older release** Reconnect, choose Settings → Interaction → Check for update, then use Save session and update when offered. Read the active release beside PK/PD Sandbox in the top-left corner.

**An import is rejected** Check its schema, file size and required engine version. Keep the original file and inspect the exact validation message.

