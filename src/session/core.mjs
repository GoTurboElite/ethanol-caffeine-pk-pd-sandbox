export const V15_VERSION = '2.1.1';
export const V15_PROJECT_SCHEMA = 'ethanol-caffeine-session';
export const V15_PROJECT_SCHEMA_VERSION = '1.1.0';
export const V15_HISTORY_LIMIT = 60;
export const V15_MAX_PROJECT_BYTES = 8 * 1024 * 1024;
export const v15Clone = value => JSON.parse(JSON.stringify(value));
export function v15Stable(value) {
  if (Array.isArray(value)) return '[' + value.map(v15Stable).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k)+':'+v15Stable(value[k])).join(',') + '}';
  return JSON.stringify(value);
}
export function v15Finite(value, label='Value') {
  const n=typeof value==='number'?value:Number(value);
  if (!Number.isFinite(n) || (typeof value==='string'&&!value.trim())) throw Error(label+' must be a finite number.');
  return n;
}
export function v15Id(prefix='item') {
  return prefix+'-'+(globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
}
export function v15SafeParse(text) {
  if (typeof text!=='string' || new TextEncoder().encode(text).byteLength>V15_MAX_PROJECT_BYTES) throw Error('Session files are limited to 8 MiB.');
  return JSON.parse(text,(k,v)=>{if(['__proto__','prototype','constructor'].includes(k))throw Error('The file contains an unsupported object key.');return v;});
}
export function v15ValidateZone(zone) {
  const value=String(zone??'').trim();
  try {new Intl.DateTimeFormat('en-GB',{timeZone:value}).format(0);return value;} catch {throw Error('Enter a recognised IANA time zone, for example Europe/London or UTC.');}
}
export function v15WallParts(instant, zone) {
  const ms=typeof instant==='number'?instant:Date.parse(instant);
  if (!Number.isFinite(ms)) throw Error('The calendar anchor is invalid.');
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:v15ValidateZone(zone),year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(ms);
  return Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
}
export function v15LocalInput(instant,zone) {
  const p=v15WallParts(instant,zone);return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute;
}
export function v15FormatInstant(instant,zone) {
  const ms=typeof instant==='number'?instant:Date.parse(instant);
  if(!Number.isFinite(ms))return 'Invalid instant';
  try {return new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit',timeZoneName:'shortOffset',hourCycle:'h23'}).format(ms);} catch{return new Date(ms).toISOString();}
}
export function v15LocalInstants(local,zone) {
  v15ValidateZone(zone);
  const m=String(local).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if(!m)throw Error('Enter a complete local date and time.');
  const nums=m.slice(1).map(Number);const [y,mo,d,h,mi]=nums;const sec=nums[5]||0;
  if(y<1900||y>2200||mo<1||mo>12||h>23||mi>59||sec>59)throw Error('The local date or time is outside the supported range.');
  const nominal=Date.UTC(y,mo-1,d,h,mi,sec), check=new Date(nominal);
  if(check.getUTCFullYear()!==y||check.getUTCMonth()!==mo-1||check.getUTCDate()!==d)throw Error('The calendar date does not exist.');
  const offsets=new Set();
  for(let n=-36;n<=36;n+=6){
    const sample=nominal+n*3600000,p=v15WallParts(sample,zone);
    offsets.add(Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)-sample);
  }
  const found=[];
  for(const offset of offsets){
    const t=nominal-offset,p=v15WallParts(t,zone);
    if(+p.year===y&&+p.month===mo&&+p.day===d&&+p.hour===h&&+p.minute===mi&&+p.second===sec)found.push(new Date(t).toISOString());
  }
  return [...new Set(found)].sort();
}
export function v15ResolveLocal(local,zone,choice='') {
  const choices=v15LocalInstants(local,zone);
  if(!choices.length)throw Error('This local time falls in a clock-change gap. Choose an existing time.');
  if(choices.length>1&&choice!=='earlier'&&choice!=='later')throw Error('This clock time occurs twice. Select the earlier or later occurrence.');
  return choices.length===1?choices[0]:choices[choice==='earlier'?0:choices.length-1];
}
export function v15TimeLabel(h) {
  if(!Number.isFinite(h))return 'Unavailable';
  const sign=h<0?'\u2212':'+',m=Math.round(Math.abs(h)*60);
  return sign+Math.floor(m/60)+' h '+String(m%60).padStart(2,'0')+' min';
}
export function v15ShiftFrame(frame, selectedKeys, deltaH, duplicate=false, makeId=v15Id) {
  deltaH=v15Finite(deltaH,'Time shift');
  if(!selectedKeys.length)throw Error('Select at least one intake or meal.');
  const selected=new Set(selectedKeys),next=v15Clone(frame);
  let count=0;
  for(const [type,items] of [['dose',next.document.mainScenario.doseEvents],['meal',next.document.mainScenario.subject.mealEvents??[]]]){
    const additions=[];
    for(const item of items){
      if(!selected.has(type+':'+item.id))continue;
      count++;
      if(duplicate){const copy=v15Clone(item);copy.id=makeId(type);copy.label=(copy.label||type)+' (copy)';copy.startTimeH+=deltaH;additions.push(copy);}
      else item.startTimeH+=deltaH;
    }
    items.push(...additions);
  }
  if(!count)throw Error('The selected events are no longer present.');
  return next;
}
export function v15Reanchor(frame,instant,zone,preserve='elapsed') {
  const old=Date.parse(frame.presentation.scenarioAnchorInstant),now=Date.parse(instant);
  if(!Number.isFinite(old)||!Number.isFinite(now))throw Error('The anchor must be a valid absolute instant.');
  if(!['elapsed','absolute'].includes(preserve))throw Error('Choose which timing relationship to preserve.');
  const next=v15Clone(frame);
  if(preserve==='absolute'){
    const delta=(old-now)/3600000;
    for(const event of next.document.mainScenario.doseEvents)event.startTimeH+=delta;
    for(const meal of next.document.mainScenario.subject.mealEvents??[])meal.startTimeH+=delta;
    for(const marker of next.markers)marker.timeH+=delta;
    next.presentation.selectedTimeH=Math.max(0,Math.min(next.document.mainScenario.subject.simulationDurationH,(next.presentation.selectedTimeH||0)+delta));
  }
  next.presentation.scenarioAnchorInstant=new Date(now).toISOString();
  next.presentation.scenarioTimeZone=v15ValidateZone(zone);
  next.presentation.scenarioAnchorDraft=null;next.presentation.scenarioClockError='';
  next.presentation.timeReferenceBasis='model-time-zero';next.presentation.followNow=false;
  return next;
}
export class V15History {
  constructor(initial,limit=V15_HISTORY_LIMIT){this.limit=limit;this.entries=[{label:'Session opened',at:new Date().toISOString(),frame:v15Clone(initial)}];this.index=0;this.lastKey=v15Stable(initial);}
 push(frame,label='Scenario edited',now=Date.now(),{coalesce:allowCoalesce=true}={}){
    const key=v15Stable(frame);if(key===this.lastKey)return false;
  const previous=this.entries[this.index],coalesce=allowCoalesce&&this.index===this.entries.length-1&&this.index>0&&previous.label===label&&now-Date.parse(previous.at)<700;
    this.entries=this.entries.slice(0,this.index+1);
    const entry={label,at:new Date(now).toISOString(),frame:v15Clone(frame)};
    if(coalesce)this.entries[this.index]=entry;
    else{this.entries.push(entry);if(this.entries.length>this.limit)this.entries.shift();this.index=this.entries.length-1;}
    this.lastKey=key;return true;
  }
  get canUndo(){return this.index>0;}
  get canRedo(){return this.index<this.entries.length-1;}
  move(index){if(!Number.isInteger(index)||index<0||index>=this.entries.length)throw Error('The history entry is unavailable.');this.index=index;const frame=v15Clone(this.entries[index].frame);this.lastKey=v15Stable(frame);return frame;}
  undo(){return this.canUndo?this.move(this.index-1):null;}
  redo(){return this.canRedo?this.move(this.index+1):null;}
}
export function v15Interpolate(points,timeH) {
  if(!points?.length||!Number.isFinite(timeH)||timeH<points[0].tH-1e-10||timeH>points.at(-1).tH+1e-10)return null;
  let lo=0,hi=points.length-1;
  while(lo<hi){const m=Math.floor((lo+hi)/2);if(points[m].tH<timeH)lo=m+1;else hi=m;}
  const b=points[lo],a=points[Math.max(0,lo-1)],f=b.tH===a.tH?0:(timeH-a.tH)/(b.tH-a.tH),out={};
  for(const key of Object.keys(b))out[key]=typeof b[key]==='number'&&typeof a[key]==='number'?a[key]+(b[key]-a[key])*f:(f<1?a[key]:b[key]);
  out.tH=timeH;return out;
}
export function v15Fluxes(result,timeH) {
  const points=result.analysisPoints??result.points,p=v15Interpolate(points,timeH);
  if(!p)return null;
  const end=points.at(-1).tH,span=Math.min(1/120,end/100||1/120),a=v15Interpolate(points,Math.max(points[0].tH,timeH-span)),b=v15Interpolate(points,Math.min(end,timeH+span));
  const dt=b.tH-a.tH,rate=key=>dt>0&&typeof a[key]==='number'&&typeof b[key]==='number'?(b[key]-a[key])/dt:null;
  return {point:p,ethanolEliminationGPerH:rate('eliminatedEthanolG'),caffeineEliminationMgPerH:rate('cumulativeCaffeineEliminatedMg'),
    ethanolSystemicAppearanceGPerH:dt>0?rate('centralEthanolG')+rate('eliminatedEthanolG'):null,
    caffeineSystemicAppearanceMgPerH:dt>0?rate('caffeineCentralMg')+rate('cumulativeCaffeineEliminatedMg'):null,intervalH:dt,
    method:'Finite differences of the accepted dense numerical trajectory. Rates are local averages around the selected time; discontinuities and boluses limit interpretation.'};
}
export function v15Diff(a,b,path='',out=[]) {
  if(v15Stable(a)===v15Stable(b))return out;
  if(out.length>=250)return out;
  if(Array.isArray(a)&&Array.isArray(b)){
    if([...a,...b].every(x=>x&&typeof x==='object'&&typeof x.id==='string')){
      const aa=new Map(a.map(x=>[x.id,x])),bb=new Map(b.map(x=>[x.id,x]));
      for(const id of new Set([...aa.keys(),...bb.keys()]))v15Diff(aa.get(id),bb.get(id),path+'['+id+']',out);
    }else for(let i=0;i<Math.max(a.length,b.length);i++)v15Diff(a[i],b[i],path+'['+i+']',out);
  }else if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){
    for(const key of new Set([...Object.keys(a),...Object.keys(b)]))v15Diff(a[key],b[key],path?path+'.'+key:key,out);
  }else out.push({path,before:a,after:b});
  return out;
}
export function v15MetricRows(a,b) {
  const defs=[['Peak BAC','peakBACGdL','g/dL'],['BAC peak time','timeOfPeakBACH','h'],['Peak caffeine','peakCaffeineMgL','mg/L'],['Caffeine peak time','timeOfPeakCaffeineH','h']];
  return defs.map(([label,key,unit])=>({label,unit,a:a.summary[key],b:b.summary[key],delta:(b.summary[key]??0)-(a.summary[key]??0)}));
}
export function v15NormalizeMarkers(markers) {
  if(!Array.isArray(markers)||markers.length>100)throw Error('A session supports up to 100 analysis markers.');
  const seen=new Set();
  return markers.map(m=>{
    if(!m||typeof m.id!=='string'||!m.id||seen.has(m.id))throw Error('Analysis markers require distinct identifiers.');
    seen.add(m.id);
    if(typeof m.label!=='string'||!m.label.trim()||m.label.length>160)throw Error('Each marker requires a label of up to 160 characters.');
    const timeH=v15Finite(m.timeH,'Marker time');if(Math.abs(timeH)>8760)throw Error('Marker time is outside the supported range.');
    return{id:m.id,label:m.label,kind:['bedtime','waking','activity','custom'].includes(m.kind)?m.kind:'custom',timeH};
  });
}
export function v15ChartSamples(points,max=700) {
  if(points.length<=max)return points;
  const out=[points[0]],width=Math.ceil((points.length-2)/Math.max(1,Math.floor((max-2)/4)));
  for(let start=1;start<points.length-1;start+=width){
    const bucket=points.slice(start,Math.min(points.length-1,start+width)),indices=new Set([0,bucket.length-1]);
    for(const key of ['bacGdL','caffeineMgL']){let best=0;for(let i=1;i<bucket.length;i++)if(bucket[i][key]>bucket[best][key])best=i;indices.add(best);}
    for(const i of [...indices].sort((a,b)=>a-b))out.push(bucket[i]);
  }
  out.push(points.at(-1));return out;
}
export function v15Escape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function v15Number(value,digits=3){return typeof value==='number'&&Number.isFinite(value)?value.toLocaleString('en-GB',{maximumFractionDigits:digits}):'Unavailable';}
export function v15HistoryLabel(type) {
 const map={title:'Edited scenario title',notes:'Edited scenario notes',subject:'Edited physiology or meal events',doses:'Edited intake schedule',constants:'Edited model parameters',comparisons:'Edited comparison scenarios',profile:'Edited behavioural profile',comparisonEnabled:'Changed comparison state',sweepConfig:'Edited sweep configuration'};
 return map[type]??({'IMPORT_APPLY':'Imported scenario','PRESET_APPLY':'Applied preset','SCENARIO_TRANSACTION':'Updated scenario'}[type]??String(type).replaceAll('_',' ').toLowerCase());
}
