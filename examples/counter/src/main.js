import "babel-polyfill"

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import createLogger from 'redux-logger';
import createSagaMiddleware from 'redux-saga'
import {fork} from 'redux-saga/effects'
import CounterContainer, {CounterSaga, CounterReducer} from './containers/CounterContainer'

const logger = createLogger();

const rootReducer = combineReducers({
    counter: CounterReducer
})

function* rootSaga() {
    yield fork(CounterSaga)
}
const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, logger))

sagaMiddleware.run(rootSaga)


render(
    <Provider store={store}>
        <CounterContainer />
    </Provider>,
    document.getElementById('root')
)