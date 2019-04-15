import {fromJS} from 'immutable'
import RelieverRegistry from './registry'
import merger, {DEL, OVERWRITE} from './utils/merger'
import RxRelieverPlugin from './plugins/rx'
import SagaRelieverPlugin from './plugins/saga'

class Reliever {
  ACTION_PREFIX = '(unset)'

  getInitialState() {
    return {}
  }

  getActions() {
    return {}
  }

  reducer(state, action) {
    if (state === undefined) state = fromJS(this.getInitialState())
    if (action.type.startsWith(this.ACTION_PREFIX + '_')) return merger(state, action.payload)
    return state
  }
}

const plugins = {
  RxRelieverPlugin,
  SagaRelieverPlugin
}

export {Reliever, RelieverRegistry as default, plugins, DEL, OVERWRITE}
