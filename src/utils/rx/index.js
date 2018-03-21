import Rx, {Observable, Subject} from 'rxjs'

/// Creates an observable sequence which is an Array of the projected values
/// the operator produces an array of the same size than the original sequence
/// and will generate new array every time a new item is emitted, from either one of the child values or the current observable sequence.
Observable.prototype.sync = function(factory) {
  return this.switchMap(seq => {
    // if sequence is empty return empty array
    if (!seq) return Observable.of([])

    // get number of element in sequence
    const count = seq.length

    if (count === 0) {
      return Observable.of([])
    }

    const buffer = new Map()
    const errored = new Map()

    return (
      Observable
        // convert sequence to observable
        .from(seq)
        // flatMap
        // reduce into a dictionnary using the index as a key
        .flatMap((item, index) => {
          return factory(item)
            .do(
              value => {
                buffer.set(index, value)
              },
              error => {
                console.warn('sync error', error) // eslint-disable-line no-console
                errored.set(index, error)
              }
            )
            .onErrorResumeNext(Observable.of(null))
        })
        // filter until we get a dictionary of the same size than the original sequence
        .filter(() => {
          const isFull = buffer.size === count - errored.size
          return isFull
        })
        // map to an array
        .map(() =>
          Array(count)
            .fill(null)
            .map((_, index) => buffer.get(index))
            .filter(elem => elem !== null && elem !== undefined)
        )
        .skip(1)
    )
  })
}

Observable.Variable = value => {
  class Variable {
    constructor(value) {
      this._val = value
      this._subject = new Subject()
    }

    set value(v) {
      this._val = v
      this._subject.next(v)
    }

    get value() {
      return this._val
    }

    asObservable(options = {triggersOnSubscribe: true}) {
      if (options.triggersOnSubscribe) return this._subject.startWith(this._val)
      return this._subject
    }
  }

  return new Variable(value)
}

Observable.prototype.bind = function(to) {
  return this.subscribe(value => (to.value = value))
}

Observable.prototype.debug = function(prefix) {
  return this.do(
    val => console.log(prefix, val), // eslint-disable-line no-console
    err => console.error(prefix, err) // eslint-disable-line no-console
  )
}

Observable.prototype.toJS = function() {
  return this.map(v => v.toJS())
}

Observable.combineToObject = obj => {
  return Observable.combineLatest(Object.keys(obj).map(k => obj[k]), (...args) => {
    return Object.keys(obj).reduce((parent, key, index) => {
      return {...parent, [key]: args[index]}
    }, {})
  })
}

Observable.prototype.promisify = function() {
  return new Promise((fulfill, reject) => {
    return this.subscribe(
      value => {
        fulfill(value)
      },
      error => reject(error)
    )
  })
}

export default Rx
