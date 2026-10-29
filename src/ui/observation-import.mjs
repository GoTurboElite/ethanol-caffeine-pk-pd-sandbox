import {parseObservations,validateScience} from '../science/schema.mjs';
import {v15Clone,v15Stable} from '../session/core.mjs';
export const observationImportKey=(document,csv,anchor,source)=>v15Stable({csv,anchor,source,observations:document.observations,committedSource:document.observationSource,legacyConversionNotes:document.legacyConversionNotes??''});
export function previewObservations(document,csv,anchor,source){
 const rows=parseObservations(csv,anchor),next=v15Clone(document);next.observations=rows;next.observationSource=source;validateScience(next);
 const count=fn=>rows.filter(fn).length,times=rows.map(r=>r.timeH);
 return {key:observationImportKey(document,csv,anchor,source),rows,summary:{count:rows.length,existing:document.observations.length,calibration:count(r=>r.role==='calibration'),evaluation:count(r=>r.role==='evaluation'),ethanol:count(r=>r.analyte==='ethanol'),caffeine:count(r=>r.analyte==='caffeine'),minTime:times.length?Math.min(...times):null,maxTime:times.length?Math.max(...times):null,units:[...new Set(rows.map(r=>r.unit))],matrices:[...new Set(rows.map(r=>r.matrix))],suppliedSD:count(r=>r.sd!=null),censored:count(r=>r.qualifier==='<'),alternative:rows.filter(r=>r.matrix!==(r.analyte==='ethanol'?'whole-blood':'plasma'))}};
}
export function confirmObservationImport(document,preview,csv,anchor,source){
 if(!preview||preview.key!==observationImportKey(document,csv,anchor,source))throw Error('CSV preview is stale. Validate the current text, source, model-zero anchor and committed dataset again.');
 const verified=previewObservations(document,csv,anchor,source),next=v15Clone(document);next.observations=verified.rows;next.observationSource=source;return validateScience(next);
}
