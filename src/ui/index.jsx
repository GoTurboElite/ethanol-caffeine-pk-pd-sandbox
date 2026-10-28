import {h,React,Fragment,bridge,controller,pwa,preferences,v15InitUI,useSession,usePWA,usePreferences,navigate,action,announce,download} from './runtime.mjs';
import {Button} from './common.jsx';
import {V15Timeline} from './timeline.jsx';
import {V15Explain} from './explain.jsx';
import {V15Projects} from './projects.jsx';
import {V15Comparison} from './comparison.jsx';
import {V15Report} from './report-view.jsx';
import {V15Help} from './help.jsx';
import {Overview} from './overview.jsx';
import {IntakeDialog,PersonDialog,ParameterDialog} from './editors.jsx';
import {PreferencesDialog} from './settings.jsx';
import {SearchDialog,Parameters} from './search.jsx';
import {Observations,ScienceWorkspace} from './science.jsx';
const analysisRoutes=[['Overview','session','overview'],['Explain','session','explain'],['Behaviour','behaviour',''],['Scientific workbench','session','validation'],['Parameters','session','parameters'],['Diagnostics','expert',''],['Numerical data','results','data']];
function locationFor(state){
 const r=state.presentation.selectedWorkspace,v=state.presentation.selectedSubview||'timeline';
 if(r==='help')return {group:'help',title:'How to use',view:'help',native:true};
 if(r==='session'){
  if(v==='timeline')return {group:'session',title:'Session',view:v,native:true};
  if(v==='observations')return {group:'session',title:'Concentration observations',view:v,native:true};
  if(['calibration','uncertainty','validation','evidence'].includes(v))return {group:'analysis',title:'Scientific workbench',view:v,native:true};
  if(v==='compare')return {group:'compare',title:'Compare scenarios',view:v,native:true};
  if(v==='projects')return {group:'saved',title:'Saved sessions',view:v,native:true};
  if(v==='report')return {group:'document',title:'Analysis report',view:v,native:true};
  return {group:'analysis',title:v==='overview'?'Analysis':v==='parameters'?'Parameters and assumptions':'Explain model state',view:v,native:true};
 }
 if(r==='calculate')return {group:'session',title:'Session inputs',view:'inputs',native:false};
 if(r==='explore')return {group:'compare',title:state.presentation.exploreView==='sweep'?'Sensitivity analysis':'Comparison editor',view:'explore',native:false};
 if(r==='export')return {group:'document',title:'Export analytical data',view:'export',native:false};
 return {group:'analysis',title:r==='expert'?'Model diagnostics':r==='behaviour'?'Behavioural interpretation':'Numerical results',view:r,native:false};
}
function CalculationState({state}){
 const current=state.snapshots.relationToDraft==='current',busy=['queued','running'].includes(state.execution.status),invalid=state.editingInvalidCount||state.draft.validation.status==='invalid';
 let label=invalid?'Input requires attention':busy?'Updating calculation':state.execution.status==='failed'?'Calculation failed':current?'Current calculation':state.snapshots.currentSnapshotId?'Previous accepted result':'Preparing calculation';
 return <div className={'v160-calculation-state'+(invalid?' error':current?' current':' pending')}><span role="status"><i aria-hidden="true"/><strong>{label}</strong>{!current&&state.snapshots.currentSnapshotId&&<span> · results retain the previous accepted inputs</span>}</span>{busy?<Button onClick={()=>bridge.store.cancel()}>Cancel calculation</Button>:!current&&!invalid?<Button onClick={()=>bridge.store.calculate()}>Update calculation</Button>:invalid?<Button onClick={()=>navigate('calculate')}>Review inputs</Button>:null}</div>;
}
export function createV15UI(value){
 const integration=v15InitUI(value);
 function Shell({legacy}){
  const state=useSession(),offline=usePWA(),prefs=usePreferences(),place=locationFor(state),[dialog,setDialog]=React.useState(null),[parameter,setParameter]=React.useState(null),[event,setEvent]=React.useState(null),[systemDark,setSystemDark]=React.useState(()=>window.matchMedia('(prefers-color-scheme: dark)').matches);
  const native=place.native,depth=state.presentation.detailMode;
  React.useEffect(()=>{if(!window.location.hash)window.location.replace('#calculate');},[]);
  React.useEffect(()=>{const media=window.matchMedia('(prefers-color-scheme: dark)'),change=()=>setSystemDark(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  React.useLayoutEffect(()=>{
   const root=document.documentElement,theme=prefs.theme==='clarity-system'?(systemDark?'dark':'light'):/dark|midnight/.test(prefs.theme)?'dark':'light';
   root.dataset.v160Theme=theme;root.dataset.v160Palette=prefs.theme;root.dataset.v160Density=prefs.density;root.dataset.v160Contrast=String(prefs.contrast);root.dataset.v160Motion=prefs.motion;root.dataset.v160LineSpacing=prefs.lineSpacing;root.dataset.v160Focus=String(prefs.focus);root.dataset.v160Explanations=prefs.explanations;root.dataset.v160Signals=prefs.palette;root.dataset.v160Text=String(prefs.textSize);root.style.setProperty('--v160-text-size',prefs.textSize+'px');root.style.setProperty('--v160-scale',String(prefs.textSize/16));
   document.body.dataset.v160Legacy=String(!native);document.body.dataset.v160Page=place.view;
   delete document.body.dataset.v15Workspace;document.title=place.title+' · PK/PD Sandbox v2.0.0';
  },[prefs,systemDark,native,place.view,place.title]);
  React.useEffect(()=>{const fn=e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setDialog('search');}};window.addEventListener('keydown',fn);return()=>window.removeEventListener('keydown',fn);},[]);
  React.useEffect(()=>{const flush=()=>{if(controller.recoveryEnabled)controller.flushRecovery().catch(()=>{});},visibility=()=>{if(document.visibilityState==='hidden')flush();};window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',visibility);return()=>{window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',visibility);};},[]);
  const close=()=>{setDialog(null);setParameter(null);setEvent(null);};
  const add=()=>{setEvent(null);setDialog('intake');},person=()=>setDialog('person'),edit=e=>{setEvent(e);setDialog('intake');},param=e=>{setParameter(e);setDialog('parameter');};
  const exportSession=()=>action(()=>download('pkpd-session-v2.0.0.json',JSON.stringify(controller.project(true),null,2)),'Session JSON prepared.');
  const status=offline.status==='ready'?(offline.online?'Offline ready':'Offline · cached release'):offline.status==='standalone'?'Standalone build':offline.status==='failed'?'Offline setup unavailable':'Preparing offline cache';
  const notification=controller.notice,showNotification=notification&&(notification.kind==='error'||prefs.notifications==='all');
  const subnav=place.group==='session'?[['Inputs','calculate',''],['Schedule','session','timeline'],['Observations','session','observations']]:place.group==='analysis'?analysisRoutes:place.group==='compare'?[['Comparison','session','compare'],['Full editor','explore','compare'],['Sensitivity','explore','sweep']]:[];
  return <div className="v160-app">
   <a className="v160-skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content')?.focus();}}>Skip to workspace</a>
   <header className="v160-header"><div className="v160-brand"><a href="#calculate" aria-label="PK/PD Sandbox session home"><span className="v160-mark" aria-hidden="true">pk</span><span>PK/PD Sandbox <small>2.0</small></span></a><span className="v160-session-name" title={state.document.title}>{state.document.title||'Untitled session'}</span></div><div className="v160-header-actions"><Button aria-label="Find a control or parameter" onClick={()=>setDialog('search')}><span aria-hidden="true">⌕</span> Find control <kbd>Ctrl K</kbd></Button><Button onClick={()=>navigate('session','report')}>Report</Button><details className="v160-document-menu"><summary>Export</summary><div><button type="button" disabled={!controller.canSave()} onClick={exportSession}>Session JSON</button><a href="#export">Analytical data</a><a href="./standalone-v2.0.0.html" download>Standalone HTML</a></div></details><Button onClick={()=>navigate('help',depth)}>Help</Button><Button onClick={()=>setDialog('settings')}>Settings</Button></div></header>
   <div className="v160-navigation"><nav aria-label="Main workspaces">{[['Session','session','#calculate'],['Analysis','analysis','#session/overview'],['Compare','compare','#session/compare'],['Saved sessions','saved','#session/projects']].map(([label,key,href])=><a key={key} href={href} aria-current={place.group===key?'page':undefined}>{label}</a>)}</nav><div className="v160-view-controls"><div className="v160-undo-controls" role="group" aria-label="Editing history"><Button aria-label="Undo committed scenario edit" aria-disabled={!controller.history.canUndo} onClick={()=>{if(controller.history.canUndo)action(()=>controller.undo());}}>↶ <span>Undo</span></Button><Button aria-label="Redo committed scenario edit" aria-disabled={!controller.history.canRedo} onClick={()=>{if(controller.history.canRedo)action(()=>controller.redo());}}>↷ <span>Redo</span></Button></div><label>Scientific depth<select aria-label="Scientific depth" value={depth} onChange={e=>controller.setDetailMode(e.target.value)}><option value="default">Default</option><option value="detailed">Detailed</option><option value="expert">Expert</option></select></label></div></div>
   <main id="main-content" tabIndex="-1"><div className="v160-page-heading"><h1>{place.title}</h1>{subnav.length>0&&<nav aria-label={place.group==='session'?'Session views':place.group==='compare'?'Comparison views':'Analysis views'}>{subnav.map(([label,route,view])=><a key={label} href={'#'+route+(view?'/'+view:'')} aria-current={state.presentation.selectedWorkspace===route&&(view?state.presentation.selectedSubview===view:route!=='session')?'page':undefined}>{label}</a>)}</nav>}</div>
    <CalculationState state={state}/>
    {showNotification&&<div className={'v160-feedback '+notification.kind} role={notification.kind==='error'?'alert':'status'}><span>{notification.text}</span><button type="button" aria-label="Dismiss message" onClick={()=>{controller.notice=null;controller.emit();}}>×</button></div>}
    {!showNotification&&notification&&<span className="v160-sr" role="status">{notification.text}</span>}
    {offline.waiting&&<div className="v160-update"><span>An application update is ready.</span><Button onClick={()=>action(()=>pwa.activate())}>Save session and update</Button></div>}
    {native&&<div className="v160-workspace v15-main" data-detail-mode={depth}>
     {place.view==='overview'?<Overview onAdd={add} onEditPerson={person} onEditIntake={edit}/>:place.view==='timeline'?<V15Timeline/>:place.view==='observations'?<Observations/>:['calibration','uncertainty','validation','evidence'].includes(place.view)?<ScienceWorkspace view={place.view}/>:place.view==='explain'?<V15Explain/>:place.view==='compare'?<V15Comparison/>:place.view==='projects'?<V15Projects/>:place.view==='report'?<V15Report/>:place.view==='parameters'?<Parameters onParameter={param}/>:<V15Help/>}
    </div>}
    <div className="v160-legacy-slot" hidden={native}>{legacy}</div>
   </main>
   <footer className="v160-footer"><span>Educational model · modelled concentrations and heuristic response indices</span><span>{status}{controller.recoveryEnabled?' · recovery '+controller.storageStatus:''}</span><button type="button" className="v160-link" onClick={()=>bridge.openSurface('about')}>Model sources and release identity</button></footer>
   {dialog==='search'&&<SearchDialog onClose={close} onParameter={param} onAdd={add} onPerson={person}/>}
   {dialog==='settings'&&<PreferencesDialog onClose={close}/>}
   {dialog==='intake'&&<IntakeDialog event={event} onClose={close}/>}
   {dialog==='person'&&<PersonDialog onClose={close}/>}
   {dialog==='parameter'&&parameter&&<ParameterDialog entry={parameter} onClose={close}/>}
  </div>;
 }
 return{...integration,Shell};
}

