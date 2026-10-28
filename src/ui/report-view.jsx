import {h,React,Fragment,bridge,controller,science,action,useSession,accepted,download,navigate} from './runtime.mjs';
import {Panel,Button,Table,SnapshotNotice,EmptyResult} from './common.jsx';
import {v15Stable,v15Number} from '../session/core.mjs';
import {v15BuildReport} from './report.mjs';
export function V15Report(){
 const state=useSession(),{snapshot,result,current}=accepted(),[depth,setDepth]=React.useState(state.presentation.detailMode),[generated,setGenerated]=React.useState(null);
 const inputKey=state.document.comparisonEnabled?v15Stable(controller.comparisonInput()):'disabled';
 React.useEffect(()=>{if(state.document.comparisonEnabled)controller.requestComparison();},[inputKey]);
 const comparison=controller.comparison,comparisonReady=!state.document.comparisonEnabled||(comparison?.status==='valid'&&comparison.key===inputKey);
 const ready=current&&comparisonReady;
 const make=()=>action(()=>{
  if(!ready)throw Error('Wait for current accepted main and comparison results before generating the report.');
  const frame=controller.validateFrame(controller.capture()),html=v15BuildReport({frame,result,snapshotId:snapshot.snapshotId,versions:{...bridge.versions},depth,scienceResults:science.exportRecords(),eventAmounts:Object.fromEntries(frame.document.mainScenario.doseEvents.map(e=>[e.id,{ethanolGrams:bridge.ethanolAmount(e,frame.document.mainScenario.constants),caffeineMg:bridge.caffeineAmount(e)}])),comparison:state.document.comparisonEnabled?comparison:null});
  download('pkpd-analysis-v2.0.0.html',html,'text/html;charset=utf-8');
  setGenerated({snapshotId:snapshot.snapshotId,time:new Date().toLocaleString(),bytes:new TextEncoder().encode(html).byteLength});
 },'Analysis report prepared for download.');
 return <div className="v15-stack"><SnapshotNotice state={state} snapshot={snapshot}/>
  <Panel title="A frozen, readable analysis document" kicker="Report">
   <p>The report freezes the accepted calculation, chronology and provenance. Concentrations use explicitly labelled canonical units. Detailed and Expert depth add assumptions, compartments and numerical provenance.</p>
   <div className="v15-actions"><label className="v15-field">Report depth<select value={depth} onChange={e=>setDepth(e.target.value)}>{['default','detailed','expert'].map(v=><option key={v} value={v}>{v[0].toUpperCase()+v.slice(1)}</option>)}</select></label><Button primary disabled={!ready} onClick={make}>Download analysis report</Button><Button onClick={()=>navigate('session','projects')}>Export editable session</Button></div>
   {!current&&<p>Finish input editing and wait for a Current accepted result.</p>}{!comparisonReady&&<p>Waiting for the enabled A/B comparison to finish.</p>}
   <p className="v15-note">Open the downloaded HTML in a browser. Use the browser’s Print command to produce a PDF. The separate session JSON preserves editable state and history.</p>
   {generated&&<p role="status">Prepared {generated.time} · {v15Number(generated.bytes)} bytes · snapshot {generated.snapshotId}.</p>}
  </Panel>
  <Panel title="Report contents"><Table headers={['Depth','Included content']} rows={[
   ['Default','Release identity, calendar anchor, selected time, full-horizon curves, summary, intakes, threshold intervals, markers and accepted comparison.'],
   ['Detailed','Default content plus physiology, active assumptions, meal events and selected-time compartment amounts.'],
   ['Expert','Detailed content plus complete constants, numerical summary metadata and the complete reproducible input state.']
  ]}/></Panel>
 </div>;
}
