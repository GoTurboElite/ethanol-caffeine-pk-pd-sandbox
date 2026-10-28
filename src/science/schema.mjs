import {v15Clone,v15Stable} from '../session/core.mjs';
export const SCIENCE_VERSION='1.0.0';
export const MODEL_PROFILE={id:'reference-1.60',name:'v1.60 reference model',engineVersion:'0.4.4',constantsVersion:'0.3.0',evidenceVersion:'2026-10-28.1',status:'Retained equations; empirical evaluation is endpoint-specific.'};
export const PARAMETERS={
 caffeineHalfLifeH:{label:'Effective caffeine half-life',unit:'h',section:'subject',key:'caffeineHalfLifeH',min:1,max:30,analyte:'caffeine'},
 ethanolClearanceModifier:{label:'Ethanol elimination multiplier',unit:'fold',section:'subject',key:'ethanolClearanceModifier',min:.25,max:3,analyte:'ethanol'},
 caffeineVdLPerKg:{label:'Caffeine apparent distribution volume',unit:'L/kg',section:'constants',key:'caffeineVdLPerKg',min:.3,max:1.2,analyte:'caffeine'},
 caffeineAbsorptionModifier:{label:'Caffeine absorption multiplier',unit:'fold',section:'subject',key:'caffeineAbsorptionModifier',min:.25,max:3,analyte:'caffeine'},
 gastricEmptyingModifier:{label:'Gastric emptying multiplier',unit:'fold',section:'subject',key:'gastricEmptyingModifier',min:.25,max:3,analyte:'ethanol'}
};
export const emptyScience=()=>({schemaVersion:SCIENCE_VERSION,modelProfile:MODEL_PROFILE.id,observations:[],observationSource:'User supplied; provenance not independently verified.',fit:{parameters:[{id:'caffeineHalfLifeH',lower:1,upper:12}],maxEvaluations:120},uncertainty:{seed:20261028,samples:32,parameters:[{id:'caffeineHalfLifeH',distribution:'triangular',lower:3,upper:8}],correlation:[[1]],paired:false},calibrations:[]});
export function number(value,label){if(value===null||value===undefined||typeof value==='boolean'||(typeof value==='string'&&!value.trim()))throw Error(label+' is required.');const n=Number(value);if(!Number.isFinite(n))throw Error(label+' must be finite.');return n;}
const text=(value,label,max=300)=>{if(typeof value!=='string'||value.length>max)throw Error(label+' is invalid.');return value;};
export function validateObservation(row,index=0){
 const analyte=String(row.analyte??'').toLowerCase();if(!['ethanol','caffeine'].includes(analyte))throw Error('Observation '+(index+1)+': analyte must be ethanol or caffeine.');
 const timeH=number(row.timeH,'Observation time');if(timeH<0||timeH>8760)throw Error('Observation times must be between 0 and 8760 elapsed hours.');
 const value=number(row.value,'Observation value');if(value<0)throw Error('Observation values cannot be negative.');
 const unit=String(row.unit??''),matrix=String(row.matrix??'').toLowerCase(),qualifier=String(row.qualifier??'='),role=String(row.role??'evaluation');
 const units=analyte==='ethanol'?['g/dL','g/L','mg/dL']:['mg/L','ng/mL','ug/mL'];if(!units.includes(unit))throw Error('Unsupported '+analyte+' unit. Use '+units.join(', ')+'.');
 if(!['=','<'].includes(qualifier))throw Error('Observation qualifier must be = or <.');
 if(!['calibration','evaluation'].includes(role))throw Error('Observation role must be calibration or evaluation.');
 let matrixFactor=row.matrixFactor==null||row.matrixFactor===''?null:number(row.matrixFactor,'Matrix factor');
 const canonicalMatrix=analyte==='ethanol'?'whole-blood':'plasma';
 if(matrix!==canonicalMatrix){if(!['serum','plasma','whole-blood','saliva'].includes(matrix)||matrixFactor===null)throw Error('Use '+canonicalMatrix+' for '+analyte+', or supply an explicit matrix_factor for a supported alternative matrix. Breath alcohol requires a separate observation model.');}
 if(matrixFactor!==null&&(matrixFactor<=0||matrixFactor>10))throw Error('Matrix factor must be positive and at most 10.');
 const sd=row.sd==null||row.sd===''?null:number(row.sd,'Measurement SD');if(sd!==null&&sd<=0)throw Error('Measurement SD must be positive.');
 return{id:text(String(row.id??'observation-'+index),'Observation ID',100),timeH,analyte,value,unit,matrix,qualifier,role,sd,matrixFactor,label:text(String(row.label??''),'Observation label',160)};
}
export function observationValue(row){const factor=row.analyte==='ethanol'?(row.unit==='g/L'?.1:row.unit==='mg/dL'?.001:1):(row.unit==='ng/mL'?.001:1);return row.value*factor*(row.matrixFactor??1);}
export function observationSD(row){return row.sd==null?(row.analyte==='ethanol'?.002:.1):observationValue({...row,value:row.sd});}
export function parameterValue(input,id){const p=PARAMETERS[id];if(!p)throw Error('Unknown parameter '+id);return input[p.section][p.key];}
export function setParameter(input,id,value){const p=PARAMETERS[id];if(!p)throw Error('Unknown parameter '+id);const n=number(value,p.label);if(n<p.min||n>p.max)throw Error(p.label+' is outside '+p.min+' to '+p.max+' '+p.unit+'.');input[p.section][p.key]=n;}
export function activeParameter(input,id){if(id==='caffeineHalfLifeH'&&input.subject.caffeineParameterMode!=='direct effective half-life')throw Error('Effective half-life is inactive in CYP1A2 covariate mode. Select direct effective half-life in Session inputs.');const p=PARAMETERS[id];if(!input.doseEvents.some(e=>(p.analyte==='caffeine'?(e.caffeineMg??e.caffeineMgPerServing??0):(e.ethanolGrams??e.ethanolGramsPerServing??e.volumeMl??0))>0))throw Error('No '+p.analyte+' intake is present for '+p.label+'.');}
export function cholesky(matrix,n){
 if(!Array.isArray(matrix)||matrix.length!==n||matrix.some(row=>!Array.isArray(row)||row.length!==n))throw Error('Correlation matrix dimensions must match the selected parameters.');
 const L=Array.from({length:n},()=>Array(n).fill(0));
 for(let i=0;i<n;i++)for(let j=0;j<=i;j++){const a=number(matrix[i][j],'Correlation'),mirror=number(matrix[j][i],'Correlation');if(Math.abs(a)>1||Math.abs(a-mirror)>1e-10||(i===j&&Math.abs(a-1)>1e-10))throw Error('Correlation matrix must be symmetric with a diagonal of 1.');let s=a;for(let k=0;k<j;k++)s-=L[i][k]*L[j][k];if(i===j){if(s<=1e-10)throw Error('Correlation matrix must be positive definite.');L[i][j]=Math.sqrt(s);}else L[i][j]=s/L[j][j];}return L;
}
export function validateParameters(rows,max=3){
 if(!Array.isArray(rows)||rows.length<1||rows.length>max)throw Error('Select between 1 and '+max+' parameters.');const seen=new Set();return rows.map(row=>{const p=PARAMETERS[row.id];if(!p||seen.has(row.id))throw Error('Parameters must be distinct registered quantities.');seen.add(row.id);const lower=number(row.lower,'Lower bound'),upper=number(row.upper,'Upper bound');if(lower<p.min||upper>p.max||upper<=lower)throw Error(p.label+': bounds must increase within '+p.min+' to '+p.max+' '+p.unit+'.');return{id:row.id,lower,upper,...(row.distribution?{distribution:row.distribution}:{}),...(row.cv!=null?{cv:number(row.cv,'CV')}: {})};});
}
export function validateScience(value){
 const d=v15Clone(value??emptyScience());if(d.schemaVersion!==SCIENCE_VERSION||d.modelProfile!==MODEL_PROFILE.id)throw Error('Unsupported scientific document or model profile.');
 if(!d.fit||!d.uncertainty)throw Error('Scientific fitting and uncertainty configurations are required.');
 if(!Array.isArray(d.observations)||d.observations.length>200)throw Error('An observation dataset supports at most 200 rows.');d.observations=d.observations.map(validateObservation);if(new Set(d.observations.map(o=>o.id)).size!==d.observations.length)throw Error('Observation IDs must be distinct.');
 d.observationSource=text(d.observationSource,'Observation provenance',2000);
 d.fit={parameters:validateParameters(d.fit?.parameters,2),maxEvaluations:number(d.fit?.maxEvaluations??120,'Fit budget')};if(!Number.isInteger(d.fit.maxEvaluations)||d.fit.maxEvaluations<40||d.fit.maxEvaluations>320)throw Error('Fit budget must be an integer from 40 to 320.');
 const u=d.uncertainty;u.parameters=validateParameters(u.parameters);for(const p of u.parameters){if(!['uniform','triangular','lognormal'].includes(p.distribution))throw Error('Select uniform, triangular or lognormal sampling.');if(p.distribution==='lognormal'&&(p.cv==null||p.cv<=0||p.cv>1))throw Error('Lognormal CV must be between 0 and 1.');}
 u.seed=number(u.seed,'Random seed');u.samples=number(u.samples,'Sample count');if(!Number.isInteger(u.seed)||u.seed<0||u.seed>4294967295)throw Error('Seed must be an unsigned 32-bit integer.');if(!Number.isInteger(u.samples)||u.samples<16||u.samples>256)throw Error('Use 16 to 256 samples.');u.paired=!!u.paired;cholesky(u.correlation,u.parameters.length);
 if(!Array.isArray(d.calibrations)||d.calibrations.length>12)throw Error('A scientific document supports up to 12 named calibration profiles.');d.calibrations=d.calibrations.map(p=>{text(p.name,'Calibration name',160);if(!p.values||Object.keys(p.values).length>2)throw Error('Malformed calibration profile.');for(const [id,value]of Object.entries(p.values)){const def=PARAMETERS[id];if(!def||!Number.isFinite(value)||value<def.min||value>def.max)throw Error('Invalid calibrated parameter.');}return p;});
 return d;
}
export function csvRows(text){
 if(typeof text!=='string'||text.length>200000)throw Error('Observation CSV is limited to 200,000 characters.');const rows=[],row=[];let field='',quoted=false;
 for(let i=0;i<=text.length;i++){const c=text[i];if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else if(c===undefined)throw Error('CSV has an unclosed quoted field.');else field+=c;}
 else if(c==='"'&&!field)quoted=true;else if(c===','||c==='\n'||c===undefined){row.push(field.trim());field='';if(c!==','){if(row.some(v=>v!==''))rows.push(row.splice(0));else row.length=0;}}else if(c!=='\r')field+=c;
 }return rows;
}
export function parseObservations(text,anchor){
 const rows=csvRows(text.replace(/^\uFEFF/,'')),header=rows.shift()?.map(s=>s.toLowerCase());if(!header||!['analyte','value','unit','matrix'].every(k=>header.includes(k))||(!header.includes('time_h')&&!header.includes('time_iso')))throw Error('CSV requires time_h (or time_iso), analyte, value, unit and matrix headers.');if(new Set(header).size!==header.length)throw Error('CSV headers must be distinct.');
 return rows.map((row,i)=>{if(row.length!==header.length)throw Error('CSV row '+(i+2)+' has the wrong field count.');const o=Object.fromEntries(header.map((k,j)=>[k,row[j]]));let timeH;
 if(o.time_h)timeH=number(o.time_h,'Elapsed time');else{if(!/T.*(?:Z|[+-]\d\d:\d\d)$/.test(o.time_iso??'')||!Number.isFinite(Date.parse(o.time_iso))||!Number.isFinite(Date.parse(anchor)))throw Error('Calendar observations require ISO timestamps with Z or an explicit UTC offset and a valid model-zero anchor.');timeH=(Date.parse(o.time_iso)-Date.parse(anchor))/3600000;}
 return validateObservation({id:'csv-'+i,timeH,analyte:o.analyte,value:o.value,unit:o.unit,matrix:o.matrix,role:o.role||'evaluation',sd:o.sd,qualifier:o.qualifier||'=',matrixFactor:o.matrix_factor,label:o.label??''},i);});
}
export const OBSERVATION_TEMPLATE='time_h,analyte,value,unit,matrix,role,sd,qualifier,label\n1,caffeine,1.5,mg/L,plasma,calibration,0.1,=,Replace illustrative value\n2,caffeine,1.3,mg/L,plasma,evaluation,0.1,=,Replace illustrative value\n';
export const scienceInputKey=(input,doc,comparison=null)=>v15Stable({input,science:doc,comparison,model:MODEL_PROFILE});
