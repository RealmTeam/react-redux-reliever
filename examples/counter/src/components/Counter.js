/*eslint-disable no-unused-vars */
import React from 'react'
import RelieverRegistry from 'react-redux-reliever'
import {Scheduler} from 'rxjs'

const Counter = ({value, incr, incrAsync, decr, incrIfOdd, setToTen, startTimer}) => (
  <p>
    Clicked: {value} times <button onClick={incr}>+</button> <button onClick={decr}>-</button> <button onClick={incrIfOdd}>Increment if odd</button>{' '}
    <button onClick={incrAsync}>Increment async</button> <button onClick={setToTen}>Set to 10</button>
    <button onClick={startTimer}>Start timer</button>
  </p>
)

export default RelieverRegistry.connect$({
  props: {
    value: state$ => state$.map(state => state.counter.get('value')),
    heavyWorkData: state$ =>
      state$
        .map(state => state.counter.get('value'))
        .observeOn(Scheduler.asap)
        .map(value => {
          let i = 0
          while (i < value * 500) {
            console.log('doing heavy work')
            i++
          }
          return value
        })
  },
  functions: (state, ownProps, dispatch) => ({
    startTimer: () => {
      dispatch({type: 'COUNTER_START_TIMER'})
    },
    incr: () => {
      dispatch(RelieverRegistry.moduleActions('counter').increment())
    },
    setToTen: () => {
      dispatch(RelieverRegistry.moduleActions('counter').set(10))
    },
    incrAsync: () => {
      dispatch(RelieverRegistry.moduleActions('counter').incrementAsync())
    },
    incrIfOdd: () => {
      if (state.counter.get('value') % 2 !== 0) dispatch(RelieverRegistry.moduleActions('counter').increment())
    },
    decr: () => {
      dispatch(RelieverRegistry.moduleActions('counter').decrement())
    }
  })
})(Counter)

//or

// export default RelieverRegistry.connect({
//   props: (state, ownProps) => ({value: RelieverRegistry.moduleState('counter', state).get('value'), ...ownProps}),
//   functions: (state, ownProps, dispatch) => ({
//     startTimer: () => {
//       dispatch({type: 'COUNTER_START_TIMER'})
//     },
//     incr: () => {
//       dispatch(RelieverRegistry.moduleActions('counter').increment())
//     },
//     setToTen: () => {
//       dispatch(RelieverRegistry.moduleActions('counter').set(10))
//     },
//     incrAsync: () => {
//       dispatch(RelieverRegistry.moduleActions('counter').incrementAsync())
//     },
//     incrIfOdd: () => {
//       if (state.counter.get('value') % 2 !== 0) dispatch(RelieverRegistry.moduleActions('counter').increment())
//     },
//     decr: () => {
//       dispatch(RelieverRegistry.moduleActions('counter').decrement())
//     }
//   })
// })(Counter)
