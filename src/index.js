/* eslint-disable no-unused-vars */
import {mergeDeep} from './utils'
import RelieverRegistry from './registry'

class Reliever {
	ACTION_PREFIX = "(unset)"

	constructor() {
		this.actions = {}
	}

	*saga() {}

	reducer(state, action) {
		if (state === undefined)
			state = this.defaultState
		if (action.type.startsWith(this.ACTION_PREFIX + "_"))
			return mergeDeep(state, action.payload)
		return state
	}
}

export {Reliever, RelieverRegistry as default}