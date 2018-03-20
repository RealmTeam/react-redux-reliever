import {Component, createElement} from 'react'
import storeShape from './utils/storeShape'
import shallowEqual from './utils/shallowEqual'
import warning from './utils/warning'
import isPlainObject from 'lodash/isPlainObject'
import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

let nextVersion = 0

export default function connect(mapProps, options = {}) {
  const {pure = true, withRef = false} = options

  // Helps track hot reloading.
  const version = nextVersion++

  return function wrapWithConnect(WrappedComponent) {
    const connectDisplayName = `RelievedConnect(${getDisplayName(WrappedComponent)})`

    function checkStateShape(props) {
      if (!isPlainObject(props)) {
        warning(`props() and functions() in ${connectDisplayName} must return a plain object. ` + `Instead received ${props}.`)
      }
    }

    class Connect extends Component {
      shouldComponentUpdate() {
        return !pure || this.haveOwnPropsChanged || this.hasStoreStateChanged
      }

      constructor(props, context) {
        super(props, context)
        this.version = version
        this.store = props.store || context.store

        invariant(
          this.store,
          `Could not find "store" in either the context or ` +
            `props of "${connectDisplayName}". ` +
            `Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "store" as a prop to "${connectDisplayName}".`
        )

        const storeState = this.store.getState()
        this.state = {storeState}
        this.clearCache()
      }

      computeProps(store, ownProps) {
        const state = store.getState()
        const dispatch = store.dispatch

        const computedProps = mapProps(state, dispatch, ownProps)
        if (process.env.NODE_ENV !== 'production') {
          checkStateShape(computedProps)
        }
        return computedProps
      }

      updatePropsIfNeeded() {
        const nextProps = this.computeProps(this.store, this.props)
        if (this.computedProps && shallowEqual(nextProps, this.computedProps)) return false
        this.computedProps = nextProps
        return true
      }

      isSubscribed() {
        return typeof this.unsubscribe === 'function'
      }

      trySubscribe() {
        if (!this.unsubscribe) {
          this.unsubscribe = this.store.subscribe(this.handleChange.bind(this))
          this.handleChange()
        }
      }

      tryUnsubscribe() {
        if (this.unsubscribe) {
          this.unsubscribe()
          this.unsubscribe = null
        }
      }

      componentDidMount() {
        this.trySubscribe()
      }

      componentWillReceiveProps(nextProps) {
        if (!pure || !shallowEqual(nextProps, this.props)) {
          this.haveOwnPropsChanged = true
        }
      }

      componentWillUnmount() {
        this.tryUnsubscribe()
        this.clearCache()
      }

      clearCache() {
        this.computedProps = null
        this.haveOwnPropsChanged = true
        this.hasStoreStateChanged = true
        this.renderedElement = null
      }

      handleChange() {
        if (!this.unsubscribe) {
          return
        }

        const storeState = this.store.getState()
        const prevStoreState = this.state.storeState
        if (pure && prevStoreState === storeState) {
          return
        }

        this.hasStoreStateChanged = true
        this.setState({storeState})
      }

      getWrappedInstance() {
        invariant(withRef, `To access the wrapped instance, you need to specify ` + `{ withRef: true } as the fourth argument of the connect() call.`)

        return this.refs.wrappedInstance
      }

      render() {
        const {haveOwnPropsChanged, hasStoreStateChanged, renderedElement} = this

        this.haveOwnPropsChanged = false
        this.hasStoreStateChanged = false

        let shouldUpdateProps = true
        if (pure && renderedElement) shouldUpdateProps = hasStoreStateChanged || haveOwnPropsChanged

        let havePropsChanged = false
        if (shouldUpdateProps) {
          havePropsChanged = this.updatePropsIfNeeded()
        } else {
          havePropsChanged = false
        }

        if (!havePropsChanged && renderedElement) {
          return renderedElement
        }

        if (withRef) {
          this.renderedElement = createElement(WrappedComponent, {
            ...this.computedProps,
            ref: 'wrappedInstance'
          })
        } else {
          this.renderedElement = createElement(WrappedComponent, this.computedProps)
        }

        return this.renderedElement
      }
    }

    Connect.displayName = connectDisplayName
    Connect.WrappedComponent = WrappedComponent
    Connect.contextTypes = {
      store: storeShape
    }
    Connect.propTypes = {
      store: storeShape
    }

    if (process.env.NODE_ENV !== 'production') {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) {
          return
        }

        // We are hot reloading!
        this.version = version
        this.trySubscribe()
        this.clearCache()
      }
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
