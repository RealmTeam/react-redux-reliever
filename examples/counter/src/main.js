import "babel-polyfill"

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import createLogger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import ReduxRelieverRegistry from "react-redux-reliever"
import CounterContainer, {CounterSaga, CounterReducer} from './containers/CounterContainer'

const logger = createLogger()

const rootReducer = ReduxRelieverRegistry.buildRootReducer()

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger))

sagaMiddleware.run(ReduxRelieverRegistry.buildRootSaga())


render(
    <Provider store={store}>
        <CounterContainer />
    </Provider>,
    document.getElementById('root')
)