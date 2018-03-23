import {all} from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'

export default class SagaRelieverPlugin {
  constructor() {
    if (!SagaRelieverPlugin.instance) {
      SagaRelieverPlugin.instance = this
      this.sagas = []
    }
    return SagaRelieverPlugin.instance
  }

  static addSaga(saga) {
    return new SagaRelieverPlugin().addSaga(saga)
  }

  addSaga(saga) {
    this.sagas.push(saga)
    return this
  }

  setupStore() {
    const sagas = this.sagas.map(saga => saga())
    const rootSaga = function*() {
      yield all(sagas)
    }
    this.middleware.run(rootSaga)
  }

  createMiddleware(reliever) {
    const saga = reliever.saga
    if (!saga) return
    this.sagas.push(saga.bind(reliever))
    if (!this.middleware) {
      this.middleware = createSagaMiddleware()
      return this.middleware
    }
    return null
  }
}
