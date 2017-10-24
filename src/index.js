/* eslint-disable no-unused-vars */
import {mergeDeep} from './utils'
import RelieverRegistry from './registry'

class Reliever {
	*saga() {}

	ACTION_PREFIX = "(unset)"

	actions = {}

	reducer(state, action) {
		if (state === undefined)
			state = this.defaultState
		if (action.type.startsWith(this.ACTION_PREFIX + "_"))
			return mergeDeep(state, action.payload)
		return state
	}
}

export {Reliever, RelieverRegistry as default}