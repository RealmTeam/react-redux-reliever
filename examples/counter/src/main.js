import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import RelieverRegistry from 'react-redux-reliever'
import RxRelieverPlugin from 'react-redux-reliever/plugins/rx'
import SagaRelieverPlugin from 'react-redux-reliever/plugins/saga'
import CounterReliever from './relievers/CounterReliever'
import Counter from './components/Counter'

RelieverRegistry.use(RxRelieverPlugin)
RelieverRegistry.use(SagaRelieverPlugin)
RelieverRegistry.register(CounterReliever, 'counter')

const logger = createLogger()
const store = createStore(RelieverRegistry.buildRootReducer(), applyMiddleware(...RelieverRegistry.middlewares(), logger))
RelieverRegistry.setupStore(store)

render(
  <Provider store={store}>
    <Counter />
  </Provider>,
  document.getElementById('root')
)
