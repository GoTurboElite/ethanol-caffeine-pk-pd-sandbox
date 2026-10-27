import {V15Controller} from '../session/controller.mjs';
import {v15PWA} from '../session/pwa.mjs';
export let React,Fragment,bridge,controller,pwa;
export const h=(...args)=>React.createElement(...args);
export function v15InitUI(value){
 bridge=value;React=value.React;Fragment=React.Fragment;controller=new V15Controller(value);pwa=v15PWA(controller);
 return{controller,pwa};
}
export function useSession(){
 React.useSyncExternalStore(controller.subscribe,controller.getRevision,controller.getRevision);
 return React.useSyncExternalStore(bridge.store.subscribe,bridge.store.getState,bridge.store.getState);
}
export function usePWA(){React.useSyncExternalStore(pwa.subscribe,()=>pwa.revision,()=>pwa.revision);return pwa.state;}
export function navigate(workspace,view=''){window.location.hash='#'+workspace+(view?'/'+view:'');}
export function announce(text,kind='success'){controller.notice={text,kind};controller.emit();}
export function action(fn,success){
 try{
  const result=fn();
  if(result&&typeof result.then==='function')return result.then(value=>{if(success)announce(success);return value;}).catch(error=>announce(error.message,'error'));
  if(success)announce(success);return result;
 }catch(error){announce(error.message,'error');}
}
export function download(name,content,type='application/json'){
 const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);
}
export function accepted(){
 const state=bridge.store.state,snapshot=bridge.snapshot();
 return{state,snapshot,result:snapshot?.numerical??null,input:state.accepted?.canonicalScenario??null,current:!!snapshot&&state.snapshots.relationToDraft==='current'&&!state.editingInvalidCount};
}
