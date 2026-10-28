import {runScience} from './analysis.mjs';
import {runBenchmarks} from './evidence.mjs';
self.onmessage=async event=>{const {id,request}=event.data;try{const options={progress:(done,total)=>self.postMessage({id,type:'progress',done,total}),yield:()=>new Promise(r=>setTimeout(r,0))};const result=request.kind==='benchmarks'?await runBenchmarks(PKCore,options):await runScience(PKCore,request,options);self.postMessage({id,type:'result',result});}catch(error){self.postMessage({id,type:'error',message:error.message});}};
