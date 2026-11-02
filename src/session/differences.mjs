import {v15Stable} from './core.mjs';
const names={bodyMassKg:['Body mass (kg)','kg'],simulationDurationH:['Horizon (h)','h'],caffeineHalfLifeH:['Effective caffeine half-life (h)','h'],referenceCaffeineHalfLifeH:['Reference caffeine half-life','h'],foodState:['Food state',''],startTimeH:['Start time','h'],durationMin:['Duration','min'],durationH:['Duration','h'],ethanolGrams:['Ethanol per serving','g'],caffeineMg:['Caffeine per serving','mg'],volumeMl:['Volume per serving','mL'],abvPercent:['Alcohol by volume','%'],servings:['Servings',''],caffeineVdLPerKg:['Caffeine distribution volume','L/kg'],solverInternalStepMin:['Internal solver step','min'],timeStepMin:['Graph sampling interval','min'],gastricEthanolG:['Gastric ethanol','g'],intestinalEthanolG:['Intestinal ethanol','g'],centralEthanolG:['Central ethanol','g'],caffeineGutMg:['Caffeine in gut','mg'],caffeineCentralMg:['Central caffeine','mg'],paraxanthineCentralMg:['Central paraxanthine','mg']};
const human=k=>k.replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/_/g,' ').replace(/^./,s=>s.toUpperCase());
const value=v=>v===undefined?'Not present':v===null?'Not specified':typeof v==='boolean'?(v?'Enabled':'Disabled'):typeof v==='object'?v15Stable(v):String(v);
const unit=k=>names[k]?.[1]??(/GdLPerH/.test(k)?'g/dL/h':/GPerHPerKg/.test(k)?'g/h/kg':/GPerMl/.test(k)?'g/mL':/MgPerMmol/.test(k)?'mg/mmol':/Grams/.test(k)?'g':/MgPerServing/.test(k)?'mg':/GdL/.test(k)?'g/dL':/MgL/.test(k)?'mg/L':/LPerKg/.test(k)?'L/kg':/GPerH/.test(k)?'g/h':/PerH/.test(k)?'1/h':/Kg$/.test(k)?'kg':/Min$/.test(k)?'min':/H$/.test(k)?'h':/Modifier|Fraction/.test(k)?'unitless':'');
const category=k=>k==='simulationDurationH'?'Calculation horizon':/caffeine|ethanol|Cyp|cyp|gastric|solver|timeStep|initialConditions|absorption|clearance/i.test(k)?'Pharmacokinetic parameters':'Subject physiology';
export const DIFFERENCE_CATEGORIES=['Subject physiology','Pharmacokinetic parameters','Intake schedules','Meal schedules','Calculation horizon','Model constants'];
// Compare immutable inputs only. Uncommitted invalid text belongs to neither input.
export function scenarioDifferences(accepted,draft,registry=[]){
 if(!accepted)return [];
 const rows=[],entries=new Map(registry.map(e=>[e.path??e.id,e]));
 function walk(a,b,path,group,prefix='',kind='Changed'){
  if(v15Stable(a)===v15Stable(b))return;
  if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){
   for(const key of [...new Set([...Object.keys(a),...Object.keys(b)])].sort())walk(a[key],b[key],path+'.'+key,group,prefix,kind);return;
  }
  if(Array.isArray(a)&&Array.isArray(b)){
   for(let i=0;i<Math.max(a.length,b.length);i++)walk(a[i],b[i],path+'.'+i,group,prefix,kind);return;
  }
  const key=path.split('.').at(-1),entry=entries.get(path),label=names[key]?.[0]??entry?.label??human(key);
  rows.push({path,category:group,label:prefix+label,unit:entry?.unit??unit(key),accepted:value(a),draft:value(b),kind});
 }
 function events(a=[],b=[],group,path){
  const before=new Map(a.map(e=>[e.id,e])),after=new Map(b.map(e=>[e.id,e]));
  const initialLength=rows.length;
  for(const id of [...new Set([...before.keys(),...after.keys()])].sort()){
   const old=before.get(id),next=after.get(id),label=(next?.label||old?.label||id)+' · ',kind=!old?'Added':!next?'Removed':'Changed';
   for(const k of [...new Set([...Object.keys(old??{}),...Object.keys(next??{})])].filter(k=>k!=='id').sort()){
    const change=['startTimeH','durationMin','durationH'].includes(k)&&old&&next?'Timing changed':/ethanol|caffeine|volume|abv|servings|doseBasis|beverage/i.test(k)&&old&&next?'Dose / composition changed':kind;
    walk(old?.[k],next?.[k],path+'.'+id+'.'+k,group,label,change);
   }
  }
  // Array order can be meaningful even when event fields are identical.
  if(a.length===b.length&&a.some((e,i)=>e.id!==b[i]?.id))rows.push({path:path+'.order',category:group,label:'Event order',unit:'',accepted:a.map(e=>e.label||e.id).join(' → '),draft:b.map(e=>e.label||e.id).join(' → '),kind:'Reordered'});
  if(rows.length>initialLength)rows.push({path,category:group,label:group==='Intake schedules'?'Intake schedule':'Meal schedule',unit:'',accepted:a.length+' events',draft:b.length+' events',kind:'Schedule changed',summary:true});
 }
 for(const k of [...new Set([...Object.keys(accepted.subject??{}),...Object.keys(draft.subject??{})])].filter(k=>k!=='mealEvents').sort())walk(accepted.subject?.[k],draft.subject?.[k],'subject.'+k,category(k));
 events(accepted.doseEvents,draft.doseEvents,'Intake schedules','doseEvents');events(accepted.subject?.mealEvents,draft.subject?.mealEvents,'Meal schedules','subject.mealEvents');
 walk(accepted.constants??{},draft.constants??{},'constants','Model constants');
 return rows.sort((a,b)=>DIFFERENCE_CATEGORIES.indexOf(a.category)-DIFFERENCE_CATEGORIES.indexOf(b.category)||(a.path<b.path?-1:a.path>b.path?1:0));
}
