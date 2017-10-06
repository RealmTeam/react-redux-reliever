/* eslint-disable no-unused-vars */
import connect from './connect'
import {mergeDeep} from './utils'
import ReduxRelieverRegistry from './registry'

class ReduxReliever {
	ACTION_PREFIX = "(unset)"

	constructor(cls) {
		this.cls = cls
		this.actions = {}
		this.container = this.connect()
	}

	connect() {
		return connect(
			(state, dispatch, ownProps) => ({
				...this.props(state, ownProps),
				...this.functions(state, ownProps, dispatch)
			})
		)(this.cls)
	}

	props(state, ownProps) {
		return ownProps
	}

	*saga() {}

	functions(state, ownProps, dispatch) {
		return {}
	}

	reducer(state, action) {
		if (state === undefined)
			state = this.defaultState
		if (action.type.startsWith(this.ACTION_PREFIX + "_"))
			return mergeDeep(state, action.payload)
		return state
	}
}

export {ReduxReliever as default, ReduxRelieverRegistry}