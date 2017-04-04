function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

function isPlainObject(item) {
  return item !== null && typeof item == 'object' && item.constructor == Object;
}

export function mergeDeep(target, source) {
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isPlainObject(source[key])) {
                if (!target[key])
                    target = {...target, [key]: {}}
                target = {...target, [key]: mergeDeep(target[key], source[key])}
            } else {
                target = {...target, [key]: source[key]}
            }
        })
    }
    return target
}
