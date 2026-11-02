import {observationValue,observationSD,observationIssues} from '../science/schema.mjs';
export const measurementText=value=>Number.isFinite(value)?Number(value.toPrecision(12)).toString():'Unavailable';
export function observationQualifications(row){
 const alternative=row.matrix!==(row.analyte==='ethanol'?'whole-blood':'plasma');
 return [...(observationIssues({observations:[row]}).length?['Historical factor requires correction; analysis blocked']:[]),...(alternative?['Matrix conversion assumed']:[]),...(alternative&&!row.conversionSource?.trim()?['Row-specific conversion source unspecified']:[]),...(row.sd==null?['Default error scale']:[]),...(row.qualifier==='<'?['Upper limit']:[])];
}
export function observationDetails(row){
 const canonical=row.analyte==='ethanol'?'g/dL whole-blood':'mg/L plasma',unit=row.analyte==='ethanol'?'g/dL':'mg/L';
 return [['Observation ID',row.id],['Elapsed time',String(row.timeH)+' h'],['Qualifier',row.qualifier==='<'?'Upper limit (<)':'Quantified value (=)'],['Original measurement',row.qualifier+' '+String(row.value)+' '+row.unit+' / '+row.matrix],['Dataset role',row.role],['Supplied SD',row.sd==null?'Not supplied':String(row.sd)+' '+row.unit+' / '+row.matrix],['Matrix conversion',row.matrixFactor==null?'Native matrix':row.matrixFactor+' × to '+(row.analyte==='ethanol'?'whole-blood':'plasma')],['Conversion source',row.conversionSource||'No row-specific conversion source; dataset source applies.'],['Canonical concentration',row.qualifier+' '+measurementText(observationValue(row))+' '+canonical],['Effective error scale',measurementText(observationSD(row))+' '+unit+(row.sd==null?' (default error scale)':' (converted supplied SD)')],['Review status',observationQualifications(row).join('; ')||'Validated measurement fields; provenance not independently verified']];
}
export function observationName(row,rows){const name=row.label||row.id;return row.label&&rows.filter(r=>r.label===row.label).length>1?name+' ('+row.id+')':name;}
