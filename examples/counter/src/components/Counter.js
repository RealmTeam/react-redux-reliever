/*eslint-disable no-unused-vars */
import React from 'react'
import RelieverRegistry from "react-redux-reliever"

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

export default RelieverRegistry.connect({
    props: (state, ownProps) => ({value: RelieverRegistry.moduleState("counter", state).value, ...ownProps}),
    functions: (state, ownProps, dispatch) => ({
        incr: () => {
            dispatch(RelieverRegistry.moduleActions("counter").increment())
        },
        setToTen: () => {
            dispatch(RelieverRegistry.moduleActions("counter").set(10))
        },
        incrAsync: () => {
            dispatch(RelieverRegistry.moduleActions("counter").incrementAsync())
        },
        incrIfOdd: () => {
            if (state.counter.value % 2 !== 0)
                dispatch(RelieverRegistry.moduleActions("counter").increment())
        },
        decr: () => {
            dispatch(RelieverRegistry.moduleActions("counter").decrement())
        }
    })
})(Counter)
