import {h,React,Fragment,bridge,controller,action,useSession,navigate} from './runtime.mjs';
import {Panel,Button,Table,Disclosure} from './common.jsx';
import {V15_GUIDES,V15_GUIDE_COMMON} from '../content/guide.mjs';
export function V15Help(){
 const state=useSession(),route=window.location.hash.split('/')[1],level=['default','detailed','expert'].includes(route)?route:state.presentation.detailMode;
 const [query,setQuery]=React.useState(''),[demo,setDemo]=React.useState('coffee'),guide=V15_GUIDES[level],q=query.trim().toLowerCase();
 const sections=guide.sections.map(section=>({...section,steps:section.steps.map((step,index)=>({step,index})).filter(x=>!q||x.step.join(' ').toLowerCase().includes(q)||section.title.toLowerCase().includes(q))})).filter(s=>s.steps.length);
 const load=()=>{if(window.confirm('Load the worked example into the main scenario? The current committed state remains available through Undo.'))action(()=>bridge.loadDemo(demo),'Worked example loaded. Open inputs or Session to inspect it.');};
 return <div className="v15-stack">
  <Panel title="How to use this application" kicker="Explicit instructions by expertise and analytical scope">
   <p>Read an instruction, perform its action, and check the expected result before continuing. The Scientific depth control changes the visible analytical depth. Reading preferences are independent. Each level uses the same numerical calculation authority.</p>
   <div className="v15-tabs" role="group" aria-label="Guide expertise level">{['default','detailed','expert'].map(x=><Button key={x} aria-pressed={level===x} onClick={()=>navigate('help',x)}>{x[0].toUpperCase()+x.slice(1)}</Button>)}</div>
   <h3>{guide.title}</h3><p>{guide.scope}</p>
   <div className="v15-actions"><Button primary onClick={()=>action(()=>controller.setDetailMode(level),level[0].toUpperCase()+level.slice(1)+' detail mode selected.')}>Use {level[0].toUpperCase()+level.slice(1)} mode</Button><Button onClick={()=>navigate('calculate')}>Open inputs</Button><Button onClick={()=>navigate('session','timeline')}>Open schedule</Button></div>
   <label className="v15-field">Search this guide<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try duration, history, clock, half-life or report"/></label>
   <div className="v15-guide-jumps">{sections.map(s=><Button key={s.id} onClick={()=>document.getElementById('v15-guide-'+s.id)?.scrollIntoView({block:'start'})}>{s.title}</Button>)}</div>
  </Panel>
  <Disclosure id="worked-examples" title="Worked examples"><p>Each example is synthetic and uses documented reference inputs. Loading one creates an undoable scenario transaction.</p><div className="v15-actions"><label className="v15-field">Example<select aria-label="Example" value={demo} onChange={e=>setDemo(e.target.value)}><option value="coffee">Single coffee: absorption and elimination</option><option value="episodes">Two ethanol episodes: repeated threshold crossings</option><option value="overnight">Overnight mixed scenario: calendar and markers</option></select></label><Button onClick={load}>Load worked example</Button></div></Disclosure>
  {!sections.length&&<Panel title="No walkthrough steps match"><p>Try a shorter search term or clear the search field.</p></Panel>}
  {sections.map(section=><Panel key={section.id} id={'v15-guide-'+section.id} title={section.title} className="v15-guide-section">
   {section.steps.map(({step,index})=><article key={step[0]} className="v15-guide-step"><div className="v15-step-number">{String(index+1).padStart(2,'0')}</div><div><h3>{step[0]}</h3><p><strong>Action.</strong> {step[1]}</p><p className="v15-expected"><strong>Expected result.</strong> {step[2]}</p>{step[3]&&<p className="v15-note"><strong>Check.</strong> {step[3]}</p>}</div></article>)}
  </Panel>)}
  <Panel title="Offline installation and updates">{V15_GUIDE_COMMON.offline.map((s,i)=><article className="v15-guide-step" key={s[0]}><div className="v15-step-number">{String(i+1).padStart(2,'0')}</div><div><h3>{s[0]}</h3><p><strong>Action.</strong> {s[1]}</p><p><strong>Expected result.</strong> {s[2]}</p></div></article>)}</Panel>
  <Panel title="Glossary"><Table headers={['Term','Meaning']} rows={V15_GUIDE_COMMON.glossary}/></Panel>
  <Panel title="Troubleshooting">{V15_GUIDE_COMMON.troubleshooting.map(([title,text])=><details className="v15-details" key={title}><summary>{title}</summary><p>{text}</p></details>)}</Panel>
 </div>;
}
