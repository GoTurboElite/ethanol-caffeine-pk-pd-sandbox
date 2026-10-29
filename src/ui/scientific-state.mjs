import {validateScience} from '../science/schema.mjs';
import {v15Stable} from '../session/core.mjs';
export function datasetReference(document){
 const text=v15Stable({observations:document.observations,source:document.observationSource,history:document.legacyConversionNotes??''});let hash=2166136261;
 for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);
 return 'D-'+(hash>>>0).toString(16).padStart(8,'0');
}
export function scientificResultState(result,key){return !result?'Not computed':result.imported?'Imported archive; recompute':result.sourceKey===key?'Matches committed inputs':'Previous inputs; recompute';}

export function configurationChanged(document,kind,candidate){try{return v15Stable(validateScience({...document,[kind]:candidate})[kind])!==v15Stable(document[kind]);}catch{return true;}}
