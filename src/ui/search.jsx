import {h,React,Fragment,bridge,controller,navigate,useSession} from './runtime.mjs';
import {Dialog} from './dialog.jsx';
import {Button,Table,Panel} from './common.jsx';
import {parameterLabel} from './units.mjs';
import {readParameter} from './editors.jsx';
const tasks=[
 {label:'Add intake',terms:'drink ethanol caffeine dose add event',action:'intake'},
 {label:'Person and observation window',terms:'body mass weight kg horizon duration person',action:'person'},
 {label:'Schedule and calendar anchor',terms:'meal time zone model zero clock DST calendar schedule',route:['session','timeline']},
 {label:'Concentration analysis',terms:'BAC caffeine concentration plot curve inspection selected time',route:['session','overview']},
 {label:'Explain model state',terms:'compartment rate flux assumptions counterfactual remove intake',route:['session','explain']},
 {label:'Compare scenarios',terms:'baseline A B delta comparison differences',route:['session','compare']},
 {label:'Saved sessions and recovery',terms:'save restore undo history JSON import export recovery',route:['session','projects']},
 {label:'Report',terms:'download print PDF frozen analysis report',route:['session','report']},
 {label:'Model diagnostics and sources',terms:'diagnostics integrity conservation provenance formula references',route:['expert','']},
 {label:'Sensitivity analysis',terms:'sweep sensitivity perturbation',route:['explore','sweep']},
 {label:'Behavioural interpretation',terms:'traits temperament personality effects behaviour PD',route:['behaviour','']},
 {label:'Concentration observations',terms:'manual measurement observations dataset CSV import SD matrix',route:['session','observations']},
 {label:'Evaluate observations',terms:'evaluation residual RMSE bias held out scientific workbench',route:['session','validation']},
 {label:'Calibrate parameters',terms:'calibration fit fitting scientific workbench',route:['session','calibration']},
 {label:'Parameter uncertainty',terms:'uncertainty seed sampling Monte Carlo distributions scientific workbench',route:['session','uncertainty']},
 {label:'Evidence and provenance',terms:'evidence sources model profile population scientific workbench',route:['session','evidence']},
 {label:'Parameter configuration',terms:'parameter configuration assumptions',route:['session','parameters']},
 {label:'How to use',terms:'help walkthrough instructions example',route:['help','default']}
];
export function parameterMatches(entry,query){
 const q=query.trim().toLowerCase(),name=parameterLabel(entry.id),text=[name,entry.id,entry.path,entry.unit,entry.applicability,entry.message].join(' ').toLowerCase();
 return !q||q.split(/\s+/).every(word=>text.includes(word));
}
export function SearchDialog({onClose,onParameter,onAdd,onPerson}){
 const [query,setQuery]=React.useState(''),q=query.trim().toLowerCase(),entries=bridge.parameters.filter(e=>parameterMatches(e,q)).slice(0,20);
 const results=tasks.filter(t=>!q||q.split(/\s+/).every(word=>(t.label+' '+t.terms).toLowerCase().includes(word)));
 const go=t=>{onClose();if(t.action==='intake')onAdd();else if(t.action==='person')onPerson();else{navigate(...t.route);}};
 return <Dialog title="Find a control or parameter" onClose={onClose} wide><label className="v15-field">Search by name, abbreviation or unit<input autoFocus type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try Vmax, half-life, body mass, g/h or recovery"/></label><p className="v160-help">Select a parameter to inspect its value, unit and validation limits. Apply a valid change to record one Undo operation.</p>
  <div className="v160-search-results">{results.length>0&&<section><h3>Tasks</h3>{results.map(t=><button key={t.label} className="v160-search-result" type="button" aria-label={t.label} onClick={()=>go(t)}><b>{t.label}</b><span>Open task →</span></button>)}</section>}{entries.length>0&&<section><h3>Parameters</h3>{entries.map(e=><button key={e.id} type="button" className="v160-search-result" onClick={()=>{onClose();onParameter(e);}}><span><b>{parameterLabel(e.id)}</b><small>{e.path}</small></span><span>{e.unit||e.type} →</span></button>)}</section>}{!entries.length&&!results.length&&<p>No matching controls. Try a shorter parameter name or its unit.</p>}</div>
 </Dialog>;
}
export function Parameters({onParameter}){
 const state=useSession(),[query,setQuery]=React.useState(''),frame=controller.capture();
 const entries=bridge.parameters.filter(e=>parameterMatches(e,query)),subject=entries.filter(e=>e.path.startsWith('subject.')),constants=entries.filter(e=>e.path.startsWith('constants.'));
 const table=rows=><Table headers={['Parameter','Committed value','Unit','Range / choices','Action']} rows={rows.map(e=>[parameterLabel(e.id),String(readParameter(frame,e.path)??'Model default'),e.unit||'—',e.hard?e.hard.min+' to '+e.hard.max:e.allowed?e.allowed.join(', '):'See parameter details',<Button onClick={()=>onParameter(e)} aria-label={'Edit '+parameterLabel(e.id)}>Inspect / edit</Button>])}/>;
 return <div className="v15-stack"><Panel title="Search the parameter registry"><p className="v160-help">Values are committed scenario inputs. The selected formulation determines which inputs are active. Changes are validated and recorded in Undo history.</p><label className="v15-field v160-search-field">Filter parameters<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Name, field path or unit"/></label><div className="v160-section-heading"><span>{entries.length} matching parameters</span><Button onClick={()=>navigate('expert')}>Diagnostics and coefficient sources</Button></div></Panel>{subject.length>0&&<Panel title="Person, timing and model formulation">{table(subject)}</Panel>}{constants.length>0&&<Panel title="Model constants">{table(constants)}</Panel>}{!entries.length&&<Panel title="No matching parameters"><p>Try a shorter name, an abbreviation or a unit.</p></Panel>}</div>;
}
