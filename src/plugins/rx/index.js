import Rx from './utils'
import {combineEpics, createEpicMiddleware} from 'redux-observable'

function getAllProperties(obj, p = []) {
  if (obj == null) return p
  return getAllProperties(Object.getPrototypeOf(obj), [...p, ...Object.getOwnPropertyNames(obj)])
}

export default class RxRelieverPlugin {
  constructor() {
    if (!RxRelieverPlugin.instance) {
      this.store$ = new Rx.ReplaySubject()
      RxRelieverPlugin.instance = this
    }
    return RxRelieverPlugin.instance
  }

  setupStore(store) {
    this.store$.next(store)
  }

  createMiddleware(reliever) {
    const epics = getAllProperties(reliever)
      .filter(key => key.endsWith('Epic'))
      .map(key => reliever[key].bind(reliever))
    const middleware = createEpicMiddleware(combineEpics(...epics), {
      adapter: {
        input: action$ => {
          if (!RxRelieverPlugin.instance.action$) {
            RxRelieverPlugin.instance.action$ = action$
          }
          return action$
        },
        output: action$ => {
          return action$.filter(action => action && action.type)
        }
      }
    })
    return middleware
  }
}

Rx.Observable.actions = {
  noop: {type: '___NO-OP___'}
}

Rx.Observable.getStore = () => {
  return RxRelieverPlugin.instance.store$
}

Rx.Observable.getState = module =>
  Rx.Observable.getStore().map(store => {
    const state = store.getState()
    if (module) return state[module]
    return state
  })

Rx.Observable.actionStream = () => RxRelieverPlugin.instance.action$

Rx.Observable.observeState = module => {
  if (Rx.Observable.stateSubject$) return Rx.Observable.stateSubject$
  Rx.Observable.stateSubject$ = new Rx.ReplaySubject()
  Rx.Observable.getStore()
    .map(store => {
      store.subscribe(() => {
        if (module) return Rx.Observable.stateSubject$.next(store.getState()[module])
        return Rx.Observable.stateSubject$.next(store.getState())
      })
    })
    .subscribe()
  return Rx.Observable.stateSubject$
}
