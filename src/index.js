import {fromJS} from 'immutable'
import RelieverRegistry from './registry'
import merger from './utils/merger'

function getAllProperties(obj, p = []) {
  if (obj == null) return p
  return getAllProperties(Object.getPrototypeOf(obj), [...p, ...Object.getOwnPropertyNames(obj)])
}

class Reliever {
  ACTION_PREFIX = '(unset)'

  getInitialState() {
    return {}
  }

  getActions() {
    return {}
  }

  epics() {
    const props = getAllProperties(this)
    return props.filter(key => key.endsWith('Epic')).map(key => this[key].bind(this))
  }

  reducer(state, action) {
    if (state === undefined) state = fromJS(this.getInitialState())
    if (action.type.startsWith(this.ACTION_PREFIX + '_')) return merger(state, action.payload)
    return state
  }
}

Reliever.actions = {
  noop: {type: '___NO-OP___'}
}

export {Reliever, RelieverRegistry as default}
