/*eslint-disable no-unused-vars */
import React from 'react'
import RelieverRegistry, {connect} from 'react-redux-reliever'

const Counter = ({value, incr, incrAsync, decr, incrIfOdd, setToTen, startTimer}) => (
  <p>
    Clicked: {value} times <button onClick={incr}>+</button> <button onClick={decr}>-</button> <button onClick={incrIfOdd}>Increment if odd</button>{' '}
    <button onClick={incrAsync}>Increment async</button> <button onClick={setToTen}>Set to 10</button>
    <button onClick={startTimer}>Start timer</button>
  </p>
)

export default connect({
  props: (state, ownProps) => ({
    value: RelieverRegistry.moduleState('counter', state).value
  }),
  functions: (props, dispatch) => ({
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
      if (props.value % 2 !== 0) dispatch(RelieverRegistry.moduleActions('counter').increment())
    },
    decr: () => {
      dispatch(RelieverRegistry.moduleActions('counter').decrement())
    }
  })
})(Counter)
