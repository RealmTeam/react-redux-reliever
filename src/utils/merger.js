import {List, Map, isImmutable} from 'immutable'

export const DEL = '__DEL__'
export const OVERWRITE = '__OVERWRITE__'

// https://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects/5878101#5878101
function isPlainObject(obj) {
  if (typeof obj == 'object' && obj !== null) {
    if (typeof Object.getPrototypeOf == 'function') {
      var proto = Object.getPrototypeOf(obj);
      return proto === Object.prototype || proto === null;
    }
    return Object.prototype.toString.call(obj) == '[object Object]';
  }
  return false;
}

export default function merger(a, b) {
  // Overwrite handling OVERWRITE
  if (b && ((isPlainObject(b) && b[OVERWRITE]) || (isImmutable(b) && b.get(OVERWRITE)))) {
    if (isImmutable(b)) b = b.delete(OVERWRITE)
    else delete b[OVERWRITE]
    return b
  }

  // Deletion handling DEL
  if (a && (Map.isMap(a) || isPlainObject(a)) && b && (Map.isMap(b) || isPlainObject(b))) {
    (isImmutable(b) ? b.entrySeq() : Object.entries(b)).forEach(([k, v]) => {
      if (v === DEL) {
        if (isImmutable(b)) b = b.delete(k)
        else delete b[k]
        if (isImmutable(a)) a = a.delete(k)
        else delete a[k]
      }
    })
  }

  // Regular merge
  if (a && a.mergeWith && !List.isList(a) && b !== null && (Map.isMap(b) || isPlainObject(b))) {
    return a.mergeWith(merger, b)
  }
  return b
}
