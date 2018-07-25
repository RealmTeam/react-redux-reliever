import {Component, createElement} from 'react'
import hoistStatics from 'hoist-non-react-statics'
import {Subject, Observable, Scheduler} from 'rxjs'
import storeShape from './utils/storeShape'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

export default function connect(createStream) {
  return function wrappedWithConnect(Wrapped, options = {}) {
    const {pure = true, addOwnProps = true} = options
    const connectDisplayName = `RelievedRxConnect(${getDisplayName(Wrapped)})`

    class Connect extends Component {
      constructor(props, context) {
        super(props, context)
        this.store = props.store || context.store
        this.storeStateSubject$ = new Subject()
        this.propsSubject$ = new Subject()
        this.subjects = Object.keys(createStream.props).map(prop => ({
          name: prop,
          stream: new Subject(),
          create: createStream.props[prop]
        }))
        this.state = {storeState: this.store.getState()}
      }

      componentWillReceiveProps(nextProps) {
        this.propsSubject$.next(nextProps)
      }

      componentDidMount() {
        this.storeSubscription = this.store.subscribe(() => {
          this.storeStateSubject$.next(this.store.getState())
        })

        const subjectsObservables = this.subjects.map(subject => {
          const stream$ = subject.create(subject.stream)
          return stream$.map(value => ({name: subject.name, value}))
        })

        const subjectsData$ = Observable.combineLatest(subjectsObservables)
          .observeOn(Scheduler.asap)
          .map(computedPropsArray => {
            const computedProps = computedPropsArray.reduce((p, c) => {
              p[c.name] = c.value
              return p
            }, {})
            return computedProps
          })

        this.subjectsSubscription = Observable.combineLatest(subjectsData$, this.propsSubject$).subscribe(([computedProps, ownProps]) => {
          Object.assign(computedProps, createStream.functions(this.store.getState(), ownProps, this.store.dispatch))
          if (addOwnProps) {
            Object.assign(computedProps, ownProps)
          }
          this.setState({computedProps, storeState: this.store.getState()})
        })

        const storeState$ = pure ? this.storeStateSubject$.distinctUntilChanged() : this.storeStateSubject$

        this.streamSubscription = storeState$.subscribe(state => {
          this.subjects.forEach(subject => subject.stream.next(state))
        })

        this.storeStateSubject$.next(this.store.getState())
        this.propsSubject$.next(this.props)
      }

      componentWillUnmount() {
        if (!this.storeSubscription) this.storeSubscription.unsubscribe()
        if (!this.streamSubscription) this.streamSubscription.unsubscribe()
        if (!this.subjectsSubscription) this.subjectsSubscription.unsubscribe()
      }

      render() {
        const {computedProps} = this.state
        return createElement(Wrapped, computedProps)
      }
    }

    Connect.displayName = connectDisplayName
    Connect.WrappedComponent = Wrapped
    Connect.contextTypes = {
      store: storeShape
    }
    Connect.propTypes = {
      store: storeShape
    }

    return hoistStatics(Connect, Wrapped)
  }
}
