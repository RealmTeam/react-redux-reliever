import {Reliever} from 'react-redux-reliever'
import {Observable} from 'rxjs'

class CounterReliever extends Reliever {
  ACTION_PREFIX = 'COUNTER'

  getInitialState() {
    return {
      value: 0
    }
  }

  incrementEpic(action$) {
    return action$.ofType('COUNTER_INCREMENT').flatMap(() => {
      return Observable.getState('counter')
        .map(x => x.toJS())
        .map(({value}) => {
          return {type: 'COUNTER_SET', payload: {value: value + 1}}
        })
    })
  }

  decrementEpic(action$) {
    return action$.ofType('COUNTER_DECREMENT').flatMap(() => {
      return Observable.getState('counter')
        .map(x => x.toJS())
        .map(({value}) => {
          return {type: 'COUNTER_SET', payload: {value: value - 1}}
        })
    })
  }

  incrementAsyncEpic(action$) {
    return action$
      .ofType('COUNTER_INCREMENT_ASYNC')
      .delay(500)
      .do(() => console.log('some side effect')) // eslint-disable-line no-console
      .delay(500)
      .mapTo({type: 'COUNTER_INCREMENT'})
  }

  timerEpic(action$) {
    return action$.ofType('COUNTER_START_TIMER').flatMap(() => {
      const toValue = state => state.toJS().value
      const startValue$ = Observable.getState('counter').map(toValue)
      const currentValue$ = Observable.observeState('counter').map(toValue)
      const counterHasIncremented10Times$ = Observable.combineLatest(startValue$, currentValue$).filter(([start, current]) => current - start >= 10)

      return Observable.timer(0, 500)
        .takeUntil(counterHasIncremented10Times$)
        .mapTo({type: 'COUNTER_INCREMENT'})
    })
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
