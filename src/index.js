/* eslint-disable no-unused-vars */
import {connect} from 'react-redux'
import {mergeDeep} from './utils'


class ReduxReliever {
	ACTION_PREFIX = "(unset)"

	constructor(cls) {
		this.cls = cls
		this.container = this.connect()
		this.container.prototype.updateStatePropsIfNeeded = function updateStatePropsIfNeeded() {
			this.stateProps = this.computeStateProps(this.store, this.props)
			return false
		}
		this.container.prototype.updateDispatchPropsIfNeeded = function updateDispatchPropsIfNeeded() {
			this.dispatchProps = this.computeDispatchProps(this.store, this.props)
			return false
		}
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
		if (action.type.startsWith(this.ACTION_PREFIX + "_"))
			return mergeDeep(state, action.payload)
		return state
	}
}

export default ReduxReliever