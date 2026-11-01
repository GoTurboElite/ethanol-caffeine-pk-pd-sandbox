export function visibleIntakeInterval(event,horizon){
 const start=event.startTimeH,end=start+Math.max(0,event.durationMin??0)/60;
 if(end<0||start>horizon||(end===0&&start<0))return null;
 return {start:Math.max(0,start),end:Math.min(horizon,end)};
}
