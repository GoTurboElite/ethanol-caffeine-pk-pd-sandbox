// Ephemeral navigation intent: never persisted or replayed by browser history.
export class SurfaceActivation{
 constructor({navigate,open,close,restore}){Object.assign(this,{navigate,open,close,restore});this.pending=null;this.active=null;this.serial=0;this.revision=0;this.listeners=new Set();}
 subscribe=fn=>{this.listeners.add(fn);return()=>this.listeners.delete(fn);};
 snapshot=()=>this.revision;
 emit(){this.revision++;for(const fn of this.listeners)fn();}
 request(surface,origin,target='#calculate'){
  if(this.active?.surface===surface&&this.active.target===target)return this.active.id;
  if(this.active){this.close(this.active.surface);this.active=null;}
  const request={id:++this.serial,surface,origin,target};this.pending=request;this.navigate(target);this.emit();return request.id;
 }
 location(hash){if(this.pending&&this.pending.target!==hash){this.pending=null;this.emit();}if(this.active&&this.active.target!==hash){const old=this.active;this.active=null;this.close(old.surface);this.emit();}}
 consume(readyRoute){if(!this.pending||this.pending.target!==readyRoute)return false;const request=this.pending;this.pending=null;this.active=request;this.open(request.surface);this.emit();return true;}
 cancel(){if(this.pending){this.pending=null;this.emit();}}
 closed(surface){if(this.active?.surface!==surface)return;const old=this.active;this.active=null;this.restore(old.origin,surface);this.emit();}
}
