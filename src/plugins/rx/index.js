import {Observable, ReplaySubject} from 'rxjs'
import {map, distinctUntilChanged, filter} from 'rxjs/operators'
import {combineEpics, createEpicMiddleware} from 'redux-observable'


function getAllProperties(obj, p = []) {
  if (obj == null) return p
  return getAllProperties(Object.getPrototypeOf(obj), [...p, ...Object.getOwnPropertyNames(obj)])
}

export default class RxRelieverPlugin {
  constructor() {
    if (!RxRelieverPlugin.instance) {
      this.store$ = new ReplaySubject()
      this.middleware = null
      this.epics = []
      RxRelieverPlugin.instance = this
    }
    return RxRelieverPlugin.instance
  }

  setupStore(store) {
    this.store$.next(store)
    this.store$ = this.store$.asObservable()

    const input = (action$, state$) => {
      const stream$ = this.middlewareOptions.input ? this.middlewareOptions.input(action$, state$) : action$
      if (!RxRelieverPlugin.instance.action$) {
        RxRelieverPlugin.instance.action$ = stream$
      }
      if (!RxRelieverPlugin.instance.state$) {
        RxRelieverPlugin.instance.state$ = state$
      }
      return stream$
    }
    const output = (action$, state$) => {
      const stream$ = action$.pipe(filter(action => action && action.type))
      return this.middlewareOptions.output ? this.middlewareOptions.output(stream$, state$) : stream$
    }
    const adapter = (...args) => {
      const [action$, ...rest] = args
      return output(combineEpics(...this.epics)(input(action$, ...rest), ...rest), ...rest)
    }
    this.middleware.run(adapter)
  }

  createMiddleware(reliever, options = {}) {
    const epics = getAllProperties(reliever)
      .filter(key => key.endsWith('Epic'))
      .map(key => reliever[key].bind(reliever))

    this.epics = this.epics.concat(epics)

    if (!this.middleware) {
      this.middleware = createEpicMiddleware()
      this.middlewareOptions = options
      return this.middleware
    }
    return null
  }

  extensions() {
    const getStore = () => RxRelieverPlugin.instance.store$
    const getState = module => getStore().pipe(map(store => {
      const state = store.getState()
      return module ? state[module] : state
    }))
    const reduxActionStream = () => RxRelieverPlugin.instance.action$
    const observeState = module => RxRelieverPlugin.instance.state$.pipe(map(state => module ? state[module] : state), distinctUntilChanged())
    return {
      getStore,
      getState,
      reduxActionStream,
      observeState,
    }
  }
}

