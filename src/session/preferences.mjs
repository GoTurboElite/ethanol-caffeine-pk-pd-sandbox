export const UI_VERSION='1.0.0';
export const UI_KEY='pkpd-v160-interface';
export const UI_DEFAULTS=Object.freeze({explanations:'concise',density:'comfortable',textSize:16,lineSpacing:'standard',focus:false,theme:'clarity-system',contrast:false,motion:'system',palette:'standard',chartLayout:'stacked',notifications:'quiet',panels:{}});
const choices={explanations:['concise','expanded','guided'],density:['comfortable','compact'],textSize:[16,18,20],lineSpacing:['standard','relaxed'],theme:['clarity-system','clarity-light','clarity-dark','workbench-dark','workbench-light','royal-vapor-dark','royal-vapor-light','chromatic','clinical','spectral','midnight','manuscript'],motion:['system','reduced'],palette:['standard','restrained'],chartLayout:['stacked','overlay'],notifications:['quiet','all']};
const displayDefaults=Object.freeze({bacDisplayUnit:'g/dL',unitDisplay:'metric',timeDisplayMode:'elapsed',autoRecalculate:true});
function validateDisplay(value){
 if(value===undefined)return {};
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid display preferences.');
 const safe={},options={bacDisplayUnit:['g/dL','% BAC','g/L','permille'],unitDisplay:['metric','metric-plus-imperial'],timeDisplayMode:['elapsed','clock']};
 for(const [key,allowed]of Object.entries(options)){if(value[key]!==undefined){if(!allowed.includes(value[key]))throw Error('Unsupported display preference: '+key);safe[key]=value[key];}}
 if(value.autoRecalculate!==undefined){if(typeof value.autoRecalculate!=='boolean')throw Error('Invalid automatic-calculation preference.');safe.autoRecalculate=value.autoRecalculate;}
 return safe;
}
export function validatePreferences(value){
 if(!value||typeof value!=='object'||Array.isArray(value))throw Error('The interface profile is incomplete.');
 const safe={...UI_DEFAULTS};
 for(const [key,values]of Object.entries(choices)){if(value[key]!==undefined&&!values.includes(value[key]))throw Error('Unsupported interface option: '+key);if(value[key]!==undefined)safe[key]=value[key];}
 for(const key of ['focus','contrast']){if(value[key]!==undefined&&typeof value[key]!=='boolean')throw Error('Invalid interface option: '+key);if(value[key]!==undefined)safe[key]=value[key];}
 if(value.panels!==undefined){if(!value.panels||typeof value.panels!=='object'||Array.isArray(value.panels))throw Error('Invalid panel preferences.');for(const [k,v]of Object.entries(value.panels)){if(!/^[a-z0-9-]{1,80}$/i.test(k)||typeof v!=='boolean')throw Error('Invalid panel preference.');}safe.panels={...value.panels};}
 return safe;
}
export class InterfacePreferences {
 constructor(store,env=globalThis){
  this.store=store;this.env=env;this.listeners=new Set();this.revision=0;this.error='';this.status='saved';
  const old=store.state.presentation;
  this.values=validatePreferences({...UI_DEFAULTS,theme:choices.theme.includes(old.theme)?old.theme:UI_DEFAULTS.theme,density:old.density==='comfortable'?'comfortable':'compact',contrast:!!old.enhancedContrast,motion:old.reducedMotion?'reduced':'system',palette:old.colourfulCharts===false?'restrained':'standard'});
  try{const raw=env.localStorage?.getItem(UI_KEY);if(raw){const data=JSON.parse(raw);if(data.version!==UI_VERSION)throw Error('This interface profile uses an unsupported version.');this.values=validatePreferences(data.values);}}catch(e){this.error='Interface preferences could not be restored: '+e.message;this.status='failed';}
  this.apply();
 }
 subscribe=f=>{this.listeners.add(f);return()=>this.listeners.delete(f);};
 snapshot=()=>this.revision;
 emit(){this.revision++;for(const f of this.listeners)f();}
 apply(){
  const p=this.values,s=this.store.state.presentation;
  const next={theme:p.theme,density:p.density,enhancedContrast:p.contrast,reducedMotion:p.motion==='reduced',colourfulCharts:p.palette==='standard'};
  if(Object.entries(next).some(([k,v])=>s[k]!==v))this.store.field('settings',{...s,...next});
 }
 set(patch){
  const next=validatePreferences({...this.values,...patch});this.values=next;this.apply();
  try{this.env.localStorage?.setItem(UI_KEY,JSON.stringify({version:UI_VERSION,values:next}));this.status='saved';this.error='';}catch(e){this.status='failed';this.error='Interface changes apply to this tab, but could not be saved: '+e.message;}
  this.emit();
 }
 reset(group){
  const groups={reading:['explanations','density','textSize','lineSpacing','focus'],appearance:['theme','contrast','palette','chartLayout'],interaction:['motion','notifications'],units:[],panels:['panels']};
  const keys=group?groups[group]:Object.keys(UI_DEFAULTS);if(!keys)throw Error('Unknown preference group.');
  this.set(Object.fromEntries(keys.map(k=>[k,UI_DEFAULTS[k]])));
  const display=!group?displayDefaults:group==='units'?{bacDisplayUnit:'g/dL',unitDisplay:'metric',timeDisplayMode:'elapsed'}:group==='interaction'?{autoRecalculate:true}:null;
  if(display)this.store.field('settings',{...this.store.state.presentation,...display});
 }
 export(){return {schema:'pkpd-interface-profile',version:UI_VERSION,values:validatePreferences(this.values),scientificDepth:this.store.state.presentation.detailMode,display:validateDisplay(Object.fromEntries(Object.entries(displayDefaults).map(([key,value])=>[key,this.store.state.presentation[key]??value])))};}
 import(text){
  if(typeof text!=='string'||text.length>65536)throw Error('Interface profiles are limited to 64 KiB.');
  const data=JSON.parse(text,(k,v)=>{if(['__proto__','prototype','constructor'].includes(k))throw Error('Unsupported profile key.');return v;});
  if(data.schema!=='pkpd-interface-profile'||data.version!==UI_VERSION)throw Error('This is not a supported interface profile.');
  if(!['default','detailed','expert'].includes(data.scientificDepth))throw Error('Invalid scientific depth.');
  const safe=validatePreferences(data.values),display=validateDisplay(data.display);this.set(safe);this.store.field('settings',{...this.store.state.presentation,...display,detailMode:data.scientificDepth});
 }
 panel(key,open){this.set({panels:{...this.values.panels,[key]:open}});}
}
