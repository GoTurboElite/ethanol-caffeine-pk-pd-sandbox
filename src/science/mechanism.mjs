import {v15Interpolate} from '../session/core.mjs';
import {seriesOf} from './metrics.mjs';

export const mechanismMethod='Reference equations evaluated on dense, linearly interpolated compartment amounts. Oral boluses are discrete jumps at their event time. Rates use the right-hand administration and meal state. Relative residual is undefined at zero available mass.';
export const quantities={
 gastricEthanolG:['Gastric ethanol','g'],intestinalEthanolG:['Intestinal ethanol','g'],centralEthanolG:['Systemic ethanol','g'],
 ethanolInput:['Oral ethanol input','g/h'],emptying:['Gastric to intestinal transfer','g/h'],gastricUptake:['Gastric uptake','g/h'],intestinalUptake:['Intestinal uptake','g/h'],firstPass:['First-pass loss','g/h'],ethanolAppearance:['Systemic ethanol appearance','g/h'],ethanolElimination:['Systemic ethanol elimination','g/h'],
 caffeineGutMg:['Caffeine in gut','mg'],caffeineCentralMg:['Systemic caffeine','mg'],paraxanthineCentralMg:['Systemic paraxanthine','mg'],
 caffeineInput:['Oral caffeine input','mg/h'],caffeineAppearance:['Systemic caffeine appearance','mg/h'],caffeineElimination:['Parent caffeine elimination','mg/h'],metaboliteFormation:['Paraxanthine formation','mg/h'],metaboliteElimination:['Paraxanthine elimination','mg/h']
};
export function mechanismContext(core,input,result){
 const {subject,constants,doseEvents}=input,distribution=result.distribution??core.mm(subject,constants);
 const doses=core.OJ(doseEvents,constants),boluses=doses.filter(d=>d.bolus);
 return {core,subject,constants,distribution,doses,boluses,meals:core.DJ(subject,doseEvents),vmaxGPerH:core.Xv(subject,constants,distribution).valueGPerH,points:seriesOf(result)};
}
export function mechanismAt(ctx,tH){
 const {core,subject,constants,points}=ctx,state=v15Interpolate(points,tH);
 if(!state||!Number.isFinite(state.centralEthanolG))return null;
 const expected=core.$J(ctx.doses,tH);
 // Dense knots hold post-bolus masses. Subtract the interpolated share of a future jump.
 const oralE=state.expectedCumulativeEthanolAdministeredG-expected.ethanolG;
 const oralC=state.expectedCumulativeCaffeineAdministeredMg-expected.caffeineMg;
 state.gastricEthanolG=Math.max(0,state.gastricEthanolG-oralE);
 state.caffeineGutMg=Math.max(0,state.caffeineGutMg-oralC);
 const rates=core.Pf({...ctx,state,tH},true),initial=subject.initialConditions;
 const initialE=initial.gastricEthanolG+initial.intestinalEthanolG+initial.centralEthanolG;
 const ratio=constants.caffeineMolecularMassMgPerMmol/constants.paraxanthineMolecularMassMgPerMmol;
 const initialC=initial.caffeineGutMg+initial.caffeineCentralMg+initial.paraxanthineCentralMg*ratio;
 function ledger(initialMass,administered,retained,losses,unit){
  const available=initialMass+administered,residual=available-Object.values(retained).reduce((a,b)=>a+b,0)-Object.values(losses).reduce((a,b)=>a+b,0);
  return {unit,initialMass,administered,retained,losses,residual,absoluteResidual:Math.abs(residual),relativeResidual:available>0?Math.abs(residual)/available:null};
 }
 const ethanol=ledger(initialE,expected.ethanolG,{gastric:state.gastricEthanolG,intestinal:state.intestinalEthanolG,central:state.centralEthanolG},{firstPass:state.firstPassEthanolG,systemicElimination:state.eliminatedEthanolG},'g');
 const caffeine=ledger(initialC,expected.caffeineMg,{gut:state.caffeineGutMg,central:state.caffeineCentralMg,metaboliteEquivalent:(state.paraxanthineCentralMg??0)*ratio},{unroutedParent:state.cumulativeCaffeineNotRoutedMg,eliminatedMetaboliteEquivalent:state.cumulativeParaxanthineEliminatedMg*ratio},'mg caffeine equivalent');
 const values=Object.fromEntries(Object.keys(quantities).map(k=>[k,rates[k]??state[k]??null]));
 return {tH,values,ethanol,caffeine,boluses:ctx.boluses.filter(d=>d.startH===tH).map(d=>({id:d.event.id,ethanolG:d.ethanolG,caffeineMg:d.caffeineMg})),
 cumulative:{systemicEthanolAbsorbedG:state.centralEthanolG-initial.centralEthanolG+state.eliminatedEthanolG,systemicCaffeineAbsorbedMg:state.caffeineCentralMg-initial.caffeineCentralMg+state.cumulativeCaffeineEliminatedMg,parentCaffeineEliminatedMg:state.cumulativeCaffeineEliminatedMg},
 caffeineKPerH:rates.caffeineKPerH,caffeineVdL:subject.bodyMassKg*constants.caffeineVdLPerKg,caffeineClearanceLPerH:rates.caffeineKPerH*subject.bodyMassKg*constants.caffeineVdLPerKg,method:mechanismMethod};
}
