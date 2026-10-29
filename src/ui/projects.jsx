import {h,React,Fragment,bridge,controller,action,announce,useSession,download} from './runtime.mjs';
import {Panel,Button,Table,Disclosure} from './common.jsx';
import {V15_MAX_PROJECT_BYTES,v15Number,v15FormatInstant} from '../session/core.mjs';
export function V15Projects(){
 const state=useSession(),[name,setName]=React.useState(''),[includeHistory,setIncludeHistory]=React.useState(true),fileRef=React.useRef(null);
 const imported=async event=>{
  const file=event.target.files?.[0];event.target.value='';if(!file)return;
  if(file.size>V15_MAX_PROJECT_BYTES){announce('Session files are limited to 8 MiB.','error');return;}
  await action(async()=>controller.importText(await file.text()),'Session imported and validated.');
 };
 const exportSession=()=>action(()=>download('pkpd-session-v2.1.0.json',JSON.stringify(controller.project(includeHistory),null,2)),'Session JSON prepared for download.');
 return <div className="v15-stack">
  <Panel title="Portable session documents" kicker="Saved states and recovery">
   <p>A session document contains the committed scenario, comparison state, absolute anchor, time zone, analysis markers and optional bounded editing history. Existing 0.8.2 scenario JSON files can also be imported.</p>
   <div className="v15-actions"><Button primary disabled={!controller.canSave()} onClick={exportSession}>Export session JSON</Button><Button onClick={()=>fileRef.current.click()}>Import session or legacy scenario</Button><label className="v15-checkbox"><input type="checkbox" checked={includeHistory} onChange={e=>setIncludeHistory(e.target.checked)}/>Include editing history</label><input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={imported}/></div>
   {!controller.canSave()&&<p>Finish or correct incomplete inputs before saving or exporting the current session.</p>}
  </Panel>
  <Panel title="Session recovery">
   <label className="v15-checkbox"><input type="checkbox" checked={controller.recoveryEnabled} onChange={e=>action(()=>controller.setRecovery(e.target.checked))}/>Enable session recovery in this browser</label>
   <p role="status"><strong>{controller.storageStatus}</strong> · {controller.message||'Choose a recovery setting. Saved states and exported files are available separately.'}</p>
   <div className="v15-actions"><Button disabled={!controller.canSave()} onClick={()=>action(()=>controller.flushRecovery(true),'Recovery copy saved.')}>Save recovery copy now</Button><Button disabled={!controller.recovery} onClick={()=>action(()=>controller.restoreRecovery(),'Recovery copy restored.')}>Restore recovery copy</Button><Button disabled={!controller.recovery} onClick={()=>action(()=>controller.clearRecovery(),'Recovery copy cleared.')}>Clear recovery copy</Button></div>
   {controller.recovery&&<p className="v15-note">Available copy: {new Date(controller.recovery.updatedAt).toLocaleString()} · {controller.recovery.project.frame.document.title||'Untitled scenario'}</p>}
   <p className="v15-note">Storage backend: {controller.storage.mode}. Keep an exported session file for restoration in another browser or device. Earlier scenario autosaves remain available through the compatibility control below.</p>
  </Panel>
  <Panel title="Named saved states">
   <div className="v15-actions"><label className="v15-field">Saved-state name<input value={name} maxLength="160" onChange={e=>setName(e.target.value)} placeholder="Baseline before timing change"/></label><Button primary disabled={!controller.canSave()} onClick={()=>action(async()=>{await controller.saveNamed(name);setName('');},'Named state saved.')}>Save named state</Button></div>
   {controller.projects.length?<Table headers={['Name','Saved','Scenario','Actions']} rows={controller.projects.map(p=>[
    p.label,new Date(p.updatedAt).toLocaleString(),p.project.frame.document.title||'Untitled scenario',
    <div className="v15-actions"><Button onClick={()=>action(()=>controller.loadNamed(p.id),'Named state loaded.')}>Load</Button><Button onClick={()=>action(()=>download('pkpd-'+p.id+'.json',JSON.stringify(p.project,null,2)))}>Export</Button><Button onClick={()=>{if(window.confirm('Remove this named browser-local saved state?'))action(()=>controller.deleteNamed(p.id),'Named state removed.');}}>Delete</Button></div>
   ])}/>:<p>No named states have been saved in this browser.</p>}
  </Panel>
  <Disclosure id="legacy-autosave" title="Earlier scenario autosave"><p className="v160-help">Review a legacy scenario autosave and its import preview before applying it. Current session history remains available through Undo.</p><Button onClick={()=>bridge.openSurface('scenario')}>Review earlier scenario autosave</Button></Disclosure>
  <Disclosure id="editing-history" title="Editing history">
   <p>History stores up to 60 committed document states. Selecting an earlier state preserves a redo path until a new edit is made.</p>
   <div className="v15-actions"><Button disabled={!controller.history.canUndo} onClick={()=>action(()=>controller.undo())}>Undo</Button><Button disabled={!controller.history.canRedo} onClick={()=>action(()=>controller.redo())}>Redo</Button></div>
   <div className="v15-history">{controller.history.entries.map((e,i)=><Button key={i} aria-pressed={i===controller.history.index} onClick={()=>action(()=>controller.jump(i))}><strong>{i+1}. {e.label}</strong><small>{new Date(e.at).toLocaleTimeString()}{i===controller.history.index?' · current':''}</small></Button>)}</div>
   {controller.importedHistory.length>0&&<details className="v15-details"><summary>History retained from the imported document</summary><p>Loading an imported historical state creates an undoable edit in this working session.</p><div className="v15-history">{controller.importedHistory.map((e,i)=><Button key={i} onClick={()=>action(()=>controller.restore(e.frame,'Loaded imported history state'),'Imported historical state loaded.')}>{i+1}. {e.label}</Button>)}</div></details>}
  </Disclosure>
 </div>;
}
