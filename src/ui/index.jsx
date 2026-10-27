import {h,React,Fragment,bridge,controller,pwa,v15InitUI,useSession,usePWA,navigate,action,announce} from './runtime.mjs';
import {Button} from './common.jsx';
import {V15Timeline} from './timeline.jsx';
import {V15Explain} from './explain.jsx';
import {V15Projects} from './projects.jsx';
import {V15Comparison} from './comparison.jsx';
import {V15Report} from './report-view.jsx';
import {V15Help} from './help.jsx';
export function createV15UI(value){
 const integration=v15InitUI(value);
 const titles={timeline:['Session','One chronology for the complete exposure schedule.'],explain:['Explain','Inspect the accepted model state and its assumptions.'],compare:['Compare','Make the changed inputs and resulting differences explicit.'],projects:['Saved states','Recover, name, export and revisit committed analytical states.'],report:['Report','Freeze an accepted analysis into a readable document.']};
 function Shell(){
  const state=useSession(),offline=usePWA(),route=state.presentation.selectedWorkspace;
  const active=route==='session'||route==='help',view=route==='help'?'help':(state.presentation.selectedSubview||'timeline'),title=route==='help'?['How to use','Action, expected result and scope at each expertise level.']:(titles[view]??titles.timeline);
  React.useLayoutEffect(()=>{
   document.body.dataset.v15Workspace=active?'true':'false';
   document.documentElement.dataset.v15Theme=state.presentation.theme||'clarity-system';
  },[active,state.presentation.theme]);
  React.useEffect(()=>{
   const flush=()=>{if(controller.recoveryEnabled)controller.flushRecovery().catch(()=>{});};
   const visibility=()=>{if(document.visibilityState==='hidden')flush();};
   window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',visibility);
   return()=>{window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  const status=offline.status==='ready'?(offline.online?'Offline ready':'Offline · cached release'):offline.status==='standalone'?'Standalone build':offline.status==='failed'?'Offline setup unavailable':'Preparing offline cache';
  return <div className="v15-shell">
   <div className="v15-topline"><a className="v15-brand" href="#calculate"><span className="v15-symbol" aria-hidden="true">∿</span><span>PK/PD Sandbox <strong>1.5</strong></span></a><span className={'v15-offline '+(offline.status==='ready'?'ready':'')} role="status">{status}</span><div className="v15-top-actions">
    {offline.prompt&&<Button onClick={()=>action(()=>pwa.install())}>Install app</Button>}
    {offline.waiting?<Button primary onClick={()=>action(()=>pwa.activate())}>Save session and update</Button>:offline.registration&&<Button onClick={()=>action(()=>pwa.check())}>Check for update</Button>}
    <a className="v15-text-link" href="./standalone-v1.5.0.html" download>Standalone HTML</a>
   </div></div>
   <nav className="v15-nav" aria-label="Session and guidance workspaces">
    {[[null,'Calculator'],['timeline','Session'],['explain','Explain'],['compare','Compare'],['projects','Saved states'],['report','Report'],['help','How to use']].map(([key,label])=><Button key={label} aria-current={(key==='help'?route==='help':key===null?route==='calculate':route==='session'&&view===key)?'page':undefined} onClick={()=>key==='help'?navigate('help',state.presentation.detailMode):key===null?navigate('calculate'):navigate('session',key)}>{label}</Button>)}
    <div className="v15-history-controls"><Button aria-label="Undo committed scenario edit" disabled={!controller.history.canUndo} onClick={()=>action(()=>controller.undo())}>Undo</Button><Button aria-label="Redo committed scenario edit" disabled={!controller.history.canRedo} onClick={()=>action(()=>controller.redo())}>Redo</Button></div>
   </nav>
   {controller.notice&&<div className={'v15-feedback '+controller.notice.kind} role={controller.notice.kind==='error'?'alert':'status'}><span>{controller.notice.text}</span><button type="button" aria-label="Dismiss message" onClick={()=>{controller.notice=null;controller.emit();}}>×</button></div>}
   {offline.message&&<p className="v15-offline-message" role="status">{offline.message}</p>}
   {active&&<main className="v15-main" data-detail-mode={state.presentation.detailMode}>
    <header className="v15-page-heading"><div><p className="v15-kicker">Ethanol + Caffeine · session and analysis release</p><h1>{title[0]}</h1><p>{title[1]}</p></div><label className="v15-field">Application detail<select aria-label="Application detail level" value={state.presentation.detailMode} onChange={e=>controller.setDetailMode(e.target.value)}><option value="default">Default</option><option value="detailed">Detailed</option><option value="expert">Expert</option></select></label></header>
    {route==='help'?<V15Help/>:view==='explain'?<V15Explain/>:view==='compare'?<V15Comparison/>:view==='projects'?<V15Projects/>:view==='report'?<V15Report/>:<V15Timeline/>}
   </main>}
  </div>;
 }
 return{...integration,Shell};
}
