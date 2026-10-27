import {h,React} from './runtime.mjs';
export function Dialog({title,onClose,children,wide=false}){
 const ref=React.useRef(null),previous=React.useRef(document.activeElement);
 React.useEffect(()=>{const el=ref.current;if(!el.open)el.showModal();el.querySelector('[autofocus],input:not([type="hidden"]),select,textarea')?.focus();const onCancel=e=>{e.preventDefault();onClose();};el.addEventListener('cancel',onCancel);return()=>{el.removeEventListener('cancel',onCancel);el.close();if(previous.current?.isConnected)previous.current.focus();else document.querySelector('[aria-label=\"Find a control or parameter\"]')?.focus();};},[]);
 return <dialog ref={ref} className={'v160-dialog'+(wide?' wide':'')} aria-labelledby="v160-dialog-title"><header><h2 id="v160-dialog-title">{title}</h2><button type="button" className="v15-button icon-button" aria-label={'Close '+title} onClick={onClose}>×</button></header><div className="v160-dialog-body">{children}</div></dialog>;
}
