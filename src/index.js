/* eslint-disable no-unused-vars */
import {connect} from 'react-redux'

class ReduxReliever {
	ACTION_PREFIX = "(unset)"

	constructor(cls) {
		this.cls = cls
		this.container = this.connect()
	}

	connect() {
		return connect(
			(state, ownProps) => state,
			(dispatch, ownProps) => ({dispatch}),
			(state, {dispatch}, ownProps) => ({
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
		if (action.type.startsWith(this.ACTION_PREFIX))
			return {...state, ...action.payload}
		return state
	}
}

export default ReduxReliever