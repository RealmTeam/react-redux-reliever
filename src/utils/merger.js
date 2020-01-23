import Immutable from 'seamless-immutable'

export const DEL = '__DEL__'
export const OVERWRITE = '__OVERWRITE__'

// https://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects/5878101#5878101
function isPlainObject(obj) {
  if (typeof obj == 'object' && obj !== null) {
    if (typeof Object.getPrototypeOf == 'function') {
      var proto = Object.getPrototypeOf(obj)
      return proto === Object.prototype || proto === null
    }
    return Object.prototype.toString.call(obj) == '[object Object]'
  }
  return false
}

export default function merger(a, b) {
  // Overwrite handling OVERWRITE
  if (b && isPlainObject(b) && b[OVERWRITE]) {
    if (Immutable.isImmutable(b)) b = b.without(OVERWRITE)
    else delete b[OVERWRITE]
    return b
  }

  // Deletion handling DEL
  if (a && isPlainObject(a) && b && isPlainObject(b)) {
    Object.entries(b).forEach(([k, v]) => {
      if (v === DEL) {
        if (Immutable.isImmutable(b)) b = b.without(k)
        else delete b[k]
        if (Immutable.isImmutable(a)) a = a.without(k)
        else delete a[k]
      }
    })
  }

  // Regular merge
  if (a != null && Immutable.isImmutable(a) && !Array.isArray(a) && b != null && isPlainObject(b)) {
    return Immutable.merge(a, b, {deep: true, merger})
  }
  return b
}
