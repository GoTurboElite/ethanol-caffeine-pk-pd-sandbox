// Refine the best sampled basin along each nuisance coordinate in log space.
// Both evaluated bounds remain eligible, including when the optimum is on a bound.
export async function nuisanceProfiles(parameters,surface,fitCost,evaluate,context){
 const records=[];
 for(const fixedIndex of [0,1]){
  const other=1-fixedIndex,f=parameters[fixedIndex],n=parameters[other],fixedKey=fixedIndex?'y':'x',freeKey=fixedIndex?'x':'y';
  for(const fixed of new Set(surface.map(p=>p[fixedKey]))){
   const grid=surface.filter(p=>p[fixedKey]===fixed).sort((a,b)=>a[freeKey]-b[freeKey]);
   const bestIndex=grid.reduce((best,p,i)=>p.cost<grid[best].cost?i:best,0);
   let optimum=grid[bestIndex][freeKey],cost=grid[bestIndex].cost,calls=0;
   let lo=Math.log(grid[Math.max(0,bestIndex-1)][freeKey]),hi=Math.log(grid[Math.min(grid.length-1,bestIndex+1)][freeKey]);
   const tolerance=(Math.log(n.upper)-Math.log(n.lower))*.001,ratio=(Math.sqrt(5)-1)/2;
   const score=async logValue=>{
    context.check();const value=Math.exp(logValue),q=await evaluate({[f.id]:fixed,[n.id]:value});calls++;
    if(q<cost){cost=q;optimum=value;}
    if(calls%4===0)await context.yield();
    return q;
   };
   let x=hi-ratio*(hi-lo),y=lo+ratio*(hi-lo),qx=await score(x),qy=await score(y);
   while(hi-lo>tolerance&&calls<18){
    if(qx<=qy){hi=y;y=x;qy=qx;x=hi-ratio*(hi-lo);qx=await score(x);}
    else{lo=x;x=y;qx=qy;y=lo+ratio*(hi-lo);qy=await score(y);}
   }
   records.push({fixedParameter:f.id,fixedValue:fixed,nuisanceParameter:n.id,optimum,cost,delta:cost-fitCost,boundary:optimum===grid[0][freeKey]||optimum===grid.at(-1)[freeKey],converged:hi-lo<=tolerance,evaluations:calls,logBracketWidth:hi-lo});
  }
 }
 return records;
}
