import {put, call, takeEvery} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import RelieverRegistry, {Reliever} from "react-redux-reliever"


class CounterReliever extends Reliever {
    ACTION_PREFIX = 'COUNTER'

    getInitialState() {
        return {
            value: 0
        }
    }

    *incrementAsync(action) {
        yield call(delay, 1000)
        yield put(RelieverRegistry.moduleActions("counter").increment())
    }

    *saga() {
        yield takeEvery('COUNTER_INCREMENT_ASYNC', this.incrementAsync)
    }

    getActions() {
        return {        
            increment: () => ({type: 'COUNTER_INCREMENT'}),
            set: (v) => ({type: 'COUNTER_SET', payload: {value: v}}),
            incrementAsync: () => ({type: 'COUNTER_INCREMENT_ASYNC'}),
            decrement: () => ({type: 'COUNTER_DECREMENT'})
        }
    }

    reducer(state, action) {
        switch (action.type) {
            case 'COUNTER_INCREMENT':
                return state.set('value', state.get('value') + 1)
            case 'COUNTER_DECREMENT':
                return state.set('value', state.get('value') - 1)
            default:
                return super.reducer(state, action)
        }
    }
}

export default CounterReliever