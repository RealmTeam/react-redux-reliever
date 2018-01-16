import {List} from 'immutable'


export default function merger(a, b) {
    if (a && a.mergeWith && !List.isList(a) && b !== null) {
        return a.mergeWith(merger, b)
    }
    return b
}
