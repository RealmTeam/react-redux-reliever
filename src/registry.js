import {combineReducers} from "redux"
import {all, fork} from "redux-saga/effects"
import connect from './connect'


class RelieverRegistry {
    constructor() {
        if (!RelieverRegistry.instance) {
            this.modules = {}
            this.modulesRootReducerKey = undefined
            this.reducerConstructed = false
            RelieverRegistry.instance = this
        }
        return RelieverRegistry.instance
    }

    register(reliever, moduleName, {reducerKey} = {}) {
        if (this.reducerConstructed)
            console.warn("You are registering a new module but the modules reducer has already been built. This should not happen.")
        const relievedComponent = new reliever()
        const saga = relievedComponent.saga.bind(relievedComponent)
        const reducer = relievedComponent.reducer.bind(relievedComponent)
        const actions = relievedComponent.getActions()
        reducerKey = reducerKey || moduleName
        this.modules[moduleName] = {saga, reducer, reducerKey, actions}
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

    buildRootSaga(rootSaga) {
        let moduleSagas = Object.values(this.modules).map(v => v.saga())
        return function* () {
            if (rootSaga)
                yield fork(rootSaga)
            yield all(moduleSagas)
        }
    }

    connect({props, functions}) {
        if (!props)
            props = (state, ownProps) => ownProps
        if (!functions)
            functions = () => ({})
        return connect(
            (state, dispatch, ownProps) => ({
                ...props(state, ownProps),
                ...functions(state, ownProps, dispatch)
            })
        )
    }

    moduleState(moduleName, state) {
        if (this.modulesRootReducerKey)
            return state[this.modulesRootReducerKey][this.modules[moduleName].reducerKey]
        return state[this.modules[moduleName].reducerKey]
    }

    moduleActions(moduleName) {
        return this.modules[moduleName].actions
    }
}

export default new RelieverRegistry()