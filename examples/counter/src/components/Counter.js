/*eslint-disable no-unused-vars */
import React from 'react'
import {connect, moduleState, moduleActions} from "react-redux-reliever"

const Counter = ({value, incr, incrAsync, decr, incrIfOdd, setToTen}) => (
    <p>
        Clicked: {value} times
        {' '}
        <button onClick={incr}>+</button>
        {' '}
        <button onClick={decr}>-</button>
        {' '}
        <button onClick={incrIfOdd}>Increment if odd</button>
        {' '}
        <button onClick={incrAsync}>Increment async</button>
        {' '}
        <button onClick={setToTen}>Set to 10</button>
    </p>
)

export default connect({
    props: (state, ownProps) => ({value: moduleState("counter", state).value, ...ownProps}),
    functions(state, ownProps, dispatch) => ({
        incr: () => {
            dispatch(moduleActions("counter").increment())
        },
        setToTen: () => {
            dispatch(moduleActions("counter").set(10))
        },
        incrAsync: () => {
            dispatch(moduleActions("counter").incrementAsync())
        },
        incrIfOdd: () => {
            if (state.counter.value % 2 !== 0)
                dispatch(moduleActions("counter").increment())
        },
        decr: () => {
            dispatch(moduleActions("counter").decrement())
        }
    })
})(Counter)
