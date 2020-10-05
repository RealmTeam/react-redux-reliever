import Immutable from 'seamless-immutable'

export const DEL = '__DEL__'
export const OVERWRITE = '__OVERWRITE__'

// https://github.com/rtfeldman/seamless-immutable/blob/2d870b14a01e222493c686a7644181185f859558/src/seamless-immutable.js#L75
function isMergableObject(target) {
  return (target !== null && typeof target === "object"
          && !(Array.isArray(target)) && !(target instanceof Date))
}

// https://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects/5878101#5878101
function isPlainObject(obj) {
  if (typeof obj == 'object' && obj !== null) {
    if (typeof Object.getPrototypeOf == 'function') {
      var proto = Object.getPrototypeOf(obj)
      return (proto === Object.prototype || proto === null ||
              (Immutable.isImmutable(obj) && isMergableObject(obj)))
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
  if (a != null && isPlainObject(a) && !Array.isArray(a) &&
      b != null && isPlainObject(b)) {
    return Immutable.merge(a, b, {deep: true, merger})
  }
  return b
}
