function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

export function mergeDeep(target, source) {
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
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
