import {put, call, takeEvery} from 'redux-saga/effects'
import {delay} from 'redux-saga'
import ReduxReliever from 'react-redux-reliever'
import Counter from '../components/Counter'


class CounterReduxReliever extends ReduxReliever {
    ACTION_PREFIX = 'COUNTER'

    defaultState = {
        value: 0
    }

    props(state, ownProps) {
        return {value: state.counter.value, ...ownProps}
    }

    *incrementAsync(action) {
        yield call(delay, 1000)
        yield put({type: 'COUNTER_INCREMENT'})
    }

    *saga() {
        yield takeEvery('COUNTER_INCREMENT_ASYNC', this.incrementAsync)
    }

    functions(state, ownProps, dispatch) {
        return {
            incr: () => {
                dispatch({type: 'COUNTER_INCREMENT'})
            },
            setToTen: () => {
                dispatch({type: 'COUNTER_SET', payload: {value: 10}})
            },
            incrAsync: () => {
                dispatch({type: 'COUNTER_INCREMENT_ASYNC'})
            },
            incrIfOdd: () => {
                if (state.counter.value % 2 !== 0)
                    dispatch({type: 'COUNTER_INCREMENT'})
            },
            decr: () => {
                dispatch({type: 'COUNTER_DECREMENT'})
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

const relievedCounter = new CounterReduxReliever(Counter)

const CounterContainer = relievedCounter.container
const CounterSaga = relievedCounter.saga.bind(relievedCounter)
const CounterReducer = relievedCounter.reducer.bind(relievedCounter)

export {CounterContainer as default, CounterSaga, CounterReducer}