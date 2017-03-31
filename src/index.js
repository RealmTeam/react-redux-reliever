/* eslint-disable no-unused-vars */
import connect from './connect'
import {mergeDeep} from './utils'


class ReduxReliever {
	ACTION_PREFIX = "(unset)"

	constructor(cls) {
		this.cls = cls
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

export default ReduxReliever