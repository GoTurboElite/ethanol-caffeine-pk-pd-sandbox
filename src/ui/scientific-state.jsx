import {h,React,Fragment,science,useScience,useSession} from './runtime.mjs';
import {MODEL_PROFILE} from '../science/schema.mjs';
import {datasetReference,scientificResultState} from './scientific-state.mjs';
export function ScientificState(){
 useScience();useSession();const doc=science.document,rows=doc.observations,key=science.key();
 return <section className="v211-scientific-state" aria-label="Committed scientific state"><div><strong>{datasetReference(doc)}</strong><span>{rows.length} observations · {rows.filter(r=>r.role==='calibration').length} calibration · {rows.filter(r=>r.role==='evaluation').length} evaluation</span><span>Model {MODEL_PROFILE.id}</span></div><div>{[['Evaluation','evaluate'],['Calibration','fit'],['Uncertainty','uncertainty']].map(([name,kind])=><span key={kind}><b>{name}:</b> {scientificResultState(science.resultFor(kind,{includeImported:true}),key)}</span>)}</div></section>;
}
export function ScientificResultOrigin({result,pending=false}){
 useScience();useSession();if(!result)return null;
 return <p className={'v211-result-origin '+(!science.isCurrent(result)||pending?'previous':'')} role="status"><b>{pending?'Editor configuration differs; recompute':scientificResultState(result,science.key())}.</b> Captured {result.computedAt??'in archived session'} · {result.modelProfile?.id??'reference-1.60'}. {result.releaseFingerprint&&<span>Build {result.releaseFingerprint.slice(0,12)}.</span>}</p>;
}
