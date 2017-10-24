import "babel-polyfill"

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import RelieverRegistry from "react-redux-reliever"
import CounterReliever from './relievers/CounterReliever'
import Counter from './components/Counter'

RelieverRegistry.register(CounterReliever, "counter")

const logger = createLogger()

const rootReducer = RelieverRegistry.buildRootReducer()

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger))

sagaMiddleware.run(RelieverRegistry.buildRootSaga())

render(
    <Provider store={store}>
        <Counter />
    </Provider>,
    document.getElementById('root')
)