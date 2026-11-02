import {v15Interpolate,v15TimeLabel} from '../session/core.mjs';
import {bacText,bacUnit,caffeineText} from './units.mjs';
export function inspectionValue(result,time,presentation){const p=v15Interpolate(result.analysisPoints??result.points,time);return v15TimeLabel(time)+(p?'; BAC '+bacText(p.bacGdL,presentation)+' '+bacUnit(presentation)+'; caffeine '+caffeineText(p.caffeineMgL,2)+' mg/L':' outside accepted coverage');}
