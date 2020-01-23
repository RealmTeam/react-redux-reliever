import {Reliever, plugins} from 'react-redux-reliever'
import {takeLatest} from 'redux-saga/effects'
import {map, mapTo, filter, takeUntil, delay, tap, flatMap} from 'rxjs/operators'
import {timer, combineLatest} from 'rxjs'

const {getStore, getState, reduxActionStream, observeState} = plugins.RxRelieverPlugin.extensions()

class CounterReliever extends Reliever {
  ACTION_PREFIX = 'COUNTER'

  getInitialState() {
    return {
      value: 0
    }
  }

  *sagaSideEffect(action) {
    console.log('some saga side effect', action)
  }

  *saga() {
    yield takeLatest('COUNTER_INCREMENT', this.sagaSideEffect.bind(this))
  }

  incrementEpic(action$) {
    return action$.ofType('COUNTER_INCREMENT').pipe(
      flatMap(() => {
        return getState('counter').pipe(
          map(x => x.asMutable()),
          map(({value}) => ({type: 'COUNTER_SET', payload: {value: value + 1}}))
        )
      })
    )
  }

  decrementEpic(action$) {
    return action$.ofType('COUNTER_DECREMENT').pipe(
      flatMap(() => {
        return getState('counter').pipe(
          map(x => x.asMutable()),
          map(({value}) => ({type: 'COUNTER_SET', payload: {value: value - 1}}))
        )
      })
    )
  }

  incrementAsyncEpic(action$) {
    return action$.ofType('COUNTER_INCREMENT_ASYNC').pipe(
      delay(500),
      tap(() => console.log('some side effect')), // eslint-disable-line no-console
      delay(500),
      mapTo({type: 'COUNTER_INCREMENT'})
    )
  }

  timerEpic(action$) {
    return action$.ofType('COUNTER_START_TIMER').pipe(
      flatMap(() => {
        const toValue = state => state.getIn('value')
        const startValue$ = getState('counter').pipe(map(toValue))
        const currentValue$ = observeState('counter').pipe(map(toValue))
        const counterHasIncremented10Times$ = combineLatest(startValue$, currentValue$).pipe(filter(([start, current]) => current - start >= 10))

        return timer(0, 500).pipe(
          takeUntil(counterHasIncremented10Times$),
          mapTo({type: 'COUNTER_INCREMENT'})
        )
      })
    )
  }

  getActions() {
    return {
      actionWithError: () => ({type: 'COUNTER_ACTION_WITH_ERROR'}),
      startTimer: () => ({type: 'COUNTER_TIMER'}),
      increment: () => ({type: 'COUNTER_INCREMENT'}),
      set: v => ({type: 'COUNTER_SET', payload: {value: v}}),
      incrementAsync: () => ({type: 'COUNTER_INCREMENT_ASYNC'}),
      decrement: () => ({type: 'COUNTER_DECREMENT'})
    }
  }
}

export default CounterReliever
