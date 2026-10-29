import {validateObservation,validateScience} from '../science/schema.mjs';
import {v15Clone} from '../session/core.mjs';
export const observationDefaults=(analyte='caffeine')=>({analyte,timeBasis:'elapsed',time:'',value:'',unit:analyte==='ethanol'?'g/dL':'mg/L',matrix:analyte==='ethanol'?'whole-blood':'plasma',role:'evaluation',sd:'',qualifier:'=',matrixFactor:'',label:'',conversionSource:''});
export function manualObservationChange(document,draft,anchor,{id,source}={}){
 const errors={},finite=(key,label,required=true)=>{const raw=draft[key];if(raw==null||!String(raw).trim()){if(required)errors[key]=label+' is required.';return null;}const n=Number(raw);if(!Number.isFinite(n)){errors[key]=label+' must be a finite number.';return null;}return n;};
 let timeH;
 if(draft.timeBasis==='calendar'){
  if(!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(draft.time??'')||!Number.isFinite(Date.parse(draft.time))||!Number.isFinite(Date.parse(anchor)))errors.time='Use an ISO timestamp with Z or an explicit UTC offset, such as 2026-10-29T20:00:00Z.';
  else timeH=(Date.parse(draft.time)-Date.parse(anchor))/3600000;
 }else timeH=finite('time','Elapsed time');
 if(timeH!=null&&(timeH<0||timeH>8760))errors.time='Observation time must be between 0 and 8760 elapsed hours from model zero.';
 const value=finite('value','Measured value'),sd=finite('sd','Measurement SD',false),matrixFactor=finite('matrixFactor','Matrix factor',false);
 if(value!=null&&value<0)errors.value='Measured value cannot be negative.';
 if(sd!=null&&sd<=0)errors.sd='Measurement SD must be positive.';
 if(matrixFactor!=null&&(matrixFactor<=0||matrixFactor>10))errors.matrixFactor='Matrix factor must be positive and at most 10.';
 const canonical=draft.analyte==='ethanol'?'whole-blood':'plasma',alternative=draft.matrix!==canonical;
 if(alternative&&matrixFactor==null)errors.matrixFactor='An alternative matrix requires an explicit conversion factor to '+canonical+'.';
 if(alternative&&!draft.conversionSource?.trim())errors.conversionSource='State the source and assumptions for this matrix conversion.';
 if(Object.keys(errors).length)return {errors};
 try{
  const row=validateObservation({id,timeH,analyte:draft.analyte,value,unit:draft.unit,matrix:draft.matrix,role:draft.role,sd,qualifier:draft.qualifier,matrixFactor:alternative?matrixFactor:null,label:draft.label,conversionSource:alternative?draft.conversionSource.trim():''});
  const next=validateScience(document),index=next.observations.findIndex(o=>o.id===id);if(index>=0)next.observations[index]=row;else next.observations.push(row);
  next.observationSource=source??next.observationSource;
  return {errors:{},document:validateScience(next),row};
 }catch(e){return {errors:{form:e.message}};}
}
