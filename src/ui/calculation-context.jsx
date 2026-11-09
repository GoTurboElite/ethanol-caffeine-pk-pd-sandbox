import {h} from './runtime.mjs';

export function CalculationContext({name,className='',kind,label,description,metadata,actions,children}){
 return <section className={className} aria-label={name} data-calculation-state={kind}>
  <span role="status" aria-atomic="true"><i aria-hidden="true"/><strong className={kind==='current'?'v21-accepted':undefined}>{label}</strong>{description&&<span className={kind==='current'?'v21-current-description':undefined}>{description}</span>}{metadata}</span>
  {actions}{children}
 </section>;
}
