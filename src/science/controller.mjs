import {v15Clone,v15Stable} from '../session/core.mjs';
import {emptyScience,validateScience,PARAMETERS,setParameter,parseObservations,MODEL_PROFILE,scienceInputKey} from './schema.mjs';
import {runScience,simulate} from './analysis.mjs';
import {runBenchmarks} from './evidence.mjs';
export class ScienceController{
 constructor(session,bridge,environment=globalThis){this.session=session;this.bridge=bridge;this.env=environment;this.listeners=new Set();this.revision=0;this.status='idle';this.progress=null;this.error='';this.result=null;this.records=[];this.serial=0;this.backend='worker';this.unsubscribe=session.subscribe(()=>{if(this.status==='running'&&this.runningKey!==this.key()){this.cancel('Inputs changed; the scientific job was cancelled.');}this.emit();});}
 subscribe=f=>{this.listeners.add(f);return()=>this.listeners.delete(f);};
 snapshot=()=>this.revision;
 emit(){this.revision++;for(const f of this.listeners)f();}
 get document(){return this.session.scienceDocument??emptyScience();}
 input(){return v15Clone(this.session.store.state.document.mainScenario);}
 comparison(){return this.session.store.state.document.comparisonEnabled?this.session.comparisonInput().scenarios:null;}
 key(){return scienceInputKey(this.input(),this.document,this.document.uncertainty.paired?this.comparison():null);}
 get current(){return this.result?.sourceKey===this.key();}
 edit(doc,label='Edited scientific inputs'){const frame=this.session.capture();frame.science=validateScience(doc);this.session.restore(frame,label);}
 importCSV(text){const doc=v15Clone(this.document);doc.observations=parseObservations(text,this.session.store.state.presentation.scenarioAnchorInstant);this.edit(doc,'Imported observation dataset');}
 cancel(message='Scientific job cancelled.'){this.serial++;this.worker?.terminate();this.worker=null;this.finishReject?.(Error(message));this.finishReject=null;this.status='cancelled';this.error=message;this.emit();}
 async run(kind){
  if(this.status==='running')this.cancel();if(!this.session.canSave()||this.session.store.state.snapshots.relationToDraft!=='current')throw Error('Wait for a current accepted calculation and complete inputs before running scientific analysis.');
  const id=++this.serial,document=validateScience(this.document),input=this.input(),comparison=document.uncertainty.paired?this.comparison():null,sourceKey=this.key(),request={kind,input,document,comparison};this.runningKey=sourceKey;this.status='running';this.progress={done:0,total:1};this.error='';this.emit();
  const progress=(done,total)=>{if(id===this.serial){this.progress={done,total};this.emit();}};
  try{
   let result;
   if(this.env.Worker){try{result=await new Promise((resolve,reject)=>{this.finishReject=reject;const source=this.env.document.getElementById('pk-kernel-source').textContent+'\n'+this.env.document.getElementById('pk-science-worker-source').textContent,url=this.env.URL.createObjectURL(new Blob([source],{type:'text/javascript'})),worker=new this.env.Worker(url);this.env.URL.revokeObjectURL(url);this.worker=worker;worker.onmessage=e=>{const d=e.data;if(d.id!==id)return;if(d.type==='progress')progress(d.done,d.total);else if(d.type==='result')resolve(d.result);else reject(Error(d.message));};worker.onerror=e=>reject(Error(e.message||'Scientific worker could not start.'));worker.postMessage({id,request});});this.backend='worker';}catch(error){if(id!==this.serial)throw error;if(!/worker|content security|script|blob|network/i.test(error.message))throw error;this.worker?.terminate();this.worker=null;this.backend='cooperative fallback';result=await this.local(request,id,progress);}}
   else{this.backend='cooperative fallback';result=await this.local(request,id,progress);}
   if(id!==this.serial||sourceKey!==this.key())return null;this.worker?.terminate();this.worker=null;this.finishReject=null;this.result={...result,sourceKey,releaseFingerprint:this.bridge.versions.buildFingerprint,backend:this.backend,imported:false};this.records=[this.result,...this.records].slice(0,3);this.status='complete';this.emit();return this.result;
  }catch(error){if(id===this.serial){this.worker?.terminate();this.worker=null;this.finishReject=null;this.status='failed';this.error=error.message;this.emit();}throw error;}
 }
 local(request,id,progress){return request.kind==='benchmarks'?runBenchmarks(this.bridge.scienceCore,{cancelled:()=>id!==this.serial,progress,yield:()=>new Promise(r=>setTimeout(r,0))}):runScience(this.bridge.scienceCore,request,{cancelled:()=>id!==this.serial,progress});}
 loadSynthetic(){const input=this.input(),r=simulate(this.bridge.scienceCore,input),doc=v15Clone(this.document),h=input.subject.simulationDurationH;const points=r.analysisPoints??r.points,analyte=r.summary.peakCaffeineMgL>0?'caffeine':'ethanol',key=analyte==='caffeine'?'caffeineMgL':'bacGdL';doc.observations=[];for(let i=1;i<=8;i++){const p=points[Math.min(points.length-1,Math.round(points.length*i/10))];doc.observations.push({id:'synthetic-'+i,timeH:p.tH,analyte,value:p[key],unit:analyte==='caffeine'?'mg/L':'g/dL',matrix:analyte==='caffeine'?'plasma':'whole-blood',role:i%3===0?'evaluation':'calibration',sd:analyte==='caffeine'?.05:.001,qualifier:'=',matrixFactor:null,label:'Synthetic exact model diagnostic'});}doc.observationSource='SYNTHETIC: exact concentrations generated by the current reference scenario. This dataset checks software recovery; it supplies no empirical validation.';if(analyte==='ethanol')doc.fit.parameters=[{id:'ethanolClearanceModifier',lower:.4,upper:2}];this.edit(doc,'Loaded synthetic recovery example');}
 applyFit(name){const result=this.result;if(!this.current||result?.kind!=='fit'||!result.applicable||result.imported)throw Error('Apply requires a current, identifiable, interior fitted result computed in this session.');if(typeof name!=='string'||!name.trim()||name.length>160)throw Error('Enter a calibration profile name of up to 160 characters.');const frame=this.session.capture();for(const[id,value]of Object.entries(result.values))setParameter(frame.document.mainScenario,id,value);frame.science.calibrations.unshift({name:name.trim(),values:v15Clone(result.values),model:MODEL_PROFILE.id,computedAt:result.computedAt,sourceFingerprint:result.releaseFingerprint,observationCount:result.residuals.length,assumptions:result.assumptions});frame.science.calibrations=frame.science.calibrations.slice(0,12);this.session.restore(frame,'Applied calibration '+name.trim());return result.values;}
 exportRecords(){return this.records.map(r=>v15Clone(r));}
 importRecords(records){if(records===undefined)return;this.records=(records??[]).map(r=>({...v15Clone(r),imported:true}));this.result=null;this.status=this.records.length?'imported archive':'idle';this.emit();}
 dispose(){this.cancel();this.unsubscribe?.();this.listeners.clear();}
}
