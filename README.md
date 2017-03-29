# react-redux-reliever

[![npm version](https://img.shields.io/npm/v/react-redux-reliever.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-reliever)

`react-redux-reliever` is a simple package that aims to relieve you from the pain of opening multiple different files and write a lot of boring code each time you want to add a small feature when you're using react and redux.

The principle is as follow : regroup all the logic from redux in a single file when you're developing new features while defaulting to certain behaviors to save you some time. You can easily override anything you don't like so you're not stuck either.

It obviously uses [react](https://github.com/facebook/react) and [redux](https://github.com/reactjs/redux) but you can add [redux-saga](https://github.com/redux-saga/redux-saga/) for the handling of asynchronous tasks (you can fallback to [redux-thunk](https://github.com/gaearon/redux-thunk) but learning to use redux-saga will result in better code).

# Getting started

## Install

```sh
$ npm install --save react-redux-reliever
```
or

```sh
$ yarn add react-redux-reliever
```

## Usage Example

First, import ReduxReliever
```javascript
import ReduxReliever from 'react-redux-reliever'
```

Then, import your component (presentational if you read redux doc)
```javascript
import Component from '../components/Component'
```

Create a class that extends `ReduxReliever`
```javascript
class ComponentReduxReliever extends ReduxReliever {
```

`ACTION_PREFIX` is used if you want to use the default behavior for the reducer which is to check if the action type starts with this prefix and merges the action payload (`action.payload = {}`) with the state if that's the case.  
Leave it out if you don't wish to use the default behavior.
```javascript
    ACTION_PREFIX = 'WHATEVER'
```

The default state for the reducer
```javascript
    defaultState = {
        value: null
    }
```

`props` is exactly like `mapStateToProps` except that you also need to return `ownProps` (that way you are able to easily remove unwanted props)
```javascript
    props(state, ownProps) {
        return {...state.whatever, ...ownProps}
    }
```

`saga` is the entrypoint for `redux-saga`
```javascript
    *saga() {
        // Do whatever async tasks you want here.
        // You can define other generator methods and call them from here for organization's sake.
    }
```

`functions` is the same as `mapDispatchToProps` except that you have access to the whole state instead of the component's props.  
This allows you to do checks or pass parameters based on the state without requiring to add them as props.
```javascript
    functions(state, ownProps, dispatch) {
        return {
            test: () => {
                // Note that we don't use action creators (source of a lot of the pain when using redux).
                // This is a choice and you can still use them if you want.
                dispatch({type: 'WHATEVER_TEST', payload: {value: "Looking good !"}})
            },
            add: () => {
                dispatch({type: 'WHATEVER_ADD'}})
            }
        }
    }
```

The reducer is not required but you can still override it. Here we have a mix between the default `react-redux-reliever` behavior and the standard `redux` behavior.  
The most frequent case for a mixed reducer is something needing to be added to some value in the state.
```javascript
    reducer(state, action) {
        switch (action.type) {
            case 'WHATEVER_ADD':
                return {value: state.value + "!"}
            default:
                // Don't forget to call super
                return super.reducer(state, action)
        }
    }
```

We instanciate our reliever with our component
```javascript
}

const relievedComponent = new ComponentReduxReliever(Component)
```
 We then extract everything that needs to be exported (and bind every method needing `this`)
```javascript
const ComponentContainer = relievedComponent.container
const ComponentSaga = relievedComponent.saga.bind(relievedComponent)
const ComponentReducer = relievedComponent.reducer.bind(relievedComponent)

export {ComponentContainer as default, ComponentSaga, ComponentReducer}
```

We can then register everything like this
```javascript
import ComponentContainer, {ComponentSaga, ComponentReducer} from './containers/ComponentContainer'

const rootReducer = combineReducers({
    whatever: ComponentReducer
})

function* rootSaga() {
    yield fork(ComponentSaga)
}
const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)
```

That's it !

# Building examples from sources

```sh
$ git clone https://github.com/PhilipGarnero/react-redux-reliever.git
$ cd react-redux-reliever
$ npm install
```

As of today, only a simple counter example has been implemented.

### Counter example

```sh
$ npm run counter
```

# Contributing

Feel free to open issues and submit pull-requests.