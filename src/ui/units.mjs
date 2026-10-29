import {v15Number} from '../session/core.mjs';
export function bacUnit(presentation){return presentation.bacDisplayUnit==='permille'?'‰':presentation.bacDisplayUnit??'g/dL';}
export function bacValue(value,presentation){return value*(presentation.bacDisplayUnit==='g/L'||presentation.bacDisplayUnit==='permille'?10:1);}
export function bacText(value,presentation,digits=4){
 if(!Number.isFinite(value))return 'Unavailable';
 const factor=presentation.bacDisplayUnit==='g/L'||presentation.bacDisplayUnit==='permille'?10:1;
 const number=value*factor,places=Math.min(6,digits+(factor===1?0:0));
 if(number>0&&number<Math.pow(10,-places))return '<'+Math.pow(10,-places).toFixed(places);
 return number.toFixed(places);
}
export function parameterLabel(id){
 const overrides={'subject.bodyMassKg':'Body mass','subject.simulationDurationH':'Observation horizon','subject.caffeineHalfLifeH':'Effective caffeine half-life','subject.referenceCaffeineHalfLifeH':'Reference caffeine half-life','subject.ethanolVmaxGPerH':'Ethanol Vmax','constants.ethanolVmaxGPerH':'Ethanol Vmax','subject.solverInternalStepMin':'Internal solver step','subject.timeStepMin':'Output sampling step'};
 const name=id.split('.').slice(1).join(' · ').replace(/(?:GdL|GPerH|MgPerL|MgL|PerH|Kg|Min|Ml)$/, '').replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2').replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/\bFfm\b/g,'FFM').replace(/\bTbw\b/g,'TBW').replace(/\bCyp1a2\b/i,'CYP1A2').replace(/^./,x=>x.toUpperCase());
 return overrides[id]??name;
}

export function bacMetric(row,presentation){
 if(row.unit!=='g/dL'&&row.unit!=='g·h/dL')return row;
 const unit=row.unit==='g/dL'?bacUnit(presentation):({'g/dL':'g·h/dL','g/L':'g·h/L','% BAC':'% BAC·h','permille':'‰·h'}[presentation.bacDisplayUnit]??'g·h/dL');
 return {...row,unit,a:bacValue(row.a,presentation),b:bacValue(row.b,presentation),delta:bacValue(row.delta,presentation)};
}

export function caffeineText(value,digits=2){if(value>0&&value<10**-digits)return '<'+(10**-digits).toFixed(digits);return v15Number(value,digits);}
