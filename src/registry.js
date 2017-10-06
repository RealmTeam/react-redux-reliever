import {combineReducers} from "redux"
import {all, fork} from "redux-saga/effects"



class ReduxRelieverRegistry {
    constructor() {
        if (!ReduxRelieverRegistry.instance) {
            this.modules = {}
            this.modulesRootReducerKey = undefined
            this.reducerConstructed = false
            ReduxRelieverRegistry.instance = this
        }
        return ReduxRelieverRegistry.instance
    }

    register(reliever, presentational, moduleName, {reducerKey} = {}) {
        if (this.reducerConstructed)
            console.warn("You are registering a new module but the modules reducer has already been built. This should not happen.")
        const relievedComponent = new reliever(presentational)
        const container = relievedComponent.container
        const saga = relievedComponent.saga.bind(relievedComponent)
        const reducer = relievedComponent.reducer.bind(relievedComponent)
        const actions = relievedComponent.actions
        reducerKey = reducerKey || moduleName
        this.modules[moduleName] = {container, saga, reducer, reducerKey, actions}
        return container
    }

    changeModuleReducerKey(moduleName, reducerKey) {
        if (this.reducerConstructed)
            console.warn("Changing the modules reducer's keys after it has been built has no effect.")
        this.modules[moduleName].reducerKey = reducerKey
    }

    buildRootReducer(rootReducer={}, modulesRootReducerKey=undefined) {
        if (this.reducerConstructed)
            console.warn("The reducer has already been built. This should not happen.")
        this.reducerConstructed = true
        const moduleReducers = Object.values(this.modules).reduce((r, m) => ({...r, [m.reducerKey]: m.reducer}), {})
        if (modulesRootReducerKey !== undefined) {
            this.modulesRootReducerKey = modulesRootReducerKey
            return combineReducers({...rootReducer, [modulesRootReducerKey]: combineReducers(moduleReducers)})
        }
        return combineReducers({...moduleReducers, ...rootReducer})
    }

    getModuleState(state, moduleName) {
        if (this.modulesRootReducerKey)
            return state[this.modulesRootReducerKey][this.modules[moduleName].reducerKey]
        return state[this.modules[moduleName].reducerKey]
    }

    getModuleActions(moduleName) {
        return this.modules[moduleName].actions
    }

    buildRootSaga(rootSaga) {
        let moduleSagas = Object.values(this.modules).map(v => v.saga())
        return function* () {
            if (rootSaga)
                yield fork(rootSaga())
            yield all(moduleSagas)
        }
    }
}

export default new ReduxRelieverRegistry()