export const V15_GUIDES = {
 default: {
  title:'Default: enter a scenario and read its results',
  scope:'Use this level for intake entry, the concentration timeline, selected-time inspection and saving. The model calculates the same trajectories at every detail level.',
  sections:[
   {id:'first-run',title:'First complete calculation',steps:[
    ['Open Session inputs','Choose Session, then Inputs. Set Scientific depth to Default.','The person and intake controls are visible.','A detail level changes the displayed controls and explanation depth.'],
    ['Set the person','Open Refine person. Enter body mass in kilograms. Choose the appropriate physiology and available composition inputs. Close the panel when the entries are complete.','The person summary reflects your committed values.','Use measured values where available. An empty optional composition field leaves the selected fallback model active.'],
    ['Define an intake','Choose Add drink or caffeine. Select a preset or enter a custom amount. Read the amount and serving labels before applying it.','The intake appears in the intake list.','Ethanol is recorded as grams; caffeine is recorded as milligrams. Presets convert their volume and composition into those amounts.'],
    ['Set its start','Enter the start relative to model zero, or use the clock entry controls. In Session, the anchor is the absolute instant corresponding to +0 h.','The event is placed at its intended position on the timeline.','A start of +2 h is two elapsed hours after model zero. A negative start represents historical intake before model zero.'],
    ['Set its duration','Enter the number of minutes over which the amount is consumed. Use zero only for an instantaneous modelled administration.','The timeline displays the full administration interval.','Dose amount is the total for the event and servings. A 60-minute duration distributes that event over one hour.'],
    ['Add the remaining events','Repeat intake entry for each distinct consumption period. Review servings, amounts, start times and durations.','The list contains the complete schedule you intend to calculate.','Events after the configured horizon require an extended horizon to be observed.'],
    ['Wait for a current result','Automatic recalculation is enabled by default. If you have disabled it, use the calculation control. Wait until the result status is Current.','The accepted snapshot matches the committed inputs.','A previous-result or pending label means that a displayed result belongs to an earlier input state.'],
    ['Open Session','Choose Session in the upper navigation. Read the model-zero anchor, time zone and horizon.','Intakes, curves and threshold intervals share one elapsed-time axis.','The wall-clock labels derive from the saved anchor and time zone.'],
    ['Inspect one time','Move Inspection time or enter an elapsed hour value inside the horizon.','The inspection line and selected-time concentrations move together.','The current-time marker is a separate clock reference. It may fall outside this hypothetical scenario.'],
    ['Read the units','Read BAC in g/dL and caffeine in mg/L. Inspect the peak values and the selected-time values separately.','You can identify the concentration at the selected time and the maximum across the full horizon.','A peak time and a selected time refer to different questions.'],
    ['Read repeated exposure','Review each above-threshold interval. Read first return and final return with their schedule and horizon labels.','Later re-exposure remains visible.','An interval open at the horizon has no observed final return within this calculation.'],
    ['Save a portable copy','Open Saved states. Enter a name and choose Save named state. Choose Export session JSON to retain an external copy.','The named state appears in the list and the JSON file downloads.','Browser-local saved states belong to this browser and origin. A downloaded session file can be imported elsewhere.']
   ]},
   {id:'recovery',title:'Recovery and reopening',steps:[
    ['Enable session recovery','Open Saved states and enable Session recovery. Wait for the Saved status.','A recoverable copy is stored after valid committed edits.','Recovery waits while an input is incomplete or invalid. The status describes the last completed write.'],
    ['Restore deliberately','After reopening, inspect the recovery timestamp and choose Restore recovery copy when that is the state you want.','The saved input state is restored and recalculated.','Restoration is an undoable operation. Export the current state first if you want an additional portable copy.'],
    ['Undo an edit','Choose Undo after a committed scenario edit. Use Redo to return to the subsequent state.','The document and its chronology return together.','History covers committed values. Finish or correct incomplete text entry before using history.'],
    ['Create an analysis marker','Open Analysis markers in Session. Enter a label, a kind and an elapsed time; choose Add marker.','A marker appears on the timeline with modelled concentrations.','Bedtime and waking markers inspect concentration. They do not calculate sleep architecture.']
   ]}
  ]
 },
 detailed: {
  title:'Detailed: inspect assumptions and compare explanations',
  scope:'Use this level for meal and physiology assumptions, compartment interpretation, selected-time rates, repeated episodes and comparisons. Begin with the Default walkthrough when entering the app for the first time.',
  sections:[
   {id:'chronology',title:'Calendar and schedule operations',steps:[
    ['Choose the calendar anchor','Open Session and expand Calendar anchor. Enter the local date and time for model zero and an IANA time zone, such as Europe/London.','The form displays the corresponding absolute instant or a clock-change explanation.','An anchor is model zero. Each intake retains a separate elapsed start.'],
    ['Resolve ambiguous clock time','If the local time occurs twice, select Earlier occurrence or Later occurrence. If it falls in a clock-change gap, enter an existing local time.','The chosen UTC instant is unambiguous.','Two identical local clock labels can identify different absolute instants.'],
    ['Choose what the anchor change preserves','Choose Preserve elapsed schedule to move the whole schedule with the anchor. Choose Preserve absolute event times to change model zero while retaining event instants. Then choose Apply anchor.','The event positions and calendar labels reflect the selected policy.','Preserving absolute times can move events into historical or future parts of the schedule. Review the resulting horizon coverage.'],
    ['Shift a group of events','Select the intake or meal checkboxes in Session. Enter a signed shift in minutes and choose Shift selected.','All selected starts move by the same elapsed interval.','Positive minutes move events later. Negative minutes move them earlier.'],
    ['Duplicate a schedule segment','Select the events, enter the desired offset and choose Duplicate selected.','Distinct copied events are added at the shifted times.','The copied events retain amounts and durations. Review total intake before calculating.'],
    ['Set meals explicitly','Enter meals in the existing timeline editor or physiology controls. Review their start, duration, food state and motility assumptions.','Meal intervals appear alongside intake events in Session.','A subject-level food state and explicit meal events have model-defined roles; inspect the active assumptions in Explain.']
   ]},
   {id:'explanation',title:'Concentrations, compartments and rates',steps:[
    ['Inspect a current accepted snapshot','Choose Explain and select an inspection time. Wait for Current status.','The panel identifies its snapshot, elapsed time and calendar instant.','Stale panels retain their previous snapshot label. A current report requires current accepted results.'],
    ['Read the compartments','Inspect gastric, intestinal and central ethanol, caffeine gut and central amounts, and paraxanthine when enabled.','The amounts explain where material resides in the model.','Compartment amounts use grams or milligrams; concentrations additionally depend on distribution volume.'],
    ['Read the local rates','Inspect systemic appearance and elimination in g/h or mg/h.','The panel displays finite-difference estimates from the accepted dense trajectory.','The displayed rate is averaged over the stated nearby interval. A bolus or abrupt boundary limits its instantaneous interpretation.'],
    ['Inspect the PD definitions','Read the definition beside each index, including its scale, baseline convention and relevant modifiers.','Concentration quantities and heuristic functional quantities have explicit meanings.','A 0–100 heuristic index is interpreted according to its transform and provenance.'],
    ['Evaluate an intake counterfactual','Select one accepted intake and choose Evaluate removal.','The original schedule is compared with the same schedule after that event is removed.','This conditional difference includes shared nonlinear dynamics. Differences from several separate removal experiments need not add to the original total.'],
    ['Use analysis markers','Add bedtime, waking or activity markers and compare their concentration values.','Each marker reports the accepted trajectory at its own time.','A marker outside the horizon is labelled outside coverage. Extend the horizon before requesting its result.']
   ]},
   {id:'comparison',title:'A reproducible comparison',steps:[
    ['Preserve a baseline','Open Saved states, give the current valid scenario a name and choose Save named state.','The baseline appears with its timestamp and release identity.','Saving a named state retains the committed document and bounded editing history.'],
    ['Modify one assumption','Change the event timing, food state, distribution assumption or selected parameter you intend to investigate.','A new accepted result is calculated.','One deliberate change makes the comparison easier to interpret. Several changes remain possible and are listed in the input difference table.'],
    ['Build the comparison','Open Compare, select the saved baseline and choose Build comparison.','Scenario A contains the saved baseline. Scenario B contains the current main scenario.','The comparison uses the same calculation authority as the main calculator.'],
    ['Read differences and milestones','Review the input-difference table, peak deltas, selected-time concentrations and final threshold returns.','The panel makes the changed assumptions and resulting numerical differences explicit.','Each final-return value applies to that scenario and its configured horizon.'],
    ['Generate a report','Open Report, select the desired report depth and choose Download analysis report.','A self-contained HTML report downloads with figures, inputs, assumptions, timestamps and model identity.','Open the downloaded report in a browser and use Print to create a PDF if required.'],
    ['Distinguish sensitivity from sampling','Use the existing Explore sensitivity and sweep controls to examine defined parameter perturbations.','The selected output varies across the stated parameter range.','The current sensitivity envelopes are deterministic explorations. A probability distribution requires a separately specified sampling model.']
   ]}
  ]
 },
 expert: {
  title:'Expert: audit the model, execution and exported analysis',
  scope:'Use this level for numerical configuration, model assumptions, provenance, conservation, structural comparisons and reproducibility. The same accepted calculation authority serves every expertise level.',
  sections:[
   {id:'model-contract',title:'Define the calculation contract',steps:[
    ['Record model identity','Open Expert and record the application, engine, constants, schema and behavioural-model versions. Inspect the source fingerprint.','The analysis can be associated with a specific implementation and parameter set.','Application features and scientific component versions advance independently.'],
    ['Choose distribution explicitly','Inspect the selected demographic TBW, FFM-derived TBW, Watson estimate or apparent-Vd formulation. Enter only the inputs used by that formulation.','The resolved distribution volume and its source are visible.','A body-composition estimate carries assumptions about tissue water and measurement quality.'],
    ['Specify ethanol elimination','Select the implemented zero-order or Michaelis–Menten formulation. Inspect Vmax, Km, reference-population scaling and any deliberate override.','The chosen formulation and effective values appear in provenance and the report.','Vmax is an amount rate; a concentration elimination slope additionally depends on distribution.'],
    ['Specify caffeine kinetics','Choose direct effective half-life or the reference-half-life/CYP1A2 formulation. Inspect absorption and distribution assumptions.','One documented caffeine kinetic configuration determines the trajectory.','An entered effective half-life already represents its intended aggregate clearance assumption.'],
    ['Specify metabolite and interaction options','Inspect paraxanthine enablement, formation fraction, distribution and elimination parameters, and the optional ethanol-linked caffeine-clearance interaction.','The model records which optional assumptions are active.','Optional metabolite contribution and clearance coupling require interpretation according to their stated approximation.'],
    ['Define historical state once','Choose a documented history of events, explicit initial compartment amounts, or a clearly defined combination representing different material.','The model ledger accounts for the starting state and subsequent administration.','Re-entering the same residual material in both initial amounts and replayed history duplicates that exposure.']
   ]},
   {id:'numerical-audit',title:'Inspect execution and numerical integrity',steps:[
    ['Separate display spacing and solver step','Set the internal integration step independently from the displayed sampling interval.','Summary calculations use the integration trajectory; the chart uses its declared sampling view.','A smoother chart alone does not establish a more accurate integration.'],
    ['Check convergence','Inspect requested and refined resolution, convergence diagnostics, tied peaks and any failure messages.','Repeated practically equal peaks have explicit representative-time semantics.','A global peak can be a set of near-equal episodes. Its selected time requires the reported tie policy.'],
    ['Check conservation','Inspect ethanol and caffeine input-delivery and mass-balance residuals across the numerical data.','Administered, remaining, metabolised and eliminated material have a consistent ledger.','Endpoint events, negative-time history and overlapping administrations are useful adversarial cases.'],
    ['Check zero-exposure semantics','Read each PD index definition at zero exposure and at very small exposure.','Absolute-state conventions and pharmacological-change conventions are identifiable.','The retained heuristic transforms have their own baseline rules. Inspect these before interpreting a low-exposure tail.'],
    ['Exercise the diagnostic suite','Run the embedded diagnostics in About and inspect Expert integrity information. Retain the reported results with the release identity.','Each assertion reports its own result and coverage.','Regression success establishes the tested properties and fixtures. Empirical predictive error requires external observations.'],
    ['Audit a dense scenario','Exercise the supported 72-hour, repeated-event case at the supported integration settings. Cancel and restart a calculation when testing execution behaviour.','The run completes or returns its explicit failure state; previous snapshots retain provenance.','Use named reference devices when recording performance budgets.']
   ]},
   {id:'reproducibility',title:'Preserve and interpret an analysis',steps:[
    ['Export the session document','Choose Export session JSON in Saved states. Retain its schema, versions, anchor, time zone, markers and history.','The exported session can reconstruct its committed state in a compatible release.','The v1.5 session schema is separate from the retained 0.8.2 scenario schema.'],
    ['Import a legacy scenario','In Saved states, choose Import session or legacy scenario and select the existing scenario JSON.','The existing schema migration and validation path prepares the scenario.','Review the resulting chronology, initial conditions and active optional models.'],
    ['Export analytical data','Use the existing Export workspace for numerical or behavioural series. Select the full horizon when that is the intended coverage.','The output identifies its accepted snapshot and coverage.','Displayed-series exports follow the displayed window. Full numerical exports retain the specified analysis trajectory.'],
    ['Record a conditional comparison','Retain both scenario inputs, their profiles, the differences and the accepted comparison results.','Another analysis can reproduce the same question.','A removal counterfactual is conditional on the rest of its schedule and the selected model structure.'],
    ['Evaluate evidence scope','Read the source and assumptions associated with each parameter and response layer.','Literature-derived parameters, engineering assumptions and heuristic transforms remain distinguishable.','External evaluation concerns the combined model in the target conditions, including measurement matrix and population.'],
    ['Capture an accepted report','Wait for the main snapshot to be current and any enabled comparison to finish. Download the Expert-depth report.','The report includes numerical metadata, complete constants, chronology, selected-time inspection and comparison provenance.','The report is a frozen document. Subsequent input changes create a new analytical state.']
   ]}
  ]
 }
};
export const V15_GUIDE_COMMON = {
 offline:[
  ['Open the hosted application online','Allow the installation status to reach Offline ready before disconnecting.','The current shell and required assets are cached.'],
  ['Install when offered','Use Install app when the browser exposes that action. On iPhone or iPad, use the browser sharing controls and Add to Home Screen.','The installed application opens the same hosted origin.'],
  ['Keep a recovery or exported copy','Enable Session recovery and wait for Saved, or export the session JSON.','A documented input state is available for restoration.'],
  ['Apply an available update','Finish incomplete input, then choose Save session and update.','A recovery copy is written before update activation and reload.'],
  ['Restore after an interrupted session','Open Saved states and inspect the recovery timestamp.','You can explicitly restore the desired committed state.']
 ],
 glossary:[
  ['Model zero','The absolute instant represented by elapsed time +0 h.'],
  ['Elapsed time','Duration relative to model zero, measured continuously through midnight and clock changes.'],
  ['Calendar anchor','The saved absolute instant used to display the scenario in a chosen time zone.'],
  ['Inspection time','The manually selected point whose values are displayed in the analysis panels.'],
  ['Current time','The present wall-clock instant, displayed separately from the inspection time.'],
  ['Horizon','The end of the modelled observation window.'],
  ['Accepted snapshot','An immutable calculation result associated with a specific input state.'],
  ['Current result','An accepted snapshot whose input identity matches the committed draft.'],
  ['Sensitivity envelope','Trajectories generated by specified parameter perturbations.'],
  ['Final return','The last observed downward crossing within the configured schedule and horizon.'],
  ['Right-censored interval','An above-threshold interval that remains open when the horizon ends.'],
  ['Session JSON','The v1.5 document containing committed scenario state, calendar information, markers and bounded history.']
 ],
 troubleshooting:[
  ['A result says Previous or Pending','Wait for recalculation, or correct the indicated invalid input. Use the snapshot label to identify retained results.'],
  ['A clock time is rejected','Check the time zone and date. Resolve an ambiguous occurrence or choose a time outside a clock-change gap.'],
  ['A marker has no concentration','Its time is outside the accepted horizon. Extend the horizon or move the marker into coverage.'],
  ['A saved state is absent on another device','Import its exported session JSON. Browser-local storage is specific to the origin and browser environment.'],
  ['Session recovery reports a failure','Export a portable session file. Retry local storage after resolving the browser restriction or available-storage problem.'],
  ['A report button is unavailable','Complete invalid text entry, wait for Current status and finish an enabled comparison.'],
  ['The installed app shows an older release','Reconnect, check for an update and use Save session and update. Read the active version in the Scientific depth control.'],
  ['An import is rejected','Check its schema, file size and required engine version. Keep the original file and inspect the exact validation message.']
 ]
};
