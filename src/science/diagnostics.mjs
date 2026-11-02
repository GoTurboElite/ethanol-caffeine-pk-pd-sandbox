export function regression(points){
 if(points.length<3)return null;const n=points.length,mx=points.reduce((s,p)=>s+p.x,0)/n,my=points.reduce((s,p)=>s+p.y,0)/n,xx=points.reduce((s,p)=>s+(p.x-mx)**2,0),yy=points.reduce((s,p)=>s+(p.y-my)**2,0),xy=points.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0);
 return xx>0?{slope:xy/xx,correlation:yy>0?xy/Math.sqrt(xx*yy):null,n}:null;
}
export function residualDiagnostics(rows){
 const groups=[];for(const analyte of ['ethanol','caffeine'])for(const role of ['calibration','evaluation']){
  const all=rows.filter(r=>r.analyte===analyte&&r.role===role),quantified=all.filter(r=>r.qualifier==='=');if(!all.length)continue;
  groups.push({analyte,role,n:quantified.length,censored:all.length-quantified.length,suppliedSD:all.filter(r=>!r.assumedSD).length,defaultSD:all.filter(r=>r.assumedSD).length,standardizedRMSE:quantified.length?Math.sqrt(quantified.reduce((s,r)=>s+r.weighted**2,0)/quantified.length):null,timeTrend:regression(quantified.map(r=>({x:r.timeH,y:r.residual}))),concentrationTrend:regression(quantified.map(r=>({x:r.predicted,y:Math.abs(r.residual)}))),matrixCounts:Object.fromEntries([...new Set(all.map(r=>r.matrix))].map(m=>[m,all.filter(r=>r.matrix===m).length])),upperLimitSSE:all.filter(r=>r.qualifier==='<').reduce((s,r)=>s+r.weighted**2,0)});
 }
 return {groups,method:'Residual = predicted minus observed. Standardised residuals use supplied converted SD or the declared default error scale. Censored observations contribute one-sided exceedance penalties only, not signed measurement residuals. Trend slopes/correlations are descriptive; repeated group means, sparse rows and heterogeneous errors do not support an independent-error inference.'};
}
