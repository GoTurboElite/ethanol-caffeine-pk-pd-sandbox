import {h,React,Fragment,bridge,controller,action,navigate} from './runtime.mjs';
import {Button} from './common.jsx';
import {Dialog} from './dialog.jsx';
import {v15Clone,v15Finite,v15Id} from '../session/core.mjs';
import {parameterLabel} from './units.mjs';
function ErrorText({error}){return error?<p className="v160-error" role="alert">{error}</p>:null;}
export function IntakeDialog({onClose,event=null}){
 const [values,setValues]=React.useState(()=>({label:event?.label??'New intake',startTimeH:String(event?.startTimeH??controller.store.state.presentation.selectedTimeH??0),durationMin:String(event?.durationMin??15),ethanolGrams:String(event?.ethanolGrams??0),caffeineMg:String(event?.caffeineMg??0),servings:String(event?.servings??1)})),[error,setError]=React.useState('');
 const change=(key,value)=>setValues(v=>({...v,[key]:value}));
 const submit=e=>{e.preventDefault();try{
  const frame=controller.capture(),item={...(event??{}),id:event?.id??v15Id('dose'),label:values.label.trim()||'Intake',doseBasis:'direct ethanol mass',caffeineDoseMode:'direct',beverageType:event?.beverageType??'custom'};
  for(const k of ['startTimeH','durationMin','ethanolGrams','caffeineMg','servings'])item[k]=v15Finite(values[k],k);
  const items=frame.document.mainScenario.doseEvents,at=items.findIndex(v=>v.id===item.id);if(at>=0)items[at]=item;else items.push(item);
  controller.restore(frame,event?'Edited intake':'Added intake');onClose();
 }catch(e){setError(e.message);}};
 return <Dialog title={event?'Edit direct intake':'Add intake'} onClose={onClose}><form onSubmit={submit}>
  <p className="v160-help">Enter direct amounts per serving. Start time is measured from model zero. For drink-volume recipes and beverage presets, use the full intake editor.</p>
  <label className="v15-field">Intake label<input autoFocus value={values.label} maxLength="160" onChange={e=>change('label',e.target.value)}/></label>
  <div className="v15-form-grid">{[['startTimeH','Start, elapsed hours'],['durationMin','Duration, minutes'],['ethanolGrams','Ethanol per serving, g'],['caffeineMg','Caffeine per serving, mg'],['servings','Number of servings']].map(([key,label])=><label className="v15-field" key={key}>{label}<input inputMode="decimal" value={values[key]} onChange={e=>change(key,e.target.value)} required/></label>)}</div>
  <ErrorText error={error}/><div className="v15-actions"><Button primary type="submit">{event?'Apply intake changes':'Add intake to session'}</Button><Button onClick={onClose}>Cancel</Button><Button onClick={()=>{onClose();navigate('calculate');}}>Full intake editor</Button></div>
 </form></Dialog>;
}
export function PersonDialog({onClose}){
 const subject=bridge.store.state.document.mainScenario.subject;
 const [mass,setMass]=React.useState(String(subject.bodyMassKg)),[horizon,setHorizon]=React.useState(String(subject.simulationDurationH)),[error,setError]=React.useState('');
 const submit=e=>{e.preventDefault();try{const f=controller.capture();f.document.mainScenario.subject.bodyMassKg=v15Finite(mass,'Body mass');f.document.mainScenario.subject.simulationDurationH=v15Finite(horizon,'Observation horizon');f.presentation.selectedTimeH=Math.min(f.presentation.selectedTimeH,f.document.mainScenario.subject.simulationDurationH);controller.restore(f,'Edited reference person and horizon');onClose();}catch(e){setError(e.message);}};
 return <Dialog title="Person and observation window" onClose={onClose}><form onSubmit={submit}><div className="v15-form-grid"><label className="v15-field">Body mass, kg<input autoFocus inputMode="decimal" value={mass} onChange={e=>setMass(e.target.value)} required/></label><label className="v15-field">Observation horizon, h<input inputMode="decimal" value={horizon} onChange={e=>setHorizon(e.target.value)} required/></label></div><p className="v160-help">Composition, physiology, food and initial conditions are available in the full person editor.</p><ErrorText error={error}/><div className="v15-actions"><Button primary type="submit">Apply person and horizon</Button><Button onClick={onClose}>Cancel</Button><Button onClick={()=>{onClose();navigate('calculate');setTimeout(()=>bridge.openSurface('person'),80);}}>Full person editor</Button></div></form></Dialog>;
}
export function readParameter(frame,path){return path.split('.').reduce((obj,k)=>obj?.[k],frame.document.mainScenario);}
export function ParameterDialog({entry,onClose}){
 const current=readParameter(controller.capture(),entry.path),[value,setValue]=React.useState(current==null?'':String(current)),[error,setError]=React.useState('');
 const submit=e=>{e.preventDefault();try{
  const frame=controller.capture(),parts=entry.path.split('.');let node=frame.document.mainScenario;
  for(const k of parts.slice(0,-1))node=node[k]??(node[k]={});
  let next;if(entry.type==='number')next=v15Finite(value,parameterLabel(entry.id));else if(entry.type==='boolean')next=value==='true';else next=value;
  if(entry.allowed&&!entry.allowed.includes(next))throw Error('Choose a supported value.');
  if(entry.hard&&(next<entry.hard.min||next>entry.hard.max))throw Error('Value must be between '+entry.hard.min+' and '+entry.hard.max+'.');
  node[parts.at(-1)]=next;frame.presentation.selectedTimeH=Math.min(frame.presentation.selectedTimeH,frame.document.mainScenario.subject.simulationDurationH);
  controller.restore(frame,'Changed '+parameterLabel(entry.id));onClose();
 }catch(e){setError(e.message);}};
 const options=entry.allowed??(entry.type==='boolean'?[false,true]:null),editable=['number','boolean','enum','select'].includes(entry.type)||options;
 return <Dialog title={parameterLabel(entry.id)} onClose={onClose}><form onSubmit={submit}><p className="v160-help">{entry.applicability}</p><label className="v15-field">{parameterLabel(entry.id)}{entry.unit?' · '+entry.unit:''}{options?<select autoFocus value={value} onChange={e=>setValue(e.target.value)}>{current==null&&<option value="">Choose a value</option>}{options.map(v=><option key={String(v)} value={String(v)}>{String(v)}</option>)}</select>:<input autoFocus inputMode={entry.type==='number'?'decimal':undefined} value={value} onChange={e=>setValue(e.target.value)} readOnly={!editable}/>}</label><p className="v160-help">{entry.message}{entry.hard?' Supported range: '+entry.hard.min+' to '+entry.hard.max+'.':''}</p><code className="v160-param-path">{entry.path}</code><ErrorText error={error}/><div className="v15-actions">{editable&&<Button primary type="submit">Apply parameter</Button>}<Button onClick={onClose}>Close</Button></div></form></Dialog>;
}
