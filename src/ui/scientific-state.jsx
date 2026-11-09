import {DatasetContext} from './datasets.jsx';
import {h,React,Fragment,science,useScience,useSession,accepted} from './runtime.mjs';
import {MODEL_PROFILE} from '../science/schema.mjs';
import {datasetReference,scientificResultState} from './scientific-state.mjs';
import {CalculationContext} from './calculation-context.jsx';
export function ScientificState(){
 useScience();useSession();const doc=science.document,rows=doc.observations,key=science.key(),simulation=accepted();
 return <section className="v211-scientific-state" aria-label="Committed scientific state"><div><strong>{datasetReference(doc)}</strong><span>{rows.length} observations · {rows.filter(r=>r.role==='calibration').length} calibration · {rows.filter(r=>r.role==='evaluation').length} evaluation</span><span>Model {MODEL_PROFILE.id}</span></div><div>{[['Evaluation','evaluate'],['Calibration','fit'],['Uncertainty','uncertainty']].map(([name,kind])=><span key={kind}><b>{name}:</b> {scientificResultState(science.resultFor(kind,{includeImported:true}),key)}</span>)}</div><p className="v213-science-context"><a href="#session/overview">Inspect accepted simulation</a> · {simulation.snapshot?<>Snapshot {simulation.snapshot.snapshotId} · {simulation.input.subject.bodyMassKg} kg · {simulation.horizon} h · {simulation.current?"matches committed scenario":"previous accepted inputs; update the calculation before new scientific analysis"}</>:"First accepted calculation pending"}. Scientific results use their own captured dataset and configuration.</p><DatasetContext context={doc.datasetContext} observations={rows}/></section>;
}
export function ScientificResultOrigin({result,pending=false}){
 useScience();useSession();if(!result)return null;
 return <CalculationContext name="Scientific calculation context" className={'v211-result-origin v240-context '+(!science.isCurrent(result)||pending?'previous':'')} label={pending?'Captured analysis · Editor configuration differs; recompute':'Captured analysis · '+scientificResultState(result,science.key())} description={<>Captured {result.computedAt??'in archived session'} · {result.modelProfile?.id??'reference-1.60'}{result.document&&' · '+datasetReference(result.document)}{result.releaseFingerprint&&' · Build '+result.releaseFingerprint.slice(0,12)}</>}/>;
}
