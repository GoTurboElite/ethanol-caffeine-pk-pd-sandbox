import {h,Fragment} from './runtime.mjs';
import {observationDetails,observationName,measurementText} from './observation-details.mjs';

export function ObservationTrace({result,selection,onSelect,heading}){
 const rows=result.residuals,observations=result.document?.observations??rows;
 const observation=observations.find(row=>row.id===selection?.id);
 if(!rows.length)return null;
 const provenance=result.document?.datasetContext;
 const errorRepresentation=provenance?.statistics;
 return <section className="v240-observation-trace" aria-label="Captured observation record">
  <h3 ref={heading} tabIndex="-1">Captured observation record</h3>
  <label className="v15-field">Inspect captured observation<select value={selection?.id??''} onChange={event=>onSelect(event.target.value)}>
   <option value="">Choose an observation</option>
   {rows.map(row=><option key={row.id} value={row.id}>{observationName(row,rows)} · {row.analyte} · {row.timeH} h</option>)}
  </select></label>
  {observation&&<><dl className="v240-results">
   {[['Analyte',observation.analyte],...observationDetails(observation),['Model prediction',measurementText(selection.predicted)+' '+selection.canonicalUnit],selection.qualifier==='<'?['Modelled exceedance of upper limit',measurementText(selection.upperLimitExceedance)+' '+selection.canonicalUnit]:['Residual (predicted − observed)',measurementText(selection.residual)+' '+selection.canonicalUnit]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
  </dl>{errorRepresentation&&<p>Recorded study error representation. {errorRepresentation}</p>}{result.document?.observationSource&&<p>Captured dataset source. {result.document.observationSource}</p>}
  {result.document?.legacyConversionNotes&&<details><summary>Historical dataset conversion notes</summary><p>{result.document.legacyConversionNotes}</p></details>}</>}
 </section>;
}
