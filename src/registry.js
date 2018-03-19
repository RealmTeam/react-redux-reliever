import {combineReducers} from 'redux'
import {combineEpics} from 'redux-observable'
import connect from './connect'
import {Observable, ReplaySubject} from 'rxjs'
import _ from 'lodash'
import {createEpicMiddleware} from 'redux-observable'

Observable.getStore = () => {
  return RelieverRegistry.instance.store$
}

Observable.getState = module =>
  Observable.getStore().map(store => {
    const state = store.getState()
    if (module) return state[module]
    return state
  })

Observable.observeState = module => {
  if (Observable.stateSubject$) return Observable.stateSubject$
  Observable.stateSubject$ = new ReplaySubject()
  Observable.getStore()
    .map(store => {
      store.subscribe(() => {
        if (module) return Observable.stateSubject$.next(store.getState()[module])
        return Observable.stateSubject$.next(store.getState())
      })
    })
    .subscribe()
  return Observable.stateSubject$
}

class RelieverRegistry {
  constructor() {
    if (!RelieverRegistry.instance) {
      this.modules = {}
      this.modulesRootReducerKey = undefined
      this.reducerConstructed = false
      this.store$ = new ReplaySubject()
      RelieverRegistry.instance = this
    }
    return RelieverRegistry.instance
  }

  setupStore(store) {
    this.store$.next(store)
  }

  register(reliever, moduleName, {reducerKey} = {}) {
    if (this.reducerConstructed) console.warn('You are registering a new module but the modules reducer has already been built. This should not happen.')
    const relievedComponent = new reliever()
    const epics = relievedComponent.epics.bind(relievedComponent) // create epics
    const reducer = relievedComponent.reducer.bind(relievedComponent)
    const actions = relievedComponent.getActions()
    reducerKey = reducerKey || moduleName
    this.modules[moduleName] = {epics, reducer, reducerKey, actions}
  }

  changeModuleReducerKey(moduleName, reducerKey) {
    if (this.reducerConstructed) console.warn("Changing the modules reducer's keys after it has been built has no effect.")
    this.modules[moduleName].reducerKey = reducerKey
  }

  buildRootReducer(rootReducer = {}, modulesRootReducerKey = undefined) {
    if (this.reducerConstructed) console.warn('The reducer has already been built. This should not happen.')
    this.reducerConstructed = true
    const moduleReducers = Object.values(this.modules).reduce((r, m) => ({...r, [m.reducerKey]: m.reducer}), {})
    if (modulesRootReducerKey !== undefined) {
      this.modulesRootReducerKey = modulesRootReducerKey
      return combineReducers({...rootReducer, [modulesRootReducerKey]: combineReducers(moduleReducers)})
    }
    return combineReducers({...moduleReducers, ...rootReducer})
  }

  buildEpics(rootEpics = () => Observable.empty()) {
    return combineEpics(
      rootEpics,
      ..._(Object.values(this.modules).map(v => v.epics()))
        .flatten()
        .value()
        .reduce((p, c) => {
          return [...p, c]
        }, [])
    )
  }

  connect({props, functions}) {
    if (!props) props = (state, ownProps) => ownProps
    if (!functions) functions = () => ({})
    return connect((state, dispatch, ownProps) => ({
      ...props(state, ownProps),
      ...functions(state, ownProps, dispatch)
    }))
  }

  moduleState(moduleName, state) {
    if (this.modulesRootReducerKey) return state[this.modulesRootReducerKey][this.modules[moduleName].reducerKey]
    return state[this.modules[moduleName].reducerKey]
  }

  moduleActions(moduleName) {
    return this.modules[moduleName].actions
  }

  middleware() {
    return createEpicMiddleware(this.buildEpics())
  }
}

export default new RelieverRegistry()
