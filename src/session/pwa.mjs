export function v15PWA(controller,environment=globalThis){
 const state={status:'checking',online:environment.navigator?.onLine!==false,registration:null,waiting:null,prompt:null,message:''},listeners=new Set();
 const emit=()=>{for(const f of listeners)f();};
 const api={state,subscribe:f=>{listeners.add(f);return()=>listeners.delete(f);},revision:0};
 const update=()=>{api.revision++;emit();};
 const nav=environment.navigator;
 if(!environment.location||environment.location.protocol==='file:'||environment.document?.documentElement.dataset.delivery==='standalone'||!nav?.serviceWorker){state.status='standalone';update();return api;}
 let reloadRequested=false,reloaded=false;
 environment.addEventListener('online',()=>{state.online=true;update();});
 environment.addEventListener('offline',()=>{state.online=false;update();});
 environment.addEventListener('beforeinstallprompt',event=>{event.preventDefault();state.prompt=event;update();});
 environment.addEventListener('appinstalled',()=>{state.prompt=null;state.message='Application installed.';update();});
 nav.serviceWorker.addEventListener('controllerchange',()=>{if(reloadRequested&&!reloaded){reloaded=true;environment.location.reload();}});
 api.check=async()=>{
  try{await state.registration?.update();state.waiting=state.registration?.waiting??null;state.message=state.waiting?'A new release is ready.':'Update check completed.';update();}
  catch(error){state.message='Update check could not complete: '+error.message;update();}
 };
 api.install=async()=>{if(!state.prompt)return;const prompt=state.prompt;state.prompt=null;await prompt.prompt();await prompt.userChoice;update();};
 api.activate=async()=>{
  if(!state.waiting)throw Error('No waiting update is available.');
  const record=await controller.flushRecovery(true);
  if(!record)throw Error('Complete the current inputs before applying the update.');
  environment.sessionStorage.setItem('pkpd-v15-update-restore','1');
  reloadRequested=true;state.waiting.postMessage({type:'PKPD_ACTIVATE_UPDATE'});
 };
 nav.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(async registration=>{
  state.registration=registration;state.waiting=registration.waiting;
  const watch=worker=>{if(worker)worker.addEventListener('statechange',()=>{
   state.waiting=registration.waiting;
   if(worker.state==='activated')state.status='ready';
   if(worker.state==='installed'&&nav.serviceWorker.controller)state.message='A new release is ready.';
   update();
  });};
  registration.addEventListener('updatefound',()=>watch(registration.installing));watch(registration.installing);
  await nav.serviceWorker.ready;state.status='ready';state.waiting=registration.waiting;update();
 }).catch(error=>{state.status='failed';state.message='Offline setup could not complete: '+error.message;update();});
 return api;
}
