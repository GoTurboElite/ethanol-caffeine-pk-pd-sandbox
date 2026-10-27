export class V15Storage {
  constructor(env=globalThis){this.env=env;this.database=null;this.mode='unopened';this.status='idle';this.error='';this.fallbackKey='pkpd-v15-project-store';}
  async open(){
    if(this.database||this.mode==='localStorage')return;
    try {
      if(!this.env.indexedDB)throw Error('IndexedDB is unavailable.');
      this.database=await new Promise((resolve,reject)=>{
        const request=this.env.indexedDB.open('pkpd-sessions',1);
        request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('records'))request.result.createObjectStore('records',{keyPath:'id'});};
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>reject(request.error??Error('Session database could not be opened.'));
        request.onblocked=()=>reject(Error('Close another old application tab to complete the storage upgrade.'));
      });
      this.database.onversionchange=()=>{this.database.close();this.database=null;this.mode='unopened';};
      this.mode='IndexedDB';this.status='ready';
    }catch(error){
      try{const key='pkpd-storage-probe';this.env.localStorage.setItem(key,'1');this.env.localStorage.removeItem(key);this.mode='localStorage';this.status='ready';}
      catch{this.status='failed';this.mode='unavailable';this.error=error.message;throw Error('Browser storage is unavailable. Session JSON export remains available.');}
    }
  }
  async operation(mode,action){
    await this.open();
    if(this.mode==='localStorage'){
      const raw=this.env.localStorage.getItem(this.fallbackKey);
      const values=raw?JSON.parse(raw):[];
      const result=action({fallback:values});
      if(mode==='readwrite')this.env.localStorage.setItem(this.fallbackKey,JSON.stringify(values));
      return result;
    }
    return new Promise((resolve,reject)=>{
      const tx=this.database.transaction('records',mode),store=tx.objectStore('records');
      let value,request;
      try{request=action(store);if(request)request.onsuccess=()=>{value=request.result;};}catch(error){reject(error);return;}
      tx.oncomplete=()=>resolve(value);
      tx.onerror=()=>reject(tx.error??Error('Session storage failed.'));
      tx.onabort=()=>reject(tx.error??Error('Session storage was interrupted.'));
    });
  }
  async put(record){
    try{await this.operation('readwrite',store=>{
      if(store.fallback){const i=store.fallback.findIndex(r=>r.id===record.id);if(i>=0)store.fallback[i]=record;else store.fallback.push(record);return record;}
      return store.put(record);
    });this.status='saved';this.error='';return record;}
    catch(error){this.status='failed';this.error=error.message;throw error;}
  }
  async get(id){return this.operation('readonly',store=>store.fallback?store.fallback.find(r=>r.id===id):store.get(id));}
  async list(){const rows=await this.operation('readonly',store=>store.fallback?store.fallback:store.getAll());return rows??[];}
  async remove(id){return this.operation('readwrite',store=>{if(store.fallback){const i=store.fallback.findIndex(r=>r.id===id);if(i>=0)store.fallback.splice(i,1);return;}return store.delete(id);});}
}
