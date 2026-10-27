import {h,React,Fragment,controller,usePreferences} from './runtime.mjs';
import {v15ChartSamples,v15Interpolate,v15Number,v15TimeLabel} from '../session/core.mjs';
import {bacText,bacUnit,bacValue} from './units.mjs';
import {Inspector} from './common.jsx';
export function ConcentrationPlots({state,result,input}){
 const box=React.useRef(null),[width,setWidth]=React.useState(840);
 React.useLayoutEffect(()=>{const observer=new ResizeObserver(entries=>{const value=Math.max(240,Math.round(entries[0].contentRect.width));setWidth(old=>old===value?old:value);});if(box.current)observer.observe(box.current);return()=>observer.disconnect();},[]);
 const prefs=usePreferences(),points=React.useMemo(()=>v15ChartSamples(result.analysisPoints??result.points),[result]),time=state.presentation.selectedTimeH;
 const point=v15Interpolate(result.analysisPoints??result.points,time),end=result.summary.horizonH??points.at(-1)?.tH??24;
 const [W,L,R,T,B]=[width,52,width-18,12,106],x=t=>L+(R-L)*t/(end||1),bacMax=Math.max(.01,result.summary.peakBACGdL||0)*1.12,cafMax=Math.max(1,result.summary.peakCaffeineMgL||0)*1.12;
 const path=(key,max)=>points.map((p,i)=>(i?'L':'M')+x(p.tH).toFixed(2)+','+(B-(B-T)*(p[key]??0)/max).toFixed(2)).join(' ');
 const inspect=e=>{const svg=e.currentTarget,p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;const matrix=svg.getScreenCTM();if(!matrix)return;const local=p.matrixTransform(matrix.inverse()),t=(local.x-L)/(R-L)*end;if(t>=0&&t<=end)controller.inspect(t);};
 const marks=()=> <>{(input?.doseEvents??[]).filter(e=>e.startTimeH>=0&&e.startTimeH<=end).map(e=><rect key={e.id} x={x(e.startTimeH)} y={B+5} width={Math.max(3,x(Math.min(end,e.startTimeH+(e.durationMin??0)/60))-x(e.startTimeH))} height="4" rx="2" fill="var(--v160-muted)"><title>{e.label||'Intake'}</title></rect>)}{controller.markers.filter(m=>m.timeH>=0&&m.timeH<=end).map(m=><line key={m.id} x1={x(m.timeH)} x2={x(m.timeH)} y1={T} y2={B} className="v160-marker-line"><title>{m.label}</title></line>)}{time>=0&&time<=end&&<line x1={x(time)} x2={x(time)} y1={T} y2={B} className="v160-cursor-line"/>}</>;
 const grid=(max,bac)=><>{[0,.5,1].map(v=><g key={v}><line x1={L} x2={R} y1={B-v*(B-T)} y2={B-v*(B-T)} className="v160-grid-line"/><text x={L-9} y={B-v*(B-T)+4} textAnchor="end">{bac?bacValue(v*max,state.presentation).toFixed(3):v15Number(v*max,1)}</text></g>)}{(W<450?[0,.5,1]:[0,.25,.5,.75,1]).map(v=><text key={v} x={x(v*end)} y="133" textAnchor="middle">{v15Number(v*end,1)} h</text>)}</>;
 const plot=(bac)=>{
  const key=bac?'bacGdL':'caffeineMgL',max=bac?bacMax:cafMax,peak=bac?result.summary.peakBACGdL:result.summary.peakCaffeineMgL,peakH=bac?result.summary.timeOfPeakBACH:result.summary.timeOfPeakCaffeineH,label=bac?'BAC':'Caffeine',unit=bac?bacUnit(state.presentation):'mg/L';
  return <section className={'v160-plot '+(bac?'bac':'caffeine')} aria-label={label+' concentration'}>
   <header><div><span className="v160-series-label"><i aria-hidden="true"/>{label} <small>{unit}</small></span><p className="v160-plot-meta">At the selected inspection time</p></div><strong className="v160-concentration">{point?(bac?bacText(point[key],state.presentation):v15Number(point[key],2)):'Outside coverage'} <small>{point?unit:''}</small></strong></header>
   <svg viewBox={'0 0 '+W+' 145'} role="img" aria-label={label+' over elapsed time; shared inspection cursor'} onClick={inspect}><title>{label+' concentration over the complete '+v15Number(end)+' hour accepted horizon. Use the inspection slider to select a time.'}</title>{grid(max,bac)}<path d={path(key,max)} className={'v160-trace '+(bac?'bac':'caffeine')} fill="none"/>{marks()}</svg>
   <footer><span>Whole-session peak <b>{bac?bacText(peak,state.presentation):v15Number(peak,2)} {unit}</b> at {v15TimeLabel(peakH)}</span><button type="button" className="v160-link" aria-label={'Inspect '+label+' peak'} onClick={()=>controller.inspect(Math.min(state.document.mainScenario.subject.simulationDurationH,peakH))}>Inspect peak</button></footer>
  </section>;
 };
 return <div className="v160-plots" ref={box}><div className="v160-section-heading"><h2>Concentration trajectory</h2><span>Modelled · full horizon {v15Number(end)} h</span></div>
  {prefs.chartLayout==='stacked'?<>{plot(true)}{plot(false)}</>:<section className="v160-plot overlay"><header><div><span className="v160-series-label">BAC {bacUnit(state.presentation)} · caffeine mg/L</span><p className="v160-plot-meta">Separate vertical scales; compare timing and shape.</p></div></header><svg viewBox={'0 0 '+W+' 155'} role="img" aria-label="Concentration overlay with separate BAC and caffeine scales" onClick={inspect}><title>BAC uses the left scale and a solid line. Caffeine uses the right scale and a dashed line.</title>{grid(bacMax,true)}{[0,.5,1].map(v=><text key={v} x={R-3} y={B-v*(B-T)-5} textAnchor="end">{v15Number(v*cafMax,1)} mg/L</text>)}<path d={path('bacGdL',bacMax)} fill="none" className="v160-trace bac"/><path d={path('caffeineMgL',cafMax)} fill="none" className="v160-trace caffeine"/>{marks()}</svg><div className="v160-inline-values"><span>BAC: {point?bacText(point.bacGdL,state.presentation):'Unavailable'} {bacUnit(state.presentation)}</span><span>Caffeine: {point?v15Number(point.caffeineMgL,2):'Unavailable'} mg/L</span></div></section>}
  <Inspector state={state} result={result}/>
 </div>;
}
