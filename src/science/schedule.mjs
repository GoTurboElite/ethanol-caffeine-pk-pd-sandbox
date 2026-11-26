import {v15Clone,v15Id,v15Stable} from '../session/core.mjs';
export function scheduleRows(core,input){
 const doses=core.OJ(input.doseEvents,input.constants).map(d=>({key:'dose:'+d.event.id,label:d.event.label,start:d.startH,end:d.endH,ethanol:d.ethanolG,caffeine:d.caffeineMg,kind:'Intake',event:d.event}));
 const meals=(input.subject.mealEvents??[]).map(m=>({key:'meal:'+m.id,label:m.label,start:m.startTimeH,end:m.startTimeH+m.durationH,food:m.foodState,kind:'Meal',event:m}));
 return [...doses,...meals].sort((a,b)=>a.start-b.start||a.key.localeCompare(b.key));
}
export function scheduleTotals(rows,start=-Infinity,end=Infinity){
 let ethanol=0,caffeine=0,minutes=0,until=-Infinity,count=0,previous=null,minSpacingH=null;
 for(const r of rows.filter(r=>r.kind==='Intake')){
  const span=r.end-r.start,lo=Math.max(r.start,start),hi=Math.min(r.end,end);
  const share=span>0?Math.max(0,hi-lo)/span:Number(r.start>=start&&r.start<=end);
  if(!share)continue;
  ethanol+=share*r.ethanol;caffeine+=share*r.caffeine;count++;
  minutes+=60*Math.max(0,hi-Math.max(lo,until));until=Math.max(until,hi);
  if(previous!=null)minSpacingH=Math.min(minSpacingH??Infinity,r.start-previous);
  previous=r.start;
 }
 return {ethanolG:ethanol,caffeineMg:caffeine,activeMinutes:minutes,count,minSpacingH};
}
export function alignedSchedule(a,b){
 const index=rows=>new Map(rows.map(r=>[r.key,r])),A=index(a),B=index(b);
 return [...new Set([...A.keys(),...B.keys()])].map(key=>{
  const a=A.get(key),b=B.get(key),changes=[];
  if(!a)changes.push('Added');else if(!b)changes.push('Removed');else{
   if(a.start!==b.start)changes.push('Start');
   if((a.event.durationMin??a.event.durationH)!==(b.event.durationMin??b.event.durationH))changes.push('Duration');
   if(a.ethanol!==b.ethanol||a.caffeine!==b.caffeine)changes.push('Dose');
   if(a.food!==b.food)changes.push('Meal state');
   if(!changes.length&&v15Stable(a.event)!==v15Stable(b.event))changes.push('Event details');
  }
  return {key,a,b,changes};
 }).sort((x,y)=>Math.min(x.a?.start??Infinity,x.b?.start??Infinity)-Math.min(y.a?.start??Infinity,y.b?.start??Infinity));
}
export function planSeries(scenario,keys,operation,count,offsetH,makeId=v15Id){
 if(!['repeat','remove'].includes(operation)||!keys.length)throw Error('Select at least one event.');
 if(operation==='repeat'&&(!Number.isInteger(count)||count<1||count>24||!Number.isFinite(offsetH)||keys.length*count>120))throw Error('Use 1–24 copies and at most 120 generated events.');
 const next=v15Clone(scenario),review=[],selected=new Set(keys);
 for(const [kind,events] of [['dose',next.doseEvents],['meal',next.subject.mealEvents??[]]]){
  const planned=[];
  for(const event of events){
   if(!selected.has(kind+':'+event.id)){planned.push(event);continue;}
   if(operation==='remove'){review.push({kind,event});continue;}
   planned.push(event);
   for(let i=1;i<=count;i++){
    const copy={...event,id:makeId(kind),startTimeH:event.startTimeH+i*offsetH,label:((event.label||kind).slice(0,145)+' (copy '+i+')')};
    planned.push(copy);review.push({kind,event:copy});
   }
  }
  if(kind==='dose')next.doseEvents=planned;else next.subject.mealEvents=planned;
 }
 if(!review.length)throw Error('Selected events are no longer present.');
 return {next,review,sourceKey:v15Stable(v15Clone(scenario)),operation};
}
