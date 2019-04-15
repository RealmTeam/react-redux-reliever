import {List, Map, isImmutable} from 'immutable'

export const DEL = '__DEL__'
export const OVERWRITE = '__OVERWRITE__'

export default function merger(a, b) {
  if (b && (b[OVERWRITE] || (isImmutable(b) && b.get(OVERWRITE)))) {
    if (isImmutable(b)) b = b.delete(OVERWRITE)
    else delete b[OVERWRITE]
    return b
  }

  if (Map.isMap(a) || (!isImmutable(a) && typeof a === 'object' && Map.isMap(b)) || (!isImmutable(b) && typeof b === 'object')) {
    (isImmutable(b) ? b.entrySeq() : Object.entries(b)).forEach(([k, v]) => {
      if (v === DEL) {
        if (isImmutable(b)) b = b.delete(k)
        else delete b[k]
        if (isImmutable(a)) a = a.delete(k)
        else delete a[k]
      }
    })
  }

  if (a && a.mergeWith && !List.isList(a) && b != null) {
    return a.mergeWith(merger, b)
  }
  return b
}
