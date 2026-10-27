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
 return overrides[id]??id.split('.').slice(1).join(' · ').replace(/([a-z0-9])([A-Z])/g,'$1 $2').replace(/GdL/g,'g/dL').replace(/^./,x=>x.toUpperCase());
}
