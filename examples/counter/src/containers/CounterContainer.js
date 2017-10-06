import {put, call, takeEvery} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import ReduxReliever, {ReduxRelieverRegistry} from "react-redux-reliever"
import Counter from '../components/Counter'


class CounterReduxReliever extends ReduxReliever {
    ACTION_PREFIX = 'COUNTER'

    defaultState = {
        value: 0
    }

    props(state, ownProps) {
        return {value: ReduxRelieverRegistry.getModuleState(state, "counter").value, ...ownProps}
    }

    *incrementAsync(action) {
        yield call(delay, 1000)
        yield put(ReduxRelieverRegistry.getModuleActions("counter").increment())
    }

    *saga() {
        yield takeEvery('COUNTER_INCREMENT_ASYNC', this.incrementAsync)
    }

    actions = {
        increment: () => ({type: 'COUNTER_INCREMENT'}),
        set: (v) => ({type: 'COUNTER_SET', payload: {value: v}}),
        incrementAsync: () => ({type: 'COUNTER_INCREMENT_ASYNC'}),
        decrement: () => ({type: 'COUNTER_DECREMENT'})
    }

    functions(state, ownProps, dispatch) {
        return {
            incr: () => {
                dispatch(this.actions.increment())
            },
            setToTen: () => {
                dispatch(this.actions.set(10))
            },
            incrAsync: () => {
                dispatch(this.actions.incrementAsync())
            },
            incrIfOdd: () => {
                if (state.counter.value % 2 !== 0)
                    dispatch(this.actions.increment())
            },
            decr: () => {
                dispatch(this.actions.decrement())
            }
        }
    }

    reducer(state, action) {
        switch (action.type) {
            case 'COUNTER_INCREMENT':
                return {value: state.value + 1}
            case 'COUNTER_DECREMENT':
                return {value: state.value - 1}
            default:
                return super.reducer(state, action)
        }
    }

}

export default ReduxRelieverRegistry.register(CounterReduxReliever, Counter, "counter")