/* eslint-disable no-unused-vars */
import {fromJS} from 'immutable'
import RelieverRegistry from './registry'


class Reliever {
	ACTION_PREFIX = "(unset)"

	getInitialState() {
		return {}
	}

	getActions() {
		return {}
	}
	
	*saga() {}

	reducer(state, action) {
		if (state === undefined)
			state = fromJS(this.getInitialState())
		if (action.type.startsWith(this.ACTION_PREFIX + "_"))
			return state.mergeDeep(action.payload)
		return state
	}
}

export {Reliever, RelieverRegistry as default}