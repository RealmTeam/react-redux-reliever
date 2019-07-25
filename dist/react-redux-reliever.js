(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReactReduxReliever"] = factory();
	else
		root["ReactReduxReliever"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OVERWRITE = exports.DEL = exports.plugins = exports.default = exports.Reliever = undefined;

	var _classCallCheck2 = __webpack_require__(46);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(47);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _immutable = __webpack_require__(118);

	var _registry = __webpack_require__(169);

	var _registry2 = _interopRequireDefault(_registry);

	var _merger = __webpack_require__(170);

	var _merger2 = _interopRequireDefault(_merger);

	var _rx = __webpack_require__(167);

	var _rx2 = _interopRequireDefault(_rx);

	var _saga = __webpack_require__(168);

	var _saga2 = _interopRequireDefault(_saga);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Reliever = function () {
	  function Reliever() {
	    (0, _classCallCheck3.default)(this, Reliever);
	    this.ACTION_PREFIX = '(unset)';
	  }

	  (0, _createClass3.default)(Reliever, [{
	    key: 'getInitialState',
	    value: function getInitialState() {
	      return {};
	    }
	  }, {
	    key: 'getActions',
	    value: function getActions() {
	      return {};
	    }
	  }, {
	    key: 'reducer',
	    value: function reducer(state, action) {
	      if (state === undefined) state = (0, _immutable.fromJS)(this.getInitialState());
	      if (action.type.startsWith(this.ACTION_PREFIX + '_') && action.payload) return (0, _merger2.default)(state, (0, _immutable.fromJS)(action.payload));
	      return state;
	    }
	  }]);
	  return Reliever;
	}();

	var plugins = {
	  RxRelieverPlugin: _rx2.default,
	  SagaRelieverPlugin: _saga2.default
	};

	exports.Reliever = Reliever;
	exports.default = _registry2.default;
	exports.plugins = plugins;
	exports.DEL = _merger.DEL;
	exports.OVERWRITE = _merger.OVERWRITE;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var isFunction_1 = __webpack_require__(45);
	var Observer_1 = __webpack_require__(138);
	var Subscription_1 = __webpack_require__(5);
	var rxSubscriber_1 = __webpack_require__(96);
	var config_1 = __webpack_require__(59);
	var hostReportError_1 = __webpack_require__(98);
	var Subscriber = (function (_super) {
	    __extends(Subscriber, _super);
	    function Subscriber(destinationOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this.syncErrorValue = null;
	        _this.syncErrorThrown = false;
	        _this.syncErrorThrowable = false;
	        _this.isStopped = false;
	        switch (arguments.length) {
	            case 0:
	                _this.destination = Observer_1.empty;
	                break;
	            case 1:
	                if (!destinationOrNext) {
	                    _this.destination = Observer_1.empty;
	                    break;
	                }
	                if (typeof destinationOrNext === 'object') {
	                    if (destinationOrNext instanceof Subscriber) {
	                        _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
	                        _this.destination = destinationOrNext;
	                        destinationOrNext.add(_this);
	                    }
	                    else {
	                        _this.syncErrorThrowable = true;
	                        _this.destination = new SafeSubscriber(_this, destinationOrNext);
	                    }
	                    break;
	                }
	            default:
	                _this.syncErrorThrowable = true;
	                _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
	                break;
	        }
	        return _this;
	    }
	    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
	    Subscriber.create = function (next, error, complete) {
	        var subscriber = new Subscriber(next, error, complete);
	        subscriber.syncErrorThrowable = false;
	        return subscriber;
	    };
	    Subscriber.prototype.next = function (value) {
	        if (!this.isStopped) {
	            this._next(value);
	        }
	    };
	    Subscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._error(err);
	        }
	    };
	    Subscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            this.isStopped = true;
	            this._complete();
	        }
	    };
	    Subscriber.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.isStopped = true;
	        _super.prototype.unsubscribe.call(this);
	    };
	    Subscriber.prototype._next = function (value) {
	        this.destination.next(value);
	    };
	    Subscriber.prototype._error = function (err) {
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    Subscriber.prototype._complete = function () {
	        this.destination.complete();
	        this.unsubscribe();
	    };
	    Subscriber.prototype._unsubscribeAndRecycle = function () {
	        var _parentOrParents = this._parentOrParents;
	        this._parentOrParents = null;
	        this.unsubscribe();
	        this.closed = false;
	        this.isStopped = false;
	        this._parentOrParents = _parentOrParents;
	        return this;
	    };
	    return Subscriber;
	}(Subscription_1.Subscription));
	exports.Subscriber = Subscriber;
	var SafeSubscriber = (function (_super) {
	    __extends(SafeSubscriber, _super);
	    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
	        var _this = _super.call(this) || this;
	        _this._parentSubscriber = _parentSubscriber;
	        var next;
	        var context = _this;
	        if (isFunction_1.isFunction(observerOrNext)) {
	            next = observerOrNext;
	        }
	        else if (observerOrNext) {
	            next = observerOrNext.next;
	            error = observerOrNext.error;
	            complete = observerOrNext.complete;
	            if (observerOrNext !== Observer_1.empty) {
	                context = Object.create(observerOrNext);
	                if (isFunction_1.isFunction(context.unsubscribe)) {
	                    _this.add(context.unsubscribe.bind(context));
	                }
	                context.unsubscribe = _this.unsubscribe.bind(_this);
	            }
	        }
	        _this._context = context;
	        _this._next = next;
	        _this._error = error;
	        _this._complete = complete;
	        return _this;
	    }
	    SafeSubscriber.prototype.next = function (value) {
	        if (!this.isStopped && this._next) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (!config_1.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                this.__tryOrUnsub(this._next, value);
	            }
	            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            var useDeprecatedSynchronousErrorHandling = config_1.config.useDeprecatedSynchronousErrorHandling;
	            if (this._error) {
	                if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(this._error, err);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, this._error, err);
	                    this.unsubscribe();
	                }
	            }
	            else if (!_parentSubscriber.syncErrorThrowable) {
	                this.unsubscribe();
	                if (useDeprecatedSynchronousErrorHandling) {
	                    throw err;
	                }
	                hostReportError_1.hostReportError(err);
	            }
	            else {
	                if (useDeprecatedSynchronousErrorHandling) {
	                    _parentSubscriber.syncErrorValue = err;
	                    _parentSubscriber.syncErrorThrown = true;
	                }
	                else {
	                    hostReportError_1.hostReportError(err);
	                }
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.complete = function () {
	        var _this = this;
	        if (!this.isStopped) {
	            var _parentSubscriber = this._parentSubscriber;
	            if (this._complete) {
	                var wrappedComplete = function () { return _this._complete.call(_this._context); };
	                if (!config_1.config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
	                    this.__tryOrUnsub(wrappedComplete);
	                    this.unsubscribe();
	                }
	                else {
	                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
	                    this.unsubscribe();
	                }
	            }
	            else {
	                this.unsubscribe();
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            this.unsubscribe();
	            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
	                throw err;
	            }
	            else {
	                hostReportError_1.hostReportError(err);
	            }
	        }
	    };
	    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
	        if (!config_1.config.useDeprecatedSynchronousErrorHandling) {
	            throw new Error('bad call');
	        }
	        try {
	            fn.call(this._context, value);
	        }
	        catch (err) {
	            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
	                parent.syncErrorValue = err;
	                parent.syncErrorThrown = true;
	                return true;
	            }
	            else {
	                hostReportError_1.hostReportError(err);
	                return true;
	            }
	        }
	        return false;
	    };
	    SafeSubscriber.prototype._unsubscribe = function () {
	        var _parentSubscriber = this._parentSubscriber;
	        this._context = null;
	        this._parentSubscriber = null;
	        _parentSubscriber.unsubscribe();
	    };
	    return SafeSubscriber;
	}(Subscriber));
	exports.SafeSubscriber = SafeSubscriber;
	//# sourceMappingURL=Subscriber.js.map

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var canReportError_1 = __webpack_require__(97);
	var toSubscriber_1 = __webpack_require__(363);
	var observable_1 = __webpack_require__(30);
	var pipe_1 = __webpack_require__(100);
	var config_1 = __webpack_require__(59);
	var Observable = (function () {
	    function Observable(subscribe) {
	        this._isScalar = false;
	        if (subscribe) {
	            this._subscribe = subscribe;
	        }
	    }
	    Observable.prototype.lift = function (operator) {
	        var observable = new Observable();
	        observable.source = this;
	        observable.operator = operator;
	        return observable;
	    };
	    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
	        var operator = this.operator;
	        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
	        if (operator) {
	            sink.add(operator.call(sink, this.source));
	        }
	        else {
	            sink.add(this.source || (config_1.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
	                this._subscribe(sink) :
	                this._trySubscribe(sink));
	        }
	        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
	            if (sink.syncErrorThrowable) {
	                sink.syncErrorThrowable = false;
	                if (sink.syncErrorThrown) {
	                    throw sink.syncErrorValue;
	                }
	            }
	        }
	        return sink;
	    };
	    Observable.prototype._trySubscribe = function (sink) {
	        try {
	            return this._subscribe(sink);
	        }
	        catch (err) {
	            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
	                sink.syncErrorThrown = true;
	                sink.syncErrorValue = err;
	            }
	            if (canReportError_1.canReportError(sink)) {
	                sink.error(err);
	            }
	            else {
	                console.warn(err);
	            }
	        }
	    };
	    Observable.prototype.forEach = function (next, promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var subscription;
	            subscription = _this.subscribe(function (value) {
	                try {
	                    next(value);
	                }
	                catch (err) {
	                    reject(err);
	                    if (subscription) {
	                        subscription.unsubscribe();
	                    }
	                }
	            }, reject, resolve);
	        });
	    };
	    Observable.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        return source && source.subscribe(subscriber);
	    };
	    Observable.prototype[observable_1.observable] = function () {
	        return this;
	    };
	    Observable.prototype.pipe = function () {
	        var operations = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            operations[_i] = arguments[_i];
	        }
	        if (operations.length === 0) {
	            return this;
	        }
	        return pipe_1.pipeFromArray(operations)(this);
	    };
	    Observable.prototype.toPromise = function (promiseCtor) {
	        var _this = this;
	        promiseCtor = getPromiseCtor(promiseCtor);
	        return new promiseCtor(function (resolve, reject) {
	            var value;
	            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
	        });
	    };
	    Observable.create = function (subscribe) {
	        return new Observable(subscribe);
	    };
	    return Observable;
	}());
	exports.Observable = Observable;
	function getPromiseCtor(promiseCtor) {
	    if (!promiseCtor) {
	        promiseCtor = config_1.config.Promise || Promise;
	    }
	    if (!promiseCtor) {
	        throw new Error('no Promise impl found');
	    }
	    return promiseCtor;
	}
	//# sourceMappingURL=Observable.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var OuterSubscriber = (function (_super) {
	    __extends(OuterSubscriber, _super);
	    function OuterSubscriber() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.destination.error(error);
	    };
	    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.destination.complete();
	    };
	    return OuterSubscriber;
	}(Subscriber_1.Subscriber));
	exports.OuterSubscriber = OuterSubscriber;
	//# sourceMappingURL=OuterSubscriber.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var InnerSubscriber_1 = __webpack_require__(21);
	var subscribeTo_1 = __webpack_require__(101);
	var Observable_1 = __webpack_require__(2);
	function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
	    if (destination === void 0) { destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex); }
	    if (destination.closed) {
	        return undefined;
	    }
	    if (result instanceof Observable_1.Observable) {
	        return result.subscribe(destination);
	    }
	    return subscribeTo_1.subscribeTo(result)(destination);
	}
	exports.subscribeToResult = subscribeToResult;
	//# sourceMappingURL=subscribeToResult.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isArray_1 = __webpack_require__(8);
	var isObject_1 = __webpack_require__(99);
	var isFunction_1 = __webpack_require__(45);
	var UnsubscriptionError_1 = __webpack_require__(159);
	var Subscription = (function () {
	    function Subscription(unsubscribe) {
	        this.closed = false;
	        this._parentOrParents = null;
	        this._subscriptions = null;
	        if (unsubscribe) {
	            this._unsubscribe = unsubscribe;
	        }
	    }
	    Subscription.prototype.unsubscribe = function () {
	        var errors;
	        if (this.closed) {
	            return;
	        }
	        var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
	        this.closed = true;
	        this._parentOrParents = null;
	        this._subscriptions = null;
	        if (_parentOrParents instanceof Subscription) {
	            _parentOrParents.remove(this);
	        }
	        else if (_parentOrParents !== null) {
	            for (var index = 0; index < _parentOrParents.length; ++index) {
	                var parent_1 = _parentOrParents[index];
	                parent_1.remove(this);
	            }
	        }
	        if (isFunction_1.isFunction(_unsubscribe)) {
	            try {
	                _unsubscribe.call(this);
	            }
	            catch (e) {
	                errors = e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
	            }
	        }
	        if (isArray_1.isArray(_subscriptions)) {
	            var index = -1;
	            var len = _subscriptions.length;
	            while (++index < len) {
	                var sub = _subscriptions[index];
	                if (isObject_1.isObject(sub)) {
	                    try {
	                        sub.unsubscribe();
	                    }
	                    catch (e) {
	                        errors = errors || [];
	                        if (e instanceof UnsubscriptionError_1.UnsubscriptionError) {
	                            errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
	                        }
	                        else {
	                            errors.push(e);
	                        }
	                    }
	                }
	            }
	        }
	        if (errors) {
	            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
	        }
	    };
	    Subscription.prototype.add = function (teardown) {
	        var subscription = teardown;
	        if (!teardown) {
	            return Subscription.EMPTY;
	        }
	        switch (typeof teardown) {
	            case 'function':
	                subscription = new Subscription(teardown);
	            case 'object':
	                if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
	                    return subscription;
	                }
	                else if (this.closed) {
	                    subscription.unsubscribe();
	                    return subscription;
	                }
	                else if (!(subscription instanceof Subscription)) {
	                    var tmp = subscription;
	                    subscription = new Subscription();
	                    subscription._subscriptions = [tmp];
	                }
	                break;
	            default: {
	                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
	            }
	        }
	        var _parentOrParents = subscription._parentOrParents;
	        if (_parentOrParents === null) {
	            subscription._parentOrParents = this;
	        }
	        else if (_parentOrParents instanceof Subscription) {
	            if (_parentOrParents === this) {
	                return subscription;
	            }
	            subscription._parentOrParents = [_parentOrParents, this];
	        }
	        else if (_parentOrParents.indexOf(this) === -1) {
	            _parentOrParents.push(this);
	        }
	        else {
	            return subscription;
	        }
	        var subscriptions = this._subscriptions;
	        if (subscriptions === null) {
	            this._subscriptions = [subscription];
	        }
	        else {
	            subscriptions.push(subscription);
	        }
	        return subscription;
	    };
	    Subscription.prototype.remove = function (subscription) {
	        var subscriptions = this._subscriptions;
	        if (subscriptions) {
	            var subscriptionIndex = subscriptions.indexOf(subscription);
	            if (subscriptionIndex !== -1) {
	                subscriptions.splice(subscriptionIndex, 1);
	            }
	        }
	    };
	    Subscription.EMPTY = (function (empty) {
	        empty.closed = true;
	        return empty;
	    }(new Subscription()));
	    return Subscription;
	}());
	exports.Subscription = Subscription;
	function flattenUnsubscriptionErrors(errors) {
	    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
	}
	//# sourceMappingURL=Subscription.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var Subscriber_1 = __webpack_require__(1);
	var Subscription_1 = __webpack_require__(5);
	var ObjectUnsubscribedError_1 = __webpack_require__(64);
	var SubjectSubscription_1 = __webpack_require__(140);
	var rxSubscriber_1 = __webpack_require__(96);
	var SubjectSubscriber = (function (_super) {
	    __extends(SubjectSubscriber, _super);
	    function SubjectSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        return _this;
	    }
	    return SubjectSubscriber;
	}(Subscriber_1.Subscriber));
	exports.SubjectSubscriber = SubjectSubscriber;
	var Subject = (function (_super) {
	    __extends(Subject, _super);
	    function Subject() {
	        var _this = _super.call(this) || this;
	        _this.observers = [];
	        _this.closed = false;
	        _this.isStopped = false;
	        _this.hasError = false;
	        _this.thrownError = null;
	        return _this;
	    }
	    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
	        return new SubjectSubscriber(this);
	    };
	    Subject.prototype.lift = function (operator) {
	        var subject = new AnonymousSubject(this, this);
	        subject.operator = operator;
	        return subject;
	    };
	    Subject.prototype.next = function (value) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        if (!this.isStopped) {
	            var observers = this.observers;
	            var len = observers.length;
	            var copy = observers.slice();
	            for (var i = 0; i < len; i++) {
	                copy[i].next(value);
	            }
	        }
	    };
	    Subject.prototype.error = function (err) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        this.hasError = true;
	        this.thrownError = err;
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].error(err);
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.complete = function () {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        this.isStopped = true;
	        var observers = this.observers;
	        var len = observers.length;
	        var copy = observers.slice();
	        for (var i = 0; i < len; i++) {
	            copy[i].complete();
	        }
	        this.observers.length = 0;
	    };
	    Subject.prototype.unsubscribe = function () {
	        this.isStopped = true;
	        this.closed = true;
	        this.observers = null;
	    };
	    Subject.prototype._trySubscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else {
	            return _super.prototype._trySubscribe.call(this, subscriber);
	        }
	    };
	    Subject.prototype._subscribe = function (subscriber) {
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	        }
	    };
	    Subject.prototype.asObservable = function () {
	        var observable = new Observable_1.Observable();
	        observable.source = this;
	        return observable;
	    };
	    Subject.create = function (destination, source) {
	        return new AnonymousSubject(destination, source);
	    };
	    return Subject;
	}(Observable_1.Observable));
	exports.Subject = Subject;
	var AnonymousSubject = (function (_super) {
	    __extends(AnonymousSubject, _super);
	    function AnonymousSubject(destination, source) {
	        var _this = _super.call(this) || this;
	        _this.destination = destination;
	        _this.source = source;
	        return _this;
	    }
	    AnonymousSubject.prototype.next = function (value) {
	        var destination = this.destination;
	        if (destination && destination.next) {
	            destination.next(value);
	        }
	    };
	    AnonymousSubject.prototype.error = function (err) {
	        var destination = this.destination;
	        if (destination && destination.error) {
	            this.destination.error(err);
	        }
	    };
	    AnonymousSubject.prototype.complete = function () {
	        var destination = this.destination;
	        if (destination && destination.complete) {
	            this.destination.complete();
	        }
	    };
	    AnonymousSubject.prototype._subscribe = function (subscriber) {
	        var source = this.source;
	        if (source) {
	            return this.source.subscribe(subscriber);
	        }
	        else {
	            return Subscription_1.Subscription.EMPTY;
	        }
	    };
	    return AnonymousSubject;
	}(Subject));
	exports.AnonymousSubject = AnonymousSubject;
	//# sourceMappingURL=Subject.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncAction_1 = __webpack_require__(40);
	var AsyncScheduler_1 = __webpack_require__(41);
	exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
	//# sourceMappingURL=async.js.map

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
	//# sourceMappingURL=isArray.js.map

/***/ },
/* 9 */
/***/ function(module, exports) {

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	}

	module.exports = _interopRequireDefault;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function map(project, thisArg) {
	    return function mapOperation(source) {
	        if (typeof project !== 'function') {
	            throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
	        }
	        return source.lift(new MapOperator(project, thisArg));
	    };
	}
	exports.map = map;
	var MapOperator = (function () {
	    function MapOperator(project, thisArg) {
	        this.project = project;
	        this.thisArg = thisArg;
	    }
	    MapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
	    };
	    return MapOperator;
	}());
	exports.MapOperator = MapOperator;
	var MapSubscriber = (function (_super) {
	    __extends(MapSubscriber, _super);
	    function MapSubscriber(destination, project, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.count = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    MapSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.project.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return MapSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=map.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var store = __webpack_require__(75)('wks');
	var uid = __webpack_require__(52);
	var Symbol = __webpack_require__(18).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.check = check;
	exports.hasOwn = hasOwn;
	exports.remove = remove;
	exports.deferred = deferred;
	exports.arrayOfDeffered = arrayOfDeffered;
	exports.delay = delay;
	exports.createMockTask = createMockTask;
	exports.autoInc = autoInc;
	exports.makeIterator = makeIterator;
	exports.log = log;
	exports.deprecate = deprecate;
	var sym = exports.sym = function sym(id) {
	  return '@@redux-saga/' + id;
	};

	var TASK = /*#__PURE__*/exports.TASK = sym('TASK');
	var HELPER = /*#__PURE__*/exports.HELPER = sym('HELPER');
	var MATCH = /*#__PURE__*/exports.MATCH = sym('MATCH');
	var CANCEL = /*#__PURE__*/exports.CANCEL = sym('CANCEL_PROMISE');
	var SAGA_ACTION = /*#__PURE__*/exports.SAGA_ACTION = sym('SAGA_ACTION');
	var SELF_CANCELLATION = /*#__PURE__*/exports.SELF_CANCELLATION = sym('SELF_CANCELLATION');
	var konst = exports.konst = function konst(v) {
	  return function () {
	    return v;
	  };
	};
	var kTrue = /*#__PURE__*/exports.kTrue = konst(true);
	var kFalse = /*#__PURE__*/exports.kFalse = konst(false);
	var noop = exports.noop = function noop() {};
	var ident = exports.ident = function ident(v) {
	  return v;
	};

	function check(value, predicate, error) {
	  if (!predicate(value)) {
	    log('error', 'uncaught at check', error);
	    throw new Error(error);
	  }
	}

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(object, property) {
	  return is.notUndef(object) && hasOwnProperty.call(object, property);
	}

	var is = exports.is = {
	  undef: function undef(v) {
	    return v === null || v === undefined;
	  },
	  notUndef: function notUndef(v) {
	    return v !== null && v !== undefined;
	  },
	  func: function func(f) {
	    return typeof f === 'function';
	  },
	  number: function number(n) {
	    return typeof n === 'number';
	  },
	  string: function string(s) {
	    return typeof s === 'string';
	  },
	  array: Array.isArray,
	  object: function object(obj) {
	    return obj && !is.array(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	  },
	  promise: function promise(p) {
	    return p && is.func(p.then);
	  },
	  iterator: function iterator(it) {
	    return it && is.func(it.next) && is.func(it.throw);
	  },
	  iterable: function iterable(it) {
	    return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
	  },
	  task: function task(t) {
	    return t && t[TASK];
	  },
	  observable: function observable(ob) {
	    return ob && is.func(ob.subscribe);
	  },
	  buffer: function buffer(buf) {
	    return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
	  },
	  pattern: function pattern(pat) {
	    return pat && (is.string(pat) || (typeof pat === 'undefined' ? 'undefined' : _typeof(pat)) === 'symbol' || is.func(pat) || is.array(pat));
	  },
	  channel: function channel(ch) {
	    return ch && is.func(ch.take) && is.func(ch.close);
	  },
	  helper: function helper(it) {
	    return it && it[HELPER];
	  },
	  stringableFunc: function stringableFunc(f) {
	    return is.func(f) && hasOwn(f, 'toString');
	  }
	};

	var object = exports.object = {
	  assign: function assign(target, source) {
	    for (var i in source) {
	      if (hasOwn(source, i)) {
	        target[i] = source[i];
	      }
	    }
	  }
	};

	function remove(array, item) {
	  var index = array.indexOf(item);
	  if (index >= 0) {
	    array.splice(index, 1);
	  }
	}

	var array = exports.array = {
	  from: function from(obj) {
	    var arr = Array(obj.length);
	    for (var i in obj) {
	      if (hasOwn(obj, i)) {
	        arr[i] = obj[i];
	      }
	    }
	    return arr;
	  }
	};

	function deferred() {
	  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  var def = _extends({}, props);
	  var promise = new Promise(function (resolve, reject) {
	    def.resolve = resolve;
	    def.reject = reject;
	  });
	  def.promise = promise;
	  return def;
	}

	function arrayOfDeffered(length) {
	  var arr = [];
	  for (var i = 0; i < length; i++) {
	    arr.push(deferred());
	  }
	  return arr;
	}

	function delay(ms) {
	  var val = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	  var timeoutId = void 0;
	  var promise = new Promise(function (resolve) {
	    timeoutId = setTimeout(function () {
	      return resolve(val);
	    }, ms);
	  });

	  promise[CANCEL] = function () {
	    return clearTimeout(timeoutId);
	  };

	  return promise;
	}

	function createMockTask() {
	  var _ref;

	  var running = true;
	  var _result = void 0,
	      _error = void 0;

	  return _ref = {}, _ref[TASK] = true, _ref.isRunning = function isRunning() {
	    return running;
	  }, _ref.result = function result() {
	    return _result;
	  }, _ref.error = function error() {
	    return _error;
	  }, _ref.setRunning = function setRunning(b) {
	    return running = b;
	  }, _ref.setResult = function setResult(r) {
	    return _result = r;
	  }, _ref.setError = function setError(e) {
	    return _error = e;
	  }, _ref;
	}

	function autoInc() {
	  var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

	  return function () {
	    return ++seed;
	  };
	}

	var uid = /*#__PURE__*/exports.uid = autoInc();

	var kThrow = function kThrow(err) {
	  throw err;
	};
	var kReturn = function kReturn(value) {
	  return { value: value, done: true };
	};
	function makeIterator(next) {
	  var thro = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : kThrow;
	  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	  var isHelper = arguments[3];

	  var iterator = { name: name, next: next, throw: thro, return: kReturn };

	  if (isHelper) {
	    iterator[HELPER] = true;
	  }
	  if (typeof Symbol !== 'undefined') {
	    iterator[Symbol.iterator] = function () {
	      return iterator;
	    };
	  }
	  return iterator;
	}

	/**
	  Print error in a useful way whether in a browser environment
	  (with expandable error stack traces), or in a node.js environment
	  (text-only log output)
	 **/
	function log(level, message) {
	  var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	  /*eslint-disable no-console*/
	  if (typeof window === 'undefined') {
	    console.log('redux-saga ' + level + ': ' + message + '\n' + (error && error.stack || error));
	  } else {
	    console[level](message, error);
	  }
	}

	function deprecate(fn, deprecationWarning) {
	  return function () {
	    if (true) log('warn', deprecationWarning);
	    return fn.apply(undefined, arguments);
	  };
	}

	var updateIncentive = exports.updateIncentive = function updateIncentive(deprecated, preferred) {
	  return deprecated + ' has been deprecated in favor of ' + preferred + ', please update your code';
	};

	var internalErr = exports.internalErr = function internalErr(err) {
	  return new Error('\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project\'s github repo.\n  Error: ' + err + '\n');
	};

	var createSetContextWarning = exports.createSetContextWarning = function createSetContextWarning(ctx, props) {
	  return (ctx ? ctx + '.' : '') + 'setContext(props): argument ' + props + ' is not a plain object';
	};

	var wrapSagaDispatch = exports.wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
	  return function (action) {
	    return dispatch(Object.defineProperty(action, SAGA_ACTION, { value: true }));
	  };
	};

	var cloneableGenerator = exports.cloneableGenerator = function cloneableGenerator(generatorFunc) {
	  return function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var history = [];
	    var gen = generatorFunc.apply(undefined, args);
	    return {
	      next: function next(arg) {
	        history.push(arg);
	        return gen.next(arg);
	      },
	      clone: function clone() {
	        var clonedGen = cloneableGenerator(generatorFunc).apply(undefined, args);
	        history.forEach(function (arg) {
	          return clonedGen.next(arg);
	        });
	        return clonedGen;
	      },
	      return: function _return(value) {
	        return gen.return(value);
	      },
	      throw: function _throw(exception) {
	        return gen.throw(exception);
	      }
	    };
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	var core = module.exports = { version: '2.6.9' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	exports.EMPTY = new Observable_1.Observable(function (subscriber) { return subscriber.complete(); });
	function empty(scheduler) {
	    return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
	}
	exports.empty = empty;
	function emptyScheduled(scheduler) {
	    return new Observable_1.Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
	}
	//# sourceMappingURL=empty.js.map

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var subscribeTo_1 = __webpack_require__(101);
	var scheduled_1 = __webpack_require__(155);
	function from(input, scheduler) {
	    if (!scheduler) {
	        if (input instanceof Observable_1.Observable) {
	            return input;
	        }
	        return new Observable_1.Observable(subscribeTo_1.subscribeTo(input));
	    }
	    else {
	        return scheduled_1.scheduled(input, scheduler);
	    }
	}
	exports.from = from;
	//# sourceMappingURL=from.js.map

/***/ },
/* 16 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function isScheduler(value) {
	    return value && typeof value.schedule === 'function';
	}
	exports.isScheduler = isScheduler;
	//# sourceMappingURL=isScheduler.js.map

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(33)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ },
/* 18 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(23);
	var IE8_DOM_DEFINE = __webpack_require__(109);
	var toPrimitive = __webpack_require__(77);
	var dP = Object.defineProperty;

	exports.f = __webpack_require__(17) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.asEffect = exports.takem = exports.detach = undefined;
	exports.take = take;
	exports.put = put;
	exports.all = all;
	exports.race = race;
	exports.call = call;
	exports.apply = apply;
	exports.cps = cps;
	exports.fork = fork;
	exports.spawn = spawn;
	exports.join = join;
	exports.cancel = cancel;
	exports.select = select;
	exports.actionChannel = actionChannel;
	exports.cancelled = cancelled;
	exports.flush = flush;
	exports.getContext = getContext;
	exports.setContext = setContext;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var IO = /*#__PURE__*/(0, _utils.sym)('IO');
	var TAKE = 'TAKE';
	var PUT = 'PUT';
	var ALL = 'ALL';
	var RACE = 'RACE';
	var CALL = 'CALL';
	var CPS = 'CPS';
	var FORK = 'FORK';
	var JOIN = 'JOIN';
	var CANCEL = 'CANCEL';
	var SELECT = 'SELECT';
	var ACTION_CHANNEL = 'ACTION_CHANNEL';
	var CANCELLED = 'CANCELLED';
	var FLUSH = 'FLUSH';
	var GET_CONTEXT = 'GET_CONTEXT';
	var SET_CONTEXT = 'SET_CONTEXT';

	var TEST_HINT = '\n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)';

	var effect = function effect(type, payload) {
	  var _ref;

	  return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
	};

	var detach = exports.detach = function detach(eff) {
	  (0, _utils.check)(asEffect.fork(eff), _utils.is.object, 'detach(eff): argument must be a fork effect');
	  eff[FORK].detached = true;
	  return eff;
	};

	function take() {
	  var patternOrChannel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '*';

	  if (arguments.length) {
	    (0, _utils.check)(arguments[0], _utils.is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
	  }
	  if (_utils.is.pattern(patternOrChannel)) {
	    return effect(TAKE, { pattern: patternOrChannel });
	  }
	  if (_utils.is.channel(patternOrChannel)) {
	    return effect(TAKE, { channel: patternOrChannel });
	  }
	  throw new Error('take(patternOrChannel): argument ' + String(patternOrChannel) + ' is not valid channel or a valid pattern');
	}

	take.maybe = function () {
	  var eff = take.apply(undefined, arguments);
	  eff[TAKE].maybe = true;
	  return eff;
	};

	var takem = /*#__PURE__*/exports.takem = (0, _utils.deprecate)(take.maybe, /*#__PURE__*/(0, _utils.updateIncentive)('takem', 'take.maybe'));

	function put(channel, action) {
	  if (arguments.length > 1) {
	    (0, _utils.check)(channel, _utils.is.notUndef, 'put(channel, action): argument channel is undefined');
	    (0, _utils.check)(channel, _utils.is.channel, 'put(channel, action): argument ' + channel + ' is not a valid channel');
	    (0, _utils.check)(action, _utils.is.notUndef, 'put(channel, action): argument action is undefined');
	  } else {
	    (0, _utils.check)(channel, _utils.is.notUndef, 'put(action): argument action is undefined');
	    action = channel;
	    channel = null;
	  }
	  return effect(PUT, { channel: channel, action: action });
	}

	put.resolve = function () {
	  var eff = put.apply(undefined, arguments);
	  eff[PUT].resolve = true;
	  return eff;
	};

	put.sync = /*#__PURE__*/(0, _utils.deprecate)(put.resolve, /*#__PURE__*/(0, _utils.updateIncentive)('put.sync', 'put.resolve'));

	function all(effects) {
	  return effect(ALL, effects);
	}

	function race(effects) {
	  return effect(RACE, effects);
	}

	function getFnCallDesc(meth, fn, args) {
	  (0, _utils.check)(fn, _utils.is.notUndef, meth + ': argument fn is undefined');

	  var context = null;
	  if (_utils.is.array(fn)) {
	    var _fn = fn;
	    context = _fn[0];
	    fn = _fn[1];
	  } else if (fn.fn) {
	    var _fn2 = fn;
	    context = _fn2.context;
	    fn = _fn2.fn;
	  }
	  if (context && _utils.is.string(fn) && _utils.is.func(context[fn])) {
	    fn = context[fn];
	  }
	  (0, _utils.check)(fn, _utils.is.func, meth + ': argument ' + fn + ' is not a function');

	  return { context: context, fn: fn, args: args };
	}

	function call(fn) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  return effect(CALL, getFnCallDesc('call', fn, args));
	}

	function apply(context, fn) {
	  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	  return effect(CALL, getFnCallDesc('apply', { context: context, fn: fn }, args));
	}

	function cps(fn) {
	  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	    args[_key2 - 1] = arguments[_key2];
	  }

	  return effect(CPS, getFnCallDesc('cps', fn, args));
	}

	function fork(fn) {
	  for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    args[_key3 - 1] = arguments[_key3];
	  }

	  return effect(FORK, getFnCallDesc('fork', fn, args));
	}

	function spawn(fn) {
	  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
	    args[_key4 - 1] = arguments[_key4];
	  }

	  return detach(fork.apply(undefined, [fn].concat(args)));
	}

	function join() {
	  for (var _len5 = arguments.length, tasks = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	    tasks[_key5] = arguments[_key5];
	  }

	  if (tasks.length > 1) {
	    return all(tasks.map(function (t) {
	      return join(t);
	    }));
	  }
	  var task = tasks[0];
	  (0, _utils.check)(task, _utils.is.notUndef, 'join(task): argument task is undefined');
	  (0, _utils.check)(task, _utils.is.task, 'join(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
	  return effect(JOIN, task);
	}

	function cancel() {
	  for (var _len6 = arguments.length, tasks = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	    tasks[_key6] = arguments[_key6];
	  }

	  if (tasks.length > 1) {
	    return all(tasks.map(function (t) {
	      return cancel(t);
	    }));
	  }
	  var task = tasks[0];
	  if (tasks.length === 1) {
	    (0, _utils.check)(task, _utils.is.notUndef, 'cancel(task): argument task is undefined');
	    (0, _utils.check)(task, _utils.is.task, 'cancel(task): argument ' + task + ' is not a valid Task object ' + TEST_HINT);
	  }
	  return effect(CANCEL, task || _utils.SELF_CANCELLATION);
	}

	function select(selector) {
	  for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
	    args[_key7 - 1] = arguments[_key7];
	  }

	  if (arguments.length === 0) {
	    selector = _utils.ident;
	  } else {
	    (0, _utils.check)(selector, _utils.is.notUndef, 'select(selector,[...]): argument selector is undefined');
	    (0, _utils.check)(selector, _utils.is.func, 'select(selector,[...]): argument ' + selector + ' is not a function');
	  }
	  return effect(SELECT, { selector: selector, args: args });
	}

	/**
	  channel(pattern, [buffer])    => creates an event channel for store actions
	**/
	function actionChannel(pattern, buffer) {
	  (0, _utils.check)(pattern, _utils.is.notUndef, 'actionChannel(pattern,...): argument pattern is undefined');
	  if (arguments.length > 1) {
	    (0, _utils.check)(buffer, _utils.is.notUndef, 'actionChannel(pattern, buffer): argument buffer is undefined');
	    (0, _utils.check)(buffer, _utils.is.buffer, 'actionChannel(pattern, buffer): argument ' + buffer + ' is not a valid buffer');
	  }
	  return effect(ACTION_CHANNEL, { pattern: pattern, buffer: buffer });
	}

	function cancelled() {
	  return effect(CANCELLED, {});
	}

	function flush(channel) {
	  (0, _utils.check)(channel, _utils.is.channel, 'flush(channel): argument ' + channel + ' is not valid channel');
	  return effect(FLUSH, channel);
	}

	function getContext(prop) {
	  (0, _utils.check)(prop, _utils.is.string, 'getContext(prop): argument ' + prop + ' is not a string');
	  return effect(GET_CONTEXT, prop);
	}

	function setContext(props) {
	  (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)(null, props));
	  return effect(SET_CONTEXT, props);
	}

	var createAsEffectType = function createAsEffectType(type) {
	  return function (effect) {
	    return effect && effect[IO] && effect[type];
	  };
	};

	var asEffect = exports.asEffect = {
	  take: /*#__PURE__*/createAsEffectType(TAKE),
	  put: /*#__PURE__*/createAsEffectType(PUT),
	  all: /*#__PURE__*/createAsEffectType(ALL),
	  race: /*#__PURE__*/createAsEffectType(RACE),
	  call: /*#__PURE__*/createAsEffectType(CALL),
	  cps: /*#__PURE__*/createAsEffectType(CPS),
	  fork: /*#__PURE__*/createAsEffectType(FORK),
	  join: /*#__PURE__*/createAsEffectType(JOIN),
	  cancel: /*#__PURE__*/createAsEffectType(CANCEL),
	  select: /*#__PURE__*/createAsEffectType(SELECT),
	  actionChannel: /*#__PURE__*/createAsEffectType(ACTION_CHANNEL),
	  cancelled: /*#__PURE__*/createAsEffectType(CANCELLED),
	  flush: /*#__PURE__*/createAsEffectType(FLUSH),
	  getContext: /*#__PURE__*/createAsEffectType(GET_CONTEXT),
	  setContext: /*#__PURE__*/createAsEffectType(SET_CONTEXT)
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var InnerSubscriber = (function (_super) {
	    __extends(InnerSubscriber, _super);
	    function InnerSubscriber(parent, outerValue, outerIndex) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        _this.outerValue = outerValue;
	        _this.outerIndex = outerIndex;
	        _this.index = 0;
	        return _this;
	    }
	    InnerSubscriber.prototype._next = function (value) {
	        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
	    };
	    InnerSubscriber.prototype._error = function (error) {
	        this.parent.notifyError(error, this);
	        this.unsubscribe();
	    };
	    InnerSubscriber.prototype._complete = function () {
	        this.parent.notifyComplete(this);
	        this.unsubscribe();
	    };
	    return InnerSubscriber;
	}(Subscriber_1.Subscriber));
	exports.InnerSubscriber = InnerSubscriber;
	//# sourceMappingURL=InnerSubscriber.js.map

/***/ },
/* 22 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(34);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(19);
	var createDesc = __webpack_require__(35);
	module.exports = __webpack_require__(17) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = {};


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(110);
	var defined = __webpack_require__(70);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.UNDEFINED_INPUT_ERROR = exports.INVALID_BUFFER = exports.isEnd = exports.END = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.emitter = emitter;
	exports.channel = channel;
	exports.eventChannel = eventChannel;
	exports.stdChannel = stdChannel;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var _buffers = /*#__PURE__*/__webpack_require__(56);

	var _scheduler = /*#__PURE__*/__webpack_require__(136);

	var CHANNEL_END_TYPE = '@@redux-saga/CHANNEL_END';
	var END = exports.END = { type: CHANNEL_END_TYPE };
	var isEnd = exports.isEnd = function isEnd(a) {
	  return a && a.type === CHANNEL_END_TYPE;
	};

	function emitter() {
	  var subscribers = [];

	  function subscribe(sub) {
	    subscribers.push(sub);
	    return function () {
	      return (0, _utils.remove)(subscribers, sub);
	    };
	  }

	  function emit(item) {
	    var arr = subscribers.slice();
	    for (var i = 0, len = arr.length; i < len; i++) {
	      arr[i](item);
	    }
	  }

	  return {
	    subscribe: subscribe,
	    emit: emit
	  };
	}

	var INVALID_BUFFER = exports.INVALID_BUFFER = 'invalid buffer passed to channel factory function';
	var UNDEFINED_INPUT_ERROR = exports.UNDEFINED_INPUT_ERROR = 'Saga was provided with an undefined action';

	if (true) {
	  exports.UNDEFINED_INPUT_ERROR = UNDEFINED_INPUT_ERROR += '\nHints:\n    - check that your Action Creator returns a non-undefined value\n    - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners\n  ';
	}

	function channel() {
	  var buffer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _buffers.buffers.fixed();

	  var closed = false;
	  var takers = [];

	  (0, _utils.check)(buffer, _utils.is.buffer, INVALID_BUFFER);

	  function checkForbiddenStates() {
	    if (closed && takers.length) {
	      throw (0, _utils.internalErr)('Cannot have a closed channel with pending takers');
	    }
	    if (takers.length && !buffer.isEmpty()) {
	      throw (0, _utils.internalErr)('Cannot have pending takers with non empty buffer');
	    }
	  }

	  function put(input) {
	    checkForbiddenStates();
	    (0, _utils.check)(input, _utils.is.notUndef, UNDEFINED_INPUT_ERROR);
	    if (closed) {
	      return;
	    }
	    if (!takers.length) {
	      return buffer.put(input);
	    }
	    for (var i = 0; i < takers.length; i++) {
	      var cb = takers[i];
	      if (!cb[_utils.MATCH] || cb[_utils.MATCH](input)) {
	        takers.splice(i, 1);
	        return cb(input);
	      }
	    }
	  }

	  function take(cb) {
	    checkForbiddenStates();
	    (0, _utils.check)(cb, _utils.is.func, "channel.take's callback must be a function");

	    if (closed && buffer.isEmpty()) {
	      cb(END);
	    } else if (!buffer.isEmpty()) {
	      cb(buffer.take());
	    } else {
	      takers.push(cb);
	      cb.cancel = function () {
	        return (0, _utils.remove)(takers, cb);
	      };
	    }
	  }

	  function flush(cb) {
	    checkForbiddenStates(); // TODO: check if some new state should be forbidden now
	    (0, _utils.check)(cb, _utils.is.func, "channel.flush' callback must be a function");
	    if (closed && buffer.isEmpty()) {
	      cb(END);
	      return;
	    }
	    cb(buffer.flush());
	  }

	  function close() {
	    checkForbiddenStates();
	    if (!closed) {
	      closed = true;
	      if (takers.length) {
	        var arr = takers;
	        takers = [];
	        for (var i = 0, len = arr.length; i < len; i++) {
	          arr[i](END);
	        }
	      }
	    }
	  }

	  return {
	    take: take,
	    put: put,
	    flush: flush,
	    close: close,
	    get __takers__() {
	      return takers;
	    },
	    get __closed__() {
	      return closed;
	    }
	  };
	}

	function eventChannel(subscribe) {
	  var buffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _buffers.buffers.none();
	  var matcher = arguments[2];

	  /**
	    should be if(typeof matcher !== undefined) instead?
	    see PR #273 for a background discussion
	  **/
	  if (arguments.length > 2) {
	    (0, _utils.check)(matcher, _utils.is.func, 'Invalid match function passed to eventChannel');
	  }

	  var chan = channel(buffer);
	  var close = function close() {
	    if (!chan.__closed__) {
	      if (unsubscribe) {
	        unsubscribe();
	      }
	      chan.close();
	    }
	  };
	  var unsubscribe = subscribe(function (input) {
	    if (isEnd(input)) {
	      close();
	      return;
	    }
	    if (matcher && !matcher(input)) {
	      return;
	    }
	    chan.put(input);
	  });
	  if (chan.__closed__) {
	    unsubscribe();
	  }

	  if (!_utils.is.func(unsubscribe)) {
	    throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
	  }

	  return {
	    take: chan.take,
	    flush: chan.flush,
	    close: close
	  };
	}

	function stdChannel(subscribe) {
	  var chan = eventChannel(function (cb) {
	    return subscribe(function (input) {
	      if (input[_utils.SAGA_ACTION]) {
	        cb(input);
	        return;
	      }
	      (0, _scheduler.asap)(function () {
	        return cb(input);
	      });
	    });
	  });

	  return _extends({}, chan, {
	    take: function take(cb, matcher) {
	      if (arguments.length > 1) {
	        (0, _utils.check)(matcher, _utils.is.func, "channel.take's matcher argument must be a function");
	        cb[_utils.MATCH] = matcher;
	      }
	      chan.take(cb);
	    }
	  });
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function filter(predicate, thisArg) {
	    return function filterOperatorFunction(source) {
	        return source.lift(new FilterOperator(predicate, thisArg));
	    };
	}
	exports.filter = filter;
	var FilterOperator = (function () {
	    function FilterOperator(predicate, thisArg) {
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	    }
	    FilterOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
	    };
	    return FilterOperator;
	}());
	var FilterSubscriber = (function (_super) {
	    __extends(FilterSubscriber, _super);
	    function FilterSubscriber(destination, predicate, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.count = 0;
	        return _this;
	    }
	    FilterSubscriber.prototype._next = function (value) {
	        var result;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.count++);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.destination.next(value);
	        }
	    };
	    return FilterSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=filter.js.map

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ConnectableObservable_1 = __webpack_require__(141);
	function multicast(subjectOrSubjectFactory, selector) {
	    return function multicastOperatorFunction(source) {
	        var subjectFactory;
	        if (typeof subjectOrSubjectFactory === 'function') {
	            subjectFactory = subjectOrSubjectFactory;
	        }
	        else {
	            subjectFactory = function subjectFactory() {
	                return subjectOrSubjectFactory;
	            };
	        }
	        if (typeof selector === 'function') {
	            return source.lift(new MulticastOperator(subjectFactory, selector));
	        }
	        var connectable = Object.create(source, ConnectableObservable_1.connectableObservableDescriptor);
	        connectable.source = source;
	        connectable.subjectFactory = subjectFactory;
	        return connectable;
	    };
	}
	exports.multicast = multicast;
	var MulticastOperator = (function () {
	    function MulticastOperator(subjectFactory, selector) {
	        this.subjectFactory = subjectFactory;
	        this.selector = selector;
	    }
	    MulticastOperator.prototype.call = function (subscriber, source) {
	        var selector = this.selector;
	        var subject = this.subjectFactory();
	        var subscription = selector(subject).subscribe(subscriber);
	        subscription.add(source.subscribe(subject));
	        return subscription;
	    };
	    return MulticastOperator;
	}());
	exports.MulticastOperator = MulticastOperator;
	//# sourceMappingURL=multicast.js.map

/***/ },
/* 30 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';
	//# sourceMappingURL=observable.js.map

/***/ },
/* 31 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function identity(x) {
	    return x;
	}
	exports.identity = identity;
	//# sourceMappingURL=identity.js.map

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(18);
	var core = __webpack_require__(13);
	var ctx = __webpack_require__(107);
	var hide = __webpack_require__(24);
	var has = __webpack_require__(22);
	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	exports.Observable = Observable_1.Observable;
	var ConnectableObservable_1 = __webpack_require__(141);
	exports.ConnectableObservable = ConnectableObservable_1.ConnectableObservable;
	var groupBy_1 = __webpack_require__(151);
	exports.GroupedObservable = groupBy_1.GroupedObservable;
	var observable_1 = __webpack_require__(30);
	exports.observable = observable_1.observable;
	var Subject_1 = __webpack_require__(6);
	exports.Subject = Subject_1.Subject;
	var BehaviorSubject_1 = __webpack_require__(137);
	exports.BehaviorSubject = BehaviorSubject_1.BehaviorSubject;
	var ReplaySubject_1 = __webpack_require__(84);
	exports.ReplaySubject = ReplaySubject_1.ReplaySubject;
	var AsyncSubject_1 = __webpack_require__(57);
	exports.AsyncSubject = AsyncSubject_1.AsyncSubject;
	var asap_1 = __webpack_require__(156);
	exports.asapScheduler = asap_1.asap;
	var async_1 = __webpack_require__(7);
	exports.asyncScheduler = async_1.async;
	var queue_1 = __webpack_require__(157);
	exports.queueScheduler = queue_1.queue;
	var animationFrame_1 = __webpack_require__(355);
	exports.animationFrameScheduler = animationFrame_1.animationFrame;
	var VirtualTimeScheduler_1 = __webpack_require__(354);
	exports.VirtualTimeScheduler = VirtualTimeScheduler_1.VirtualTimeScheduler;
	exports.VirtualAction = VirtualTimeScheduler_1.VirtualAction;
	var Scheduler_1 = __webpack_require__(139);
	exports.Scheduler = Scheduler_1.Scheduler;
	var Subscription_1 = __webpack_require__(5);
	exports.Subscription = Subscription_1.Subscription;
	var Subscriber_1 = __webpack_require__(1);
	exports.Subscriber = Subscriber_1.Subscriber;
	var Notification_1 = __webpack_require__(58);
	exports.Notification = Notification_1.Notification;
	exports.NotificationKind = Notification_1.NotificationKind;
	var pipe_1 = __webpack_require__(100);
	exports.pipe = pipe_1.pipe;
	var noop_1 = __webpack_require__(66);
	exports.noop = noop_1.noop;
	var identity_1 = __webpack_require__(31);
	exports.identity = identity_1.identity;
	var isObservable_1 = __webpack_require__(359);
	exports.isObservable = isObservable_1.isObservable;
	var ArgumentOutOfRangeError_1 = __webpack_require__(43);
	exports.ArgumentOutOfRangeError = ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
	var EmptyError_1 = __webpack_require__(44);
	exports.EmptyError = EmptyError_1.EmptyError;
	var ObjectUnsubscribedError_1 = __webpack_require__(64);
	exports.ObjectUnsubscribedError = ObjectUnsubscribedError_1.ObjectUnsubscribedError;
	var UnsubscriptionError_1 = __webpack_require__(159);
	exports.UnsubscriptionError = UnsubscriptionError_1.UnsubscriptionError;
	var TimeoutError_1 = __webpack_require__(158);
	exports.TimeoutError = TimeoutError_1.TimeoutError;
	var bindCallback_1 = __webpack_require__(250);
	exports.bindCallback = bindCallback_1.bindCallback;
	var bindNodeCallback_1 = __webpack_require__(251);
	exports.bindNodeCallback = bindNodeCallback_1.bindNodeCallback;
	var combineLatest_1 = __webpack_require__(85);
	exports.combineLatest = combineLatest_1.combineLatest;
	var concat_1 = __webpack_require__(60);
	exports.concat = concat_1.concat;
	var defer_1 = __webpack_require__(86);
	exports.defer = defer_1.defer;
	var empty_1 = __webpack_require__(14);
	exports.empty = empty_1.empty;
	var forkJoin_1 = __webpack_require__(252);
	exports.forkJoin = forkJoin_1.forkJoin;
	var from_1 = __webpack_require__(15);
	exports.from = from_1.from;
	var fromEvent_1 = __webpack_require__(253);
	exports.fromEvent = fromEvent_1.fromEvent;
	var fromEventPattern_1 = __webpack_require__(254);
	exports.fromEventPattern = fromEventPattern_1.fromEventPattern;
	var generate_1 = __webpack_require__(255);
	exports.generate = generate_1.generate;
	var iif_1 = __webpack_require__(256);
	exports.iif = iif_1.iif;
	var interval_1 = __webpack_require__(257);
	exports.interval = interval_1.interval;
	var merge_1 = __webpack_require__(142);
	exports.merge = merge_1.merge;
	var never_1 = __webpack_require__(143);
	exports.never = never_1.never;
	var of_1 = __webpack_require__(61);
	exports.of = of_1.of;
	var onErrorResumeNext_1 = __webpack_require__(258);
	exports.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;
	var pairs_1 = __webpack_require__(259);
	exports.pairs = pairs_1.pairs;
	var partition_1 = __webpack_require__(260);
	exports.partition = partition_1.partition;
	var race_1 = __webpack_require__(144);
	exports.race = race_1.race;
	var range_1 = __webpack_require__(261);
	exports.range = range_1.range;
	var throwError_1 = __webpack_require__(87);
	exports.throwError = throwError_1.throwError;
	var timer_1 = __webpack_require__(145);
	exports.timer = timer_1.timer;
	var using_1 = __webpack_require__(262);
	exports.using = using_1.using;
	var zip_1 = __webpack_require__(88);
	exports.zip = zip_1.zip;
	var scheduled_1 = __webpack_require__(155);
	exports.scheduled = scheduled_1.scheduled;
	var empty_2 = __webpack_require__(14);
	exports.EMPTY = empty_2.EMPTY;
	var never_2 = __webpack_require__(143);
	exports.NEVER = never_2.NEVER;
	var config_1 = __webpack_require__(59);
	exports.config = config_1.config;
	//# sourceMappingURL=index.js.map

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var subscribeToArray_1 = __webpack_require__(164);
	var scheduleArray_1 = __webpack_require__(95);
	function fromArray(input, scheduler) {
	    if (!scheduler) {
	        return new Observable_1.Observable(subscribeToArray_1.subscribeToArray(input));
	    }
	    else {
	        return scheduleArray_1.scheduleArray(input, scheduler);
	    }
	}
	exports.fromArray = fromArray;
	//# sourceMappingURL=fromArray.js.map

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function defaultIfEmpty(defaultValue) {
	    if (defaultValue === void 0) { defaultValue = null; }
	    return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
	}
	exports.defaultIfEmpty = defaultIfEmpty;
	var DefaultIfEmptyOperator = (function () {
	    function DefaultIfEmptyOperator(defaultValue) {
	        this.defaultValue = defaultValue;
	    }
	    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
	    };
	    return DefaultIfEmptyOperator;
	}());
	var DefaultIfEmptySubscriber = (function (_super) {
	    __extends(DefaultIfEmptySubscriber, _super);
	    function DefaultIfEmptySubscriber(destination, defaultValue) {
	        var _this = _super.call(this, destination) || this;
	        _this.defaultValue = defaultValue;
	        _this.isEmpty = true;
	        return _this;
	    }
	    DefaultIfEmptySubscriber.prototype._next = function (value) {
	        this.isEmpty = false;
	        this.destination.next(value);
	    };
	    DefaultIfEmptySubscriber.prototype._complete = function () {
	        if (this.isEmpty) {
	            this.destination.next(this.defaultValue);
	        }
	        this.destination.complete();
	    };
	    return DefaultIfEmptySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=defaultIfEmpty.js.map

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var subscribeToResult_1 = __webpack_require__(4);
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	var map_1 = __webpack_require__(10);
	var from_1 = __webpack_require__(15);
	function mergeMap(project, resultSelector, concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    if (typeof resultSelector === 'function') {
	        return function (source) { return source.pipe(mergeMap(function (a, i) { return from_1.from(project(a, i)).pipe(map_1.map(function (b, ii) { return resultSelector(a, b, i, ii); })); }, concurrent)); };
	    }
	    else if (typeof resultSelector === 'number') {
	        concurrent = resultSelector;
	    }
	    return function (source) { return source.lift(new MergeMapOperator(project, concurrent)); };
	}
	exports.mergeMap = mergeMap;
	var MergeMapOperator = (function () {
	    function MergeMapOperator(project, concurrent) {
	        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	        this.project = project;
	        this.concurrent = concurrent;
	    }
	    MergeMapOperator.prototype.call = function (observer, source) {
	        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.concurrent));
	    };
	    return MergeMapOperator;
	}());
	exports.MergeMapOperator = MergeMapOperator;
	var MergeMapSubscriber = (function (_super) {
	    __extends(MergeMapSubscriber, _super);
	    function MergeMapSubscriber(destination, project, concurrent) {
	        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.concurrent = concurrent;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        _this.index = 0;
	        return _this;
	    }
	    MergeMapSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            this._tryNext(value);
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeMapSubscriber.prototype._tryNext = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.active++;
	        this._innerSub(result, value, index);
	    };
	    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
	        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        subscribeToResult_1.subscribeToResult(this, ish, value, index, innerSubscriber);
	    };
	    MergeMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            this.destination.complete();
	        }
	        this.unsubscribe();
	    };
	    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        this.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return MergeMapSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.MergeMapSubscriber = MergeMapSubscriber;
	//# sourceMappingURL=mergeMap.js.map

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Action_1 = __webpack_require__(347);
	var AsyncAction = (function (_super) {
	    __extends(AsyncAction, _super);
	    function AsyncAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.pending = false;
	        return _this;
	    }
	    AsyncAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (this.closed) {
	            return this;
	        }
	        this.state = state;
	        var id = this.id;
	        var scheduler = this.scheduler;
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, delay);
	        }
	        this.pending = true;
	        this.delay = delay;
	        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
	        return this;
	    };
	    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        return setInterval(scheduler.flush.bind(scheduler, this), delay);
	    };
	    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (delay !== null && this.delay === delay && this.pending === false) {
	            return id;
	        }
	        clearInterval(id);
	        return undefined;
	    };
	    AsyncAction.prototype.execute = function (state, delay) {
	        if (this.closed) {
	            return new Error('executing a cancelled action');
	        }
	        this.pending = false;
	        var error = this._execute(state, delay);
	        if (error) {
	            return error;
	        }
	        else if (this.pending === false && this.id != null) {
	            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
	        }
	    };
	    AsyncAction.prototype._execute = function (state, delay) {
	        var errored = false;
	        var errorValue = undefined;
	        try {
	            this.work(state);
	        }
	        catch (e) {
	            errored = true;
	            errorValue = !!e && e || new Error(e);
	        }
	        if (errored) {
	            this.unsubscribe();
	            return errorValue;
	        }
	    };
	    AsyncAction.prototype._unsubscribe = function () {
	        var id = this.id;
	        var scheduler = this.scheduler;
	        var actions = scheduler.actions;
	        var index = actions.indexOf(this);
	        this.work = null;
	        this.state = null;
	        this.pending = false;
	        this.scheduler = null;
	        if (index !== -1) {
	            actions.splice(index, 1);
	        }
	        if (id != null) {
	            this.id = this.recycleAsyncId(scheduler, id, null);
	        }
	        this.delay = null;
	    };
	    return AsyncAction;
	}(Action_1.Action));
	exports.AsyncAction = AsyncAction;
	//# sourceMappingURL=AsyncAction.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Scheduler_1 = __webpack_require__(139);
	var AsyncScheduler = (function (_super) {
	    __extends(AsyncScheduler, _super);
	    function AsyncScheduler(SchedulerAction, now) {
	        if (now === void 0) { now = Scheduler_1.Scheduler.now; }
	        var _this = _super.call(this, SchedulerAction, function () {
	            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
	                return AsyncScheduler.delegate.now();
	            }
	            else {
	                return now();
	            }
	        }) || this;
	        _this.actions = [];
	        _this.active = false;
	        _this.scheduled = undefined;
	        return _this;
	    }
	    AsyncScheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) { delay = 0; }
	        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
	            return AsyncScheduler.delegate.schedule(work, delay, state);
	        }
	        else {
	            return _super.prototype.schedule.call(this, work, delay, state);
	        }
	    };
	    AsyncScheduler.prototype.flush = function (action) {
	        var actions = this.actions;
	        if (this.active) {
	            actions.push(action);
	            return;
	        }
	        var error;
	        this.active = true;
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (action = actions.shift());
	        this.active = false;
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsyncScheduler;
	}(Scheduler_1.Scheduler));
	exports.AsyncScheduler = AsyncScheduler;
	//# sourceMappingURL=AsyncScheduler.js.map

/***/ },
/* 42 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function getSymbolIterator() {
	    if (typeof Symbol !== 'function' || !Symbol.iterator) {
	        return '@@iterator';
	    }
	    return Symbol.iterator;
	}
	exports.getSymbolIterator = getSymbolIterator;
	exports.iterator = getSymbolIterator();
	exports.$$iterator = exports.iterator;
	//# sourceMappingURL=iterator.js.map

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function ArgumentOutOfRangeErrorImpl() {
	    Error.call(this);
	    this.message = 'argument out of range';
	    this.name = 'ArgumentOutOfRangeError';
	    return this;
	}
	ArgumentOutOfRangeErrorImpl.prototype = Object.create(Error.prototype);
	exports.ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;
	//# sourceMappingURL=ArgumentOutOfRangeError.js.map

/***/ },
/* 44 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function EmptyErrorImpl() {
	    Error.call(this);
	    this.message = 'no elements in sequence';
	    this.name = 'EmptyError';
	    return this;
	}
	EmptyErrorImpl.prototype = Object.create(Error.prototype);
	exports.EmptyError = EmptyErrorImpl;
	//# sourceMappingURL=EmptyError.js.map

/***/ },
/* 45 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function isFunction(x) {
	    return typeof x === 'function';
	}
	exports.isFunction = isFunction;
	//# sourceMappingURL=isFunction.js.map

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(104);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = true;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(114);
	var enumBugKeys = __webpack_require__(71);

	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ },
/* 50 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(70);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ },
/* 52 */
/***/ function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(207)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(111)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	if (false) {
	  module.exports = require('./cjs/react-is.production.min.js');
	} else {
	  module.exports = __webpack_require__(224);
	}


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports["default"] = exports.ReactReduxContext = void 0;

	var _react = _interopRequireDefault(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));

	var ReactReduxContext = _react["default"].createContext(null);

	exports.ReactReduxContext = ReactReduxContext;
	var _default = ReactReduxContext;
	exports["default"] = _default;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.buffers = exports.BUFFER_OVERFLOW = undefined;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var BUFFER_OVERFLOW = exports.BUFFER_OVERFLOW = "Channel's Buffer overflow!";

	var ON_OVERFLOW_THROW = 1;
	var ON_OVERFLOW_DROP = 2;
	var ON_OVERFLOW_SLIDE = 3;
	var ON_OVERFLOW_EXPAND = 4;

	var zeroBuffer = { isEmpty: _utils.kTrue, put: _utils.noop, take: _utils.noop };

	function ringBuffer() {
	  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
	  var overflowAction = arguments[1];

	  var arr = new Array(limit);
	  var length = 0;
	  var pushIndex = 0;
	  var popIndex = 0;

	  var push = function push(it) {
	    arr[pushIndex] = it;
	    pushIndex = (pushIndex + 1) % limit;
	    length++;
	  };

	  var take = function take() {
	    if (length != 0) {
	      var it = arr[popIndex];
	      arr[popIndex] = null;
	      length--;
	      popIndex = (popIndex + 1) % limit;
	      return it;
	    }
	  };

	  var flush = function flush() {
	    var items = [];
	    while (length) {
	      items.push(take());
	    }
	    return items;
	  };

	  return {
	    isEmpty: function isEmpty() {
	      return length == 0;
	    },
	    put: function put(it) {
	      if (length < limit) {
	        push(it);
	      } else {
	        var doubledLimit = void 0;
	        switch (overflowAction) {
	          case ON_OVERFLOW_THROW:
	            throw new Error(BUFFER_OVERFLOW);
	          case ON_OVERFLOW_SLIDE:
	            arr[pushIndex] = it;
	            pushIndex = (pushIndex + 1) % limit;
	            popIndex = pushIndex;
	            break;
	          case ON_OVERFLOW_EXPAND:
	            doubledLimit = 2 * limit;

	            arr = flush();

	            length = arr.length;
	            pushIndex = arr.length;
	            popIndex = 0;

	            arr.length = doubledLimit;
	            limit = doubledLimit;

	            push(it);
	            break;
	          default:
	          // DROP
	        }
	      }
	    },
	    take: take,
	    flush: flush
	  };
	}

	var buffers = exports.buffers = {
	  none: function none() {
	    return zeroBuffer;
	  },
	  fixed: function fixed(limit) {
	    return ringBuffer(limit, ON_OVERFLOW_THROW);
	  },
	  dropping: function dropping(limit) {
	    return ringBuffer(limit, ON_OVERFLOW_DROP);
	  },
	  sliding: function sliding(limit) {
	    return ringBuffer(limit, ON_OVERFLOW_SLIDE);
	  },
	  expanding: function expanding(initialSize) {
	    return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
	  }
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var Subscription_1 = __webpack_require__(5);
	var AsyncSubject = (function (_super) {
	    __extends(AsyncSubject, _super);
	    function AsyncSubject() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.value = null;
	        _this.hasNext = false;
	        _this.hasCompleted = false;
	        return _this;
	    }
	    AsyncSubject.prototype._subscribe = function (subscriber) {
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	            return Subscription_1.Subscription.EMPTY;
	        }
	        else if (this.hasCompleted && this.hasNext) {
	            subscriber.next(this.value);
	            subscriber.complete();
	            return Subscription_1.Subscription.EMPTY;
	        }
	        return _super.prototype._subscribe.call(this, subscriber);
	    };
	    AsyncSubject.prototype.next = function (value) {
	        if (!this.hasCompleted) {
	            this.value = value;
	            this.hasNext = true;
	        }
	    };
	    AsyncSubject.prototype.error = function (error) {
	        if (!this.hasCompleted) {
	            _super.prototype.error.call(this, error);
	        }
	    };
	    AsyncSubject.prototype.complete = function () {
	        this.hasCompleted = true;
	        if (this.hasNext) {
	            _super.prototype.next.call(this, this.value);
	        }
	        _super.prototype.complete.call(this);
	    };
	    return AsyncSubject;
	}(Subject_1.Subject));
	exports.AsyncSubject = AsyncSubject;
	//# sourceMappingURL=AsyncSubject.js.map

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var empty_1 = __webpack_require__(14);
	var of_1 = __webpack_require__(61);
	var throwError_1 = __webpack_require__(87);
	var NotificationKind;
	(function (NotificationKind) {
	    NotificationKind["NEXT"] = "N";
	    NotificationKind["ERROR"] = "E";
	    NotificationKind["COMPLETE"] = "C";
	})(NotificationKind = exports.NotificationKind || (exports.NotificationKind = {}));
	var Notification = (function () {
	    function Notification(kind, value, error) {
	        this.kind = kind;
	        this.value = value;
	        this.error = error;
	        this.hasValue = kind === 'N';
	    }
	    Notification.prototype.observe = function (observer) {
	        switch (this.kind) {
	            case 'N':
	                return observer.next && observer.next(this.value);
	            case 'E':
	                return observer.error && observer.error(this.error);
	            case 'C':
	                return observer.complete && observer.complete();
	        }
	    };
	    Notification.prototype.do = function (next, error, complete) {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return next && next(this.value);
	            case 'E':
	                return error && error(this.error);
	            case 'C':
	                return complete && complete();
	        }
	    };
	    Notification.prototype.accept = function (nextOrObserver, error, complete) {
	        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
	            return this.observe(nextOrObserver);
	        }
	        else {
	            return this.do(nextOrObserver, error, complete);
	        }
	    };
	    Notification.prototype.toObservable = function () {
	        var kind = this.kind;
	        switch (kind) {
	            case 'N':
	                return of_1.of(this.value);
	            case 'E':
	                return throwError_1.throwError(this.error);
	            case 'C':
	                return empty_1.empty();
	        }
	        throw new Error('unexpected notification kind value');
	    };
	    Notification.createNext = function (value) {
	        if (typeof value !== 'undefined') {
	            return new Notification('N', value);
	        }
	        return Notification.undefinedValueNotification;
	    };
	    Notification.createError = function (err) {
	        return new Notification('E', undefined, err);
	    };
	    Notification.createComplete = function () {
	        return Notification.completeNotification;
	    };
	    Notification.completeNotification = new Notification('C');
	    Notification.undefinedValueNotification = new Notification('N', undefined);
	    return Notification;
	}());
	exports.Notification = Notification;
	//# sourceMappingURL=Notification.js.map

/***/ },
/* 59 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var _enable_super_gross_mode_that_will_cause_bad_things = false;
	exports.config = {
	    Promise: undefined,
	    set useDeprecatedSynchronousErrorHandling(value) {
	        if (value) {
	            var error = new Error();
	            console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
	        }
	        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
	            console.log('RxJS: Back to a better error behavior. Thank you. <3');
	        }
	        _enable_super_gross_mode_that_will_cause_bad_things = value;
	    },
	    get useDeprecatedSynchronousErrorHandling() {
	        return _enable_super_gross_mode_that_will_cause_bad_things;
	    },
	};
	//# sourceMappingURL=config.js.map

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var of_1 = __webpack_require__(61);
	var concatAll_1 = __webpack_require__(147);
	function concat() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    return concatAll_1.concatAll()(of_1.of.apply(void 0, observables));
	}
	exports.concat = concat;
	//# sourceMappingURL=concat.js.map

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isScheduler_1 = __webpack_require__(16);
	var fromArray_1 = __webpack_require__(37);
	var scheduleArray_1 = __webpack_require__(95);
	function of() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	    }
	    var scheduler = args[args.length - 1];
	    if (isScheduler_1.isScheduler(scheduler)) {
	        args.pop();
	        return scheduleArray_1.scheduleArray(args, scheduler);
	    }
	    else {
	        return fromArray_1.fromArray(args);
	    }
	}
	exports.of = of;
	//# sourceMappingURL=of.js.map

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var scan_1 = __webpack_require__(91);
	var takeLast_1 = __webpack_require__(94);
	var defaultIfEmpty_1 = __webpack_require__(38);
	var pipe_1 = __webpack_require__(100);
	function reduce(accumulator, seed) {
	    if (arguments.length >= 2) {
	        return function reduceOperatorFunctionWithSeed(source) {
	            return pipe_1.pipe(scan_1.scan(accumulator, seed), takeLast_1.takeLast(1), defaultIfEmpty_1.defaultIfEmpty(seed))(source);
	        };
	    }
	    return function reduceOperatorFunction(source) {
	        return pipe_1.pipe(scan_1.scan(function (acc, value, index) { return accumulator(acc, value, index + 1); }), takeLast_1.takeLast(1))(source);
	    };
	}
	exports.reduce = reduce;
	//# sourceMappingURL=reduce.js.map

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var EmptyError_1 = __webpack_require__(44);
	var Subscriber_1 = __webpack_require__(1);
	function throwIfEmpty(errorFactory) {
	    if (errorFactory === void 0) { errorFactory = defaultErrorFactory; }
	    return function (source) {
	        return source.lift(new ThrowIfEmptyOperator(errorFactory));
	    };
	}
	exports.throwIfEmpty = throwIfEmpty;
	var ThrowIfEmptyOperator = (function () {
	    function ThrowIfEmptyOperator(errorFactory) {
	        this.errorFactory = errorFactory;
	    }
	    ThrowIfEmptyOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ThrowIfEmptySubscriber(subscriber, this.errorFactory));
	    };
	    return ThrowIfEmptyOperator;
	}());
	var ThrowIfEmptySubscriber = (function (_super) {
	    __extends(ThrowIfEmptySubscriber, _super);
	    function ThrowIfEmptySubscriber(destination, errorFactory) {
	        var _this = _super.call(this, destination) || this;
	        _this.errorFactory = errorFactory;
	        _this.hasValue = false;
	        return _this;
	    }
	    ThrowIfEmptySubscriber.prototype._next = function (value) {
	        this.hasValue = true;
	        this.destination.next(value);
	    };
	    ThrowIfEmptySubscriber.prototype._complete = function () {
	        if (!this.hasValue) {
	            var err = void 0;
	            try {
	                err = this.errorFactory();
	            }
	            catch (e) {
	                err = e;
	            }
	            this.destination.error(err);
	        }
	        else {
	            return this.destination.complete();
	        }
	    };
	    return ThrowIfEmptySubscriber;
	}(Subscriber_1.Subscriber));
	function defaultErrorFactory() {
	    return new EmptyError_1.EmptyError();
	}
	//# sourceMappingURL=throwIfEmpty.js.map

/***/ },
/* 64 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function ObjectUnsubscribedErrorImpl() {
	    Error.call(this);
	    this.message = 'object unsubscribed';
	    this.name = 'ObjectUnsubscribedError';
	    return this;
	}
	ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
	exports.ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;
	//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isArray_1 = __webpack_require__(8);
	function isNumeric(val) {
	    return !isArray_1.isArray(val) && (val - parseFloat(val) + 1) >= 0;
	}
	exports.isNumeric = isNumeric;
	//# sourceMappingURL=isNumeric.js.map

/***/ },
/* 66 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function noop() { }
	exports.noop = noop;
	//# sourceMappingURL=noop.js.map

/***/ },
/* 67 */
/***/ function(module, exports) {

	function _extends() {
	  module.exports = _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	module.exports = _extends;

/***/ },
/* 68 */
/***/ function(module, exports) {

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	module.exports = _objectWithoutPropertiesLoose;

/***/ },
/* 69 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ },
/* 70 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ },
/* 71 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ },
/* 72 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(19).f;
	var has = __webpack_require__(22);
	var TAG = __webpack_require__(11)('toStringTag');

	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(75)('keys');
	var uid = __webpack_require__(52);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var core = __webpack_require__(13);
	var global = __webpack_require__(18);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: core.version,
	  mode: __webpack_require__(48) ? 'pure' : 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});


/***/ },
/* 76 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(34);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(18);
	var core = __webpack_require__(13);
	var LIBRARY = __webpack_require__(48);
	var wksExt = __webpack_require__(79);
	var defineProperty = __webpack_require__(19).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(11);


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(212);
	var global = __webpack_require__(18);
	var hide = __webpack_require__(24);
	var Iterators = __webpack_require__(25);
	var TO_STRING_TAG = __webpack_require__(11)('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = global[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (true) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = void 0;

	var _batch = __webpack_require__(124);

	// encapsulates the subscription logic for connecting a component to the redux store, as
	// well as nesting subscriptions of descendant components, so that we can ensure the
	// ancestor components re-render before descendants
	var CLEARED = null;
	var nullListeners = {
	  notify: function notify() {}
	};

	function createListenerCollection() {
	  var batch = (0, _batch.getBatch)(); // the current/next pattern is copied from redux's createStore code.
	  // TODO: refactor+expose that code to be reusable here?

	  var current = [];
	  var next = [];
	  return {
	    clear: function clear() {
	      next = CLEARED;
	      current = CLEARED;
	    },
	    notify: function notify() {
	      var listeners = current = next;
	      batch(function () {
	        for (var i = 0; i < listeners.length; i++) {
	          listeners[i]();
	        }
	      });
	    },
	    get: function get() {
	      return next;
	    },
	    subscribe: function subscribe(listener) {
	      var isSubscribed = true;
	      if (next === current) next = current.slice();
	      next.push(listener);
	      return function unsubscribe() {
	        if (!isSubscribed || current === CLEARED) return;
	        isSubscribed = false;
	        if (next === current) next = current.slice();
	        next.splice(next.indexOf(listener), 1);
	      };
	    }
	  };
	}

	var Subscription =
	/*#__PURE__*/
	function () {
	  function Subscription(store, parentSub) {
	    this.store = store;
	    this.parentSub = parentSub;
	    this.unsubscribe = null;
	    this.listeners = nullListeners;
	    this.handleChangeWrapper = this.handleChangeWrapper.bind(this);
	  }

	  var _proto = Subscription.prototype;

	  _proto.addNestedSub = function addNestedSub(listener) {
	    this.trySubscribe();
	    return this.listeners.subscribe(listener);
	  };

	  _proto.notifyNestedSubs = function notifyNestedSubs() {
	    this.listeners.notify();
	  };

	  _proto.handleChangeWrapper = function handleChangeWrapper() {
	    if (this.onStateChange) {
	      this.onStateChange();
	    }
	  };

	  _proto.isSubscribed = function isSubscribed() {
	    return Boolean(this.unsubscribe);
	  };

	  _proto.trySubscribe = function trySubscribe() {
	    if (!this.unsubscribe) {
	      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.handleChangeWrapper) : this.store.subscribe(this.handleChangeWrapper);
	      this.listeners = createListenerCollection();
	    }
	  };

	  _proto.tryUnsubscribe = function tryUnsubscribe() {
	    if (this.unsubscribe) {
	      this.unsubscribe();
	      this.unsubscribe = null;
	      this.listeners.clear();
	      this.listeners = nullListeners;
	    }
	  };

	  return Subscription;
	}();

	exports["default"] = Subscription;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.qEnd = undefined;
	exports.safeName = safeName;
	exports.default = fsmIterator;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var done = { done: true, value: undefined };
	var qEnd = exports.qEnd = {};

	function safeName(patternOrChannel) {
	  if (_utils.is.channel(patternOrChannel)) {
	    return 'channel';
	  } else if (Array.isArray(patternOrChannel)) {
	    return String(patternOrChannel.map(function (entry) {
	      return String(entry);
	    }));
	  } else {
	    return String(patternOrChannel);
	  }
	}

	function fsmIterator(fsm, q0) {
	  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'iterator';

	  var updateState = void 0,
	      qNext = q0;

	  function next(arg, error) {
	    if (qNext === qEnd) {
	      return done;
	    }

	    if (error) {
	      qNext = qEnd;
	      throw error;
	    } else {
	      updateState && updateState(arg);

	      var _fsm$qNext = fsm[qNext](),
	          q = _fsm$qNext[0],
	          output = _fsm$qNext[1],
	          _updateState = _fsm$qNext[2];

	      qNext = q;
	      updateState = _updateState;
	      return qNext === qEnd ? done : output;
	    }
	  }

	  return (0, _utils.makeIterator)(next, function (error) {
	    return next(null, error);
	  }, name, true);
	}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var queue_1 = __webpack_require__(157);
	var Subscription_1 = __webpack_require__(5);
	var observeOn_1 = __webpack_require__(152);
	var ObjectUnsubscribedError_1 = __webpack_require__(64);
	var SubjectSubscription_1 = __webpack_require__(140);
	var ReplaySubject = (function (_super) {
	    __extends(ReplaySubject, _super);
	    function ReplaySubject(bufferSize, windowTime, scheduler) {
	        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
	        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
	        var _this = _super.call(this) || this;
	        _this.scheduler = scheduler;
	        _this._events = [];
	        _this._infiniteTimeWindow = false;
	        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
	        _this._windowTime = windowTime < 1 ? 1 : windowTime;
	        if (windowTime === Number.POSITIVE_INFINITY) {
	            _this._infiniteTimeWindow = true;
	            _this.next = _this.nextInfiniteTimeWindow;
	        }
	        else {
	            _this.next = _this.nextTimeWindow;
	        }
	        return _this;
	    }
	    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
	        var _events = this._events;
	        _events.push(value);
	        if (_events.length > this._bufferSize) {
	            _events.shift();
	        }
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype.nextTimeWindow = function (value) {
	        this._events.push(new ReplayEvent(this._getNow(), value));
	        this._trimBufferThenGetEvents();
	        _super.prototype.next.call(this, value);
	    };
	    ReplaySubject.prototype._subscribe = function (subscriber) {
	        var _infiniteTimeWindow = this._infiniteTimeWindow;
	        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
	        var scheduler = this.scheduler;
	        var len = _events.length;
	        var subscription;
	        if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else if (this.isStopped || this.hasError) {
	            subscription = Subscription_1.Subscription.EMPTY;
	        }
	        else {
	            this.observers.push(subscriber);
	            subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
	        }
	        if (scheduler) {
	            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
	        }
	        if (_infiniteTimeWindow) {
	            for (var i = 0; i < len && !subscriber.closed; i++) {
	                subscriber.next(_events[i]);
	            }
	        }
	        else {
	            for (var i = 0; i < len && !subscriber.closed; i++) {
	                subscriber.next(_events[i].value);
	            }
	        }
	        if (this.hasError) {
	            subscriber.error(this.thrownError);
	        }
	        else if (this.isStopped) {
	            subscriber.complete();
	        }
	        return subscription;
	    };
	    ReplaySubject.prototype._getNow = function () {
	        return (this.scheduler || queue_1.queue).now();
	    };
	    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
	        var now = this._getNow();
	        var _bufferSize = this._bufferSize;
	        var _windowTime = this._windowTime;
	        var _events = this._events;
	        var eventsCount = _events.length;
	        var spliceCount = 0;
	        while (spliceCount < eventsCount) {
	            if ((now - _events[spliceCount].time) < _windowTime) {
	                break;
	            }
	            spliceCount++;
	        }
	        if (eventsCount > _bufferSize) {
	            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
	        }
	        if (spliceCount > 0) {
	            _events.splice(0, spliceCount);
	        }
	        return _events;
	    };
	    return ReplaySubject;
	}(Subject_1.Subject));
	exports.ReplaySubject = ReplaySubject;
	var ReplayEvent = (function () {
	    function ReplayEvent(time, value) {
	        this.time = time;
	        this.value = value;
	    }
	    return ReplayEvent;
	}());
	//# sourceMappingURL=ReplaySubject.js.map

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var isScheduler_1 = __webpack_require__(16);
	var isArray_1 = __webpack_require__(8);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	var fromArray_1 = __webpack_require__(37);
	var NONE = {};
	function combineLatest() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var resultSelector = null;
	    var scheduler = null;
	    if (isScheduler_1.isScheduler(observables[observables.length - 1])) {
	        scheduler = observables.pop();
	    }
	    if (typeof observables[observables.length - 1] === 'function') {
	        resultSelector = observables.pop();
	    }
	    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
	        observables = observables[0];
	    }
	    return fromArray_1.fromArray(observables, scheduler).lift(new CombineLatestOperator(resultSelector));
	}
	exports.combineLatest = combineLatest;
	var CombineLatestOperator = (function () {
	    function CombineLatestOperator(resultSelector) {
	        this.resultSelector = resultSelector;
	    }
	    CombineLatestOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new CombineLatestSubscriber(subscriber, this.resultSelector));
	    };
	    return CombineLatestOperator;
	}());
	exports.CombineLatestOperator = CombineLatestOperator;
	var CombineLatestSubscriber = (function (_super) {
	    __extends(CombineLatestSubscriber, _super);
	    function CombineLatestSubscriber(destination, resultSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.resultSelector = resultSelector;
	        _this.active = 0;
	        _this.values = [];
	        _this.observables = [];
	        return _this;
	    }
	    CombineLatestSubscriber.prototype._next = function (observable) {
	        this.values.push(NONE);
	        this.observables.push(observable);
	    };
	    CombineLatestSubscriber.prototype._complete = function () {
	        var observables = this.observables;
	        var len = observables.length;
	        if (len === 0) {
	            this.destination.complete();
	        }
	        else {
	            this.active = len;
	            this.toRespond = len;
	            for (var i = 0; i < len; i++) {
	                var observable = observables[i];
	                this.add(subscribeToResult_1.subscribeToResult(this, observable, observable, i));
	            }
	        }
	    };
	    CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
	        if ((this.active -= 1) === 0) {
	            this.destination.complete();
	        }
	    };
	    CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var values = this.values;
	        var oldVal = values[outerIndex];
	        var toRespond = !this.toRespond
	            ? 0
	            : oldVal === NONE ? --this.toRespond : this.toRespond;
	        values[outerIndex] = innerValue;
	        if (toRespond === 0) {
	            if (this.resultSelector) {
	                this._tryResultSelector(values);
	            }
	            else {
	                this.destination.next(values.slice());
	            }
	        }
	    };
	    CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
	        var result;
	        try {
	            result = this.resultSelector.apply(this, values);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return CombineLatestSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.CombineLatestSubscriber = CombineLatestSubscriber;
	//# sourceMappingURL=combineLatest.js.map

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var from_1 = __webpack_require__(15);
	var empty_1 = __webpack_require__(14);
	function defer(observableFactory) {
	    return new Observable_1.Observable(function (subscriber) {
	        var input;
	        try {
	            input = observableFactory();
	        }
	        catch (err) {
	            subscriber.error(err);
	            return undefined;
	        }
	        var source = input ? from_1.from(input) : empty_1.empty();
	        return source.subscribe(subscriber);
	    });
	}
	exports.defer = defer;
	//# sourceMappingURL=defer.js.map

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	function throwError(error, scheduler) {
	    if (!scheduler) {
	        return new Observable_1.Observable(function (subscriber) { return subscriber.error(error); });
	    }
	    else {
	        return new Observable_1.Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
	    }
	}
	exports.throwError = throwError;
	function dispatch(_a) {
	    var error = _a.error, subscriber = _a.subscriber;
	    subscriber.error(error);
	}
	//# sourceMappingURL=throwError.js.map

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var fromArray_1 = __webpack_require__(37);
	var isArray_1 = __webpack_require__(8);
	var Subscriber_1 = __webpack_require__(1);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	var iterator_1 = __webpack_require__(42);
	function zip() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var resultSelector = observables[observables.length - 1];
	    if (typeof resultSelector === 'function') {
	        observables.pop();
	    }
	    return fromArray_1.fromArray(observables, undefined).lift(new ZipOperator(resultSelector));
	}
	exports.zip = zip;
	var ZipOperator = (function () {
	    function ZipOperator(resultSelector) {
	        this.resultSelector = resultSelector;
	    }
	    ZipOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
	    };
	    return ZipOperator;
	}());
	exports.ZipOperator = ZipOperator;
	var ZipSubscriber = (function (_super) {
	    __extends(ZipSubscriber, _super);
	    function ZipSubscriber(destination, resultSelector, values) {
	        if (values === void 0) { values = Object.create(null); }
	        var _this = _super.call(this, destination) || this;
	        _this.iterators = [];
	        _this.active = 0;
	        _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
	        _this.values = values;
	        return _this;
	    }
	    ZipSubscriber.prototype._next = function (value) {
	        var iterators = this.iterators;
	        if (isArray_1.isArray(value)) {
	            iterators.push(new StaticArrayIterator(value));
	        }
	        else if (typeof value[iterator_1.iterator] === 'function') {
	            iterators.push(new StaticIterator(value[iterator_1.iterator]()));
	        }
	        else {
	            iterators.push(new ZipBufferIterator(this.destination, this, value));
	        }
	    };
	    ZipSubscriber.prototype._complete = function () {
	        var iterators = this.iterators;
	        var len = iterators.length;
	        this.unsubscribe();
	        if (len === 0) {
	            this.destination.complete();
	            return;
	        }
	        this.active = len;
	        for (var i = 0; i < len; i++) {
	            var iterator = iterators[i];
	            if (iterator.stillUnsubscribed) {
	                var destination = this.destination;
	                destination.add(iterator.subscribe(iterator, i));
	            }
	            else {
	                this.active--;
	            }
	        }
	    };
	    ZipSubscriber.prototype.notifyInactive = function () {
	        this.active--;
	        if (this.active === 0) {
	            this.destination.complete();
	        }
	    };
	    ZipSubscriber.prototype.checkIterators = function () {
	        var iterators = this.iterators;
	        var len = iterators.length;
	        var destination = this.destination;
	        for (var i = 0; i < len; i++) {
	            var iterator = iterators[i];
	            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
	                return;
	            }
	        }
	        var shouldComplete = false;
	        var args = [];
	        for (var i = 0; i < len; i++) {
	            var iterator = iterators[i];
	            var result = iterator.next();
	            if (iterator.hasCompleted()) {
	                shouldComplete = true;
	            }
	            if (result.done) {
	                destination.complete();
	                return;
	            }
	            args.push(result.value);
	        }
	        if (this.resultSelector) {
	            this._tryresultSelector(args);
	        }
	        else {
	            destination.next(args);
	        }
	        if (shouldComplete) {
	            destination.complete();
	        }
	    };
	    ZipSubscriber.prototype._tryresultSelector = function (args) {
	        var result;
	        try {
	            result = this.resultSelector.apply(this, args);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return ZipSubscriber;
	}(Subscriber_1.Subscriber));
	exports.ZipSubscriber = ZipSubscriber;
	var StaticIterator = (function () {
	    function StaticIterator(iterator) {
	        this.iterator = iterator;
	        this.nextResult = iterator.next();
	    }
	    StaticIterator.prototype.hasValue = function () {
	        return true;
	    };
	    StaticIterator.prototype.next = function () {
	        var result = this.nextResult;
	        this.nextResult = this.iterator.next();
	        return result;
	    };
	    StaticIterator.prototype.hasCompleted = function () {
	        var nextResult = this.nextResult;
	        return nextResult && nextResult.done;
	    };
	    return StaticIterator;
	}());
	var StaticArrayIterator = (function () {
	    function StaticArrayIterator(array) {
	        this.array = array;
	        this.index = 0;
	        this.length = 0;
	        this.length = array.length;
	    }
	    StaticArrayIterator.prototype[iterator_1.iterator] = function () {
	        return this;
	    };
	    StaticArrayIterator.prototype.next = function (value) {
	        var i = this.index++;
	        var array = this.array;
	        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
	    };
	    StaticArrayIterator.prototype.hasValue = function () {
	        return this.array.length > this.index;
	    };
	    StaticArrayIterator.prototype.hasCompleted = function () {
	        return this.array.length === this.index;
	    };
	    return StaticArrayIterator;
	}());
	var ZipBufferIterator = (function (_super) {
	    __extends(ZipBufferIterator, _super);
	    function ZipBufferIterator(destination, parent, observable) {
	        var _this = _super.call(this, destination) || this;
	        _this.parent = parent;
	        _this.observable = observable;
	        _this.stillUnsubscribed = true;
	        _this.buffer = [];
	        _this.isComplete = false;
	        return _this;
	    }
	    ZipBufferIterator.prototype[iterator_1.iterator] = function () {
	        return this;
	    };
	    ZipBufferIterator.prototype.next = function () {
	        var buffer = this.buffer;
	        if (buffer.length === 0 && this.isComplete) {
	            return { value: null, done: true };
	        }
	        else {
	            return { value: buffer.shift(), done: false };
	        }
	    };
	    ZipBufferIterator.prototype.hasValue = function () {
	        return this.buffer.length > 0;
	    };
	    ZipBufferIterator.prototype.hasCompleted = function () {
	        return this.buffer.length === 0 && this.isComplete;
	    };
	    ZipBufferIterator.prototype.notifyComplete = function () {
	        if (this.buffer.length > 0) {
	            this.isComplete = true;
	            this.parent.notifyInactive();
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.buffer.push(innerValue);
	        this.parent.checkIterators();
	    };
	    ZipBufferIterator.prototype.subscribe = function (value, index) {
	        return subscribeToResult_1.subscribeToResult(this, this.observable, this, index);
	    };
	    return ZipBufferIterator;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=zip.js.map

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var mergeMap_1 = __webpack_require__(39);
	var identity_1 = __webpack_require__(31);
	function mergeAll(concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    return mergeMap_1.mergeMap(identity_1.identity, concurrent);
	}
	exports.mergeAll = mergeAll;
	//# sourceMappingURL=mergeAll.js.map

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function refCount() {
	    return function refCountOperatorFunction(source) {
	        return source.lift(new RefCountOperator(source));
	    };
	}
	exports.refCount = refCount;
	var RefCountOperator = (function () {
	    function RefCountOperator(connectable) {
	        this.connectable = connectable;
	    }
	    RefCountOperator.prototype.call = function (subscriber, source) {
	        var connectable = this.connectable;
	        connectable._refCount++;
	        var refCounter = new RefCountSubscriber(subscriber, connectable);
	        var subscription = source.subscribe(refCounter);
	        if (!refCounter.closed) {
	            refCounter.connection = connectable.connect();
	        }
	        return subscription;
	    };
	    return RefCountOperator;
	}());
	var RefCountSubscriber = (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (!connectable) {
	            this.connection = null;
	            return;
	        }
	        this.connectable = null;
	        var refCount = connectable._refCount;
	        if (refCount <= 0) {
	            this.connection = null;
	            return;
	        }
	        connectable._refCount = refCount - 1;
	        if (refCount > 1) {
	            this.connection = null;
	            return;
	        }
	        var connection = this.connection;
	        var sharedConnection = connectable._connection;
	        this.connection = null;
	        if (sharedConnection && (!connection || sharedConnection === connection)) {
	            sharedConnection.unsubscribe();
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=refCount.js.map

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function scan(accumulator, seed) {
	    var hasSeed = false;
	    if (arguments.length >= 2) {
	        hasSeed = true;
	    }
	    return function scanOperatorFunction(source) {
	        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
	    };
	}
	exports.scan = scan;
	var ScanOperator = (function () {
	    function ScanOperator(accumulator, seed, hasSeed) {
	        if (hasSeed === void 0) { hasSeed = false; }
	        this.accumulator = accumulator;
	        this.seed = seed;
	        this.hasSeed = hasSeed;
	    }
	    ScanOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
	    };
	    return ScanOperator;
	}());
	var ScanSubscriber = (function (_super) {
	    __extends(ScanSubscriber, _super);
	    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
	        var _this = _super.call(this, destination) || this;
	        _this.accumulator = accumulator;
	        _this._seed = _seed;
	        _this.hasSeed = hasSeed;
	        _this.index = 0;
	        return _this;
	    }
	    Object.defineProperty(ScanSubscriber.prototype, "seed", {
	        get: function () {
	            return this._seed;
	        },
	        set: function (value) {
	            this.hasSeed = true;
	            this._seed = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ScanSubscriber.prototype._next = function (value) {
	        if (!this.hasSeed) {
	            this.seed = value;
	            this.destination.next(value);
	        }
	        else {
	            return this._tryNext(value);
	        }
	    };
	    ScanSubscriber.prototype._tryNext = function (value) {
	        var index = this.index++;
	        var result;
	        try {
	            result = this.accumulator(this.seed, value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	        this.seed = result;
	        this.destination.next(result);
	    };
	    return ScanSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=scan.js.map

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	var subscribeToResult_1 = __webpack_require__(4);
	var map_1 = __webpack_require__(10);
	var from_1 = __webpack_require__(15);
	function switchMap(project, resultSelector) {
	    if (typeof resultSelector === 'function') {
	        return function (source) { return source.pipe(switchMap(function (a, i) { return from_1.from(project(a, i)).pipe(map_1.map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
	    }
	    return function (source) { return source.lift(new SwitchMapOperator(project)); };
	}
	exports.switchMap = switchMap;
	var SwitchMapOperator = (function () {
	    function SwitchMapOperator(project) {
	        this.project = project;
	    }
	    SwitchMapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
	    };
	    return SwitchMapOperator;
	}());
	var SwitchMapSubscriber = (function (_super) {
	    __extends(SwitchMapSubscriber, _super);
	    function SwitchMapSubscriber(destination, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.index = 0;
	        return _this;
	    }
	    SwitchMapSubscriber.prototype._next = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (error) {
	            this.destination.error(error);
	            return;
	        }
	        this._innerSub(result, value, index);
	    };
	    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
	        var innerSubscription = this.innerSubscription;
	        if (innerSubscription) {
	            innerSubscription.unsubscribe();
	        }
	        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index, innerSubscriber);
	    };
	    SwitchMapSubscriber.prototype._complete = function () {
	        var innerSubscription = this.innerSubscription;
	        if (!innerSubscription || innerSubscription.closed) {
	            _super.prototype._complete.call(this);
	        }
	        this.unsubscribe();
	    };
	    SwitchMapSubscriber.prototype._unsubscribe = function () {
	        this.innerSubscription = null;
	    };
	    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var destination = this.destination;
	        destination.remove(innerSub);
	        this.innerSubscription = null;
	        if (this.isStopped) {
	            _super.prototype._complete.call(this);
	        }
	    };
	    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    return SwitchMapSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=switchMap.js.map

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var ArgumentOutOfRangeError_1 = __webpack_require__(43);
	var empty_1 = __webpack_require__(14);
	function take(count) {
	    return function (source) {
	        if (count === 0) {
	            return empty_1.empty();
	        }
	        else {
	            return source.lift(new TakeOperator(count));
	        }
	    };
	}
	exports.take = take;
	var TakeOperator = (function () {
	    function TakeOperator(total) {
	        this.total = total;
	        if (this.total < 0) {
	            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
	        }
	    }
	    TakeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new TakeSubscriber(subscriber, this.total));
	    };
	    return TakeOperator;
	}());
	var TakeSubscriber = (function (_super) {
	    __extends(TakeSubscriber, _super);
	    function TakeSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.count = 0;
	        return _this;
	    }
	    TakeSubscriber.prototype._next = function (value) {
	        var total = this.total;
	        var count = ++this.count;
	        if (count <= total) {
	            this.destination.next(value);
	            if (count === total) {
	                this.destination.complete();
	                this.unsubscribe();
	            }
	        }
	    };
	    return TakeSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=take.js.map

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var ArgumentOutOfRangeError_1 = __webpack_require__(43);
	var empty_1 = __webpack_require__(14);
	function takeLast(count) {
	    return function takeLastOperatorFunction(source) {
	        if (count === 0) {
	            return empty_1.empty();
	        }
	        else {
	            return source.lift(new TakeLastOperator(count));
	        }
	    };
	}
	exports.takeLast = takeLast;
	var TakeLastOperator = (function () {
	    function TakeLastOperator(total) {
	        this.total = total;
	        if (this.total < 0) {
	            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
	        }
	    }
	    TakeLastOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
	    };
	    return TakeLastOperator;
	}());
	var TakeLastSubscriber = (function (_super) {
	    __extends(TakeLastSubscriber, _super);
	    function TakeLastSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.ring = new Array();
	        _this.count = 0;
	        return _this;
	    }
	    TakeLastSubscriber.prototype._next = function (value) {
	        var ring = this.ring;
	        var total = this.total;
	        var count = this.count++;
	        if (ring.length < total) {
	            ring.push(value);
	        }
	        else {
	            var index = count % total;
	            ring[index] = value;
	        }
	    };
	    TakeLastSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        var count = this.count;
	        if (count > 0) {
	            var total = this.count >= this.total ? this.total : this.count;
	            var ring = this.ring;
	            for (var i = 0; i < total; i++) {
	                var idx = (count++) % total;
	                destination.next(ring[idx]);
	            }
	        }
	        destination.complete();
	    };
	    return TakeLastSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=takeLast.js.map

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var Subscription_1 = __webpack_require__(5);
	function scheduleArray(input, scheduler) {
	    return new Observable_1.Observable(function (subscriber) {
	        var sub = new Subscription_1.Subscription();
	        var i = 0;
	        sub.add(scheduler.schedule(function () {
	            if (i === input.length) {
	                subscriber.complete();
	                return;
	            }
	            subscriber.next(input[i++]);
	            if (!subscriber.closed) {
	                sub.add(this.schedule());
	            }
	        }));
	        return sub;
	    });
	}
	exports.scheduleArray = scheduleArray;
	//# sourceMappingURL=scheduleArray.js.map

/***/ },
/* 96 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.rxSubscriber = typeof Symbol === 'function'
	    ? Symbol('rxSubscriber')
	    : '@@rxSubscriber_' + Math.random();
	exports.$$rxSubscriber = exports.rxSubscriber;
	//# sourceMappingURL=rxSubscriber.js.map

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function canReportError(observer) {
	    while (observer) {
	        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
	        if (closed_1 || isStopped) {
	            return false;
	        }
	        else if (destination && destination instanceof Subscriber_1.Subscriber) {
	            observer = destination;
	        }
	        else {
	            observer = null;
	        }
	    }
	    return true;
	}
	exports.canReportError = canReportError;
	//# sourceMappingURL=canReportError.js.map

/***/ },
/* 98 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function hostReportError(err) {
	    setTimeout(function () { throw err; }, 0);
	}
	exports.hostReportError = hostReportError;
	//# sourceMappingURL=hostReportError.js.map

/***/ },
/* 99 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function isObject(x) {
	    return x !== null && typeof x === 'object';
	}
	exports.isObject = isObject;
	//# sourceMappingURL=isObject.js.map

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var noop_1 = __webpack_require__(66);
	function pipe() {
	    var fns = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        fns[_i] = arguments[_i];
	    }
	    return pipeFromArray(fns);
	}
	exports.pipe = pipe;
	function pipeFromArray(fns) {
	    if (!fns) {
	        return noop_1.noop;
	    }
	    if (fns.length === 1) {
	        return fns[0];
	    }
	    return function piped(input) {
	        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
	    };
	}
	exports.pipeFromArray = pipeFromArray;
	//# sourceMappingURL=pipe.js.map

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var subscribeToArray_1 = __webpack_require__(164);
	var subscribeToPromise_1 = __webpack_require__(362);
	var subscribeToIterable_1 = __webpack_require__(360);
	var subscribeToObservable_1 = __webpack_require__(361);
	var isArrayLike_1 = __webpack_require__(160);
	var isPromise_1 = __webpack_require__(162);
	var isObject_1 = __webpack_require__(99);
	var iterator_1 = __webpack_require__(42);
	var observable_1 = __webpack_require__(30);
	exports.subscribeTo = function (result) {
	    if (!!result && typeof result[observable_1.observable] === 'function') {
	        return subscribeToObservable_1.subscribeToObservable(result);
	    }
	    else if (isArrayLike_1.isArrayLike(result)) {
	        return subscribeToArray_1.subscribeToArray(result);
	    }
	    else if (isPromise_1.isPromise(result)) {
	        return subscribeToPromise_1.subscribeToPromise(result);
	    }
	    else if (!!result && typeof result[iterator_1.iterator] === 'function') {
	        return subscribeToIterable_1.subscribeToIterable(result);
	    }
	    else {
	        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
	        var msg = "You provided " + value + " where a stream was expected."
	            + ' You can provide an Observable, Promise, Array, or Iterable.';
	        throw new TypeError(msg);
	    }
	};
	//# sourceMappingURL=subscribeTo.js.map

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var audit_1 = __webpack_require__(146);
	exports.audit = audit_1.audit;
	var auditTime_1 = __webpack_require__(263);
	exports.auditTime = auditTime_1.auditTime;
	var buffer_1 = __webpack_require__(264);
	exports.buffer = buffer_1.buffer;
	var bufferCount_1 = __webpack_require__(265);
	exports.bufferCount = bufferCount_1.bufferCount;
	var bufferTime_1 = __webpack_require__(266);
	exports.bufferTime = bufferTime_1.bufferTime;
	var bufferToggle_1 = __webpack_require__(267);
	exports.bufferToggle = bufferToggle_1.bufferToggle;
	var bufferWhen_1 = __webpack_require__(268);
	exports.bufferWhen = bufferWhen_1.bufferWhen;
	var catchError_1 = __webpack_require__(269);
	exports.catchError = catchError_1.catchError;
	var combineAll_1 = __webpack_require__(270);
	exports.combineAll = combineAll_1.combineAll;
	var combineLatest_1 = __webpack_require__(271);
	exports.combineLatest = combineLatest_1.combineLatest;
	var concat_1 = __webpack_require__(272);
	exports.concat = concat_1.concat;
	var concatAll_1 = __webpack_require__(147);
	exports.concatAll = concatAll_1.concatAll;
	var concatMap_1 = __webpack_require__(148);
	exports.concatMap = concatMap_1.concatMap;
	var concatMapTo_1 = __webpack_require__(273);
	exports.concatMapTo = concatMapTo_1.concatMapTo;
	var count_1 = __webpack_require__(274);
	exports.count = count_1.count;
	var debounce_1 = __webpack_require__(275);
	exports.debounce = debounce_1.debounce;
	var debounceTime_1 = __webpack_require__(276);
	exports.debounceTime = debounceTime_1.debounceTime;
	var defaultIfEmpty_1 = __webpack_require__(38);
	exports.defaultIfEmpty = defaultIfEmpty_1.defaultIfEmpty;
	var delay_1 = __webpack_require__(277);
	exports.delay = delay_1.delay;
	var delayWhen_1 = __webpack_require__(278);
	exports.delayWhen = delayWhen_1.delayWhen;
	var dematerialize_1 = __webpack_require__(279);
	exports.dematerialize = dematerialize_1.dematerialize;
	var distinct_1 = __webpack_require__(280);
	exports.distinct = distinct_1.distinct;
	var distinctUntilChanged_1 = __webpack_require__(149);
	exports.distinctUntilChanged = distinctUntilChanged_1.distinctUntilChanged;
	var distinctUntilKeyChanged_1 = __webpack_require__(281);
	exports.distinctUntilKeyChanged = distinctUntilKeyChanged_1.distinctUntilKeyChanged;
	var elementAt_1 = __webpack_require__(282);
	exports.elementAt = elementAt_1.elementAt;
	var endWith_1 = __webpack_require__(283);
	exports.endWith = endWith_1.endWith;
	var every_1 = __webpack_require__(284);
	exports.every = every_1.every;
	var exhaust_1 = __webpack_require__(285);
	exports.exhaust = exhaust_1.exhaust;
	var exhaustMap_1 = __webpack_require__(286);
	exports.exhaustMap = exhaustMap_1.exhaustMap;
	var expand_1 = __webpack_require__(287);
	exports.expand = expand_1.expand;
	var filter_1 = __webpack_require__(28);
	exports.filter = filter_1.filter;
	var finalize_1 = __webpack_require__(288);
	exports.finalize = finalize_1.finalize;
	var find_1 = __webpack_require__(150);
	exports.find = find_1.find;
	var findIndex_1 = __webpack_require__(289);
	exports.findIndex = findIndex_1.findIndex;
	var first_1 = __webpack_require__(290);
	exports.first = first_1.first;
	var groupBy_1 = __webpack_require__(151);
	exports.groupBy = groupBy_1.groupBy;
	var ignoreElements_1 = __webpack_require__(291);
	exports.ignoreElements = ignoreElements_1.ignoreElements;
	var isEmpty_1 = __webpack_require__(292);
	exports.isEmpty = isEmpty_1.isEmpty;
	var last_1 = __webpack_require__(293);
	exports.last = last_1.last;
	var map_1 = __webpack_require__(10);
	exports.map = map_1.map;
	var mapTo_1 = __webpack_require__(294);
	exports.mapTo = mapTo_1.mapTo;
	var materialize_1 = __webpack_require__(295);
	exports.materialize = materialize_1.materialize;
	var max_1 = __webpack_require__(296);
	exports.max = max_1.max;
	var merge_1 = __webpack_require__(297);
	exports.merge = merge_1.merge;
	var mergeAll_1 = __webpack_require__(89);
	exports.mergeAll = mergeAll_1.mergeAll;
	var mergeMap_1 = __webpack_require__(39);
	exports.mergeMap = mergeMap_1.mergeMap;
	var mergeMap_2 = __webpack_require__(39);
	exports.flatMap = mergeMap_2.mergeMap;
	var mergeMapTo_1 = __webpack_require__(298);
	exports.mergeMapTo = mergeMapTo_1.mergeMapTo;
	var mergeScan_1 = __webpack_require__(299);
	exports.mergeScan = mergeScan_1.mergeScan;
	var min_1 = __webpack_require__(300);
	exports.min = min_1.min;
	var multicast_1 = __webpack_require__(29);
	exports.multicast = multicast_1.multicast;
	var observeOn_1 = __webpack_require__(152);
	exports.observeOn = observeOn_1.observeOn;
	var onErrorResumeNext_1 = __webpack_require__(301);
	exports.onErrorResumeNext = onErrorResumeNext_1.onErrorResumeNext;
	var pairwise_1 = __webpack_require__(302);
	exports.pairwise = pairwise_1.pairwise;
	var partition_1 = __webpack_require__(303);
	exports.partition = partition_1.partition;
	var pluck_1 = __webpack_require__(304);
	exports.pluck = pluck_1.pluck;
	var publish_1 = __webpack_require__(305);
	exports.publish = publish_1.publish;
	var publishBehavior_1 = __webpack_require__(306);
	exports.publishBehavior = publishBehavior_1.publishBehavior;
	var publishLast_1 = __webpack_require__(307);
	exports.publishLast = publishLast_1.publishLast;
	var publishReplay_1 = __webpack_require__(308);
	exports.publishReplay = publishReplay_1.publishReplay;
	var race_1 = __webpack_require__(309);
	exports.race = race_1.race;
	var reduce_1 = __webpack_require__(62);
	exports.reduce = reduce_1.reduce;
	var repeat_1 = __webpack_require__(310);
	exports.repeat = repeat_1.repeat;
	var repeatWhen_1 = __webpack_require__(311);
	exports.repeatWhen = repeatWhen_1.repeatWhen;
	var retry_1 = __webpack_require__(312);
	exports.retry = retry_1.retry;
	var retryWhen_1 = __webpack_require__(313);
	exports.retryWhen = retryWhen_1.retryWhen;
	var refCount_1 = __webpack_require__(90);
	exports.refCount = refCount_1.refCount;
	var sample_1 = __webpack_require__(314);
	exports.sample = sample_1.sample;
	var sampleTime_1 = __webpack_require__(315);
	exports.sampleTime = sampleTime_1.sampleTime;
	var scan_1 = __webpack_require__(91);
	exports.scan = scan_1.scan;
	var sequenceEqual_1 = __webpack_require__(316);
	exports.sequenceEqual = sequenceEqual_1.sequenceEqual;
	var share_1 = __webpack_require__(317);
	exports.share = share_1.share;
	var shareReplay_1 = __webpack_require__(318);
	exports.shareReplay = shareReplay_1.shareReplay;
	var single_1 = __webpack_require__(319);
	exports.single = single_1.single;
	var skip_1 = __webpack_require__(320);
	exports.skip = skip_1.skip;
	var skipLast_1 = __webpack_require__(321);
	exports.skipLast = skipLast_1.skipLast;
	var skipUntil_1 = __webpack_require__(322);
	exports.skipUntil = skipUntil_1.skipUntil;
	var skipWhile_1 = __webpack_require__(323);
	exports.skipWhile = skipWhile_1.skipWhile;
	var startWith_1 = __webpack_require__(324);
	exports.startWith = startWith_1.startWith;
	var subscribeOn_1 = __webpack_require__(325);
	exports.subscribeOn = subscribeOn_1.subscribeOn;
	var switchAll_1 = __webpack_require__(326);
	exports.switchAll = switchAll_1.switchAll;
	var switchMap_1 = __webpack_require__(92);
	exports.switchMap = switchMap_1.switchMap;
	var switchMapTo_1 = __webpack_require__(327);
	exports.switchMapTo = switchMapTo_1.switchMapTo;
	var take_1 = __webpack_require__(93);
	exports.take = take_1.take;
	var takeLast_1 = __webpack_require__(94);
	exports.takeLast = takeLast_1.takeLast;
	var takeUntil_1 = __webpack_require__(328);
	exports.takeUntil = takeUntil_1.takeUntil;
	var takeWhile_1 = __webpack_require__(329);
	exports.takeWhile = takeWhile_1.takeWhile;
	var tap_1 = __webpack_require__(330);
	exports.tap = tap_1.tap;
	var throttle_1 = __webpack_require__(153);
	exports.throttle = throttle_1.throttle;
	var throttleTime_1 = __webpack_require__(331);
	exports.throttleTime = throttleTime_1.throttleTime;
	var throwIfEmpty_1 = __webpack_require__(63);
	exports.throwIfEmpty = throwIfEmpty_1.throwIfEmpty;
	var timeInterval_1 = __webpack_require__(332);
	exports.timeInterval = timeInterval_1.timeInterval;
	var timeout_1 = __webpack_require__(333);
	exports.timeout = timeout_1.timeout;
	var timeoutWith_1 = __webpack_require__(154);
	exports.timeoutWith = timeoutWith_1.timeoutWith;
	var timestamp_1 = __webpack_require__(334);
	exports.timestamp = timestamp_1.timestamp;
	var toArray_1 = __webpack_require__(335);
	exports.toArray = toArray_1.toArray;
	var window_1 = __webpack_require__(336);
	exports.window = window_1.window;
	var windowCount_1 = __webpack_require__(337);
	exports.windowCount = windowCount_1.windowCount;
	var windowTime_1 = __webpack_require__(338);
	exports.windowTime = windowTime_1.windowTime;
	var windowToggle_1 = __webpack_require__(339);
	exports.windowToggle = windowToggle_1.windowToggle;
	var windowWhen_1 = __webpack_require__(340);
	exports.windowWhen = windowWhen_1.windowWhen;
	var withLatestFrom_1 = __webpack_require__(341);
	exports.withLatestFrom = withLatestFrom_1.withLatestFrom;
	var zip_1 = __webpack_require__(342);
	exports.zip = zip_1.zip;
	var zipAll_1 = __webpack_require__(343);
	exports.zipAll = zipAll_1.zipAll;
	//# sourceMappingURL=index.js.map

/***/ },
/* 103 */
/***/ function(module, exports) {

	function _interopRequireWildcard(obj) {
	  if (obj && obj.__esModule) {
	    return obj;
	  } else {
	    var newObj = {};

	    if (obj != null) {
	      for (var key in obj) {
	        if (Object.prototype.hasOwnProperty.call(obj, key)) {
	          var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};

	          if (desc.get || desc.set) {
	            Object.defineProperty(newObj, key, desc);
	          } else {
	            newObj[key] = obj[key];
	          }
	        }
	      }
	    }

	    newObj["default"] = obj;
	    return newObj;
	  }
	}

	module.exports = _interopRequireWildcard;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(186), __esModule: true };

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(171);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(69);
	var TAG = __webpack_require__(11)('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(189);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(34);
	var document = __webpack_require__(18).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(17) && !__webpack_require__(33)(function () {
	  return Object.defineProperty(__webpack_require__(108)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(69);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(48);
	var $export = __webpack_require__(32);
	var redefine = __webpack_require__(115);
	var hide = __webpack_require__(24);
	var Iterators = __webpack_require__(25);
	var $iterCreate = __webpack_require__(198);
	var setToStringTag = __webpack_require__(73);
	var getPrototypeOf = __webpack_require__(206);
	var ITERATOR = __webpack_require__(11)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(23);
	var dPs = __webpack_require__(203);
	var enumBugKeys = __webpack_require__(71);
	var IE_PROTO = __webpack_require__(74)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(108)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(194).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(114);
	var hiddenKeys = __webpack_require__(71).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var has = __webpack_require__(22);
	var toIObject = __webpack_require__(26);
	var arrayIndexOf = __webpack_require__(191)(false);
	var IE_PROTO = __webpack_require__(74)('IE_PROTO');

	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(24);


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(76);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var classof = __webpack_require__(106);
	var ITERATOR = __webpack_require__(11)('iterator');
	var Iterators = __webpack_require__(25);
	module.exports = __webpack_require__(13).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.Immutable = {})));
	}(this, (function (exports) { 'use strict';

	  // Used for setting prototype methods that IE8 chokes on.
	  var DELETE = 'delete';

	  // Constants describing the size of trie nodes.
	  var SHIFT = 5; // Resulted in best performance after ______?
	  var SIZE = 1 << SHIFT;
	  var MASK = SIZE - 1;

	  // A consistent shared value representing "not set" which equals nothing other
	  // than itself, and nothing that could be provided externally.
	  var NOT_SET = {};

	  // Boolean references, Rough equivalent of `bool &`.
	  function MakeRef() {
	    return { value: false };
	  }

	  function SetRef(ref) {
	    if (ref) {
	      ref.value = true;
	    }
	  }

	  // A function which returns a value representing an "owner" for transient writes
	  // to tries. The return value will only ever equal itself, and will not equal
	  // the return of any subsequent call of this function.
	  function OwnerID() {}

	  function ensureSize(iter) {
	    if (iter.size === undefined) {
	      iter.size = iter.__iterate(returnTrue);
	    }
	    return iter.size;
	  }

	  function wrapIndex(iter, index) {
	    // This implements "is array index" which the ECMAString spec defines as:
	    //
	    //     A String property name P is an array index if and only if
	    //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
	    //     to 2^32−1.
	    //
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
	    if (typeof index !== 'number') {
	      var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
	      if ('' + uint32Index !== index || uint32Index === 4294967295) {
	        return NaN;
	      }
	      index = uint32Index;
	    }
	    return index < 0 ? ensureSize(iter) + index : index;
	  }

	  function returnTrue() {
	    return true;
	  }

	  function wholeSlice(begin, end, size) {
	    return (
	      ((begin === 0 && !isNeg(begin)) ||
	        (size !== undefined && begin <= -size)) &&
	      (end === undefined || (size !== undefined && end >= size))
	    );
	  }

	  function resolveBegin(begin, size) {
	    return resolveIndex(begin, size, 0);
	  }

	  function resolveEnd(end, size) {
	    return resolveIndex(end, size, size);
	  }

	  function resolveIndex(index, size, defaultIndex) {
	    // Sanitize indices using this shorthand for ToInt32(argument)
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	    return index === undefined
	      ? defaultIndex
	      : isNeg(index)
	        ? size === Infinity
	          ? size
	          : Math.max(0, size + index) | 0
	        : size === undefined || size === index
	          ? index
	          : Math.min(size, index) | 0;
	  }

	  function isNeg(value) {
	    // Account for -0 which is negative, but not less than 0.
	    return value < 0 || (value === 0 && 1 / value === -Infinity);
	  }

	  // Note: value is unchanged to not break immutable-devtools.
	  var IS_COLLECTION_SYMBOL = '@@__IMMUTABLE_ITERABLE__@@';

	  function isCollection(maybeCollection) {
	    return Boolean(maybeCollection && maybeCollection[IS_COLLECTION_SYMBOL]);
	  }

	  var IS_KEYED_SYMBOL = '@@__IMMUTABLE_KEYED__@@';

	  function isKeyed(maybeKeyed) {
	    return Boolean(maybeKeyed && maybeKeyed[IS_KEYED_SYMBOL]);
	  }

	  var IS_INDEXED_SYMBOL = '@@__IMMUTABLE_INDEXED__@@';

	  function isIndexed(maybeIndexed) {
	    return Boolean(maybeIndexed && maybeIndexed[IS_INDEXED_SYMBOL]);
	  }

	  function isAssociative(maybeAssociative) {
	    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
	  }

	  var Collection = function Collection(value) {
	    return isCollection(value) ? value : Seq(value);
	  };

	  var KeyedCollection = /*@__PURE__*/(function (Collection) {
	    function KeyedCollection(value) {
	      return isKeyed(value) ? value : KeyedSeq(value);
	    }

	    if ( Collection ) KeyedCollection.__proto__ = Collection;
	    KeyedCollection.prototype = Object.create( Collection && Collection.prototype );
	    KeyedCollection.prototype.constructor = KeyedCollection;

	    return KeyedCollection;
	  }(Collection));

	  var IndexedCollection = /*@__PURE__*/(function (Collection) {
	    function IndexedCollection(value) {
	      return isIndexed(value) ? value : IndexedSeq(value);
	    }

	    if ( Collection ) IndexedCollection.__proto__ = Collection;
	    IndexedCollection.prototype = Object.create( Collection && Collection.prototype );
	    IndexedCollection.prototype.constructor = IndexedCollection;

	    return IndexedCollection;
	  }(Collection));

	  var SetCollection = /*@__PURE__*/(function (Collection) {
	    function SetCollection(value) {
	      return isCollection(value) && !isAssociative(value) ? value : SetSeq(value);
	    }

	    if ( Collection ) SetCollection.__proto__ = Collection;
	    SetCollection.prototype = Object.create( Collection && Collection.prototype );
	    SetCollection.prototype.constructor = SetCollection;

	    return SetCollection;
	  }(Collection));

	  Collection.Keyed = KeyedCollection;
	  Collection.Indexed = IndexedCollection;
	  Collection.Set = SetCollection;

	  var IS_SEQ_SYMBOL = '@@__IMMUTABLE_SEQ__@@';

	  function isSeq(maybeSeq) {
	    return Boolean(maybeSeq && maybeSeq[IS_SEQ_SYMBOL]);
	  }

	  var IS_RECORD_SYMBOL = '@@__IMMUTABLE_RECORD__@@';

	  function isRecord(maybeRecord) {
	    return Boolean(maybeRecord && maybeRecord[IS_RECORD_SYMBOL]);
	  }

	  function isImmutable(maybeImmutable) {
	    return isCollection(maybeImmutable) || isRecord(maybeImmutable);
	  }

	  var IS_ORDERED_SYMBOL = '@@__IMMUTABLE_ORDERED__@@';

	  function isOrdered(maybeOrdered) {
	    return Boolean(maybeOrdered && maybeOrdered[IS_ORDERED_SYMBOL]);
	  }

	  var ITERATE_KEYS = 0;
	  var ITERATE_VALUES = 1;
	  var ITERATE_ENTRIES = 2;

	  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator';

	  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

	  var Iterator = function Iterator(next) {
	    this.next = next;
	  };

	  Iterator.prototype.toString = function toString () {
	    return '[Iterator]';
	  };

	  Iterator.KEYS = ITERATE_KEYS;
	  Iterator.VALUES = ITERATE_VALUES;
	  Iterator.ENTRIES = ITERATE_ENTRIES;

	  Iterator.prototype.inspect = Iterator.prototype.toSource = function() {
	    return this.toString();
	  };
	  Iterator.prototype[ITERATOR_SYMBOL] = function() {
	    return this;
	  };

	  function iteratorValue(type, k, v, iteratorResult) {
	    var value = type === 0 ? k : type === 1 ? v : [k, v];
	    iteratorResult
	      ? (iteratorResult.value = value)
	      : (iteratorResult = {
	          value: value,
	          done: false,
	        });
	    return iteratorResult;
	  }

	  function iteratorDone() {
	    return { value: undefined, done: true };
	  }

	  function hasIterator(maybeIterable) {
	    return !!getIteratorFn(maybeIterable);
	  }

	  function isIterator(maybeIterator) {
	    return maybeIterator && typeof maybeIterator.next === 'function';
	  }

	  function getIterator(iterable) {
	    var iteratorFn = getIteratorFn(iterable);
	    return iteratorFn && iteratorFn.call(iterable);
	  }

	  function getIteratorFn(iterable) {
	    var iteratorFn =
	      iterable &&
	      ((REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
	        iterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  var hasOwnProperty = Object.prototype.hasOwnProperty;

	  function isArrayLike(value) {
	    if (Array.isArray(value) || typeof value === 'string') {
	      return true;
	    }

	    return (
	      value &&
	      typeof value === 'object' &&
	      Number.isInteger(value.length) &&
	      value.length >= 0 &&
	      (value.length === 0
	        ? // Only {length: 0} is considered Array-like.
	          Object.keys(value).length === 1
	        : // An object is only Array-like if it has a property where the last value
	          // in the array-like may be found (which could be undefined).
	          value.hasOwnProperty(value.length - 1))
	    );
	  }

	  var Seq = /*@__PURE__*/(function (Collection$$1) {
	    function Seq(value) {
	      return value === null || value === undefined
	        ? emptySequence()
	        : isImmutable(value)
	          ? value.toSeq()
	          : seqFromValue(value);
	    }

	    if ( Collection$$1 ) Seq.__proto__ = Collection$$1;
	    Seq.prototype = Object.create( Collection$$1 && Collection$$1.prototype );
	    Seq.prototype.constructor = Seq;

	    Seq.prototype.toSeq = function toSeq () {
	      return this;
	    };

	    Seq.prototype.toString = function toString () {
	      return this.__toString('Seq {', '}');
	    };

	    Seq.prototype.cacheResult = function cacheResult () {
	      if (!this._cache && this.__iterateUncached) {
	        this._cache = this.entrySeq().toArray();
	        this.size = this._cache.length;
	      }
	      return this;
	    };

	    // abstract __iterateUncached(fn, reverse)

	    Seq.prototype.__iterate = function __iterate (fn, reverse) {
	      var cache = this._cache;
	      if (cache) {
	        var size = cache.length;
	        var i = 0;
	        while (i !== size) {
	          var entry = cache[reverse ? size - ++i : i++];
	          if (fn(entry[1], entry[0], this) === false) {
	            break;
	          }
	        }
	        return i;
	      }
	      return this.__iterateUncached(fn, reverse);
	    };

	    // abstract __iteratorUncached(type, reverse)

	    Seq.prototype.__iterator = function __iterator (type, reverse) {
	      var cache = this._cache;
	      if (cache) {
	        var size = cache.length;
	        var i = 0;
	        return new Iterator(function () {
	          if (i === size) {
	            return iteratorDone();
	          }
	          var entry = cache[reverse ? size - ++i : i++];
	          return iteratorValue(type, entry[0], entry[1]);
	        });
	      }
	      return this.__iteratorUncached(type, reverse);
	    };

	    return Seq;
	  }(Collection));

	  var KeyedSeq = /*@__PURE__*/(function (Seq) {
	    function KeyedSeq(value) {
	      return value === null || value === undefined
	        ? emptySequence().toKeyedSeq()
	        : isCollection(value)
	          ? isKeyed(value)
	            ? value.toSeq()
	            : value.fromEntrySeq()
	          : isRecord(value)
	            ? value.toSeq()
	            : keyedSeqFromValue(value);
	    }

	    if ( Seq ) KeyedSeq.__proto__ = Seq;
	    KeyedSeq.prototype = Object.create( Seq && Seq.prototype );
	    KeyedSeq.prototype.constructor = KeyedSeq;

	    KeyedSeq.prototype.toKeyedSeq = function toKeyedSeq () {
	      return this;
	    };

	    return KeyedSeq;
	  }(Seq));

	  var IndexedSeq = /*@__PURE__*/(function (Seq) {
	    function IndexedSeq(value) {
	      return value === null || value === undefined
	        ? emptySequence()
	        : isCollection(value)
	          ? isKeyed(value)
	            ? value.entrySeq()
	            : value.toIndexedSeq()
	          : isRecord(value)
	            ? value.toSeq().entrySeq()
	            : indexedSeqFromValue(value);
	    }

	    if ( Seq ) IndexedSeq.__proto__ = Seq;
	    IndexedSeq.prototype = Object.create( Seq && Seq.prototype );
	    IndexedSeq.prototype.constructor = IndexedSeq;

	    IndexedSeq.of = function of (/*...values*/) {
	      return IndexedSeq(arguments);
	    };

	    IndexedSeq.prototype.toIndexedSeq = function toIndexedSeq () {
	      return this;
	    };

	    IndexedSeq.prototype.toString = function toString () {
	      return this.__toString('Seq [', ']');
	    };

	    return IndexedSeq;
	  }(Seq));

	  var SetSeq = /*@__PURE__*/(function (Seq) {
	    function SetSeq(value) {
	      return (isCollection(value) && !isAssociative(value)
	        ? value
	        : IndexedSeq(value)
	      ).toSetSeq();
	    }

	    if ( Seq ) SetSeq.__proto__ = Seq;
	    SetSeq.prototype = Object.create( Seq && Seq.prototype );
	    SetSeq.prototype.constructor = SetSeq;

	    SetSeq.of = function of (/*...values*/) {
	      return SetSeq(arguments);
	    };

	    SetSeq.prototype.toSetSeq = function toSetSeq () {
	      return this;
	    };

	    return SetSeq;
	  }(Seq));

	  Seq.isSeq = isSeq;
	  Seq.Keyed = KeyedSeq;
	  Seq.Set = SetSeq;
	  Seq.Indexed = IndexedSeq;

	  Seq.prototype[IS_SEQ_SYMBOL] = true;

	  // #pragma Root Sequences

	  var ArraySeq = /*@__PURE__*/(function (IndexedSeq) {
	    function ArraySeq(array) {
	      this._array = array;
	      this.size = array.length;
	    }

	    if ( IndexedSeq ) ArraySeq.__proto__ = IndexedSeq;
	    ArraySeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
	    ArraySeq.prototype.constructor = ArraySeq;

	    ArraySeq.prototype.get = function get (index, notSetValue) {
	      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
	    };

	    ArraySeq.prototype.__iterate = function __iterate (fn, reverse) {
	      var array = this._array;
	      var size = array.length;
	      var i = 0;
	      while (i !== size) {
	        var ii = reverse ? size - ++i : i++;
	        if (fn(array[ii], ii, this) === false) {
	          break;
	        }
	      }
	      return i;
	    };

	    ArraySeq.prototype.__iterator = function __iterator (type, reverse) {
	      var array = this._array;
	      var size = array.length;
	      var i = 0;
	      return new Iterator(function () {
	        if (i === size) {
	          return iteratorDone();
	        }
	        var ii = reverse ? size - ++i : i++;
	        return iteratorValue(type, ii, array[ii]);
	      });
	    };

	    return ArraySeq;
	  }(IndexedSeq));

	  var ObjectSeq = /*@__PURE__*/(function (KeyedSeq) {
	    function ObjectSeq(object) {
	      var keys = Object.keys(object);
	      this._object = object;
	      this._keys = keys;
	      this.size = keys.length;
	    }

	    if ( KeyedSeq ) ObjectSeq.__proto__ = KeyedSeq;
	    ObjectSeq.prototype = Object.create( KeyedSeq && KeyedSeq.prototype );
	    ObjectSeq.prototype.constructor = ObjectSeq;

	    ObjectSeq.prototype.get = function get (key, notSetValue) {
	      if (notSetValue !== undefined && !this.has(key)) {
	        return notSetValue;
	      }
	      return this._object[key];
	    };

	    ObjectSeq.prototype.has = function has (key) {
	      return hasOwnProperty.call(this._object, key);
	    };

	    ObjectSeq.prototype.__iterate = function __iterate (fn, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var size = keys.length;
	      var i = 0;
	      while (i !== size) {
	        var key = keys[reverse ? size - ++i : i++];
	        if (fn(object[key], key, this) === false) {
	          break;
	        }
	      }
	      return i;
	    };

	    ObjectSeq.prototype.__iterator = function __iterator (type, reverse) {
	      var object = this._object;
	      var keys = this._keys;
	      var size = keys.length;
	      var i = 0;
	      return new Iterator(function () {
	        if (i === size) {
	          return iteratorDone();
	        }
	        var key = keys[reverse ? size - ++i : i++];
	        return iteratorValue(type, key, object[key]);
	      });
	    };

	    return ObjectSeq;
	  }(KeyedSeq));
	  ObjectSeq.prototype[IS_ORDERED_SYMBOL] = true;

	  var CollectionSeq = /*@__PURE__*/(function (IndexedSeq) {
	    function CollectionSeq(collection) {
	      this._collection = collection;
	      this.size = collection.length || collection.size;
	    }

	    if ( IndexedSeq ) CollectionSeq.__proto__ = IndexedSeq;
	    CollectionSeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
	    CollectionSeq.prototype.constructor = CollectionSeq;

	    CollectionSeq.prototype.__iterateUncached = function __iterateUncached (fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var collection = this._collection;
	      var iterator = getIterator(collection);
	      var iterations = 0;
	      if (isIterator(iterator)) {
	        var step;
	        while (!(step = iterator.next()).done) {
	          if (fn(step.value, iterations++, this) === false) {
	            break;
	          }
	        }
	      }
	      return iterations;
	    };

	    CollectionSeq.prototype.__iteratorUncached = function __iteratorUncached (type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var collection = this._collection;
	      var iterator = getIterator(collection);
	      if (!isIterator(iterator)) {
	        return new Iterator(iteratorDone);
	      }
	      var iterations = 0;
	      return new Iterator(function () {
	        var step = iterator.next();
	        return step.done ? step : iteratorValue(type, iterations++, step.value);
	      });
	    };

	    return CollectionSeq;
	  }(IndexedSeq));

	  // # pragma Helper functions

	  var EMPTY_SEQ;

	  function emptySequence() {
	    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
	  }

	  function keyedSeqFromValue(value) {
	    var seq = Array.isArray(value)
	      ? new ArraySeq(value)
	      : hasIterator(value)
	        ? new CollectionSeq(value)
	        : undefined;
	    if (seq) {
	      return seq.fromEntrySeq();
	    }
	    if (typeof value === 'object') {
	      return new ObjectSeq(value);
	    }
	    throw new TypeError(
	      'Expected Array or collection object of [k, v] entries, or keyed object: ' +
	        value
	    );
	  }

	  function indexedSeqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value);
	    if (seq) {
	      return seq;
	    }
	    throw new TypeError(
	      'Expected Array or collection object of values: ' + value
	    );
	  }

	  function seqFromValue(value) {
	    var seq = maybeIndexedSeqFromValue(value);
	    if (seq) {
	      return seq;
	    }
	    if (typeof value === 'object') {
	      return new ObjectSeq(value);
	    }
	    throw new TypeError(
	      'Expected Array or collection object of values, or keyed object: ' + value
	    );
	  }

	  function maybeIndexedSeqFromValue(value) {
	    return isArrayLike(value)
	      ? new ArraySeq(value)
	      : hasIterator(value)
	        ? new CollectionSeq(value)
	        : undefined;
	  }

	  var IS_MAP_SYMBOL = '@@__IMMUTABLE_MAP__@@';

	  function isMap(maybeMap) {
	    return Boolean(maybeMap && maybeMap[IS_MAP_SYMBOL]);
	  }

	  function isOrderedMap(maybeOrderedMap) {
	    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
	  }

	  function isValueObject(maybeValue) {
	    return Boolean(
	      maybeValue &&
	        typeof maybeValue.equals === 'function' &&
	        typeof maybeValue.hashCode === 'function'
	    );
	  }

	  /**
	   * An extension of the "same-value" algorithm as [described for use by ES6 Map
	   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
	   *
	   * NaN is considered the same as NaN, however -0 and 0 are considered the same
	   * value, which is different from the algorithm described by
	   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
	   *
	   * This is extended further to allow Objects to describe the values they
	   * represent, by way of `valueOf` or `equals` (and `hashCode`).
	   *
	   * Note: because of this extension, the key equality of Immutable.Map and the
	   * value equality of Immutable.Set will differ from ES6 Map and Set.
	   *
	   * ### Defining custom values
	   *
	   * The easiest way to describe the value an object represents is by implementing
	   * `valueOf`. For example, `Date` represents a value by returning a unix
	   * timestamp for `valueOf`:
	   *
	   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
	   *     var date2 = new Date(1234567890000);
	   *     date1.valueOf(); // 1234567890000
	   *     assert( date1 !== date2 );
	   *     assert( Immutable.is( date1, date2 ) );
	   *
	   * Note: overriding `valueOf` may have other implications if you use this object
	   * where JavaScript expects a primitive, such as implicit string coercion.
	   *
	   * For more complex types, especially collections, implementing `valueOf` may
	   * not be performant. An alternative is to implement `equals` and `hashCode`.
	   *
	   * `equals` takes another object, presumably of similar type, and returns true
	   * if it is equal. Equality is symmetrical, so the same result should be
	   * returned if this and the argument are flipped.
	   *
	   *     assert( a.equals(b) === b.equals(a) );
	   *
	   * `hashCode` returns a 32bit integer number representing the object which will
	   * be used to determine how to store the value object in a Map or Set. You must
	   * provide both or neither methods, one must not exist without the other.
	   *
	   * Also, an important relationship between these methods must be upheld: if two
	   * values are equal, they *must* return the same hashCode. If the values are not
	   * equal, they might have the same hashCode; this is called a hash collision,
	   * and while undesirable for performance reasons, it is acceptable.
	   *
	   *     if (a.equals(b)) {
	   *       assert( a.hashCode() === b.hashCode() );
	   *     }
	   *
	   * All Immutable collections are Value Objects: they implement `equals()`
	   * and `hashCode()`.
	   */
	  function is(valueA, valueB) {
	    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	      return true;
	    }
	    if (!valueA || !valueB) {
	      return false;
	    }
	    if (
	      typeof valueA.valueOf === 'function' &&
	      typeof valueB.valueOf === 'function'
	    ) {
	      valueA = valueA.valueOf();
	      valueB = valueB.valueOf();
	      if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
	        return true;
	      }
	      if (!valueA || !valueB) {
	        return false;
	      }
	    }
	    return !!(
	      isValueObject(valueA) &&
	      isValueObject(valueB) &&
	      valueA.equals(valueB)
	    );
	  }

	  var imul =
	    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2
	      ? Math.imul
	      : function imul(a, b) {
	          a |= 0; // int
	          b |= 0; // int
	          var c = a & 0xffff;
	          var d = b & 0xffff;
	          // Shift by 0 fixes the sign on the high part.
	          return (c * d + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0)) | 0; // int
	        };

	  // v8 has an optimization for storing 31-bit signed numbers.
	  // Values which have either 00 or 11 as the high order bits qualify.
	  // This function drops the highest order bit in a signed number, maintaining
	  // the sign bit.
	  function smi(i32) {
	    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xbfffffff);
	  }

	  var defaultValueOf = Object.prototype.valueOf;

	  function hash(o) {
	    switch (typeof o) {
	      case 'boolean':
	        // The hash values for built-in constants are a 1 value for each 5-byte
	        // shift region expect for the first, which encodes the value. This
	        // reduces the odds of a hash collision for these common values.
	        return o ? 0x42108421 : 0x42108420;
	      case 'number':
	        return hashNumber(o);
	      case 'string':
	        return o.length > STRING_HASH_CACHE_MIN_STRLEN
	          ? cachedHashString(o)
	          : hashString(o);
	      case 'object':
	      case 'function':
	        if (o === null) {
	          return 0x42108422;
	        }
	        if (typeof o.hashCode === 'function') {
	          // Drop any high bits from accidentally long hash codes.
	          return smi(o.hashCode(o));
	        }
	        if (o.valueOf !== defaultValueOf && typeof o.valueOf === 'function') {
	          o = o.valueOf(o);
	        }
	        return hashJSObj(o);
	      case 'undefined':
	        return 0x42108423;
	      default:
	        if (typeof o.toString === 'function') {
	          return hashString(o.toString());
	        }
	        throw new Error('Value type ' + typeof o + ' cannot be hashed.');
	    }
	  }

	  // Compress arbitrarily large numbers into smi hashes.
	  function hashNumber(n) {
	    if (n !== n || n === Infinity) {
	      return 0;
	    }
	    var hash = n | 0;
	    if (hash !== n) {
	      hash ^= n * 0xffffffff;
	    }
	    while (n > 0xffffffff) {
	      n /= 0xffffffff;
	      hash ^= n;
	    }
	    return smi(hash);
	  }

	  function cachedHashString(string) {
	    var hashed = stringHashCache[string];
	    if (hashed === undefined) {
	      hashed = hashString(string);
	      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
	        STRING_HASH_CACHE_SIZE = 0;
	        stringHashCache = {};
	      }
	      STRING_HASH_CACHE_SIZE++;
	      stringHashCache[string] = hashed;
	    }
	    return hashed;
	  }

	  // http://jsperf.com/hashing-strings
	  function hashString(string) {
	    // This is the hash from JVM
	    // The hash code for a string is computed as
	    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
	    // where s[i] is the ith character of the string and n is the length of
	    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
	    // (exclusive) by dropping high bits.
	    var hashed = 0;
	    for (var ii = 0; ii < string.length; ii++) {
	      hashed = (31 * hashed + string.charCodeAt(ii)) | 0;
	    }
	    return smi(hashed);
	  }

	  function hashJSObj(obj) {
	    var hashed;
	    if (usingWeakMap) {
	      hashed = weakMap.get(obj);
	      if (hashed !== undefined) {
	        return hashed;
	      }
	    }

	    hashed = obj[UID_HASH_KEY];
	    if (hashed !== undefined) {
	      return hashed;
	    }

	    if (!canDefineProperty) {
	      hashed = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
	      if (hashed !== undefined) {
	        return hashed;
	      }

	      hashed = getIENodeHash(obj);
	      if (hashed !== undefined) {
	        return hashed;
	      }
	    }

	    hashed = ++objHashUID;
	    if (objHashUID & 0x40000000) {
	      objHashUID = 0;
	    }

	    if (usingWeakMap) {
	      weakMap.set(obj, hashed);
	    } else if (isExtensible !== undefined && isExtensible(obj) === false) {
	      throw new Error('Non-extensible objects are not allowed as keys.');
	    } else if (canDefineProperty) {
	      Object.defineProperty(obj, UID_HASH_KEY, {
	        enumerable: false,
	        configurable: false,
	        writable: false,
	        value: hashed,
	      });
	    } else if (
	      obj.propertyIsEnumerable !== undefined &&
	      obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable
	    ) {
	      // Since we can't define a non-enumerable property on the object
	      // we'll hijack one of the less-used non-enumerable properties to
	      // save our hash on it. Since this is a function it will not show up in
	      // `JSON.stringify` which is what we want.
	      obj.propertyIsEnumerable = function() {
	        return this.constructor.prototype.propertyIsEnumerable.apply(
	          this,
	          arguments
	        );
	      };
	      obj.propertyIsEnumerable[UID_HASH_KEY] = hashed;
	    } else if (obj.nodeType !== undefined) {
	      // At this point we couldn't get the IE `uniqueID` to use as a hash
	      // and we couldn't use a non-enumerable property to exploit the
	      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
	      // itself.
	      obj[UID_HASH_KEY] = hashed;
	    } else {
	      throw new Error('Unable to set a non-enumerable property on object.');
	    }

	    return hashed;
	  }

	  // Get references to ES5 object methods.
	  var isExtensible = Object.isExtensible;

	  // True if Object.defineProperty works as expected. IE8 fails this test.
	  var canDefineProperty = (function() {
	    try {
	      Object.defineProperty({}, '@', {});
	      return true;
	    } catch (e) {
	      return false;
	    }
	  })();

	  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
	  // and avoid memory leaks from the IE cloneNode bug.
	  function getIENodeHash(node) {
	    if (node && node.nodeType > 0) {
	      switch (node.nodeType) {
	        case 1: // Element
	          return node.uniqueID;
	        case 9: // Document
	          return node.documentElement && node.documentElement.uniqueID;
	      }
	    }
	  }

	  // If possible, use a WeakMap.
	  var usingWeakMap = typeof WeakMap === 'function';
	  var weakMap;
	  if (usingWeakMap) {
	    weakMap = new WeakMap();
	  }

	  var objHashUID = 0;

	  var UID_HASH_KEY = '__immutablehash__';
	  if (typeof Symbol === 'function') {
	    UID_HASH_KEY = Symbol(UID_HASH_KEY);
	  }

	  var STRING_HASH_CACHE_MIN_STRLEN = 16;
	  var STRING_HASH_CACHE_MAX_SIZE = 255;
	  var STRING_HASH_CACHE_SIZE = 0;
	  var stringHashCache = {};

	  var ToKeyedSequence = /*@__PURE__*/(function (KeyedSeq$$1) {
	    function ToKeyedSequence(indexed, useKeys) {
	      this._iter = indexed;
	      this._useKeys = useKeys;
	      this.size = indexed.size;
	    }

	    if ( KeyedSeq$$1 ) ToKeyedSequence.__proto__ = KeyedSeq$$1;
	    ToKeyedSequence.prototype = Object.create( KeyedSeq$$1 && KeyedSeq$$1.prototype );
	    ToKeyedSequence.prototype.constructor = ToKeyedSequence;

	    ToKeyedSequence.prototype.get = function get (key, notSetValue) {
	      return this._iter.get(key, notSetValue);
	    };

	    ToKeyedSequence.prototype.has = function has (key) {
	      return this._iter.has(key);
	    };

	    ToKeyedSequence.prototype.valueSeq = function valueSeq () {
	      return this._iter.valueSeq();
	    };

	    ToKeyedSequence.prototype.reverse = function reverse () {
	      var this$1 = this;

	      var reversedSequence = reverseFactory(this, true);
	      if (!this._useKeys) {
	        reversedSequence.valueSeq = function () { return this$1._iter.toSeq().reverse(); };
	      }
	      return reversedSequence;
	    };

	    ToKeyedSequence.prototype.map = function map (mapper, context) {
	      var this$1 = this;

	      var mappedSequence = mapFactory(this, mapper, context);
	      if (!this._useKeys) {
	        mappedSequence.valueSeq = function () { return this$1._iter.toSeq().map(mapper, context); };
	      }
	      return mappedSequence;
	    };

	    ToKeyedSequence.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      return this._iter.__iterate(function (v, k) { return fn(v, k, this$1); }, reverse);
	    };

	    ToKeyedSequence.prototype.__iterator = function __iterator (type, reverse) {
	      return this._iter.__iterator(type, reverse);
	    };

	    return ToKeyedSequence;
	  }(KeyedSeq));
	  ToKeyedSequence.prototype[IS_ORDERED_SYMBOL] = true;

	  var ToIndexedSequence = /*@__PURE__*/(function (IndexedSeq$$1) {
	    function ToIndexedSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }

	    if ( IndexedSeq$$1 ) ToIndexedSequence.__proto__ = IndexedSeq$$1;
	    ToIndexedSequence.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
	    ToIndexedSequence.prototype.constructor = ToIndexedSequence;

	    ToIndexedSequence.prototype.includes = function includes (value) {
	      return this._iter.includes(value);
	    };

	    ToIndexedSequence.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      var i = 0;
	      reverse && ensureSize(this);
	      return this._iter.__iterate(
	        function (v) { return fn(v, reverse ? this$1.size - ++i : i++, this$1); },
	        reverse
	      );
	    };

	    ToIndexedSequence.prototype.__iterator = function __iterator (type, reverse) {
	      var this$1 = this;

	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      var i = 0;
	      reverse && ensureSize(this);
	      return new Iterator(function () {
	        var step = iterator.next();
	        return step.done
	          ? step
	          : iteratorValue(
	              type,
	              reverse ? this$1.size - ++i : i++,
	              step.value,
	              step
	            );
	      });
	    };

	    return ToIndexedSequence;
	  }(IndexedSeq));

	  var ToSetSequence = /*@__PURE__*/(function (SetSeq$$1) {
	    function ToSetSequence(iter) {
	      this._iter = iter;
	      this.size = iter.size;
	    }

	    if ( SetSeq$$1 ) ToSetSequence.__proto__ = SetSeq$$1;
	    ToSetSequence.prototype = Object.create( SetSeq$$1 && SetSeq$$1.prototype );
	    ToSetSequence.prototype.constructor = ToSetSequence;

	    ToSetSequence.prototype.has = function has (key) {
	      return this._iter.includes(key);
	    };

	    ToSetSequence.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      return this._iter.__iterate(function (v) { return fn(v, v, this$1); }, reverse);
	    };

	    ToSetSequence.prototype.__iterator = function __iterator (type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new Iterator(function () {
	        var step = iterator.next();
	        return step.done
	          ? step
	          : iteratorValue(type, step.value, step.value, step);
	      });
	    };

	    return ToSetSequence;
	  }(SetSeq));

	  var FromEntriesSequence = /*@__PURE__*/(function (KeyedSeq$$1) {
	    function FromEntriesSequence(entries) {
	      this._iter = entries;
	      this.size = entries.size;
	    }

	    if ( KeyedSeq$$1 ) FromEntriesSequence.__proto__ = KeyedSeq$$1;
	    FromEntriesSequence.prototype = Object.create( KeyedSeq$$1 && KeyedSeq$$1.prototype );
	    FromEntriesSequence.prototype.constructor = FromEntriesSequence;

	    FromEntriesSequence.prototype.entrySeq = function entrySeq () {
	      return this._iter.toSeq();
	    };

	    FromEntriesSequence.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      return this._iter.__iterate(function (entry) {
	        // Check if entry exists first so array access doesn't throw for holes
	        // in the parent iteration.
	        if (entry) {
	          validateEntry(entry);
	          var indexedCollection = isCollection(entry);
	          return fn(
	            indexedCollection ? entry.get(1) : entry[1],
	            indexedCollection ? entry.get(0) : entry[0],
	            this$1
	          );
	        }
	      }, reverse);
	    };

	    FromEntriesSequence.prototype.__iterator = function __iterator (type, reverse) {
	      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
	      return new Iterator(function () {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          // Check if entry exists first so array access doesn't throw for holes
	          // in the parent iteration.
	          if (entry) {
	            validateEntry(entry);
	            var indexedCollection = isCollection(entry);
	            return iteratorValue(
	              type,
	              indexedCollection ? entry.get(0) : entry[0],
	              indexedCollection ? entry.get(1) : entry[1],
	              step
	            );
	          }
	        }
	      });
	    };

	    return FromEntriesSequence;
	  }(KeyedSeq));

	  ToIndexedSequence.prototype.cacheResult = ToKeyedSequence.prototype.cacheResult = ToSetSequence.prototype.cacheResult = FromEntriesSequence.prototype.cacheResult = cacheResultThrough;

	  function flipFactory(collection) {
	    var flipSequence = makeSequence(collection);
	    flipSequence._iter = collection;
	    flipSequence.size = collection.size;
	    flipSequence.flip = function () { return collection; };
	    flipSequence.reverse = function() {
	      var reversedSequence = collection.reverse.apply(this); // super.reverse()
	      reversedSequence.flip = function () { return collection.reverse(); };
	      return reversedSequence;
	    };
	    flipSequence.has = function (key) { return collection.includes(key); };
	    flipSequence.includes = function (key) { return collection.has(key); };
	    flipSequence.cacheResult = cacheResultThrough;
	    flipSequence.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      return collection.__iterate(function (v, k) { return fn(k, v, this$1) !== false; }, reverse);
	    };
	    flipSequence.__iteratorUncached = function(type, reverse) {
	      if (type === ITERATE_ENTRIES) {
	        var iterator = collection.__iterator(type, reverse);
	        return new Iterator(function () {
	          var step = iterator.next();
	          if (!step.done) {
	            var k = step.value[0];
	            step.value[0] = step.value[1];
	            step.value[1] = k;
	          }
	          return step;
	        });
	      }
	      return collection.__iterator(
	        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
	        reverse
	      );
	    };
	    return flipSequence;
	  }

	  function mapFactory(collection, mapper, context) {
	    var mappedSequence = makeSequence(collection);
	    mappedSequence.size = collection.size;
	    mappedSequence.has = function (key) { return collection.has(key); };
	    mappedSequence.get = function (key, notSetValue) {
	      var v = collection.get(key, NOT_SET);
	      return v === NOT_SET
	        ? notSetValue
	        : mapper.call(context, v, key, collection);
	    };
	    mappedSequence.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      return collection.__iterate(
	        function (v, k, c) { return fn(mapper.call(context, v, k, c), k, this$1) !== false; },
	        reverse
	      );
	    };
	    mappedSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
	      return new Iterator(function () {
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var key = entry[0];
	        return iteratorValue(
	          type,
	          key,
	          mapper.call(context, entry[1], key, collection),
	          step
	        );
	      });
	    };
	    return mappedSequence;
	  }

	  function reverseFactory(collection, useKeys) {
	    var this$1 = this;

	    var reversedSequence = makeSequence(collection);
	    reversedSequence._iter = collection;
	    reversedSequence.size = collection.size;
	    reversedSequence.reverse = function () { return collection; };
	    if (collection.flip) {
	      reversedSequence.flip = function() {
	        var flipSequence = flipFactory(collection);
	        flipSequence.reverse = function () { return collection.flip(); };
	        return flipSequence;
	      };
	    }
	    reversedSequence.get = function (key, notSetValue) { return collection.get(useKeys ? key : -1 - key, notSetValue); };
	    reversedSequence.has = function (key) { return collection.has(useKeys ? key : -1 - key); };
	    reversedSequence.includes = function (value) { return collection.includes(value); };
	    reversedSequence.cacheResult = cacheResultThrough;
	    reversedSequence.__iterate = function(fn, reverse) {
	      var this$1 = this;

	      var i = 0;
	      reverse && ensureSize(collection);
	      return collection.__iterate(
	        function (v, k) { return fn(v, useKeys ? k : reverse ? this$1.size - ++i : i++, this$1); },
	        !reverse
	      );
	    };
	    reversedSequence.__iterator = function (type, reverse) {
	      var i = 0;
	      reverse && ensureSize(collection);
	      var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);
	      return new Iterator(function () {
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        return iteratorValue(
	          type,
	          useKeys ? entry[0] : reverse ? this$1.size - ++i : i++,
	          entry[1],
	          step
	        );
	      });
	    };
	    return reversedSequence;
	  }

	  function filterFactory(collection, predicate, context, useKeys) {
	    var filterSequence = makeSequence(collection);
	    if (useKeys) {
	      filterSequence.has = function (key) {
	        var v = collection.get(key, NOT_SET);
	        return v !== NOT_SET && !!predicate.call(context, v, key, collection);
	      };
	      filterSequence.get = function (key, notSetValue) {
	        var v = collection.get(key, NOT_SET);
	        return v !== NOT_SET && predicate.call(context, v, key, collection)
	          ? v
	          : notSetValue;
	      };
	    }
	    filterSequence.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      var iterations = 0;
	      collection.__iterate(function (v, k, c) {
	        if (predicate.call(context, v, k, c)) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$1);
	        }
	      }, reverse);
	      return iterations;
	    };
	    filterSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
	      var iterations = 0;
	      return new Iterator(function () {
	        while (true) {
	          var step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	          var entry = step.value;
	          var key = entry[0];
	          var value = entry[1];
	          if (predicate.call(context, value, key, collection)) {
	            return iteratorValue(type, useKeys ? key : iterations++, value, step);
	          }
	        }
	      });
	    };
	    return filterSequence;
	  }

	  function countByFactory(collection, grouper, context) {
	    var groups = Map().asMutable();
	    collection.__iterate(function (v, k) {
	      groups.update(grouper.call(context, v, k, collection), 0, function (a) { return a + 1; });
	    });
	    return groups.asImmutable();
	  }

	  function groupByFactory(collection, grouper, context) {
	    var isKeyedIter = isKeyed(collection);
	    var groups = (isOrdered(collection) ? OrderedMap() : Map()).asMutable();
	    collection.__iterate(function (v, k) {
	      groups.update(
	        grouper.call(context, v, k, collection),
	        function (a) { return ((a = a || []), a.push(isKeyedIter ? [k, v] : v), a); }
	      );
	    });
	    var coerce = collectionClass(collection);
	    return groups.map(function (arr) { return reify(collection, coerce(arr)); }).asImmutable();
	  }

	  function sliceFactory(collection, begin, end, useKeys) {
	    var originalSize = collection.size;

	    if (wholeSlice(begin, end, originalSize)) {
	      return collection;
	    }

	    var resolvedBegin = resolveBegin(begin, originalSize);
	    var resolvedEnd = resolveEnd(end, originalSize);

	    // begin or end will be NaN if they were provided as negative numbers and
	    // this collection's size is unknown. In that case, cache first so there is
	    // a known size and these do not resolve to NaN.
	    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
	      return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
	    }

	    // Note: resolvedEnd is undefined when the original sequence's length is
	    // unknown and this slice did not supply an end and should contain all
	    // elements after resolvedBegin.
	    // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
	    var resolvedSize = resolvedEnd - resolvedBegin;
	    var sliceSize;
	    if (resolvedSize === resolvedSize) {
	      sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
	    }

	    var sliceSeq = makeSequence(collection);

	    // If collection.size is undefined, the size of the realized sliceSeq is
	    // unknown at this point unless the number of items to slice is 0
	    sliceSeq.size =
	      sliceSize === 0 ? sliceSize : (collection.size && sliceSize) || undefined;

	    if (!useKeys && isSeq(collection) && sliceSize >= 0) {
	      sliceSeq.get = function(index, notSetValue) {
	        index = wrapIndex(this, index);
	        return index >= 0 && index < sliceSize
	          ? collection.get(index + resolvedBegin, notSetValue)
	          : notSetValue;
	      };
	    }

	    sliceSeq.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      if (sliceSize === 0) {
	        return 0;
	      }
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var skipped = 0;
	      var isSkipping = true;
	      var iterations = 0;
	      collection.__iterate(function (v, k) {
	        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
	          iterations++;
	          return (
	            fn(v, useKeys ? k : iterations - 1, this$1) !== false &&
	            iterations !== sliceSize
	          );
	        }
	      });
	      return iterations;
	    };

	    sliceSeq.__iteratorUncached = function(type, reverse) {
	      if (sliceSize !== 0 && reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      // Don't bother instantiating parent iterator if taking 0.
	      if (sliceSize === 0) {
	        return new Iterator(iteratorDone);
	      }
	      var iterator = collection.__iterator(type, reverse);
	      var skipped = 0;
	      var iterations = 0;
	      return new Iterator(function () {
	        while (skipped++ < resolvedBegin) {
	          iterator.next();
	        }
	        if (++iterations > sliceSize) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (useKeys || type === ITERATE_VALUES || step.done) {
	          return step;
	        }
	        if (type === ITERATE_KEYS) {
	          return iteratorValue(type, iterations - 1, undefined, step);
	        }
	        return iteratorValue(type, iterations - 1, step.value[1], step);
	      });
	    };

	    return sliceSeq;
	  }

	  function takeWhileFactory(collection, predicate, context) {
	    var takeSequence = makeSequence(collection);
	    takeSequence.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterations = 0;
	      collection.__iterate(
	        function (v, k, c) { return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$1); }
	      );
	      return iterations;
	    };
	    takeSequence.__iteratorUncached = function(type, reverse) {
	      var this$1 = this;

	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
	      var iterating = true;
	      return new Iterator(function () {
	        if (!iterating) {
	          return iteratorDone();
	        }
	        var step = iterator.next();
	        if (step.done) {
	          return step;
	        }
	        var entry = step.value;
	        var k = entry[0];
	        var v = entry[1];
	        if (!predicate.call(context, v, k, this$1)) {
	          iterating = false;
	          return iteratorDone();
	        }
	        return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
	      });
	    };
	    return takeSequence;
	  }

	  function skipWhileFactory(collection, predicate, context, useKeys) {
	    var skipSequence = makeSequence(collection);
	    skipSequence.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var isSkipping = true;
	      var iterations = 0;
	      collection.__iterate(function (v, k, c) {
	        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
	          iterations++;
	          return fn(v, useKeys ? k : iterations - 1, this$1);
	        }
	      });
	      return iterations;
	    };
	    skipSequence.__iteratorUncached = function(type, reverse) {
	      var this$1 = this;

	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
	      var skipping = true;
	      var iterations = 0;
	      return new Iterator(function () {
	        var step;
	        var k;
	        var v;
	        do {
	          step = iterator.next();
	          if (step.done) {
	            if (useKeys || type === ITERATE_VALUES) {
	              return step;
	            }
	            if (type === ITERATE_KEYS) {
	              return iteratorValue(type, iterations++, undefined, step);
	            }
	            return iteratorValue(type, iterations++, step.value[1], step);
	          }
	          var entry = step.value;
	          k = entry[0];
	          v = entry[1];
	          skipping && (skipping = predicate.call(context, v, k, this$1));
	        } while (skipping);
	        return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
	      });
	    };
	    return skipSequence;
	  }

	  function concatFactory(collection, values) {
	    var isKeyedCollection = isKeyed(collection);
	    var iters = [collection]
	      .concat(values)
	      .map(function (v) {
	        if (!isCollection(v)) {
	          v = isKeyedCollection
	            ? keyedSeqFromValue(v)
	            : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
	        } else if (isKeyedCollection) {
	          v = KeyedCollection(v);
	        }
	        return v;
	      })
	      .filter(function (v) { return v.size !== 0; });

	    if (iters.length === 0) {
	      return collection;
	    }

	    if (iters.length === 1) {
	      var singleton = iters[0];
	      if (
	        singleton === collection ||
	        (isKeyedCollection && isKeyed(singleton)) ||
	        (isIndexed(collection) && isIndexed(singleton))
	      ) {
	        return singleton;
	      }
	    }

	    var concatSeq = new ArraySeq(iters);
	    if (isKeyedCollection) {
	      concatSeq = concatSeq.toKeyedSeq();
	    } else if (!isIndexed(collection)) {
	      concatSeq = concatSeq.toSetSeq();
	    }
	    concatSeq = concatSeq.flatten(true);
	    concatSeq.size = iters.reduce(function (sum, seq) {
	      if (sum !== undefined) {
	        var size = seq.size;
	        if (size !== undefined) {
	          return sum + size;
	        }
	      }
	    }, 0);
	    return concatSeq;
	  }

	  function flattenFactory(collection, depth, useKeys) {
	    var flatSequence = makeSequence(collection);
	    flatSequence.__iterateUncached = function(fn, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterate(fn, reverse);
	      }
	      var iterations = 0;
	      var stopped = false;
	      function flatDeep(iter, currentDepth) {
	        iter.__iterate(function (v, k) {
	          if ((!depth || currentDepth < depth) && isCollection(v)) {
	            flatDeep(v, currentDepth + 1);
	          } else {
	            iterations++;
	            if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
	              stopped = true;
	            }
	          }
	          return !stopped;
	        }, reverse);
	      }
	      flatDeep(collection, 0);
	      return iterations;
	    };
	    flatSequence.__iteratorUncached = function(type, reverse) {
	      if (reverse) {
	        return this.cacheResult().__iterator(type, reverse);
	      }
	      var iterator = collection.__iterator(type, reverse);
	      var stack = [];
	      var iterations = 0;
	      return new Iterator(function () {
	        while (iterator) {
	          var step = iterator.next();
	          if (step.done !== false) {
	            iterator = stack.pop();
	            continue;
	          }
	          var v = step.value;
	          if (type === ITERATE_ENTRIES) {
	            v = v[1];
	          }
	          if ((!depth || stack.length < depth) && isCollection(v)) {
	            stack.push(iterator);
	            iterator = v.__iterator(type, reverse);
	          } else {
	            return useKeys ? step : iteratorValue(type, iterations++, v, step);
	          }
	        }
	        return iteratorDone();
	      });
	    };
	    return flatSequence;
	  }

	  function flatMapFactory(collection, mapper, context) {
	    var coerce = collectionClass(collection);
	    return collection
	      .toSeq()
	      .map(function (v, k) { return coerce(mapper.call(context, v, k, collection)); })
	      .flatten(true);
	  }

	  function interposeFactory(collection, separator) {
	    var interposedSequence = makeSequence(collection);
	    interposedSequence.size = collection.size && collection.size * 2 - 1;
	    interposedSequence.__iterateUncached = function(fn, reverse) {
	      var this$1 = this;

	      var iterations = 0;
	      collection.__iterate(
	        function (v) { return (!iterations || fn(separator, iterations++, this$1) !== false) &&
	          fn(v, iterations++, this$1) !== false; },
	        reverse
	      );
	      return iterations;
	    };
	    interposedSequence.__iteratorUncached = function(type, reverse) {
	      var iterator = collection.__iterator(ITERATE_VALUES, reverse);
	      var iterations = 0;
	      var step;
	      return new Iterator(function () {
	        if (!step || iterations % 2) {
	          step = iterator.next();
	          if (step.done) {
	            return step;
	          }
	        }
	        return iterations % 2
	          ? iteratorValue(type, iterations++, separator)
	          : iteratorValue(type, iterations++, step.value, step);
	      });
	    };
	    return interposedSequence;
	  }

	  function sortFactory(collection, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    var isKeyedCollection = isKeyed(collection);
	    var index = 0;
	    var entries = collection
	      .toSeq()
	      .map(function (v, k) { return [k, v, index++, mapper ? mapper(v, k, collection) : v]; })
	      .valueSeq()
	      .toArray();
	    entries.sort(function (a, b) { return comparator(a[3], b[3]) || a[2] - b[2]; }).forEach(
	      isKeyedCollection
	        ? function (v, i) {
	            entries[i].length = 2;
	          }
	        : function (v, i) {
	            entries[i] = v[1];
	          }
	    );
	    return isKeyedCollection
	      ? KeyedSeq(entries)
	      : isIndexed(collection)
	        ? IndexedSeq(entries)
	        : SetSeq(entries);
	  }

	  function maxFactory(collection, comparator, mapper) {
	    if (!comparator) {
	      comparator = defaultComparator;
	    }
	    if (mapper) {
	      var entry = collection
	        .toSeq()
	        .map(function (v, k) { return [v, mapper(v, k, collection)]; })
	        .reduce(function (a, b) { return (maxCompare(comparator, a[1], b[1]) ? b : a); });
	      return entry && entry[0];
	    }
	    return collection.reduce(function (a, b) { return (maxCompare(comparator, a, b) ? b : a); });
	  }

	  function maxCompare(comparator, a, b) {
	    var comp = comparator(b, a);
	    // b is considered the new max if the comparator declares them equal, but
	    // they are not equal and b is in fact a nullish value.
	    return (
	      (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) ||
	      comp > 0
	    );
	  }

	  function zipWithFactory(keyIter, zipper, iters, zipAll) {
	    var zipSequence = makeSequence(keyIter);
	    var sizes = new ArraySeq(iters).map(function (i) { return i.size; });
	    zipSequence.size = zipAll ? sizes.max() : sizes.min();
	    // Note: this a generic base implementation of __iterate in terms of
	    // __iterator which may be more generically useful in the future.
	    zipSequence.__iterate = function(fn, reverse) {
	      /* generic:
	      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        iterations++;
	        if (fn(step.value[1], step.value[0], this) === false) {
	          break;
	        }
	      }
	      return iterations;
	      */
	      // indexed:
	      var iterator = this.__iterator(ITERATE_VALUES, reverse);
	      var step;
	      var iterations = 0;
	      while (!(step = iterator.next()).done) {
	        if (fn(step.value, iterations++, this) === false) {
	          break;
	        }
	      }
	      return iterations;
	    };
	    zipSequence.__iteratorUncached = function(type, reverse) {
	      var iterators = iters.map(
	        function (i) { return ((i = Collection(i)), getIterator(reverse ? i.reverse() : i)); }
	      );
	      var iterations = 0;
	      var isDone = false;
	      return new Iterator(function () {
	        var steps;
	        if (!isDone) {
	          steps = iterators.map(function (i) { return i.next(); });
	          isDone = zipAll ? steps.every(function (s) { return s.done; }) : steps.some(function (s) { return s.done; });
	        }
	        if (isDone) {
	          return iteratorDone();
	        }
	        return iteratorValue(
	          type,
	          iterations++,
	          zipper.apply(null, steps.map(function (s) { return s.value; }))
	        );
	      });
	    };
	    return zipSequence;
	  }

	  // #pragma Helper Functions

	  function reify(iter, seq) {
	    return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
	  }

	  function validateEntry(entry) {
	    if (entry !== Object(entry)) {
	      throw new TypeError('Expected [K, V] tuple: ' + entry);
	    }
	  }

	  function collectionClass(collection) {
	    return isKeyed(collection)
	      ? KeyedCollection
	      : isIndexed(collection)
	        ? IndexedCollection
	        : SetCollection;
	  }

	  function makeSequence(collection) {
	    return Object.create(
	      (isKeyed(collection)
	        ? KeyedSeq
	        : isIndexed(collection)
	          ? IndexedSeq
	          : SetSeq
	      ).prototype
	    );
	  }

	  function cacheResultThrough() {
	    if (this._iter.cacheResult) {
	      this._iter.cacheResult();
	      this.size = this._iter.size;
	      return this;
	    }
	    return Seq.prototype.cacheResult.call(this);
	  }

	  function defaultComparator(a, b) {
	    if (a === undefined && b === undefined) {
	      return 0;
	    }

	    if (a === undefined) {
	      return 1;
	    }

	    if (b === undefined) {
	      return -1;
	    }

	    return a > b ? 1 : a < b ? -1 : 0;
	  }

	  // http://jsperf.com/copy-array-inline
	  function arrCopy(arr, offset) {
	    offset = offset || 0;
	    var len = Math.max(0, arr.length - offset);
	    var newArr = new Array(len);
	    for (var ii = 0; ii < len; ii++) {
	      newArr[ii] = arr[ii + offset];
	    }
	    return newArr;
	  }

	  function invariant(condition, error) {
	    if (!condition) { throw new Error(error); }
	  }

	  function assertNotInfinite(size) {
	    invariant(
	      size !== Infinity,
	      'Cannot perform this action with an infinite size.'
	    );
	  }

	  function coerceKeyPath(keyPath) {
	    if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
	      return keyPath;
	    }
	    if (isOrdered(keyPath)) {
	      return keyPath.toArray();
	    }
	    throw new TypeError(
	      'Invalid keyPath: expected Ordered Collection or Array: ' + keyPath
	    );
	  }

	  function isPlainObj(value) {
	    return (
	      value &&
	      (typeof value.constructor !== 'function' ||
	        value.constructor.name === 'Object')
	    );
	  }

	  /**
	   * Returns true if the value is a potentially-persistent data structure, either
	   * provided by Immutable.js or a plain Array or Object.
	   */
	  function isDataStructure(value) {
	    return (
	      typeof value === 'object' &&
	      (isImmutable(value) || Array.isArray(value) || isPlainObj(value))
	    );
	  }

	  /**
	   * Converts a value to a string, adding quotes if a string was provided.
	   */
	  function quoteString(value) {
	    try {
	      return typeof value === 'string' ? JSON.stringify(value) : String(value);
	    } catch (_ignoreError) {
	      return JSON.stringify(value);
	    }
	  }

	  function has(collection, key) {
	    return isImmutable(collection)
	      ? collection.has(key)
	      : isDataStructure(collection) && hasOwnProperty.call(collection, key);
	  }

	  function get(collection, key, notSetValue) {
	    return isImmutable(collection)
	      ? collection.get(key, notSetValue)
	      : !has(collection, key)
	        ? notSetValue
	        : typeof collection.get === 'function'
	          ? collection.get(key)
	          : collection[key];
	  }

	  function shallowCopy(from) {
	    if (Array.isArray(from)) {
	      return arrCopy(from);
	    }
	    var to = {};
	    for (var key in from) {
	      if (hasOwnProperty.call(from, key)) {
	        to[key] = from[key];
	      }
	    }
	    return to;
	  }

	  function remove(collection, key) {
	    if (!isDataStructure(collection)) {
	      throw new TypeError(
	        'Cannot update non-data-structure value: ' + collection
	      );
	    }
	    if (isImmutable(collection)) {
	      if (!collection.remove) {
	        throw new TypeError(
	          'Cannot update immutable value without .remove() method: ' + collection
	        );
	      }
	      return collection.remove(key);
	    }
	    if (!hasOwnProperty.call(collection, key)) {
	      return collection;
	    }
	    var collectionCopy = shallowCopy(collection);
	    if (Array.isArray(collectionCopy)) {
	      collectionCopy.splice(key, 1);
	    } else {
	      delete collectionCopy[key];
	    }
	    return collectionCopy;
	  }

	  function set(collection, key, value) {
	    if (!isDataStructure(collection)) {
	      throw new TypeError(
	        'Cannot update non-data-structure value: ' + collection
	      );
	    }
	    if (isImmutable(collection)) {
	      if (!collection.set) {
	        throw new TypeError(
	          'Cannot update immutable value without .set() method: ' + collection
	        );
	      }
	      return collection.set(key, value);
	    }
	    if (hasOwnProperty.call(collection, key) && value === collection[key]) {
	      return collection;
	    }
	    var collectionCopy = shallowCopy(collection);
	    collectionCopy[key] = value;
	    return collectionCopy;
	  }

	  function updateIn(collection, keyPath, notSetValue, updater) {
	    if (!updater) {
	      updater = notSetValue;
	      notSetValue = undefined;
	    }
	    var updatedValue = updateInDeeply(
	      isImmutable(collection),
	      collection,
	      coerceKeyPath(keyPath),
	      0,
	      notSetValue,
	      updater
	    );
	    return updatedValue === NOT_SET ? notSetValue : updatedValue;
	  }

	  function updateInDeeply(
	    inImmutable,
	    existing,
	    keyPath,
	    i,
	    notSetValue,
	    updater
	  ) {
	    var wasNotSet = existing === NOT_SET;
	    if (i === keyPath.length) {
	      var existingValue = wasNotSet ? notSetValue : existing;
	      var newValue = updater(existingValue);
	      return newValue === existingValue ? existing : newValue;
	    }
	    if (!wasNotSet && !isDataStructure(existing)) {
	      throw new TypeError(
	        'Cannot update within non-data-structure value in path [' +
	          keyPath.slice(0, i).map(quoteString) +
	          ']: ' +
	          existing
	      );
	    }
	    var key = keyPath[i];
	    var nextExisting = wasNotSet ? NOT_SET : get(existing, key, NOT_SET);
	    var nextUpdated = updateInDeeply(
	      nextExisting === NOT_SET ? inImmutable : isImmutable(nextExisting),
	      nextExisting,
	      keyPath,
	      i + 1,
	      notSetValue,
	      updater
	    );
	    return nextUpdated === nextExisting
	      ? existing
	      : nextUpdated === NOT_SET
	        ? remove(existing, key)
	        : set(
	            wasNotSet ? (inImmutable ? emptyMap() : {}) : existing,
	            key,
	            nextUpdated
	          );
	  }

	  function setIn(collection, keyPath, value) {
	    return updateIn(collection, keyPath, NOT_SET, function () { return value; });
	  }

	  function setIn$1(keyPath, v) {
	    return setIn(this, keyPath, v);
	  }

	  function removeIn(collection, keyPath) {
	    return updateIn(collection, keyPath, function () { return NOT_SET; });
	  }

	  function deleteIn(keyPath) {
	    return removeIn(this, keyPath);
	  }

	  function update(collection, key, notSetValue, updater) {
	    return updateIn(collection, [key], notSetValue, updater);
	  }

	  function update$1(key, notSetValue, updater) {
	    return arguments.length === 1
	      ? key(this)
	      : update(this, key, notSetValue, updater);
	  }

	  function updateIn$1(keyPath, notSetValue, updater) {
	    return updateIn(this, keyPath, notSetValue, updater);
	  }

	  function merge() {
	    var iters = [], len = arguments.length;
	    while ( len-- ) iters[ len ] = arguments[ len ];

	    return mergeIntoKeyedWith(this, iters);
	  }

	  function mergeWith(merger) {
	    var iters = [], len = arguments.length - 1;
	    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

	    if (typeof merger !== 'function') {
	      throw new TypeError('Invalid merger function: ' + merger);
	    }
	    return mergeIntoKeyedWith(this, iters, merger);
	  }

	  function mergeIntoKeyedWith(collection, collections, merger) {
	    var iters = [];
	    for (var ii = 0; ii < collections.length; ii++) {
	      var collection$1 = KeyedCollection(collections[ii]);
	      if (collection$1.size !== 0) {
	        iters.push(collection$1);
	      }
	    }
	    if (iters.length === 0) {
	      return collection;
	    }
	    if (
	      collection.toSeq().size === 0 &&
	      !collection.__ownerID &&
	      iters.length === 1
	    ) {
	      return collection.constructor(iters[0]);
	    }
	    return collection.withMutations(function (collection) {
	      var mergeIntoCollection = merger
	        ? function (value, key) {
	            update(
	              collection,
	              key,
	              NOT_SET,
	              function (oldVal) { return (oldVal === NOT_SET ? value : merger(oldVal, value, key)); }
	            );
	          }
	        : function (value, key) {
	            collection.set(key, value);
	          };
	      for (var ii = 0; ii < iters.length; ii++) {
	        iters[ii].forEach(mergeIntoCollection);
	      }
	    });
	  }

	  function merge$1(collection) {
	    var sources = [], len = arguments.length - 1;
	    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

	    return mergeWithSources(collection, sources);
	  }

	  function mergeWith$1(merger, collection) {
	    var sources = [], len = arguments.length - 2;
	    while ( len-- > 0 ) sources[ len ] = arguments[ len + 2 ];

	    return mergeWithSources(collection, sources, merger);
	  }

	  function mergeDeep(collection) {
	    var sources = [], len = arguments.length - 1;
	    while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

	    return mergeDeepWithSources(collection, sources);
	  }

	  function mergeDeepWith(merger, collection) {
	    var sources = [], len = arguments.length - 2;
	    while ( len-- > 0 ) sources[ len ] = arguments[ len + 2 ];

	    return mergeDeepWithSources(collection, sources, merger);
	  }

	  function mergeDeepWithSources(collection, sources, merger) {
	    return mergeWithSources(collection, sources, deepMergerWith(merger));
	  }

	  function mergeWithSources(collection, sources, merger) {
	    if (!isDataStructure(collection)) {
	      throw new TypeError(
	        'Cannot merge into non-data-structure value: ' + collection
	      );
	    }
	    if (isImmutable(collection)) {
	      return typeof merger === 'function' && collection.mergeWith
	        ? collection.mergeWith.apply(collection, [ merger ].concat( sources ))
	        : collection.merge
	          ? collection.merge.apply(collection, sources)
	          : collection.concat.apply(collection, sources);
	    }
	    var isArray = Array.isArray(collection);
	    var merged = collection;
	    var Collection$$1 = isArray ? IndexedCollection : KeyedCollection;
	    var mergeItem = isArray
	      ? function (value) {
	          // Copy on write
	          if (merged === collection) {
	            merged = shallowCopy(merged);
	          }
	          merged.push(value);
	        }
	      : function (value, key) {
	          var hasVal = hasOwnProperty.call(merged, key);
	          var nextVal =
	            hasVal && merger ? merger(merged[key], value, key) : value;
	          if (!hasVal || nextVal !== merged[key]) {
	            // Copy on write
	            if (merged === collection) {
	              merged = shallowCopy(merged);
	            }
	            merged[key] = nextVal;
	          }
	        };
	    for (var i = 0; i < sources.length; i++) {
	      Collection$$1(sources[i]).forEach(mergeItem);
	    }
	    return merged;
	  }

	  function deepMergerWith(merger) {
	    function deepMerger(oldValue, newValue, key) {
	      return isDataStructure(oldValue) && isDataStructure(newValue)
	        ? mergeWithSources(oldValue, [newValue], deepMerger)
	        : merger
	          ? merger(oldValue, newValue, key)
	          : newValue;
	    }
	    return deepMerger;
	  }

	  function mergeDeep$1() {
	    var iters = [], len = arguments.length;
	    while ( len-- ) iters[ len ] = arguments[ len ];

	    return mergeDeepWithSources(this, iters);
	  }

	  function mergeDeepWith$1(merger) {
	    var iters = [], len = arguments.length - 1;
	    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

	    return mergeDeepWithSources(this, iters, merger);
	  }

	  function mergeIn(keyPath) {
	    var iters = [], len = arguments.length - 1;
	    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

	    return updateIn(this, keyPath, emptyMap(), function (m) { return mergeWithSources(m, iters); });
	  }

	  function mergeDeepIn(keyPath) {
	    var iters = [], len = arguments.length - 1;
	    while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

	    return updateIn(this, keyPath, emptyMap(), function (m) { return mergeDeepWithSources(m, iters); }
	    );
	  }

	  function withMutations(fn) {
	    var mutable = this.asMutable();
	    fn(mutable);
	    return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
	  }

	  function asMutable() {
	    return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
	  }

	  function asImmutable() {
	    return this.__ensureOwner();
	  }

	  function wasAltered() {
	    return this.__altered;
	  }

	  var Map = /*@__PURE__*/(function (KeyedCollection$$1) {
	    function Map(value) {
	      return value === null || value === undefined
	        ? emptyMap()
	        : isMap(value) && !isOrdered(value)
	          ? value
	          : emptyMap().withMutations(function (map) {
	              var iter = KeyedCollection$$1(value);
	              assertNotInfinite(iter.size);
	              iter.forEach(function (v, k) { return map.set(k, v); });
	            });
	    }

	    if ( KeyedCollection$$1 ) Map.__proto__ = KeyedCollection$$1;
	    Map.prototype = Object.create( KeyedCollection$$1 && KeyedCollection$$1.prototype );
	    Map.prototype.constructor = Map;

	    Map.of = function of () {
	      var keyValues = [], len = arguments.length;
	      while ( len-- ) keyValues[ len ] = arguments[ len ];

	      return emptyMap().withMutations(function (map) {
	        for (var i = 0; i < keyValues.length; i += 2) {
	          if (i + 1 >= keyValues.length) {
	            throw new Error('Missing value for key: ' + keyValues[i]);
	          }
	          map.set(keyValues[i], keyValues[i + 1]);
	        }
	      });
	    };

	    Map.prototype.toString = function toString () {
	      return this.__toString('Map {', '}');
	    };

	    // @pragma Access

	    Map.prototype.get = function get (k, notSetValue) {
	      return this._root
	        ? this._root.get(0, undefined, k, notSetValue)
	        : notSetValue;
	    };

	    // @pragma Modification

	    Map.prototype.set = function set (k, v) {
	      return updateMap(this, k, v);
	    };

	    Map.prototype.remove = function remove (k) {
	      return updateMap(this, k, NOT_SET);
	    };

	    Map.prototype.deleteAll = function deleteAll (keys) {
	      var collection = Collection(keys);

	      if (collection.size === 0) {
	        return this;
	      }

	      return this.withMutations(function (map) {
	        collection.forEach(function (key) { return map.remove(key); });
	      });
	    };

	    Map.prototype.clear = function clear () {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._root = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyMap();
	    };

	    // @pragma Composition

	    Map.prototype.sort = function sort (comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator));
	    };

	    Map.prototype.sortBy = function sortBy (mapper, comparator) {
	      // Late binding
	      return OrderedMap(sortFactory(this, comparator, mapper));
	    };

	    Map.prototype.map = function map (mapper, context) {
	      return this.withMutations(function (map) {
	        map.forEach(function (value, key) {
	          map.set(key, mapper.call(context, value, key, map));
	        });
	      });
	    };

	    // @pragma Mutability

	    Map.prototype.__iterator = function __iterator (type, reverse) {
	      return new MapIterator(this, type, reverse);
	    };

	    Map.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      var iterations = 0;
	      this._root &&
	        this._root.iterate(function (entry) {
	          iterations++;
	          return fn(entry[1], entry[0], this$1);
	        }, reverse);
	      return iterations;
	    };

	    Map.prototype.__ensureOwner = function __ensureOwner (ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        if (this.size === 0) {
	          return emptyMap();
	        }
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeMap(this.size, this._root, ownerID, this.__hash);
	    };

	    return Map;
	  }(KeyedCollection));

	  Map.isMap = isMap;

	  var MapPrototype = Map.prototype;
	  MapPrototype[IS_MAP_SYMBOL] = true;
	  MapPrototype[DELETE] = MapPrototype.remove;
	  MapPrototype.removeAll = MapPrototype.deleteAll;
	  MapPrototype.setIn = setIn$1;
	  MapPrototype.removeIn = MapPrototype.deleteIn = deleteIn;
	  MapPrototype.update = update$1;
	  MapPrototype.updateIn = updateIn$1;
	  MapPrototype.merge = MapPrototype.concat = merge;
	  MapPrototype.mergeWith = mergeWith;
	  MapPrototype.mergeDeep = mergeDeep$1;
	  MapPrototype.mergeDeepWith = mergeDeepWith$1;
	  MapPrototype.mergeIn = mergeIn;
	  MapPrototype.mergeDeepIn = mergeDeepIn;
	  MapPrototype.withMutations = withMutations;
	  MapPrototype.wasAltered = wasAltered;
	  MapPrototype.asImmutable = asImmutable;
	  MapPrototype['@@transducer/init'] = MapPrototype.asMutable = asMutable;
	  MapPrototype['@@transducer/step'] = function(result, arr) {
	    return result.set(arr[0], arr[1]);
	  };
	  MapPrototype['@@transducer/result'] = function(obj) {
	    return obj.asImmutable();
	  };

	  // #pragma Trie Nodes

	  var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
	    this.ownerID = ownerID;
	    this.entries = entries;
	  };

	  ArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
	    var entries = this.entries;
	    for (var ii = 0, len = entries.length; ii < len; ii++) {
	      if (is(key, entries[ii][0])) {
	        return entries[ii][1];
	      }
	    }
	    return notSetValue;
	  };

	  ArrayMapNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    var removed = value === NOT_SET;

	    var entries = this.entries;
	    var idx = 0;
	    var len = entries.length;
	    for (; idx < len; idx++) {
	      if (is(key, entries[idx][0])) {
	        break;
	      }
	    }
	    var exists = idx < len;

	    if (exists ? entries[idx][1] === value : removed) {
	      return this;
	    }

	    SetRef(didAlter);
	    (removed || !exists) && SetRef(didChangeSize);

	    if (removed && entries.length === 1) {
	      return; // undefined
	    }

	    if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
	      return createNodes(ownerID, entries, key, value);
	    }

	    var isEditable = ownerID && ownerID === this.ownerID;
	    var newEntries = isEditable ? entries : arrCopy(entries);

	    if (exists) {
	      if (removed) {
	        idx === len - 1
	          ? newEntries.pop()
	          : (newEntries[idx] = newEntries.pop());
	      } else {
	        newEntries[idx] = [key, value];
	      }
	    } else {
	      newEntries.push([key, value]);
	    }

	    if (isEditable) {
	      this.entries = newEntries;
	      return this;
	    }

	    return new ArrayMapNode(ownerID, newEntries);
	  };

	  var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
	    this.ownerID = ownerID;
	    this.bitmap = bitmap;
	    this.nodes = nodes;
	  };

	  BitmapIndexedNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
	    if (keyHash === undefined) {
	      keyHash = hash(key);
	    }
	    var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
	    var bitmap = this.bitmap;
	    return (bitmap & bit) === 0
	      ? notSetValue
	      : this.nodes[popCount(bitmap & (bit - 1))].get(
	          shift + SHIFT,
	          keyHash,
	          key,
	          notSetValue
	        );
	  };

	  BitmapIndexedNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (keyHash === undefined) {
	      keyHash = hash(key);
	    }
	    var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	    var bit = 1 << keyHashFrag;
	    var bitmap = this.bitmap;
	    var exists = (bitmap & bit) !== 0;

	    if (!exists && value === NOT_SET) {
	      return this;
	    }

	    var idx = popCount(bitmap & (bit - 1));
	    var nodes = this.nodes;
	    var node = exists ? nodes[idx] : undefined;
	    var newNode = updateNode(
	      node,
	      ownerID,
	      shift + SHIFT,
	      keyHash,
	      key,
	      value,
	      didChangeSize,
	      didAlter
	    );

	    if (newNode === node) {
	      return this;
	    }

	    if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
	      return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
	    }

	    if (
	      exists &&
	      !newNode &&
	      nodes.length === 2 &&
	      isLeafNode(nodes[idx ^ 1])
	    ) {
	      return nodes[idx ^ 1];
	    }

	    if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
	      return newNode;
	    }

	    var isEditable = ownerID && ownerID === this.ownerID;
	    var newBitmap = exists ? (newNode ? bitmap : bitmap ^ bit) : bitmap | bit;
	    var newNodes = exists
	      ? newNode
	        ? setAt(nodes, idx, newNode, isEditable)
	        : spliceOut(nodes, idx, isEditable)
	      : spliceIn(nodes, idx, newNode, isEditable);

	    if (isEditable) {
	      this.bitmap = newBitmap;
	      this.nodes = newNodes;
	      return this;
	    }

	    return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
	  };

	  var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
	    this.ownerID = ownerID;
	    this.count = count;
	    this.nodes = nodes;
	  };

	  HashArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
	    if (keyHash === undefined) {
	      keyHash = hash(key);
	    }
	    var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	    var node = this.nodes[idx];
	    return node
	      ? node.get(shift + SHIFT, keyHash, key, notSetValue)
	      : notSetValue;
	  };

	  HashArrayMapNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (keyHash === undefined) {
	      keyHash = hash(key);
	    }
	    var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
	    var removed = value === NOT_SET;
	    var nodes = this.nodes;
	    var node = nodes[idx];

	    if (removed && !node) {
	      return this;
	    }

	    var newNode = updateNode(
	      node,
	      ownerID,
	      shift + SHIFT,
	      keyHash,
	      key,
	      value,
	      didChangeSize,
	      didAlter
	    );
	    if (newNode === node) {
	      return this;
	    }

	    var newCount = this.count;
	    if (!node) {
	      newCount++;
	    } else if (!newNode) {
	      newCount--;
	      if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
	        return packNodes(ownerID, nodes, newCount, idx);
	      }
	    }

	    var isEditable = ownerID && ownerID === this.ownerID;
	    var newNodes = setAt(nodes, idx, newNode, isEditable);

	    if (isEditable) {
	      this.count = newCount;
	      this.nodes = newNodes;
	      return this;
	    }

	    return new HashArrayMapNode(ownerID, newCount, newNodes);
	  };

	  var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
	    this.ownerID = ownerID;
	    this.keyHash = keyHash;
	    this.entries = entries;
	  };

	  HashCollisionNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
	    var entries = this.entries;
	    for (var ii = 0, len = entries.length; ii < len; ii++) {
	      if (is(key, entries[ii][0])) {
	        return entries[ii][1];
	      }
	    }
	    return notSetValue;
	  };

	  HashCollisionNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    if (keyHash === undefined) {
	      keyHash = hash(key);
	    }

	    var removed = value === NOT_SET;

	    if (keyHash !== this.keyHash) {
	      if (removed) {
	        return this;
	      }
	      SetRef(didAlter);
	      SetRef(didChangeSize);
	      return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
	    }

	    var entries = this.entries;
	    var idx = 0;
	    var len = entries.length;
	    for (; idx < len; idx++) {
	      if (is(key, entries[idx][0])) {
	        break;
	      }
	    }
	    var exists = idx < len;

	    if (exists ? entries[idx][1] === value : removed) {
	      return this;
	    }

	    SetRef(didAlter);
	    (removed || !exists) && SetRef(didChangeSize);

	    if (removed && len === 2) {
	      return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
	    }

	    var isEditable = ownerID && ownerID === this.ownerID;
	    var newEntries = isEditable ? entries : arrCopy(entries);

	    if (exists) {
	      if (removed) {
	        idx === len - 1
	          ? newEntries.pop()
	          : (newEntries[idx] = newEntries.pop());
	      } else {
	        newEntries[idx] = [key, value];
	      }
	    } else {
	      newEntries.push([key, value]);
	    }

	    if (isEditable) {
	      this.entries = newEntries;
	      return this;
	    }

	    return new HashCollisionNode(ownerID, this.keyHash, newEntries);
	  };

	  var ValueNode = function ValueNode(ownerID, keyHash, entry) {
	    this.ownerID = ownerID;
	    this.keyHash = keyHash;
	    this.entry = entry;
	  };

	  ValueNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
	    return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
	  };

	  ValueNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
	    var removed = value === NOT_SET;
	    var keyMatch = is(key, this.entry[0]);
	    if (keyMatch ? value === this.entry[1] : removed) {
	      return this;
	    }

	    SetRef(didAlter);

	    if (removed) {
	      SetRef(didChangeSize);
	      return; // undefined
	    }

	    if (keyMatch) {
	      if (ownerID && ownerID === this.ownerID) {
	        this.entry[1] = value;
	        return this;
	      }
	      return new ValueNode(ownerID, this.keyHash, [key, value]);
	    }

	    SetRef(didChangeSize);
	    return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
	  };

	  // #pragma Iterators

	  ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate = function(
	    fn,
	    reverse
	  ) {
	    var entries = this.entries;
	    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
	      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
	        return false;
	      }
	    }
	  };

	  BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate = function(
	    fn,
	    reverse
	  ) {
	    var nodes = this.nodes;
	    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
	      var node = nodes[reverse ? maxIndex - ii : ii];
	      if (node && node.iterate(fn, reverse) === false) {
	        return false;
	      }
	    }
	  };

	  // eslint-disable-next-line no-unused-vars
	  ValueNode.prototype.iterate = function(fn, reverse) {
	    return fn(this.entry);
	  };

	  var MapIterator = /*@__PURE__*/(function (Iterator$$1) {
	    function MapIterator(map, type, reverse) {
	      this._type = type;
	      this._reverse = reverse;
	      this._stack = map._root && mapIteratorFrame(map._root);
	    }

	    if ( Iterator$$1 ) MapIterator.__proto__ = Iterator$$1;
	    MapIterator.prototype = Object.create( Iterator$$1 && Iterator$$1.prototype );
	    MapIterator.prototype.constructor = MapIterator;

	    MapIterator.prototype.next = function next () {
	      var type = this._type;
	      var stack = this._stack;
	      while (stack) {
	        var node = stack.node;
	        var index = stack.index++;
	        var maxIndex = (void 0);
	        if (node.entry) {
	          if (index === 0) {
	            return mapIteratorValue(type, node.entry);
	          }
	        } else if (node.entries) {
	          maxIndex = node.entries.length - 1;
	          if (index <= maxIndex) {
	            return mapIteratorValue(
	              type,
	              node.entries[this._reverse ? maxIndex - index : index]
	            );
	          }
	        } else {
	          maxIndex = node.nodes.length - 1;
	          if (index <= maxIndex) {
	            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
	            if (subNode) {
	              if (subNode.entry) {
	                return mapIteratorValue(type, subNode.entry);
	              }
	              stack = this._stack = mapIteratorFrame(subNode, stack);
	            }
	            continue;
	          }
	        }
	        stack = this._stack = this._stack.__prev;
	      }
	      return iteratorDone();
	    };

	    return MapIterator;
	  }(Iterator));

	  function mapIteratorValue(type, entry) {
	    return iteratorValue(type, entry[0], entry[1]);
	  }

	  function mapIteratorFrame(node, prev) {
	    return {
	      node: node,
	      index: 0,
	      __prev: prev,
	    };
	  }

	  function makeMap(size, root, ownerID, hash$$1) {
	    var map = Object.create(MapPrototype);
	    map.size = size;
	    map._root = root;
	    map.__ownerID = ownerID;
	    map.__hash = hash$$1;
	    map.__altered = false;
	    return map;
	  }

	  var EMPTY_MAP;
	  function emptyMap() {
	    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
	  }

	  function updateMap(map, k, v) {
	    var newRoot;
	    var newSize;
	    if (!map._root) {
	      if (v === NOT_SET) {
	        return map;
	      }
	      newSize = 1;
	      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
	    } else {
	      var didChangeSize = MakeRef();
	      var didAlter = MakeRef();
	      newRoot = updateNode(
	        map._root,
	        map.__ownerID,
	        0,
	        undefined,
	        k,
	        v,
	        didChangeSize,
	        didAlter
	      );
	      if (!didAlter.value) {
	        return map;
	      }
	      newSize = map.size + (didChangeSize.value ? (v === NOT_SET ? -1 : 1) : 0);
	    }
	    if (map.__ownerID) {
	      map.size = newSize;
	      map._root = newRoot;
	      map.__hash = undefined;
	      map.__altered = true;
	      return map;
	    }
	    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
	  }

	  function updateNode(
	    node,
	    ownerID,
	    shift,
	    keyHash,
	    key,
	    value,
	    didChangeSize,
	    didAlter
	  ) {
	    if (!node) {
	      if (value === NOT_SET) {
	        return node;
	      }
	      SetRef(didAlter);
	      SetRef(didChangeSize);
	      return new ValueNode(ownerID, keyHash, [key, value]);
	    }
	    return node.update(
	      ownerID,
	      shift,
	      keyHash,
	      key,
	      value,
	      didChangeSize,
	      didAlter
	    );
	  }

	  function isLeafNode(node) {
	    return (
	      node.constructor === ValueNode || node.constructor === HashCollisionNode
	    );
	  }

	  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
	    if (node.keyHash === keyHash) {
	      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
	    }

	    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
	    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

	    var newNode;
	    var nodes =
	      idx1 === idx2
	        ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)]
	        : ((newNode = new ValueNode(ownerID, keyHash, entry)),
	          idx1 < idx2 ? [node, newNode] : [newNode, node]);

	    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
	  }

	  function createNodes(ownerID, entries, key, value) {
	    if (!ownerID) {
	      ownerID = new OwnerID();
	    }
	    var node = new ValueNode(ownerID, hash(key), [key, value]);
	    for (var ii = 0; ii < entries.length; ii++) {
	      var entry = entries[ii];
	      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
	    }
	    return node;
	  }

	  function packNodes(ownerID, nodes, count, excluding) {
	    var bitmap = 0;
	    var packedII = 0;
	    var packedNodes = new Array(count);
	    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
	      var node = nodes[ii];
	      if (node !== undefined && ii !== excluding) {
	        bitmap |= bit;
	        packedNodes[packedII++] = node;
	      }
	    }
	    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
	  }

	  function expandNodes(ownerID, nodes, bitmap, including, node) {
	    var count = 0;
	    var expandedNodes = new Array(SIZE);
	    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
	      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
	    }
	    expandedNodes[including] = node;
	    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
	  }

	  function popCount(x) {
	    x -= (x >> 1) & 0x55555555;
	    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
	    x = (x + (x >> 4)) & 0x0f0f0f0f;
	    x += x >> 8;
	    x += x >> 16;
	    return x & 0x7f;
	  }

	  function setAt(array, idx, val, canEdit) {
	    var newArray = canEdit ? array : arrCopy(array);
	    newArray[idx] = val;
	    return newArray;
	  }

	  function spliceIn(array, idx, val, canEdit) {
	    var newLen = array.length + 1;
	    if (canEdit && idx + 1 === newLen) {
	      array[idx] = val;
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        newArray[ii] = val;
	        after = -1;
	      } else {
	        newArray[ii] = array[ii + after];
	      }
	    }
	    return newArray;
	  }

	  function spliceOut(array, idx, canEdit) {
	    var newLen = array.length - 1;
	    if (canEdit && idx === newLen) {
	      array.pop();
	      return array;
	    }
	    var newArray = new Array(newLen);
	    var after = 0;
	    for (var ii = 0; ii < newLen; ii++) {
	      if (ii === idx) {
	        after = 1;
	      }
	      newArray[ii] = array[ii + after];
	    }
	    return newArray;
	  }

	  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
	  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
	  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

	  var IS_LIST_SYMBOL = '@@__IMMUTABLE_LIST__@@';

	  function isList(maybeList) {
	    return Boolean(maybeList && maybeList[IS_LIST_SYMBOL]);
	  }

	  var List = /*@__PURE__*/(function (IndexedCollection$$1) {
	    function List(value) {
	      var empty = emptyList();
	      if (value === null || value === undefined) {
	        return empty;
	      }
	      if (isList(value)) {
	        return value;
	      }
	      var iter = IndexedCollection$$1(value);
	      var size = iter.size;
	      if (size === 0) {
	        return empty;
	      }
	      assertNotInfinite(size);
	      if (size > 0 && size < SIZE) {
	        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
	      }
	      return empty.withMutations(function (list) {
	        list.setSize(size);
	        iter.forEach(function (v, i) { return list.set(i, v); });
	      });
	    }

	    if ( IndexedCollection$$1 ) List.__proto__ = IndexedCollection$$1;
	    List.prototype = Object.create( IndexedCollection$$1 && IndexedCollection$$1.prototype );
	    List.prototype.constructor = List;

	    List.of = function of (/*...values*/) {
	      return this(arguments);
	    };

	    List.prototype.toString = function toString () {
	      return this.__toString('List [', ']');
	    };

	    // @pragma Access

	    List.prototype.get = function get (index, notSetValue) {
	      index = wrapIndex(this, index);
	      if (index >= 0 && index < this.size) {
	        index += this._origin;
	        var node = listNodeFor(this, index);
	        return node && node.array[index & MASK];
	      }
	      return notSetValue;
	    };

	    // @pragma Modification

	    List.prototype.set = function set (index, value) {
	      return updateList(this, index, value);
	    };

	    List.prototype.remove = function remove (index) {
	      return !this.has(index)
	        ? this
	        : index === 0
	          ? this.shift()
	          : index === this.size - 1
	            ? this.pop()
	            : this.splice(index, 1);
	    };

	    List.prototype.insert = function insert (index, value) {
	      return this.splice(index, 0, value);
	    };

	    List.prototype.clear = function clear () {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = this._origin = this._capacity = 0;
	        this._level = SHIFT;
	        this._root = this._tail = null;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyList();
	    };

	    List.prototype.push = function push (/*...values*/) {
	      var values = arguments;
	      var oldSize = this.size;
	      return this.withMutations(function (list) {
	        setListBounds(list, 0, oldSize + values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(oldSize + ii, values[ii]);
	        }
	      });
	    };

	    List.prototype.pop = function pop () {
	      return setListBounds(this, 0, -1);
	    };

	    List.prototype.unshift = function unshift (/*...values*/) {
	      var values = arguments;
	      return this.withMutations(function (list) {
	        setListBounds(list, -values.length);
	        for (var ii = 0; ii < values.length; ii++) {
	          list.set(ii, values[ii]);
	        }
	      });
	    };

	    List.prototype.shift = function shift () {
	      return setListBounds(this, 1);
	    };

	    // @pragma Composition

	    List.prototype.concat = function concat (/*...collections*/) {
	      var arguments$1 = arguments;

	      var seqs = [];
	      for (var i = 0; i < arguments.length; i++) {
	        var argument = arguments$1[i];
	        var seq = IndexedCollection$$1(
	          typeof argument !== 'string' && hasIterator(argument)
	            ? argument
	            : [argument]
	        );
	        if (seq.size !== 0) {
	          seqs.push(seq);
	        }
	      }
	      if (seqs.length === 0) {
	        return this;
	      }
	      if (this.size === 0 && !this.__ownerID && seqs.length === 1) {
	        return this.constructor(seqs[0]);
	      }
	      return this.withMutations(function (list) {
	        seqs.forEach(function (seq) { return seq.forEach(function (value) { return list.push(value); }); });
	      });
	    };

	    List.prototype.setSize = function setSize (size) {
	      return setListBounds(this, 0, size);
	    };

	    List.prototype.map = function map (mapper, context) {
	      var this$1 = this;

	      return this.withMutations(function (list) {
	        for (var i = 0; i < this$1.size; i++) {
	          list.set(i, mapper.call(context, list.get(i), i, list));
	        }
	      });
	    };

	    // @pragma Iteration

	    List.prototype.slice = function slice (begin, end) {
	      var size = this.size;
	      if (wholeSlice(begin, end, size)) {
	        return this;
	      }
	      return setListBounds(
	        this,
	        resolveBegin(begin, size),
	        resolveEnd(end, size)
	      );
	    };

	    List.prototype.__iterator = function __iterator (type, reverse) {
	      var index = reverse ? this.size : 0;
	      var values = iterateList(this, reverse);
	      return new Iterator(function () {
	        var value = values();
	        return value === DONE
	          ? iteratorDone()
	          : iteratorValue(type, reverse ? --index : index++, value);
	      });
	    };

	    List.prototype.__iterate = function __iterate (fn, reverse) {
	      var index = reverse ? this.size : 0;
	      var values = iterateList(this, reverse);
	      var value;
	      while ((value = values()) !== DONE) {
	        if (fn(value, reverse ? --index : index++, this) === false) {
	          break;
	        }
	      }
	      return index;
	    };

	    List.prototype.__ensureOwner = function __ensureOwner (ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        if (this.size === 0) {
	          return emptyList();
	        }
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeList(
	        this._origin,
	        this._capacity,
	        this._level,
	        this._root,
	        this._tail,
	        ownerID,
	        this.__hash
	      );
	    };

	    return List;
	  }(IndexedCollection));

	  List.isList = isList;

	  var ListPrototype = List.prototype;
	  ListPrototype[IS_LIST_SYMBOL] = true;
	  ListPrototype[DELETE] = ListPrototype.remove;
	  ListPrototype.merge = ListPrototype.concat;
	  ListPrototype.setIn = setIn$1;
	  ListPrototype.deleteIn = ListPrototype.removeIn = deleteIn;
	  ListPrototype.update = update$1;
	  ListPrototype.updateIn = updateIn$1;
	  ListPrototype.mergeIn = mergeIn;
	  ListPrototype.mergeDeepIn = mergeDeepIn;
	  ListPrototype.withMutations = withMutations;
	  ListPrototype.wasAltered = wasAltered;
	  ListPrototype.asImmutable = asImmutable;
	  ListPrototype['@@transducer/init'] = ListPrototype.asMutable = asMutable;
	  ListPrototype['@@transducer/step'] = function(result, arr) {
	    return result.push(arr);
	  };
	  ListPrototype['@@transducer/result'] = function(obj) {
	    return obj.asImmutable();
	  };

	  var VNode = function VNode(array, ownerID) {
	    this.array = array;
	    this.ownerID = ownerID;
	  };

	  // TODO: seems like these methods are very similar

	  VNode.prototype.removeBefore = function removeBefore (ownerID, level, index) {
	    if (index === level ? 1 << level : this.array.length === 0) {
	      return this;
	    }
	    var originIndex = (index >>> level) & MASK;
	    if (originIndex >= this.array.length) {
	      return new VNode([], ownerID);
	    }
	    var removingFirst = originIndex === 0;
	    var newChild;
	    if (level > 0) {
	      var oldChild = this.array[originIndex];
	      newChild =
	        oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
	      if (newChild === oldChild && removingFirst) {
	        return this;
	      }
	    }
	    if (removingFirst && !newChild) {
	      return this;
	    }
	    var editable = editableVNode(this, ownerID);
	    if (!removingFirst) {
	      for (var ii = 0; ii < originIndex; ii++) {
	        editable.array[ii] = undefined;
	      }
	    }
	    if (newChild) {
	      editable.array[originIndex] = newChild;
	    }
	    return editable;
	  };

	  VNode.prototype.removeAfter = function removeAfter (ownerID, level, index) {
	    if (index === (level ? 1 << level : 0) || this.array.length === 0) {
	      return this;
	    }
	    var sizeIndex = ((index - 1) >>> level) & MASK;
	    if (sizeIndex >= this.array.length) {
	      return this;
	    }

	    var newChild;
	    if (level > 0) {
	      var oldChild = this.array[sizeIndex];
	      newChild =
	        oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
	      if (newChild === oldChild && sizeIndex === this.array.length - 1) {
	        return this;
	      }
	    }

	    var editable = editableVNode(this, ownerID);
	    editable.array.splice(sizeIndex + 1);
	    if (newChild) {
	      editable.array[sizeIndex] = newChild;
	    }
	    return editable;
	  };

	  var DONE = {};

	  function iterateList(list, reverse) {
	    var left = list._origin;
	    var right = list._capacity;
	    var tailPos = getTailOffset(right);
	    var tail = list._tail;

	    return iterateNodeOrLeaf(list._root, list._level, 0);

	    function iterateNodeOrLeaf(node, level, offset) {
	      return level === 0
	        ? iterateLeaf(node, offset)
	        : iterateNode(node, level, offset);
	    }

	    function iterateLeaf(node, offset) {
	      var array = offset === tailPos ? tail && tail.array : node && node.array;
	      var from = offset > left ? 0 : left - offset;
	      var to = right - offset;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function () {
	        if (from === to) {
	          return DONE;
	        }
	        var idx = reverse ? --to : from++;
	        return array && array[idx];
	      };
	    }

	    function iterateNode(node, level, offset) {
	      var values;
	      var array = node && node.array;
	      var from = offset > left ? 0 : (left - offset) >> level;
	      var to = ((right - offset) >> level) + 1;
	      if (to > SIZE) {
	        to = SIZE;
	      }
	      return function () {
	        while (true) {
	          if (values) {
	            var value = values();
	            if (value !== DONE) {
	              return value;
	            }
	            values = null;
	          }
	          if (from === to) {
	            return DONE;
	          }
	          var idx = reverse ? --to : from++;
	          values = iterateNodeOrLeaf(
	            array && array[idx],
	            level - SHIFT,
	            offset + (idx << level)
	          );
	        }
	      };
	    }
	  }

	  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
	    var list = Object.create(ListPrototype);
	    list.size = capacity - origin;
	    list._origin = origin;
	    list._capacity = capacity;
	    list._level = level;
	    list._root = root;
	    list._tail = tail;
	    list.__ownerID = ownerID;
	    list.__hash = hash;
	    list.__altered = false;
	    return list;
	  }

	  var EMPTY_LIST;
	  function emptyList() {
	    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
	  }

	  function updateList(list, index, value) {
	    index = wrapIndex(list, index);

	    if (index !== index) {
	      return list;
	    }

	    if (index >= list.size || index < 0) {
	      return list.withMutations(function (list) {
	        index < 0
	          ? setListBounds(list, index).set(0, value)
	          : setListBounds(list, 0, index + 1).set(index, value);
	      });
	    }

	    index += list._origin;

	    var newTail = list._tail;
	    var newRoot = list._root;
	    var didAlter = MakeRef();
	    if (index >= getTailOffset(list._capacity)) {
	      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
	    } else {
	      newRoot = updateVNode(
	        newRoot,
	        list.__ownerID,
	        list._level,
	        index,
	        value,
	        didAlter
	      );
	    }

	    if (!didAlter.value) {
	      return list;
	    }

	    if (list.__ownerID) {
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
	  }

	  function updateVNode(node, ownerID, level, index, value, didAlter) {
	    var idx = (index >>> level) & MASK;
	    var nodeHas = node && idx < node.array.length;
	    if (!nodeHas && value === undefined) {
	      return node;
	    }

	    var newNode;

	    if (level > 0) {
	      var lowerNode = node && node.array[idx];
	      var newLowerNode = updateVNode(
	        lowerNode,
	        ownerID,
	        level - SHIFT,
	        index,
	        value,
	        didAlter
	      );
	      if (newLowerNode === lowerNode) {
	        return node;
	      }
	      newNode = editableVNode(node, ownerID);
	      newNode.array[idx] = newLowerNode;
	      return newNode;
	    }

	    if (nodeHas && node.array[idx] === value) {
	      return node;
	    }

	    if (didAlter) {
	      SetRef(didAlter);
	    }

	    newNode = editableVNode(node, ownerID);
	    if (value === undefined && idx === newNode.array.length - 1) {
	      newNode.array.pop();
	    } else {
	      newNode.array[idx] = value;
	    }
	    return newNode;
	  }

	  function editableVNode(node, ownerID) {
	    if (ownerID && node && ownerID === node.ownerID) {
	      return node;
	    }
	    return new VNode(node ? node.array.slice() : [], ownerID);
	  }

	  function listNodeFor(list, rawIndex) {
	    if (rawIndex >= getTailOffset(list._capacity)) {
	      return list._tail;
	    }
	    if (rawIndex < 1 << (list._level + SHIFT)) {
	      var node = list._root;
	      var level = list._level;
	      while (node && level > 0) {
	        node = node.array[(rawIndex >>> level) & MASK];
	        level -= SHIFT;
	      }
	      return node;
	    }
	  }

	  function setListBounds(list, begin, end) {
	    // Sanitize begin & end using this shorthand for ToInt32(argument)
	    // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
	    if (begin !== undefined) {
	      begin |= 0;
	    }
	    if (end !== undefined) {
	      end |= 0;
	    }
	    var owner = list.__ownerID || new OwnerID();
	    var oldOrigin = list._origin;
	    var oldCapacity = list._capacity;
	    var newOrigin = oldOrigin + begin;
	    var newCapacity =
	      end === undefined
	        ? oldCapacity
	        : end < 0
	          ? oldCapacity + end
	          : oldOrigin + end;
	    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
	      return list;
	    }

	    // If it's going to end after it starts, it's empty.
	    if (newOrigin >= newCapacity) {
	      return list.clear();
	    }

	    var newLevel = list._level;
	    var newRoot = list._root;

	    // New origin might need creating a higher root.
	    var offsetShift = 0;
	    while (newOrigin + offsetShift < 0) {
	      newRoot = new VNode(
	        newRoot && newRoot.array.length ? [undefined, newRoot] : [],
	        owner
	      );
	      newLevel += SHIFT;
	      offsetShift += 1 << newLevel;
	    }
	    if (offsetShift) {
	      newOrigin += offsetShift;
	      oldOrigin += offsetShift;
	      newCapacity += offsetShift;
	      oldCapacity += offsetShift;
	    }

	    var oldTailOffset = getTailOffset(oldCapacity);
	    var newTailOffset = getTailOffset(newCapacity);

	    // New size might need creating a higher root.
	    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
	      newRoot = new VNode(
	        newRoot && newRoot.array.length ? [newRoot] : [],
	        owner
	      );
	      newLevel += SHIFT;
	    }

	    // Locate or create the new tail.
	    var oldTail = list._tail;
	    var newTail =
	      newTailOffset < oldTailOffset
	        ? listNodeFor(list, newCapacity - 1)
	        : newTailOffset > oldTailOffset
	          ? new VNode([], owner)
	          : oldTail;

	    // Merge Tail into tree.
	    if (
	      oldTail &&
	      newTailOffset > oldTailOffset &&
	      newOrigin < oldCapacity &&
	      oldTail.array.length
	    ) {
	      newRoot = editableVNode(newRoot, owner);
	      var node = newRoot;
	      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
	        var idx = (oldTailOffset >>> level) & MASK;
	        node = node.array[idx] = editableVNode(node.array[idx], owner);
	      }
	      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
	    }

	    // If the size has been reduced, there's a chance the tail needs to be trimmed.
	    if (newCapacity < oldCapacity) {
	      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
	    }

	    // If the new origin is within the tail, then we do not need a root.
	    if (newOrigin >= newTailOffset) {
	      newOrigin -= newTailOffset;
	      newCapacity -= newTailOffset;
	      newLevel = SHIFT;
	      newRoot = null;
	      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

	      // Otherwise, if the root has been trimmed, garbage collect.
	    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
	      offsetShift = 0;

	      // Identify the new top root node of the subtree of the old root.
	      while (newRoot) {
	        var beginIndex = (newOrigin >>> newLevel) & MASK;
	        if ((beginIndex !== newTailOffset >>> newLevel) & MASK) {
	          break;
	        }
	        if (beginIndex) {
	          offsetShift += (1 << newLevel) * beginIndex;
	        }
	        newLevel -= SHIFT;
	        newRoot = newRoot.array[beginIndex];
	      }

	      // Trim the new sides of the new root.
	      if (newRoot && newOrigin > oldOrigin) {
	        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
	      }
	      if (newRoot && newTailOffset < oldTailOffset) {
	        newRoot = newRoot.removeAfter(
	          owner,
	          newLevel,
	          newTailOffset - offsetShift
	        );
	      }
	      if (offsetShift) {
	        newOrigin -= offsetShift;
	        newCapacity -= offsetShift;
	      }
	    }

	    if (list.__ownerID) {
	      list.size = newCapacity - newOrigin;
	      list._origin = newOrigin;
	      list._capacity = newCapacity;
	      list._level = newLevel;
	      list._root = newRoot;
	      list._tail = newTail;
	      list.__hash = undefined;
	      list.__altered = true;
	      return list;
	    }
	    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
	  }

	  function getTailOffset(size) {
	    return size < SIZE ? 0 : ((size - 1) >>> SHIFT) << SHIFT;
	  }

	  var OrderedMap = /*@__PURE__*/(function (Map$$1) {
	    function OrderedMap(value) {
	      return value === null || value === undefined
	        ? emptyOrderedMap()
	        : isOrderedMap(value)
	          ? value
	          : emptyOrderedMap().withMutations(function (map) {
	              var iter = KeyedCollection(value);
	              assertNotInfinite(iter.size);
	              iter.forEach(function (v, k) { return map.set(k, v); });
	            });
	    }

	    if ( Map$$1 ) OrderedMap.__proto__ = Map$$1;
	    OrderedMap.prototype = Object.create( Map$$1 && Map$$1.prototype );
	    OrderedMap.prototype.constructor = OrderedMap;

	    OrderedMap.of = function of (/*...values*/) {
	      return this(arguments);
	    };

	    OrderedMap.prototype.toString = function toString () {
	      return this.__toString('OrderedMap {', '}');
	    };

	    // @pragma Access

	    OrderedMap.prototype.get = function get (k, notSetValue) {
	      var index = this._map.get(k);
	      return index !== undefined ? this._list.get(index)[1] : notSetValue;
	    };

	    // @pragma Modification

	    OrderedMap.prototype.clear = function clear () {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._map.clear();
	        this._list.clear();
	        return this;
	      }
	      return emptyOrderedMap();
	    };

	    OrderedMap.prototype.set = function set (k, v) {
	      return updateOrderedMap(this, k, v);
	    };

	    OrderedMap.prototype.remove = function remove (k) {
	      return updateOrderedMap(this, k, NOT_SET);
	    };

	    OrderedMap.prototype.wasAltered = function wasAltered () {
	      return this._map.wasAltered() || this._list.wasAltered();
	    };

	    OrderedMap.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      return this._list.__iterate(
	        function (entry) { return entry && fn(entry[1], entry[0], this$1); },
	        reverse
	      );
	    };

	    OrderedMap.prototype.__iterator = function __iterator (type, reverse) {
	      return this._list.fromEntrySeq().__iterator(type, reverse);
	    };

	    OrderedMap.prototype.__ensureOwner = function __ensureOwner (ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      var newList = this._list.__ensureOwner(ownerID);
	      if (!ownerID) {
	        if (this.size === 0) {
	          return emptyOrderedMap();
	        }
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        this._list = newList;
	        return this;
	      }
	      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
	    };

	    return OrderedMap;
	  }(Map));

	  OrderedMap.isOrderedMap = isOrderedMap;

	  OrderedMap.prototype[IS_ORDERED_SYMBOL] = true;
	  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

	  function makeOrderedMap(map, list, ownerID, hash) {
	    var omap = Object.create(OrderedMap.prototype);
	    omap.size = map ? map.size : 0;
	    omap._map = map;
	    omap._list = list;
	    omap.__ownerID = ownerID;
	    omap.__hash = hash;
	    return omap;
	  }

	  var EMPTY_ORDERED_MAP;
	  function emptyOrderedMap() {
	    return (
	      EMPTY_ORDERED_MAP ||
	      (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()))
	    );
	  }

	  function updateOrderedMap(omap, k, v) {
	    var map = omap._map;
	    var list = omap._list;
	    var i = map.get(k);
	    var has = i !== undefined;
	    var newMap;
	    var newList;
	    if (v === NOT_SET) {
	      // removed
	      if (!has) {
	        return omap;
	      }
	      if (list.size >= SIZE && list.size >= map.size * 2) {
	        newList = list.filter(function (entry, idx) { return entry !== undefined && i !== idx; });
	        newMap = newList
	          .toKeyedSeq()
	          .map(function (entry) { return entry[0]; })
	          .flip()
	          .toMap();
	        if (omap.__ownerID) {
	          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
	        }
	      } else {
	        newMap = map.remove(k);
	        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
	      }
	    } else if (has) {
	      if (v === list.get(i)[1]) {
	        return omap;
	      }
	      newMap = map;
	      newList = list.set(i, [k, v]);
	    } else {
	      newMap = map.set(k, list.size);
	      newList = list.set(list.size, [k, v]);
	    }
	    if (omap.__ownerID) {
	      omap.size = newMap.size;
	      omap._map = newMap;
	      omap._list = newList;
	      omap.__hash = undefined;
	      return omap;
	    }
	    return makeOrderedMap(newMap, newList);
	  }

	  var IS_STACK_SYMBOL = '@@__IMMUTABLE_STACK__@@';

	  function isStack(maybeStack) {
	    return Boolean(maybeStack && maybeStack[IS_STACK_SYMBOL]);
	  }

	  var Stack = /*@__PURE__*/(function (IndexedCollection$$1) {
	    function Stack(value) {
	      return value === null || value === undefined
	        ? emptyStack()
	        : isStack(value)
	          ? value
	          : emptyStack().pushAll(value);
	    }

	    if ( IndexedCollection$$1 ) Stack.__proto__ = IndexedCollection$$1;
	    Stack.prototype = Object.create( IndexedCollection$$1 && IndexedCollection$$1.prototype );
	    Stack.prototype.constructor = Stack;

	    Stack.of = function of (/*...values*/) {
	      return this(arguments);
	    };

	    Stack.prototype.toString = function toString () {
	      return this.__toString('Stack [', ']');
	    };

	    // @pragma Access

	    Stack.prototype.get = function get (index, notSetValue) {
	      var head = this._head;
	      index = wrapIndex(this, index);
	      while (head && index--) {
	        head = head.next;
	      }
	      return head ? head.value : notSetValue;
	    };

	    Stack.prototype.peek = function peek () {
	      return this._head && this._head.value;
	    };

	    // @pragma Modification

	    Stack.prototype.push = function push (/*...values*/) {
	      var arguments$1 = arguments;

	      if (arguments.length === 0) {
	        return this;
	      }
	      var newSize = this.size + arguments.length;
	      var head = this._head;
	      for (var ii = arguments.length - 1; ii >= 0; ii--) {
	        head = {
	          value: arguments$1[ii],
	          next: head,
	        };
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    Stack.prototype.pushAll = function pushAll (iter) {
	      iter = IndexedCollection$$1(iter);
	      if (iter.size === 0) {
	        return this;
	      }
	      if (this.size === 0 && isStack(iter)) {
	        return iter;
	      }
	      assertNotInfinite(iter.size);
	      var newSize = this.size;
	      var head = this._head;
	      iter.__iterate(function (value) {
	        newSize++;
	        head = {
	          value: value,
	          next: head,
	        };
	      }, /* reverse */ true);
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    Stack.prototype.pop = function pop () {
	      return this.slice(1);
	    };

	    Stack.prototype.clear = function clear () {
	      if (this.size === 0) {
	        return this;
	      }
	      if (this.__ownerID) {
	        this.size = 0;
	        this._head = undefined;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return emptyStack();
	    };

	    Stack.prototype.slice = function slice (begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      var resolvedBegin = resolveBegin(begin, this.size);
	      var resolvedEnd = resolveEnd(end, this.size);
	      if (resolvedEnd !== this.size) {
	        // super.slice(begin, end);
	        return IndexedCollection$$1.prototype.slice.call(this, begin, end);
	      }
	      var newSize = this.size - resolvedBegin;
	      var head = this._head;
	      while (resolvedBegin--) {
	        head = head.next;
	      }
	      if (this.__ownerID) {
	        this.size = newSize;
	        this._head = head;
	        this.__hash = undefined;
	        this.__altered = true;
	        return this;
	      }
	      return makeStack(newSize, head);
	    };

	    // @pragma Mutability

	    Stack.prototype.__ensureOwner = function __ensureOwner (ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      if (!ownerID) {
	        if (this.size === 0) {
	          return emptyStack();
	        }
	        this.__ownerID = ownerID;
	        this.__altered = false;
	        return this;
	      }
	      return makeStack(this.size, this._head, ownerID, this.__hash);
	    };

	    // @pragma Iteration

	    Stack.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      if (reverse) {
	        return new ArraySeq(this.toArray()).__iterate(
	          function (v, k) { return fn(v, k, this$1); },
	          reverse
	        );
	      }
	      var iterations = 0;
	      var node = this._head;
	      while (node) {
	        if (fn(node.value, iterations++, this) === false) {
	          break;
	        }
	        node = node.next;
	      }
	      return iterations;
	    };

	    Stack.prototype.__iterator = function __iterator (type, reverse) {
	      if (reverse) {
	        return new ArraySeq(this.toArray()).__iterator(type, reverse);
	      }
	      var iterations = 0;
	      var node = this._head;
	      return new Iterator(function () {
	        if (node) {
	          var value = node.value;
	          node = node.next;
	          return iteratorValue(type, iterations++, value);
	        }
	        return iteratorDone();
	      });
	    };

	    return Stack;
	  }(IndexedCollection));

	  Stack.isStack = isStack;

	  var StackPrototype = Stack.prototype;
	  StackPrototype[IS_STACK_SYMBOL] = true;
	  StackPrototype.shift = StackPrototype.pop;
	  StackPrototype.unshift = StackPrototype.push;
	  StackPrototype.unshiftAll = StackPrototype.pushAll;
	  StackPrototype.withMutations = withMutations;
	  StackPrototype.wasAltered = wasAltered;
	  StackPrototype.asImmutable = asImmutable;
	  StackPrototype['@@transducer/init'] = StackPrototype.asMutable = asMutable;
	  StackPrototype['@@transducer/step'] = function(result, arr) {
	    return result.unshift(arr);
	  };
	  StackPrototype['@@transducer/result'] = function(obj) {
	    return obj.asImmutable();
	  };

	  function makeStack(size, head, ownerID, hash) {
	    var map = Object.create(StackPrototype);
	    map.size = size;
	    map._head = head;
	    map.__ownerID = ownerID;
	    map.__hash = hash;
	    map.__altered = false;
	    return map;
	  }

	  var EMPTY_STACK;
	  function emptyStack() {
	    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
	  }

	  var IS_SET_SYMBOL = '@@__IMMUTABLE_SET__@@';

	  function isSet(maybeSet) {
	    return Boolean(maybeSet && maybeSet[IS_SET_SYMBOL]);
	  }

	  function isOrderedSet(maybeOrderedSet) {
	    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
	  }

	  function deepEqual(a, b) {
	    if (a === b) {
	      return true;
	    }

	    if (
	      !isCollection(b) ||
	      (a.size !== undefined && b.size !== undefined && a.size !== b.size) ||
	      (a.__hash !== undefined &&
	        b.__hash !== undefined &&
	        a.__hash !== b.__hash) ||
	      isKeyed(a) !== isKeyed(b) ||
	      isIndexed(a) !== isIndexed(b) ||
	      isOrdered(a) !== isOrdered(b)
	    ) {
	      return false;
	    }

	    if (a.size === 0 && b.size === 0) {
	      return true;
	    }

	    var notAssociative = !isAssociative(a);

	    if (isOrdered(a)) {
	      var entries = a.entries();
	      return (
	        b.every(function (v, k) {
	          var entry = entries.next().value;
	          return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
	        }) && entries.next().done
	      );
	    }

	    var flipped = false;

	    if (a.size === undefined) {
	      if (b.size === undefined) {
	        if (typeof a.cacheResult === 'function') {
	          a.cacheResult();
	        }
	      } else {
	        flipped = true;
	        var _ = a;
	        a = b;
	        b = _;
	      }
	    }

	    var allEqual = true;
	    var bSize = b.__iterate(function (v, k) {
	      if (
	        notAssociative
	          ? !a.has(v)
	          : flipped
	            ? !is(v, a.get(k, NOT_SET))
	            : !is(a.get(k, NOT_SET), v)
	      ) {
	        allEqual = false;
	        return false;
	      }
	    });

	    return allEqual && a.size === bSize;
	  }

	  /**
	   * Contributes additional methods to a constructor
	   */
	  function mixin(ctor, methods) {
	    var keyCopier = function (key) {
	      ctor.prototype[key] = methods[key];
	    };
	    Object.keys(methods).forEach(keyCopier);
	    Object.getOwnPropertySymbols &&
	      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
	    return ctor;
	  }

	  function toJS(value) {
	    if (!value || typeof value !== 'object') {
	      return value;
	    }
	    if (!isCollection(value)) {
	      if (!isDataStructure(value)) {
	        return value;
	      }
	      value = Seq(value);
	    }
	    if (isKeyed(value)) {
	      var result$1 = {};
	      value.__iterate(function (v, k) {
	        result$1[k] = toJS(v);
	      });
	      return result$1;
	    }
	    var result = [];
	    value.__iterate(function (v) {
	      result.push(toJS(v));
	    });
	    return result;
	  }

	  var Set = /*@__PURE__*/(function (SetCollection$$1) {
	    function Set(value) {
	      return value === null || value === undefined
	        ? emptySet()
	        : isSet(value) && !isOrdered(value)
	          ? value
	          : emptySet().withMutations(function (set) {
	              var iter = SetCollection$$1(value);
	              assertNotInfinite(iter.size);
	              iter.forEach(function (v) { return set.add(v); });
	            });
	    }

	    if ( SetCollection$$1 ) Set.__proto__ = SetCollection$$1;
	    Set.prototype = Object.create( SetCollection$$1 && SetCollection$$1.prototype );
	    Set.prototype.constructor = Set;

	    Set.of = function of (/*...values*/) {
	      return this(arguments);
	    };

	    Set.fromKeys = function fromKeys (value) {
	      return this(KeyedCollection(value).keySeq());
	    };

	    Set.intersect = function intersect (sets) {
	      sets = Collection(sets).toArray();
	      return sets.length
	        ? SetPrototype.intersect.apply(Set(sets.pop()), sets)
	        : emptySet();
	    };

	    Set.union = function union (sets) {
	      sets = Collection(sets).toArray();
	      return sets.length
	        ? SetPrototype.union.apply(Set(sets.pop()), sets)
	        : emptySet();
	    };

	    Set.prototype.toString = function toString () {
	      return this.__toString('Set {', '}');
	    };

	    // @pragma Access

	    Set.prototype.has = function has (value) {
	      return this._map.has(value);
	    };

	    // @pragma Modification

	    Set.prototype.add = function add (value) {
	      return updateSet(this, this._map.set(value, value));
	    };

	    Set.prototype.remove = function remove (value) {
	      return updateSet(this, this._map.remove(value));
	    };

	    Set.prototype.clear = function clear () {
	      return updateSet(this, this._map.clear());
	    };

	    // @pragma Composition

	    Set.prototype.map = function map (mapper, context) {
	      var this$1 = this;

	      var removes = [];
	      var adds = [];
	      this.forEach(function (value) {
	        var mapped = mapper.call(context, value, value, this$1);
	        if (mapped !== value) {
	          removes.push(value);
	          adds.push(mapped);
	        }
	      });
	      return this.withMutations(function (set) {
	        removes.forEach(function (value) { return set.remove(value); });
	        adds.forEach(function (value) { return set.add(value); });
	      });
	    };

	    Set.prototype.union = function union () {
	      var iters = [], len = arguments.length;
	      while ( len-- ) iters[ len ] = arguments[ len ];

	      iters = iters.filter(function (x) { return x.size !== 0; });
	      if (iters.length === 0) {
	        return this;
	      }
	      if (this.size === 0 && !this.__ownerID && iters.length === 1) {
	        return this.constructor(iters[0]);
	      }
	      return this.withMutations(function (set) {
	        for (var ii = 0; ii < iters.length; ii++) {
	          SetCollection$$1(iters[ii]).forEach(function (value) { return set.add(value); });
	        }
	      });
	    };

	    Set.prototype.intersect = function intersect () {
	      var iters = [], len = arguments.length;
	      while ( len-- ) iters[ len ] = arguments[ len ];

	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function (iter) { return SetCollection$$1(iter); });
	      var toRemove = [];
	      this.forEach(function (value) {
	        if (!iters.every(function (iter) { return iter.includes(value); })) {
	          toRemove.push(value);
	        }
	      });
	      return this.withMutations(function (set) {
	        toRemove.forEach(function (value) {
	          set.remove(value);
	        });
	      });
	    };

	    Set.prototype.subtract = function subtract () {
	      var iters = [], len = arguments.length;
	      while ( len-- ) iters[ len ] = arguments[ len ];

	      if (iters.length === 0) {
	        return this;
	      }
	      iters = iters.map(function (iter) { return SetCollection$$1(iter); });
	      var toRemove = [];
	      this.forEach(function (value) {
	        if (iters.some(function (iter) { return iter.includes(value); })) {
	          toRemove.push(value);
	        }
	      });
	      return this.withMutations(function (set) {
	        toRemove.forEach(function (value) {
	          set.remove(value);
	        });
	      });
	    };

	    Set.prototype.sort = function sort (comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator));
	    };

	    Set.prototype.sortBy = function sortBy (mapper, comparator) {
	      // Late binding
	      return OrderedSet(sortFactory(this, comparator, mapper));
	    };

	    Set.prototype.wasAltered = function wasAltered () {
	      return this._map.wasAltered();
	    };

	    Set.prototype.__iterate = function __iterate (fn, reverse) {
	      var this$1 = this;

	      return this._map.__iterate(function (k) { return fn(k, k, this$1); }, reverse);
	    };

	    Set.prototype.__iterator = function __iterator (type, reverse) {
	      return this._map.__iterator(type, reverse);
	    };

	    Set.prototype.__ensureOwner = function __ensureOwner (ownerID) {
	      if (ownerID === this.__ownerID) {
	        return this;
	      }
	      var newMap = this._map.__ensureOwner(ownerID);
	      if (!ownerID) {
	        if (this.size === 0) {
	          return this.__empty();
	        }
	        this.__ownerID = ownerID;
	        this._map = newMap;
	        return this;
	      }
	      return this.__make(newMap, ownerID);
	    };

	    return Set;
	  }(SetCollection));

	  Set.isSet = isSet;

	  var SetPrototype = Set.prototype;
	  SetPrototype[IS_SET_SYMBOL] = true;
	  SetPrototype[DELETE] = SetPrototype.remove;
	  SetPrototype.merge = SetPrototype.concat = SetPrototype.union;
	  SetPrototype.withMutations = withMutations;
	  SetPrototype.asImmutable = asImmutable;
	  SetPrototype['@@transducer/init'] = SetPrototype.asMutable = asMutable;
	  SetPrototype['@@transducer/step'] = function(result, arr) {
	    return result.add(arr);
	  };
	  SetPrototype['@@transducer/result'] = function(obj) {
	    return obj.asImmutable();
	  };

	  SetPrototype.__empty = emptySet;
	  SetPrototype.__make = makeSet;

	  function updateSet(set, newMap) {
	    if (set.__ownerID) {
	      set.size = newMap.size;
	      set._map = newMap;
	      return set;
	    }
	    return newMap === set._map
	      ? set
	      : newMap.size === 0
	        ? set.__empty()
	        : set.__make(newMap);
	  }

	  function makeSet(map, ownerID) {
	    var set = Object.create(SetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }

	  var EMPTY_SET;
	  function emptySet() {
	    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
	  }

	  /**
	   * Returns a lazy seq of nums from start (inclusive) to end
	   * (exclusive), by step, where start defaults to 0, step to 1, and end to
	   * infinity. When start is equal to end, returns empty list.
	   */
	  var Range = /*@__PURE__*/(function (IndexedSeq$$1) {
	    function Range(start, end, step) {
	      if (!(this instanceof Range)) {
	        return new Range(start, end, step);
	      }
	      invariant(step !== 0, 'Cannot step a Range by 0');
	      start = start || 0;
	      if (end === undefined) {
	        end = Infinity;
	      }
	      step = step === undefined ? 1 : Math.abs(step);
	      if (end < start) {
	        step = -step;
	      }
	      this._start = start;
	      this._end = end;
	      this._step = step;
	      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
	      if (this.size === 0) {
	        if (EMPTY_RANGE) {
	          return EMPTY_RANGE;
	        }
	        EMPTY_RANGE = this;
	      }
	    }

	    if ( IndexedSeq$$1 ) Range.__proto__ = IndexedSeq$$1;
	    Range.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
	    Range.prototype.constructor = Range;

	    Range.prototype.toString = function toString () {
	      if (this.size === 0) {
	        return 'Range []';
	      }
	      return (
	        'Range [ ' +
	        this._start +
	        '...' +
	        this._end +
	        (this._step !== 1 ? ' by ' + this._step : '') +
	        ' ]'
	      );
	    };

	    Range.prototype.get = function get (index, notSetValue) {
	      return this.has(index)
	        ? this._start + wrapIndex(this, index) * this._step
	        : notSetValue;
	    };

	    Range.prototype.includes = function includes (searchValue) {
	      var possibleIndex = (searchValue - this._start) / this._step;
	      return (
	        possibleIndex >= 0 &&
	        possibleIndex < this.size &&
	        possibleIndex === Math.floor(possibleIndex)
	      );
	    };

	    Range.prototype.slice = function slice (begin, end) {
	      if (wholeSlice(begin, end, this.size)) {
	        return this;
	      }
	      begin = resolveBegin(begin, this.size);
	      end = resolveEnd(end, this.size);
	      if (end <= begin) {
	        return new Range(0, 0);
	      }
	      return new Range(
	        this.get(begin, this._end),
	        this.get(end, this._end),
	        this._step
	      );
	    };

	    Range.prototype.indexOf = function indexOf (searchValue) {
	      var offsetValue = searchValue - this._start;
	      if (offsetValue % this._step === 0) {
	        var index = offsetValue / this._step;
	        if (index >= 0 && index < this.size) {
	          return index;
	        }
	      }
	      return -1;
	    };

	    Range.prototype.lastIndexOf = function lastIndexOf (searchValue) {
	      return this.indexOf(searchValue);
	    };

	    Range.prototype.__iterate = function __iterate (fn, reverse) {
	      var size = this.size;
	      var step = this._step;
	      var value = reverse ? this._start + (size - 1) * step : this._start;
	      var i = 0;
	      while (i !== size) {
	        if (fn(value, reverse ? size - ++i : i++, this) === false) {
	          break;
	        }
	        value += reverse ? -step : step;
	      }
	      return i;
	    };

	    Range.prototype.__iterator = function __iterator (type, reverse) {
	      var size = this.size;
	      var step = this._step;
	      var value = reverse ? this._start + (size - 1) * step : this._start;
	      var i = 0;
	      return new Iterator(function () {
	        if (i === size) {
	          return iteratorDone();
	        }
	        var v = value;
	        value += reverse ? -step : step;
	        return iteratorValue(type, reverse ? size - ++i : i++, v);
	      });
	    };

	    Range.prototype.equals = function equals (other) {
	      return other instanceof Range
	        ? this._start === other._start &&
	            this._end === other._end &&
	            this._step === other._step
	        : deepEqual(this, other);
	    };

	    return Range;
	  }(IndexedSeq));

	  var EMPTY_RANGE;

	  function getIn(collection, searchKeyPath, notSetValue) {
	    var keyPath = coerceKeyPath(searchKeyPath);
	    var i = 0;
	    while (i !== keyPath.length) {
	      collection = get(collection, keyPath[i++], NOT_SET);
	      if (collection === NOT_SET) {
	        return notSetValue;
	      }
	    }
	    return collection;
	  }

	  function getIn$1(searchKeyPath, notSetValue) {
	    return getIn(this, searchKeyPath, notSetValue);
	  }

	  function hasIn(collection, keyPath) {
	    return getIn(collection, keyPath, NOT_SET) !== NOT_SET;
	  }

	  function hasIn$1(searchKeyPath) {
	    return hasIn(this, searchKeyPath);
	  }

	  function toObject() {
	    assertNotInfinite(this.size);
	    var object = {};
	    this.__iterate(function (v, k) {
	      object[k] = v;
	    });
	    return object;
	  }

	  // Note: all of these methods are deprecated.
	  Collection.isIterable = isCollection;
	  Collection.isKeyed = isKeyed;
	  Collection.isIndexed = isIndexed;
	  Collection.isAssociative = isAssociative;
	  Collection.isOrdered = isOrdered;

	  Collection.Iterator = Iterator;

	  mixin(Collection, {
	    // ### Conversion to other types

	    toArray: function toArray() {
	      assertNotInfinite(this.size);
	      var array = new Array(this.size || 0);
	      var useTuples = isKeyed(this);
	      var i = 0;
	      this.__iterate(function (v, k) {
	        // Keyed collections produce an array of tuples.
	        array[i++] = useTuples ? [k, v] : v;
	      });
	      return array;
	    },

	    toIndexedSeq: function toIndexedSeq() {
	      return new ToIndexedSequence(this);
	    },

	    toJS: function toJS$1() {
	      return toJS(this);
	    },

	    toKeyedSeq: function toKeyedSeq() {
	      return new ToKeyedSequence(this, true);
	    },

	    toMap: function toMap() {
	      // Use Late Binding here to solve the circular dependency.
	      return Map(this.toKeyedSeq());
	    },

	    toObject: toObject,

	    toOrderedMap: function toOrderedMap() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedMap(this.toKeyedSeq());
	    },

	    toOrderedSet: function toOrderedSet() {
	      // Use Late Binding here to solve the circular dependency.
	      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toSet: function toSet() {
	      // Use Late Binding here to solve the circular dependency.
	      return Set(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toSetSeq: function toSetSeq() {
	      return new ToSetSequence(this);
	    },

	    toSeq: function toSeq() {
	      return isIndexed(this)
	        ? this.toIndexedSeq()
	        : isKeyed(this)
	          ? this.toKeyedSeq()
	          : this.toSetSeq();
	    },

	    toStack: function toStack() {
	      // Use Late Binding here to solve the circular dependency.
	      return Stack(isKeyed(this) ? this.valueSeq() : this);
	    },

	    toList: function toList() {
	      // Use Late Binding here to solve the circular dependency.
	      return List(isKeyed(this) ? this.valueSeq() : this);
	    },

	    // ### Common JavaScript methods and properties

	    toString: function toString() {
	      return '[Collection]';
	    },

	    __toString: function __toString(head, tail) {
	      if (this.size === 0) {
	        return head + tail;
	      }
	      return (
	        head +
	        ' ' +
	        this.toSeq()
	          .map(this.__toStringMapper)
	          .join(', ') +
	        ' ' +
	        tail
	      );
	    },

	    // ### ES6 Collection methods (ES6 Array and Map)

	    concat: function concat() {
	      var values = [], len = arguments.length;
	      while ( len-- ) values[ len ] = arguments[ len ];

	      return reify(this, concatFactory(this, values));
	    },

	    includes: function includes(searchValue) {
	      return this.some(function (value) { return is(value, searchValue); });
	    },

	    entries: function entries() {
	      return this.__iterator(ITERATE_ENTRIES);
	    },

	    every: function every(predicate, context) {
	      assertNotInfinite(this.size);
	      var returnValue = true;
	      this.__iterate(function (v, k, c) {
	        if (!predicate.call(context, v, k, c)) {
	          returnValue = false;
	          return false;
	        }
	      });
	      return returnValue;
	    },

	    filter: function filter(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, true));
	    },

	    find: function find(predicate, context, notSetValue) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[1] : notSetValue;
	    },

	    forEach: function forEach(sideEffect, context) {
	      assertNotInfinite(this.size);
	      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
	    },

	    join: function join(separator) {
	      assertNotInfinite(this.size);
	      separator = separator !== undefined ? '' + separator : ',';
	      var joined = '';
	      var isFirst = true;
	      this.__iterate(function (v) {
	        isFirst ? (isFirst = false) : (joined += separator);
	        joined += v !== null && v !== undefined ? v.toString() : '';
	      });
	      return joined;
	    },

	    keys: function keys() {
	      return this.__iterator(ITERATE_KEYS);
	    },

	    map: function map(mapper, context) {
	      return reify(this, mapFactory(this, mapper, context));
	    },

	    reduce: function reduce$1(reducer, initialReduction, context) {
	      return reduce(
	        this,
	        reducer,
	        initialReduction,
	        context,
	        arguments.length < 2,
	        false
	      );
	    },

	    reduceRight: function reduceRight(reducer, initialReduction, context) {
	      return reduce(
	        this,
	        reducer,
	        initialReduction,
	        context,
	        arguments.length < 2,
	        true
	      );
	    },

	    reverse: function reverse() {
	      return reify(this, reverseFactory(this, true));
	    },

	    slice: function slice(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, true));
	    },

	    some: function some(predicate, context) {
	      return !this.every(not(predicate), context);
	    },

	    sort: function sort(comparator) {
	      return reify(this, sortFactory(this, comparator));
	    },

	    values: function values() {
	      return this.__iterator(ITERATE_VALUES);
	    },

	    // ### More sequential methods

	    butLast: function butLast() {
	      return this.slice(0, -1);
	    },

	    isEmpty: function isEmpty() {
	      return this.size !== undefined ? this.size === 0 : !this.some(function () { return true; });
	    },

	    count: function count(predicate, context) {
	      return ensureSize(
	        predicate ? this.toSeq().filter(predicate, context) : this
	      );
	    },

	    countBy: function countBy(grouper, context) {
	      return countByFactory(this, grouper, context);
	    },

	    equals: function equals(other) {
	      return deepEqual(this, other);
	    },

	    entrySeq: function entrySeq() {
	      var collection = this;
	      if (collection._cache) {
	        // We cache as an entries array, so we can just return the cache!
	        return new ArraySeq(collection._cache);
	      }
	      var entriesSequence = collection
	        .toSeq()
	        .map(entryMapper)
	        .toIndexedSeq();
	      entriesSequence.fromEntrySeq = function () { return collection.toSeq(); };
	      return entriesSequence;
	    },

	    filterNot: function filterNot(predicate, context) {
	      return this.filter(not(predicate), context);
	    },

	    findEntry: function findEntry(predicate, context, notSetValue) {
	      var found = notSetValue;
	      this.__iterate(function (v, k, c) {
	        if (predicate.call(context, v, k, c)) {
	          found = [k, v];
	          return false;
	        }
	      });
	      return found;
	    },

	    findKey: function findKey(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry && entry[0];
	    },

	    findLast: function findLast(predicate, context, notSetValue) {
	      return this.toKeyedSeq()
	        .reverse()
	        .find(predicate, context, notSetValue);
	    },

	    findLastEntry: function findLastEntry(predicate, context, notSetValue) {
	      return this.toKeyedSeq()
	        .reverse()
	        .findEntry(predicate, context, notSetValue);
	    },

	    findLastKey: function findLastKey(predicate, context) {
	      return this.toKeyedSeq()
	        .reverse()
	        .findKey(predicate, context);
	    },

	    first: function first(notSetValue) {
	      return this.find(returnTrue, null, notSetValue);
	    },

	    flatMap: function flatMap(mapper, context) {
	      return reify(this, flatMapFactory(this, mapper, context));
	    },

	    flatten: function flatten(depth) {
	      return reify(this, flattenFactory(this, depth, true));
	    },

	    fromEntrySeq: function fromEntrySeq() {
	      return new FromEntriesSequence(this);
	    },

	    get: function get(searchKey, notSetValue) {
	      return this.find(function (_, key) { return is(key, searchKey); }, undefined, notSetValue);
	    },

	    getIn: getIn$1,

	    groupBy: function groupBy(grouper, context) {
	      return groupByFactory(this, grouper, context);
	    },

	    has: function has(searchKey) {
	      return this.get(searchKey, NOT_SET) !== NOT_SET;
	    },

	    hasIn: hasIn$1,

	    isSubset: function isSubset(iter) {
	      iter = typeof iter.includes === 'function' ? iter : Collection(iter);
	      return this.every(function (value) { return iter.includes(value); });
	    },

	    isSuperset: function isSuperset(iter) {
	      iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
	      return iter.isSubset(this);
	    },

	    keyOf: function keyOf(searchValue) {
	      return this.findKey(function (value) { return is(value, searchValue); });
	    },

	    keySeq: function keySeq() {
	      return this.toSeq()
	        .map(keyMapper)
	        .toIndexedSeq();
	    },

	    last: function last(notSetValue) {
	      return this.toSeq()
	        .reverse()
	        .first(notSetValue);
	    },

	    lastKeyOf: function lastKeyOf(searchValue) {
	      return this.toKeyedSeq()
	        .reverse()
	        .keyOf(searchValue);
	    },

	    max: function max(comparator) {
	      return maxFactory(this, comparator);
	    },

	    maxBy: function maxBy(mapper, comparator) {
	      return maxFactory(this, comparator, mapper);
	    },

	    min: function min(comparator) {
	      return maxFactory(
	        this,
	        comparator ? neg(comparator) : defaultNegComparator
	      );
	    },

	    minBy: function minBy(mapper, comparator) {
	      return maxFactory(
	        this,
	        comparator ? neg(comparator) : defaultNegComparator,
	        mapper
	      );
	    },

	    rest: function rest() {
	      return this.slice(1);
	    },

	    skip: function skip(amount) {
	      return amount === 0 ? this : this.slice(Math.max(0, amount));
	    },

	    skipLast: function skipLast(amount) {
	      return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
	    },

	    skipWhile: function skipWhile(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, true));
	    },

	    skipUntil: function skipUntil(predicate, context) {
	      return this.skipWhile(not(predicate), context);
	    },

	    sortBy: function sortBy(mapper, comparator) {
	      return reify(this, sortFactory(this, comparator, mapper));
	    },

	    take: function take(amount) {
	      return this.slice(0, Math.max(0, amount));
	    },

	    takeLast: function takeLast(amount) {
	      return this.slice(-Math.max(0, amount));
	    },

	    takeWhile: function takeWhile(predicate, context) {
	      return reify(this, takeWhileFactory(this, predicate, context));
	    },

	    takeUntil: function takeUntil(predicate, context) {
	      return this.takeWhile(not(predicate), context);
	    },

	    update: function update(fn) {
	      return fn(this);
	    },

	    valueSeq: function valueSeq() {
	      return this.toIndexedSeq();
	    },

	    // ### Hashable Object

	    hashCode: function hashCode() {
	      return this.__hash || (this.__hash = hashCollection(this));
	    },

	    // ### Internal

	    // abstract __iterate(fn, reverse)

	    // abstract __iterator(type, reverse)
	  });

	  var CollectionPrototype = Collection.prototype;
	  CollectionPrototype[IS_COLLECTION_SYMBOL] = true;
	  CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
	  CollectionPrototype.toJSON = CollectionPrototype.toArray;
	  CollectionPrototype.__toStringMapper = quoteString;
	  CollectionPrototype.inspect = CollectionPrototype.toSource = function() {
	    return this.toString();
	  };
	  CollectionPrototype.chain = CollectionPrototype.flatMap;
	  CollectionPrototype.contains = CollectionPrototype.includes;

	  mixin(KeyedCollection, {
	    // ### More sequential methods

	    flip: function flip() {
	      return reify(this, flipFactory(this));
	    },

	    mapEntries: function mapEntries(mapper, context) {
	      var this$1 = this;

	      var iterations = 0;
	      return reify(
	        this,
	        this.toSeq()
	          .map(function (v, k) { return mapper.call(context, [k, v], iterations++, this$1); })
	          .fromEntrySeq()
	      );
	    },

	    mapKeys: function mapKeys(mapper, context) {
	      var this$1 = this;

	      return reify(
	        this,
	        this.toSeq()
	          .flip()
	          .map(function (k, v) { return mapper.call(context, k, v, this$1); })
	          .flip()
	      );
	    },
	  });

	  var KeyedCollectionPrototype = KeyedCollection.prototype;
	  KeyedCollectionPrototype[IS_KEYED_SYMBOL] = true;
	  KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
	  KeyedCollectionPrototype.toJSON = toObject;
	  KeyedCollectionPrototype.__toStringMapper = function (v, k) { return quoteString(k) + ': ' + quoteString(v); };

	  mixin(IndexedCollection, {
	    // ### Conversion to other types

	    toKeyedSeq: function toKeyedSeq() {
	      return new ToKeyedSequence(this, false);
	    },

	    // ### ES6 Collection methods (ES6 Array and Map)

	    filter: function filter(predicate, context) {
	      return reify(this, filterFactory(this, predicate, context, false));
	    },

	    findIndex: function findIndex(predicate, context) {
	      var entry = this.findEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },

	    indexOf: function indexOf(searchValue) {
	      var key = this.keyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },

	    lastIndexOf: function lastIndexOf(searchValue) {
	      var key = this.lastKeyOf(searchValue);
	      return key === undefined ? -1 : key;
	    },

	    reverse: function reverse() {
	      return reify(this, reverseFactory(this, false));
	    },

	    slice: function slice(begin, end) {
	      return reify(this, sliceFactory(this, begin, end, false));
	    },

	    splice: function splice(index, removeNum /*, ...values*/) {
	      var numArgs = arguments.length;
	      removeNum = Math.max(removeNum || 0, 0);
	      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
	        return this;
	      }
	      // If index is negative, it should resolve relative to the size of the
	      // collection. However size may be expensive to compute if not cached, so
	      // only call count() if the number is in fact negative.
	      index = resolveBegin(index, index < 0 ? this.count() : this.size);
	      var spliced = this.slice(0, index);
	      return reify(
	        this,
	        numArgs === 1
	          ? spliced
	          : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
	      );
	    },

	    // ### More collection methods

	    findLastIndex: function findLastIndex(predicate, context) {
	      var entry = this.findLastEntry(predicate, context);
	      return entry ? entry[0] : -1;
	    },

	    first: function first(notSetValue) {
	      return this.get(0, notSetValue);
	    },

	    flatten: function flatten(depth) {
	      return reify(this, flattenFactory(this, depth, false));
	    },

	    get: function get(index, notSetValue) {
	      index = wrapIndex(this, index);
	      return index < 0 ||
	        (this.size === Infinity || (this.size !== undefined && index > this.size))
	        ? notSetValue
	        : this.find(function (_, key) { return key === index; }, undefined, notSetValue);
	    },

	    has: function has(index) {
	      index = wrapIndex(this, index);
	      return (
	        index >= 0 &&
	        (this.size !== undefined
	          ? this.size === Infinity || index < this.size
	          : this.indexOf(index) !== -1)
	      );
	    },

	    interpose: function interpose(separator) {
	      return reify(this, interposeFactory(this, separator));
	    },

	    interleave: function interleave(/*...collections*/) {
	      var collections = [this].concat(arrCopy(arguments));
	      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
	      var interleaved = zipped.flatten(true);
	      if (zipped.size) {
	        interleaved.size = zipped.size * collections.length;
	      }
	      return reify(this, interleaved);
	    },

	    keySeq: function keySeq() {
	      return Range(0, this.size);
	    },

	    last: function last(notSetValue) {
	      return this.get(-1, notSetValue);
	    },

	    skipWhile: function skipWhile(predicate, context) {
	      return reify(this, skipWhileFactory(this, predicate, context, false));
	    },

	    zip: function zip(/*, ...collections */) {
	      var collections = [this].concat(arrCopy(arguments));
	      return reify(this, zipWithFactory(this, defaultZipper, collections));
	    },

	    zipAll: function zipAll(/*, ...collections */) {
	      var collections = [this].concat(arrCopy(arguments));
	      return reify(this, zipWithFactory(this, defaultZipper, collections, true));
	    },

	    zipWith: function zipWith(zipper /*, ...collections */) {
	      var collections = arrCopy(arguments);
	      collections[0] = this;
	      return reify(this, zipWithFactory(this, zipper, collections));
	    },
	  });

	  var IndexedCollectionPrototype = IndexedCollection.prototype;
	  IndexedCollectionPrototype[IS_INDEXED_SYMBOL] = true;
	  IndexedCollectionPrototype[IS_ORDERED_SYMBOL] = true;

	  mixin(SetCollection, {
	    // ### ES6 Collection methods (ES6 Array and Map)

	    get: function get(value, notSetValue) {
	      return this.has(value) ? value : notSetValue;
	    },

	    includes: function includes(value) {
	      return this.has(value);
	    },

	    // ### More sequential methods

	    keySeq: function keySeq() {
	      return this.valueSeq();
	    },
	  });

	  SetCollection.prototype.has = CollectionPrototype.includes;
	  SetCollection.prototype.contains = SetCollection.prototype.includes;

	  // Mixin subclasses

	  mixin(KeyedSeq, KeyedCollection.prototype);
	  mixin(IndexedSeq, IndexedCollection.prototype);
	  mixin(SetSeq, SetCollection.prototype);

	  // #pragma Helper functions

	  function reduce(collection, reducer, reduction, context, useFirst, reverse) {
	    assertNotInfinite(collection.size);
	    collection.__iterate(function (v, k, c) {
	      if (useFirst) {
	        useFirst = false;
	        reduction = v;
	      } else {
	        reduction = reducer.call(context, reduction, v, k, c);
	      }
	    }, reverse);
	    return reduction;
	  }

	  function keyMapper(v, k) {
	    return k;
	  }

	  function entryMapper(v, k) {
	    return [k, v];
	  }

	  function not(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  }

	  function neg(predicate) {
	    return function() {
	      return -predicate.apply(this, arguments);
	    };
	  }

	  function defaultZipper() {
	    return arrCopy(arguments);
	  }

	  function defaultNegComparator(a, b) {
	    return a < b ? 1 : a > b ? -1 : 0;
	  }

	  function hashCollection(collection) {
	    if (collection.size === Infinity) {
	      return 0;
	    }
	    var ordered = isOrdered(collection);
	    var keyed = isKeyed(collection);
	    var h = ordered ? 1 : 0;
	    var size = collection.__iterate(
	      keyed
	        ? ordered
	          ? function (v, k) {
	              h = (31 * h + hashMerge(hash(v), hash(k))) | 0;
	            }
	          : function (v, k) {
	              h = (h + hashMerge(hash(v), hash(k))) | 0;
	            }
	        : ordered
	          ? function (v) {
	              h = (31 * h + hash(v)) | 0;
	            }
	          : function (v) {
	              h = (h + hash(v)) | 0;
	            }
	    );
	    return murmurHashOfSize(size, h);
	  }

	  function murmurHashOfSize(size, h) {
	    h = imul(h, 0xcc9e2d51);
	    h = imul((h << 15) | (h >>> -15), 0x1b873593);
	    h = imul((h << 13) | (h >>> -13), 5);
	    h = ((h + 0xe6546b64) | 0) ^ size;
	    h = imul(h ^ (h >>> 16), 0x85ebca6b);
	    h = imul(h ^ (h >>> 13), 0xc2b2ae35);
	    h = smi(h ^ (h >>> 16));
	    return h;
	  }

	  function hashMerge(a, b) {
	    return (a ^ (b + 0x9e3779b9 + (a << 6) + (a >> 2))) | 0; // int
	  }

	  var OrderedSet = /*@__PURE__*/(function (Set$$1) {
	    function OrderedSet(value) {
	      return value === null || value === undefined
	        ? emptyOrderedSet()
	        : isOrderedSet(value)
	          ? value
	          : emptyOrderedSet().withMutations(function (set) {
	              var iter = SetCollection(value);
	              assertNotInfinite(iter.size);
	              iter.forEach(function (v) { return set.add(v); });
	            });
	    }

	    if ( Set$$1 ) OrderedSet.__proto__ = Set$$1;
	    OrderedSet.prototype = Object.create( Set$$1 && Set$$1.prototype );
	    OrderedSet.prototype.constructor = OrderedSet;

	    OrderedSet.of = function of (/*...values*/) {
	      return this(arguments);
	    };

	    OrderedSet.fromKeys = function fromKeys (value) {
	      return this(KeyedCollection(value).keySeq());
	    };

	    OrderedSet.prototype.toString = function toString () {
	      return this.__toString('OrderedSet {', '}');
	    };

	    return OrderedSet;
	  }(Set));

	  OrderedSet.isOrderedSet = isOrderedSet;

	  var OrderedSetPrototype = OrderedSet.prototype;
	  OrderedSetPrototype[IS_ORDERED_SYMBOL] = true;
	  OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
	  OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;

	  OrderedSetPrototype.__empty = emptyOrderedSet;
	  OrderedSetPrototype.__make = makeOrderedSet;

	  function makeOrderedSet(map, ownerID) {
	    var set = Object.create(OrderedSetPrototype);
	    set.size = map ? map.size : 0;
	    set._map = map;
	    set.__ownerID = ownerID;
	    return set;
	  }

	  var EMPTY_ORDERED_SET;
	  function emptyOrderedSet() {
	    return (
	      EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()))
	    );
	  }

	  var Record = function Record(defaultValues, name) {
	    var hasInitialized;

	    var RecordType = function Record(values) {
	      var this$1 = this;

	      if (values instanceof RecordType) {
	        return values;
	      }
	      if (!(this instanceof RecordType)) {
	        return new RecordType(values);
	      }
	      if (!hasInitialized) {
	        hasInitialized = true;
	        var keys = Object.keys(defaultValues);
	        var indices = (RecordTypePrototype._indices = {});
	        // Deprecated: left to attempt not to break any external code which
	        // relies on a ._name property existing on record instances.
	        // Use Record.getDescriptiveName() instead
	        RecordTypePrototype._name = name;
	        RecordTypePrototype._keys = keys;
	        RecordTypePrototype._defaultValues = defaultValues;
	        for (var i = 0; i < keys.length; i++) {
	          var propName = keys[i];
	          indices[propName] = i;
	          if (RecordTypePrototype[propName]) {
	            /* eslint-disable no-console */
	            typeof console === 'object' &&
	              console.warn &&
	              console.warn(
	                'Cannot define ' +
	                  recordName(this) +
	                  ' with property "' +
	                  propName +
	                  '" since that property name is part of the Record API.'
	              );
	            /* eslint-enable no-console */
	          } else {
	            setProp(RecordTypePrototype, propName);
	          }
	        }
	      }
	      this.__ownerID = undefined;
	      this._values = List().withMutations(function (l) {
	        l.setSize(this$1._keys.length);
	        KeyedCollection(values).forEach(function (v, k) {
	          l.set(this$1._indices[k], v === this$1._defaultValues[k] ? undefined : v);
	        });
	      });
	    };

	    var RecordTypePrototype = (RecordType.prototype = Object.create(
	      RecordPrototype
	    ));
	    RecordTypePrototype.constructor = RecordType;

	    if (name) {
	      RecordType.displayName = name;
	    }

	    return RecordType;
	  };

	  Record.prototype.toString = function toString () {
	    var str = recordName(this) + ' { ';
	    var keys = this._keys;
	    var k;
	    for (var i = 0, l = keys.length; i !== l; i++) {
	      k = keys[i];
	      str += (i ? ', ' : '') + k + ': ' + quoteString(this.get(k));
	    }
	    return str + ' }';
	  };

	  Record.prototype.equals = function equals (other) {
	    return (
	      this === other ||
	      (other &&
	        this._keys === other._keys &&
	        recordSeq(this).equals(recordSeq(other)))
	    );
	  };

	  Record.prototype.hashCode = function hashCode () {
	    return recordSeq(this).hashCode();
	  };

	  // @pragma Access

	  Record.prototype.has = function has (k) {
	    return this._indices.hasOwnProperty(k);
	  };

	  Record.prototype.get = function get (k, notSetValue) {
	    if (!this.has(k)) {
	      return notSetValue;
	    }
	    var index = this._indices[k];
	    var value = this._values.get(index);
	    return value === undefined ? this._defaultValues[k] : value;
	  };

	  // @pragma Modification

	  Record.prototype.set = function set (k, v) {
	    if (this.has(k)) {
	      var newValues = this._values.set(
	        this._indices[k],
	        v === this._defaultValues[k] ? undefined : v
	      );
	      if (newValues !== this._values && !this.__ownerID) {
	        return makeRecord(this, newValues);
	      }
	    }
	    return this;
	  };

	  Record.prototype.remove = function remove (k) {
	    return this.set(k);
	  };

	  Record.prototype.clear = function clear () {
	    var newValues = this._values.clear().setSize(this._keys.length);
	    return this.__ownerID ? this : makeRecord(this, newValues);
	  };

	  Record.prototype.wasAltered = function wasAltered () {
	    return this._values.wasAltered();
	  };

	  Record.prototype.toSeq = function toSeq () {
	    return recordSeq(this);
	  };

	  Record.prototype.toJS = function toJS$1 () {
	    return toJS(this);
	  };

	  Record.prototype.entries = function entries () {
	    return this.__iterator(ITERATE_ENTRIES);
	  };

	  Record.prototype.__iterator = function __iterator (type, reverse) {
	    return recordSeq(this).__iterator(type, reverse);
	  };

	  Record.prototype.__iterate = function __iterate (fn, reverse) {
	    return recordSeq(this).__iterate(fn, reverse);
	  };

	  Record.prototype.__ensureOwner = function __ensureOwner (ownerID) {
	    if (ownerID === this.__ownerID) {
	      return this;
	    }
	    var newValues = this._values.__ensureOwner(ownerID);
	    if (!ownerID) {
	      this.__ownerID = ownerID;
	      this._values = newValues;
	      return this;
	    }
	    return makeRecord(this, newValues, ownerID);
	  };

	  Record.isRecord = isRecord;
	  Record.getDescriptiveName = recordName;
	  var RecordPrototype = Record.prototype;
	  RecordPrototype[IS_RECORD_SYMBOL] = true;
	  RecordPrototype[DELETE] = RecordPrototype.remove;
	  RecordPrototype.deleteIn = RecordPrototype.removeIn = deleteIn;
	  RecordPrototype.getIn = getIn$1;
	  RecordPrototype.hasIn = CollectionPrototype.hasIn;
	  RecordPrototype.merge = merge;
	  RecordPrototype.mergeWith = mergeWith;
	  RecordPrototype.mergeIn = mergeIn;
	  RecordPrototype.mergeDeep = mergeDeep$1;
	  RecordPrototype.mergeDeepWith = mergeDeepWith$1;
	  RecordPrototype.mergeDeepIn = mergeDeepIn;
	  RecordPrototype.setIn = setIn$1;
	  RecordPrototype.update = update$1;
	  RecordPrototype.updateIn = updateIn$1;
	  RecordPrototype.withMutations = withMutations;
	  RecordPrototype.asMutable = asMutable;
	  RecordPrototype.asImmutable = asImmutable;
	  RecordPrototype[ITERATOR_SYMBOL] = RecordPrototype.entries;
	  RecordPrototype.toJSON = RecordPrototype.toObject =
	    CollectionPrototype.toObject;
	  RecordPrototype.inspect = RecordPrototype.toSource = function() {
	    return this.toString();
	  };

	  function makeRecord(likeRecord, values, ownerID) {
	    var record = Object.create(Object.getPrototypeOf(likeRecord));
	    record._values = values;
	    record.__ownerID = ownerID;
	    return record;
	  }

	  function recordName(record) {
	    return record.constructor.displayName || record.constructor.name || 'Record';
	  }

	  function recordSeq(record) {
	    return keyedSeqFromValue(record._keys.map(function (k) { return [k, record.get(k)]; }));
	  }

	  function setProp(prototype, name) {
	    try {
	      Object.defineProperty(prototype, name, {
	        get: function() {
	          return this.get(name);
	        },
	        set: function(value) {
	          invariant(this.__ownerID, 'Cannot set on an immutable record.');
	          this.set(name, value);
	        },
	      });
	    } catch (error) {
	      // Object.defineProperty failed. Probably IE8.
	    }
	  }

	  /**
	   * Returns a lazy Seq of `value` repeated `times` times. When `times` is
	   * undefined, returns an infinite sequence of `value`.
	   */
	  var Repeat = /*@__PURE__*/(function (IndexedSeq$$1) {
	    function Repeat(value, times) {
	      if (!(this instanceof Repeat)) {
	        return new Repeat(value, times);
	      }
	      this._value = value;
	      this.size = times === undefined ? Infinity : Math.max(0, times);
	      if (this.size === 0) {
	        if (EMPTY_REPEAT) {
	          return EMPTY_REPEAT;
	        }
	        EMPTY_REPEAT = this;
	      }
	    }

	    if ( IndexedSeq$$1 ) Repeat.__proto__ = IndexedSeq$$1;
	    Repeat.prototype = Object.create( IndexedSeq$$1 && IndexedSeq$$1.prototype );
	    Repeat.prototype.constructor = Repeat;

	    Repeat.prototype.toString = function toString () {
	      if (this.size === 0) {
	        return 'Repeat []';
	      }
	      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
	    };

	    Repeat.prototype.get = function get (index, notSetValue) {
	      return this.has(index) ? this._value : notSetValue;
	    };

	    Repeat.prototype.includes = function includes (searchValue) {
	      return is(this._value, searchValue);
	    };

	    Repeat.prototype.slice = function slice (begin, end) {
	      var size = this.size;
	      return wholeSlice(begin, end, size)
	        ? this
	        : new Repeat(
	            this._value,
	            resolveEnd(end, size) - resolveBegin(begin, size)
	          );
	    };

	    Repeat.prototype.reverse = function reverse () {
	      return this;
	    };

	    Repeat.prototype.indexOf = function indexOf (searchValue) {
	      if (is(this._value, searchValue)) {
	        return 0;
	      }
	      return -1;
	    };

	    Repeat.prototype.lastIndexOf = function lastIndexOf (searchValue) {
	      if (is(this._value, searchValue)) {
	        return this.size;
	      }
	      return -1;
	    };

	    Repeat.prototype.__iterate = function __iterate (fn, reverse) {
	      var size = this.size;
	      var i = 0;
	      while (i !== size) {
	        if (fn(this._value, reverse ? size - ++i : i++, this) === false) {
	          break;
	        }
	      }
	      return i;
	    };

	    Repeat.prototype.__iterator = function __iterator (type, reverse) {
	      var this$1 = this;

	      var size = this.size;
	      var i = 0;
	      return new Iterator(
	        function () { return i === size
	            ? iteratorDone()
	            : iteratorValue(type, reverse ? size - ++i : i++, this$1._value); }
	      );
	    };

	    Repeat.prototype.equals = function equals (other) {
	      return other instanceof Repeat
	        ? is(this._value, other._value)
	        : deepEqual(other);
	    };

	    return Repeat;
	  }(IndexedSeq));

	  var EMPTY_REPEAT;

	  function fromJS(value, converter) {
	    return fromJSWith(
	      [],
	      converter || defaultConverter,
	      value,
	      '',
	      converter && converter.length > 2 ? [] : undefined,
	      { '': value }
	    );
	  }

	  function fromJSWith(stack, converter, value, key, keyPath, parentValue) {
	    var toSeq = Array.isArray(value)
	      ? IndexedSeq
	      : isPlainObj(value)
	        ? KeyedSeq
	        : null;
	    if (toSeq) {
	      if (~stack.indexOf(value)) {
	        throw new TypeError('Cannot convert circular structure to Immutable');
	      }
	      stack.push(value);
	      keyPath && key !== '' && keyPath.push(key);
	      var converted = converter.call(
	        parentValue,
	        key,
	        toSeq(value).map(function (v, k) { return fromJSWith(stack, converter, v, k, keyPath, value); }
	        ),
	        keyPath && keyPath.slice()
	      );
	      stack.pop();
	      keyPath && keyPath.pop();
	      return converted;
	    }
	    return value;
	  }

	  function defaultConverter(k, v) {
	    return isKeyed(v) ? v.toMap() : v.toList();
	  }

	  var version = "4.0.0-rc.11";

	  var Immutable = {
	    version: version,

	    Collection: Collection,
	    // Note: Iterable is deprecated
	    Iterable: Collection,

	    Seq: Seq,
	    Map: Map,
	    OrderedMap: OrderedMap,
	    List: List,
	    Stack: Stack,
	    Set: Set,
	    OrderedSet: OrderedSet,

	    Record: Record,
	    Range: Range,
	    Repeat: Repeat,

	    is: is,
	    fromJS: fromJS,
	    hash: hash,

	    isImmutable: isImmutable,
	    isCollection: isCollection,
	    isKeyed: isKeyed,
	    isIndexed: isIndexed,
	    isAssociative: isAssociative,
	    isOrdered: isOrdered,
	    isValueObject: isValueObject,
	    isSeq: isSeq,
	    isList: isList,
	    isMap: isMap,
	    isOrderedMap: isOrderedMap,
	    isStack: isStack,
	    isSet: isSet,
	    isOrderedSet: isOrderedSet,
	    isRecord: isRecord,

	    get: get,
	    getIn: getIn,
	    has: has,
	    hasIn: hasIn,
	    merge: merge$1,
	    mergeDeep: mergeDeep,
	    mergeWith: mergeWith$1,
	    mergeDeepWith: mergeDeepWith,
	    remove: remove,
	    removeIn: removeIn,
	    set: set,
	    setIn: setIn,
	    update: update,
	    updateIn: updateIn,
	  };

	  // Note: Iterable is deprecated
	  var Iterable = Collection;

	  exports.default = Immutable;
	  exports.version = version;
	  exports.Collection = Collection;
	  exports.Iterable = Iterable;
	  exports.Seq = Seq;
	  exports.Map = Map;
	  exports.OrderedMap = OrderedMap;
	  exports.List = List;
	  exports.Stack = Stack;
	  exports.Set = Set;
	  exports.OrderedSet = OrderedSet;
	  exports.Record = Record;
	  exports.Range = Range;
	  exports.Repeat = Repeat;
	  exports.is = is;
	  exports.fromJS = fromJS;
	  exports.hash = hash;
	  exports.isImmutable = isImmutable;
	  exports.isCollection = isCollection;
	  exports.isKeyed = isKeyed;
	  exports.isIndexed = isIndexed;
	  exports.isAssociative = isAssociative;
	  exports.isOrdered = isOrdered;
	  exports.isValueObject = isValueObject;
	  exports.get = get;
	  exports.getIn = getIn;
	  exports.has = has;
	  exports.hasIn = hasIn;
	  exports.merge = merge$1;
	  exports.mergeDeep = mergeDeep;
	  exports.mergeWith = mergeWith$1;
	  exports.mergeDeepWith = mergeDeepWith;
	  exports.remove = remove;
	  exports.removeIn = removeIn;
	  exports.set = set;
	  exports.setIn = setIn;
	  exports.update = update;
	  exports.updateIn = updateIn;

	  Object.defineProperty(exports, '__esModule', { value: true });

	})));


/***/ },
/* 119 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

	module.exports = ReactPropTypesSecret;


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireWildcard = __webpack_require__(103);

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports["default"] = connectAdvanced;

	var _extends2 = _interopRequireDefault(__webpack_require__(67));

	var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(68));

	var _hoistNonReactStatics = _interopRequireDefault(__webpack_require__(219));

	var _invariant = _interopRequireDefault(__webpack_require__(81));

	var _react = _interopRequireWildcard(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));

	var _reactIs = __webpack_require__(54);

	var _Subscription = _interopRequireDefault(__webpack_require__(82));

	var _Context = __webpack_require__(55);

	// Define some constant arrays just to avoid re-creating these
	var EMPTY_ARRAY = [];
	var NO_SUBSCRIPTION_ARRAY = [null, null];

	var stringifyComponent = function stringifyComponent(Comp) {
	  try {
	    return JSON.stringify(Comp);
	  } catch (err) {
	    return String(Comp);
	  }
	};

	function storeStateUpdatesReducer(state, action) {
	  var updateCount = state[1];
	  return [action.payload, updateCount + 1];
	}

	var initStateUpdates = function initStateUpdates() {
	  return [null, 0];
	}; // React currently throws a warning when using useLayoutEffect on the server.
	// To get around it, we can conditionally useEffect on the server (no-op) and
	// useLayoutEffect in the browser. We need useLayoutEffect because we want
	// `connect` to perform sync updates to a ref to save the latest props after
	// a render is actually committed to the DOM.


	var useIsomorphicLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? _react.useLayoutEffect : _react.useEffect;

	function connectAdvanced(
	/*
	  selectorFactory is a func that is responsible for returning the selector function used to
	  compute new props from state, props, and dispatch. For example:
	     export default connectAdvanced((dispatch, options) => (state, props) => ({
	      thing: state.things[props.thingId],
	      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
	    }))(YourComponent)
	   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
	  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
	  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
	   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
	  props. Do not use connectAdvanced directly without memoizing results between calls to your
	  selector, otherwise the Connect component will re-render on every state or props change.
	*/
	selectorFactory, // options object:
	_ref) {
	  if (_ref === void 0) {
	    _ref = {};
	  }

	  var _ref2 = _ref,
	      _ref2$getDisplayName = _ref2.getDisplayName,
	      getDisplayName = _ref2$getDisplayName === void 0 ? function (name) {
	    return "ConnectAdvanced(" + name + ")";
	  } : _ref2$getDisplayName,
	      _ref2$methodName = _ref2.methodName,
	      methodName = _ref2$methodName === void 0 ? 'connectAdvanced' : _ref2$methodName,
	      _ref2$renderCountProp = _ref2.renderCountProp,
	      renderCountProp = _ref2$renderCountProp === void 0 ? undefined : _ref2$renderCountProp,
	      _ref2$shouldHandleSta = _ref2.shouldHandleStateChanges,
	      shouldHandleStateChanges = _ref2$shouldHandleSta === void 0 ? true : _ref2$shouldHandleSta,
	      _ref2$storeKey = _ref2.storeKey,
	      storeKey = _ref2$storeKey === void 0 ? 'store' : _ref2$storeKey,
	      _ref2$withRef = _ref2.withRef,
	      withRef = _ref2$withRef === void 0 ? false : _ref2$withRef,
	      _ref2$forwardRef = _ref2.forwardRef,
	      forwardRef = _ref2$forwardRef === void 0 ? false : _ref2$forwardRef,
	      _ref2$context = _ref2.context,
	      context = _ref2$context === void 0 ? _Context.ReactReduxContext : _ref2$context,
	      connectOptions = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["getDisplayName", "methodName", "renderCountProp", "shouldHandleStateChanges", "storeKey", "withRef", "forwardRef", "context"]);
	  (0, _invariant["default"])(renderCountProp === undefined, "renderCountProp is removed. render counting is built into the latest React Dev Tools profiling extension");
	  (0, _invariant["default"])(!withRef, 'withRef is removed. To access the wrapped instance, use a ref on the connected component');
	  var customStoreWarningMessage = 'To use a custom Redux store for specific components, create a custom React context with ' + "React.createContext(), and pass the context object to React Redux's Provider and specific components" + ' like: <Provider context={MyContext}><ConnectedComponent context={MyContext} /></Provider>. ' + 'You may also pass a {context : MyContext} option to connect';
	  (0, _invariant["default"])(storeKey === 'store', 'storeKey has been removed and does not do anything. ' + customStoreWarningMessage);
	  var Context = context;
	  return function wrapWithConnect(WrappedComponent) {
	    if (true) {
	      (0, _invariant["default"])((0, _reactIs.isValidElementType)(WrappedComponent), "You must pass a component to the function returned by " + (methodName + ". Instead received " + stringifyComponent(WrappedComponent)));
	    }

	    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
	    var displayName = getDisplayName(wrappedComponentName);
	    var selectorFactoryOptions = (0, _extends2["default"])({}, connectOptions, {
	      getDisplayName: getDisplayName,
	      methodName: methodName,
	      renderCountProp: renderCountProp,
	      shouldHandleStateChanges: shouldHandleStateChanges,
	      storeKey: storeKey,
	      displayName: displayName,
	      wrappedComponentName: wrappedComponentName,
	      WrappedComponent: WrappedComponent
	    });
	    var pure = connectOptions.pure;

	    function createChildSelector(store) {
	      return selectorFactory(store.dispatch, selectorFactoryOptions);
	    } // If we aren't running in "pure" mode, we don't want to memoize values.
	    // To avoid conditionally calling hooks, we fall back to a tiny wrapper
	    // that just executes the given callback immediately.


	    var usePureOnlyMemo = pure ? _react.useMemo : function (callback) {
	      return callback();
	    };

	    function ConnectFunction(props) {
	      var _useMemo = (0, _react.useMemo)(function () {
	        // Distinguish between actual "data" props that were passed to the wrapper component,
	        // and values needed to control behavior (forwarded refs, alternate context instances).
	        // To maintain the wrapperProps object reference, memoize this destructuring.
	        var forwardedRef = props.forwardedRef,
	            wrapperProps = (0, _objectWithoutPropertiesLoose2["default"])(props, ["forwardedRef"]);
	        return [props.context, forwardedRef, wrapperProps];
	      }, [props]),
	          propsContext = _useMemo[0],
	          forwardedRef = _useMemo[1],
	          wrapperProps = _useMemo[2];

	      var ContextToUse = (0, _react.useMemo)(function () {
	        // Users may optionally pass in a custom context instance to use instead of our ReactReduxContext.
	        // Memoize the check that determines which context instance we should use.
	        return propsContext && propsContext.Consumer && (0, _reactIs.isContextConsumer)(_react["default"].createElement(propsContext.Consumer, null)) ? propsContext : Context;
	      }, [propsContext, Context]); // Retrieve the store and ancestor subscription via context, if available

	      var contextValue = (0, _react.useContext)(ContextToUse); // The store _must_ exist as either a prop or in context

	      var didStoreComeFromProps = Boolean(props.store);
	      var didStoreComeFromContext = Boolean(contextValue) && Boolean(contextValue.store);
	      (0, _invariant["default"])(didStoreComeFromProps || didStoreComeFromContext, "Could not find \"store\" in the context of " + ("\"" + displayName + "\". Either wrap the root component in a <Provider>, ") + "or pass a custom React context provider to <Provider> and the corresponding " + ("React context consumer to " + displayName + " in connect options."));
	      var store = props.store || contextValue.store;
	      var childPropsSelector = (0, _react.useMemo)(function () {
	        // The child props selector needs the store reference as an input.
	        // Re-create this selector whenever the store changes.
	        return createChildSelector(store);
	      }, [store]);

	      var _useMemo2 = (0, _react.useMemo)(function () {
	        if (!shouldHandleStateChanges) return NO_SUBSCRIPTION_ARRAY; // This Subscription's source should match where store came from: props vs. context. A component
	        // connected to the store via props shouldn't use subscription from context, or vice versa.

	        var subscription = new _Subscription["default"](store, didStoreComeFromProps ? null : contextValue.subscription); // `notifyNestedSubs` is duplicated to handle the case where the component is unmounted in
	        // the middle of the notification loop, where `subscription` will then be null. This can
	        // probably be avoided if Subscription's listeners logic is changed to not call listeners
	        // that have been unsubscribed in the  middle of the notification loop.

	        var notifyNestedSubs = subscription.notifyNestedSubs.bind(subscription);
	        return [subscription, notifyNestedSubs];
	      }, [store, didStoreComeFromProps, contextValue]),
	          subscription = _useMemo2[0],
	          notifyNestedSubs = _useMemo2[1]; // Determine what {store, subscription} value should be put into nested context, if necessary,
	      // and memoize that value to avoid unnecessary context updates.


	      var overriddenContextValue = (0, _react.useMemo)(function () {
	        if (didStoreComeFromProps) {
	          // This component is directly subscribed to a store from props.
	          // We don't want descendants reading from this store - pass down whatever
	          // the existing context value is from the nearest connected ancestor.
	          return contextValue;
	        } // Otherwise, put this component's subscription instance into context, so that
	        // connected descendants won't update until after this component is done


	        return (0, _extends2["default"])({}, contextValue, {
	          subscription: subscription
	        });
	      }, [didStoreComeFromProps, contextValue, subscription]); // We need to force this wrapper component to re-render whenever a Redux store update
	      // causes a change to the calculated child component props (or we caught an error in mapState)

	      var _useReducer = (0, _react.useReducer)(storeStateUpdatesReducer, EMPTY_ARRAY, initStateUpdates),
	          _useReducer$ = _useReducer[0],
	          previousStateUpdateResult = _useReducer$[0],
	          forceComponentUpdateDispatch = _useReducer[1]; // Propagate any mapState/mapDispatch errors upwards


	      if (previousStateUpdateResult && previousStateUpdateResult.error) {
	        throw previousStateUpdateResult.error;
	      } // Set up refs to coordinate values between the subscription effect and the render logic


	      var lastChildProps = (0, _react.useRef)();
	      var lastWrapperProps = (0, _react.useRef)(wrapperProps);
	      var childPropsFromStoreUpdate = (0, _react.useRef)();
	      var renderIsScheduled = (0, _react.useRef)(false);
	      var actualChildProps = usePureOnlyMemo(function () {
	        // Tricky logic here:
	        // - This render may have been triggered by a Redux store update that produced new child props
	        // - However, we may have gotten new wrapper props after that
	        // If we have new child props, and the same wrapper props, we know we should use the new child props as-is.
	        // But, if we have new wrapper props, those might change the child props, so we have to recalculate things.
	        // So, we'll use the child props from store update only if the wrapper props are the same as last time.
	        if (childPropsFromStoreUpdate.current && wrapperProps === lastWrapperProps.current) {
	          return childPropsFromStoreUpdate.current;
	        } // TODO We're reading the store directly in render() here. Bad idea?
	        // This will likely cause Bad Things (TM) to happen in Concurrent Mode.
	        // Note that we do this because on renders _not_ caused by store updates, we need the latest store state
	        // to determine what the child props should be.


	        return childPropsSelector(store.getState(), wrapperProps);
	      }, [store, previousStateUpdateResult, wrapperProps]); // We need this to execute synchronously every time we re-render. However, React warns
	      // about useLayoutEffect in SSR, so we try to detect environment and fall back to
	      // just useEffect instead to avoid the warning, since neither will run anyway.

	      useIsomorphicLayoutEffect(function () {
	        // We want to capture the wrapper props and child props we used for later comparisons
	        lastWrapperProps.current = wrapperProps;
	        lastChildProps.current = actualChildProps;
	        renderIsScheduled.current = false; // If the render was from a store update, clear out that reference and cascade the subscriber update

	        if (childPropsFromStoreUpdate.current) {
	          childPropsFromStoreUpdate.current = null;
	          notifyNestedSubs();
	        }
	      }); // Our re-subscribe logic only runs when the store/subscription setup changes

	      useIsomorphicLayoutEffect(function () {
	        // If we're not subscribed to the store, nothing to do here
	        if (!shouldHandleStateChanges) return; // Capture values for checking if and when this component unmounts

	        var didUnsubscribe = false;
	        var lastThrownError = null; // We'll run this callback every time a store subscription update propagates to this component

	        var checkForUpdates = function checkForUpdates() {
	          if (didUnsubscribe) {
	            // Don't run stale listeners.
	            // Redux doesn't guarantee unsubscriptions happen until next dispatch.
	            return;
	          }

	          var latestStoreState = store.getState();
	          var newChildProps, error;

	          try {
	            // Actually run the selector with the most recent store state and wrapper props
	            // to determine what the child props should be
	            newChildProps = childPropsSelector(latestStoreState, lastWrapperProps.current);
	          } catch (e) {
	            error = e;
	            lastThrownError = e;
	          }

	          if (!error) {
	            lastThrownError = null;
	          } // If the child props haven't changed, nothing to do here - cascade the subscription update


	          if (newChildProps === lastChildProps.current) {
	            if (!renderIsScheduled.current) {
	              notifyNestedSubs();
	            }
	          } else {
	            // Save references to the new child props.  Note that we track the "child props from store update"
	            // as a ref instead of a useState/useReducer because we need a way to determine if that value has
	            // been processed.  If this went into useState/useReducer, we couldn't clear out the value without
	            // forcing another re-render, which we don't want.
	            lastChildProps.current = newChildProps;
	            childPropsFromStoreUpdate.current = newChildProps;
	            renderIsScheduled.current = true; // If the child props _did_ change (or we caught an error), this wrapper component needs to re-render

	            forceComponentUpdateDispatch({
	              type: 'STORE_UPDATED',
	              payload: {
	                latestStoreState: latestStoreState,
	                error: error
	              }
	            });
	          }
	        }; // Actually subscribe to the nearest connected ancestor (or store)


	        subscription.onStateChange = checkForUpdates;
	        subscription.trySubscribe(); // Pull data from the store after first render in case the store has
	        // changed since we began.

	        checkForUpdates();

	        var unsubscribeWrapper = function unsubscribeWrapper() {
	          didUnsubscribe = true;
	          subscription.tryUnsubscribe();

	          if (lastThrownError) {
	            // It's possible that we caught an error due to a bad mapState function, but the
	            // parent re-rendered without this component and we're about to unmount.
	            // This shouldn't happen as long as we do top-down subscriptions correctly, but
	            // if we ever do those wrong, this throw will surface the error in our tests.
	            // In that case, throw the error from here so it doesn't get lost.
	            throw lastThrownError;
	          }
	        };

	        return unsubscribeWrapper;
	      }, [store, subscription, childPropsSelector]); // Now that all that's done, we can finally try to actually render the child component.
	      // We memoize the elements for the rendered child component as an optimization.

	      var renderedWrappedComponent = (0, _react.useMemo)(function () {
	        return _react["default"].createElement(WrappedComponent, (0, _extends2["default"])({}, actualChildProps, {
	          ref: forwardedRef
	        }));
	      }, [forwardedRef, WrappedComponent, actualChildProps]); // If React sees the exact same element reference as last time, it bails out of re-rendering
	      // that child, same as if it was wrapped in React.memo() or returned false from shouldComponentUpdate.

	      var renderedChild = (0, _react.useMemo)(function () {
	        if (shouldHandleStateChanges) {
	          // If this component is subscribed to store updates, we need to pass its own
	          // subscription instance down to our descendants. That means rendering the same
	          // Context instance, and putting a different value into the context.
	          return _react["default"].createElement(ContextToUse.Provider, {
	            value: overriddenContextValue
	          }, renderedWrappedComponent);
	        }

	        return renderedWrappedComponent;
	      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue]);
	      return renderedChild;
	    } // If we're in "pure" mode, ensure our wrapper component only re-renders when incoming props have changed.


	    var Connect = pure ? _react["default"].memo(ConnectFunction) : ConnectFunction;
	    Connect.WrappedComponent = WrappedComponent;
	    Connect.displayName = displayName;

	    if (forwardRef) {
	      var forwarded = _react["default"].forwardRef(function forwardConnectRef(props, ref) {
	        return _react["default"].createElement(Connect, (0, _extends2["default"])({}, props, {
	          forwardedRef: ref
	        }));
	      });

	      forwarded.displayName = displayName;
	      forwarded.WrappedComponent = WrappedComponent;
	      return (0, _hoistNonReactStatics["default"])(forwarded, WrappedComponent);
	    }

	    return (0, _hoistNonReactStatics["default"])(Connect, WrappedComponent);
	  };
	}

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports.wrapMapToPropsConstant = wrapMapToPropsConstant;
	exports.getDependsOnOwnProps = getDependsOnOwnProps;
	exports.wrapMapToPropsFunc = wrapMapToPropsFunc;

	var _verifyPlainObject = _interopRequireDefault(__webpack_require__(126));

	function wrapMapToPropsConstant(getConstant) {
	  return function initConstantSelector(dispatch, options) {
	    var constant = getConstant(dispatch, options);

	    function constantSelector() {
	      return constant;
	    }

	    constantSelector.dependsOnOwnProps = false;
	    return constantSelector;
	  };
	} // dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
	// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
	// whether mapToProps needs to be invoked when props have changed.
	//
	// A length of one signals that mapToProps does not depend on props from the parent component.
	// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
	// therefore not reporting its length accurately..


	function getDependsOnOwnProps(mapToProps) {
	  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
	} // Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
	// this function wraps mapToProps in a proxy function which does several things:
	//
	//  * Detects whether the mapToProps function being called depends on props, which
	//    is used by selectorFactory to decide if it should reinvoke on props changes.
	//
	//  * On first call, handles mapToProps if returns another function, and treats that
	//    new function as the true mapToProps for subsequent calls.
	//
	//  * On first call, verifies the first result is a plain object, in order to warn
	//    the developer that their mapToProps function is not returning a valid result.
	//


	function wrapMapToPropsFunc(mapToProps, methodName) {
	  return function initProxySelector(dispatch, _ref) {
	    var displayName = _ref.displayName;

	    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
	      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
	    }; // allow detectFactoryAndVerify to get ownProps


	    proxy.dependsOnOwnProps = true;

	    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
	      proxy.mapToProps = mapToProps;
	      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
	      var props = proxy(stateOrDispatch, ownProps);

	      if (typeof props === 'function') {
	        proxy.mapToProps = props;
	        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
	        props = proxy(stateOrDispatch, ownProps);
	      }

	      if (true) (0, _verifyPlainObject["default"])(props, displayName, methodName);
	      return props;
	    };

	    return proxy;
	  };
	}

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports.useReduxContext = useReduxContext;

	var _react = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _invariant = _interopRequireDefault(__webpack_require__(81));

	var _Context = __webpack_require__(55);

	/**
	 * A hook to access the value of the `ReactReduxContext`. This is a low-level
	 * hook that you should usually not need to call directly.
	 *
	 * @returns {any} the value of the `ReactReduxContext`
	 *
	 * @example
	 *
	 * import React from 'react'
	 * import { useReduxContext } from 'react-redux'
	 *
	 * export const CounterComponent = ({ value }) => {
	 *   const { store } = useReduxContext()
	 *   return <div>{store.getState()}</div>
	 * }
	 */
	function useReduxContext() {
	  var contextValue = (0, _react.useContext)(_Context.ReactReduxContext);
	  (0, _invariant["default"])(contextValue, 'could not find react-redux context value; please ensure the component is wrapped in a <Provider>');
	  return contextValue;
	}

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.useStore = useStore;

	var _useReduxContext2 = __webpack_require__(122);

	/**
	 * A hook to access the redux store.
	 *
	 * @returns {any} the redux store
	 *
	 * @example
	 *
	 * import React from 'react'
	 * import { useStore } from 'react-redux'
	 *
	 * export const ExampleComponent = () => {
	 *   const store = useStore()
	 *   return <div>{store.getState()}</div>
	 * }
	 */
	function useStore() {
	  var _useReduxContext = (0, _useReduxContext2.useReduxContext)(),
	      store = _useReduxContext.store;

	  return store;
	}

/***/ },
/* 124 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.getBatch = exports.setBatch = void 0;

	// Default to a dummy "batch" implementation that just runs the callback
	function defaultNoopBatch(callback) {
	  callback();
	}

	var batch = defaultNoopBatch; // Allow injecting another batching function later

	var setBatch = function setBatch(newBatch) {
	  return batch = newBatch;
	}; // Supply a getter just to skip dealing with ESM bindings


	exports.setBatch = setBatch;

	var getBatch = function getBatch() {
	  return batch;
	};

	exports.getBatch = getBatch;

/***/ },
/* 125 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = shallowEqual;
	var hasOwn = Object.prototype.hasOwnProperty;

	function is(x, y) {
	  if (x === y) {
	    return x !== 0 || y !== 0 || 1 / x === 1 / y;
	  } else {
	    return x !== x && y !== y;
	  }
	}

	function shallowEqual(objA, objB) {
	  if (is(objA, objB)) return true;

	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }

	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);
	  if (keysA.length !== keysB.length) return false;

	  for (var i = 0; i < keysA.length; i++) {
	    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
	      return false;
	    }
	  }

	  return true;
	}

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports["default"] = verifyPlainObject;

	var _isPlainObject = _interopRequireDefault(__webpack_require__(235));

	var _warning = _interopRequireDefault(__webpack_require__(127));

	function verifyPlainObject(value, displayName, methodName) {
	  if (!(0, _isPlainObject["default"])(value)) {
	    (0, _warning["default"])(methodName + "() in " + displayName + " must return a plain object. Instead received " + value + ".");
	  }
	}

/***/ },
/* 127 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = warning;

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */


	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	    /* eslint-disable no-empty */
	  } catch (e) {}
	  /* eslint-enable no-empty */

	}

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ActionsObservable = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _rxjs = __webpack_require__(36);

	var _operators = __webpack_require__(130);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ActionsObservable = exports.ActionsObservable = function (_Observable) {
	  _inherits(ActionsObservable, _Observable);

	  _createClass(ActionsObservable, null, [{
	    key: 'of',
	    value: function of() {
	      return new this(_rxjs.of.apply(undefined, arguments));
	    }
	  }, {
	    key: 'from',
	    value: function from(actions, scheduler) {
	      return new this((0, _rxjs.from)(actions, scheduler));
	    }
	  }]);

	  function ActionsObservable(actionsSubject) {
	    _classCallCheck(this, ActionsObservable);

	    var _this = _possibleConstructorReturn(this, (ActionsObservable.__proto__ || Object.getPrototypeOf(ActionsObservable)).call(this));

	    _this.source = actionsSubject;
	    return _this;
	  }

	  _createClass(ActionsObservable, [{
	    key: 'lift',
	    value: function lift(operator) {
	      var observable = new ActionsObservable(this);
	      observable.operator = operator;
	      return observable;
	    }
	  }, {
	    key: 'ofType',
	    value: function ofType() {
	      return _operators.ofType.apply(undefined, arguments)(this);
	    }
	  }]);

	  return ActionsObservable;
	}(_rxjs.Observable);

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.StateObservable = undefined;

	var _rxjs = __webpack_require__(36);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var StateObservable = exports.StateObservable = function (_Observable) {
	  _inherits(StateObservable, _Observable);

	  function StateObservable(stateSubject, initialState) {
	    _classCallCheck(this, StateObservable);

	    var _this = _possibleConstructorReturn(this, (StateObservable.__proto__ || Object.getPrototypeOf(StateObservable)).call(this, function (subscriber) {
	      var subscription = _this.__notifier.subscribe(subscriber);
	      if (subscription && !subscription.closed) {
	        subscriber.next(_this.value);
	      }
	      return subscription;
	    }));

	    _this.value = initialState;
	    _this.__notifier = new _rxjs.Subject();
	    _this.__subscription = stateSubject.subscribe(function (value) {
	      // We only want to update state$ if it has actually changed since
	      // redux requires reducers use immutability patterns.
	      // This is basically what distinctUntilChanged() does but it's so simple
	      // we don't need to pull that code in
	      if (value !== _this.value) {
	        _this.value = value;
	        _this.__notifier.next(value);
	      }
	    });
	    return _this;
	  }

	  return StateObservable;
	}(_rxjs.Observable);

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ofType = undefined;

	var _operators = __webpack_require__(102);

	var keyHasType = function keyHasType(type, key) {
	  return type === key || typeof key === 'function' && type === key.toString();
	};

	var ofType = exports.ofType = function ofType() {
	  for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
	    keys[_key] = arguments[_key];
	  }

	  return function (source) {
	    return source.pipe((0, _operators.filter)(function (_ref) {
	      var type = _ref.type;

	      var len = keys.length;
	      if (len === 1) {
	        return keyHasType(type, keys[0]);
	      } else {
	        for (var i = 0; i < len; i++) {
	          if (keyHasType(type, keys[i])) {
	            return true;
	          }
	        }
	      }
	      return false;
	    }));
	  };
	};

/***/ },
/* 131 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var deprecationsSeen = {};
	var resetDeprecationsSeen = exports.resetDeprecationsSeen = function resetDeprecationsSeen() {
	  deprecationsSeen = {};
	};

	var consoleWarn = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && typeof console.warn === 'function' ? function () {
	  var _console;

	  return (_console = console).warn.apply(_console, arguments);
	} : function () {};

	var deprecate = exports.deprecate = function deprecate(msg) {
	  if (!deprecationsSeen[msg]) {
	    deprecationsSeen[msg] = true;
	    consoleWarn('redux-observable | DEPRECATION: ' + msg);
	  }
	};

	var warn = exports.warn = function warn(msg) {
	  consoleWarn('redux-observable | WARNING: ' + msg);
	};

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _io = /*#__PURE__*/__webpack_require__(20);

	Object.defineProperty(exports, 'take', {
	  enumerable: true,
	  get: function get() {
	    return _io.take;
	  }
	});
	Object.defineProperty(exports, 'takem', {
	  enumerable: true,
	  get: function get() {
	    return _io.takem;
	  }
	});
	Object.defineProperty(exports, 'put', {
	  enumerable: true,
	  get: function get() {
	    return _io.put;
	  }
	});
	Object.defineProperty(exports, 'all', {
	  enumerable: true,
	  get: function get() {
	    return _io.all;
	  }
	});
	Object.defineProperty(exports, 'race', {
	  enumerable: true,
	  get: function get() {
	    return _io.race;
	  }
	});
	Object.defineProperty(exports, 'call', {
	  enumerable: true,
	  get: function get() {
	    return _io.call;
	  }
	});
	Object.defineProperty(exports, 'apply', {
	  enumerable: true,
	  get: function get() {
	    return _io.apply;
	  }
	});
	Object.defineProperty(exports, 'cps', {
	  enumerable: true,
	  get: function get() {
	    return _io.cps;
	  }
	});
	Object.defineProperty(exports, 'fork', {
	  enumerable: true,
	  get: function get() {
	    return _io.fork;
	  }
	});
	Object.defineProperty(exports, 'spawn', {
	  enumerable: true,
	  get: function get() {
	    return _io.spawn;
	  }
	});
	Object.defineProperty(exports, 'join', {
	  enumerable: true,
	  get: function get() {
	    return _io.join;
	  }
	});
	Object.defineProperty(exports, 'cancel', {
	  enumerable: true,
	  get: function get() {
	    return _io.cancel;
	  }
	});
	Object.defineProperty(exports, 'select', {
	  enumerable: true,
	  get: function get() {
	    return _io.select;
	  }
	});
	Object.defineProperty(exports, 'actionChannel', {
	  enumerable: true,
	  get: function get() {
	    return _io.actionChannel;
	  }
	});
	Object.defineProperty(exports, 'cancelled', {
	  enumerable: true,
	  get: function get() {
	    return _io.cancelled;
	  }
	});
	Object.defineProperty(exports, 'flush', {
	  enumerable: true,
	  get: function get() {
	    return _io.flush;
	  }
	});
	Object.defineProperty(exports, 'getContext', {
	  enumerable: true,
	  get: function get() {
	    return _io.getContext;
	  }
	});
	Object.defineProperty(exports, 'setContext', {
	  enumerable: true,
	  get: function get() {
	    return _io.setContext;
	  }
	});

	var _ioHelpers = /*#__PURE__*/__webpack_require__(241);

	Object.defineProperty(exports, 'takeEvery', {
	  enumerable: true,
	  get: function get() {
	    return _ioHelpers.takeEvery;
	  }
	});
	Object.defineProperty(exports, 'takeLatest', {
	  enumerable: true,
	  get: function get() {
	    return _ioHelpers.takeLatest;
	  }
	});
	Object.defineProperty(exports, 'throttle', {
	  enumerable: true,
	  get: function get() {
	    return _ioHelpers.throttle;
	  }
	});

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.TASK_CANCEL = exports.CHANNEL_END = exports.NOT_ITERATOR_ERROR = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.default = proc;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var _scheduler = /*#__PURE__*/__webpack_require__(136);

	var _io = /*#__PURE__*/__webpack_require__(20);

	var _channel = /*#__PURE__*/__webpack_require__(27);

	var _buffers = /*#__PURE__*/__webpack_require__(56);

	function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

	var NOT_ITERATOR_ERROR = exports.NOT_ITERATOR_ERROR = 'proc first argument (Saga function result) must be an iterator';

	var CHANNEL_END = exports.CHANNEL_END = {
	  toString: function toString() {
	    return '@@redux-saga/CHANNEL_END';
	  }
	};
	var TASK_CANCEL = exports.TASK_CANCEL = {
	  toString: function toString() {
	    return '@@redux-saga/TASK_CANCEL';
	  }
	};

	var matchers = {
	  wildcard: function wildcard() {
	    return _utils.kTrue;
	  },
	  default: function _default(pattern) {
	    return (typeof pattern === 'undefined' ? 'undefined' : _typeof(pattern)) === 'symbol' ? function (input) {
	      return input.type === pattern;
	    } : function (input) {
	      return input.type === String(pattern);
	    };
	  },
	  array: function array(patterns) {
	    return function (input) {
	      return patterns.some(function (p) {
	        return matcher(p)(input);
	      });
	    };
	  },
	  predicate: function predicate(_predicate) {
	    return function (input) {
	      return _predicate(input);
	    };
	  }
	};

	function matcher(pattern) {
	  // prettier-ignore
	  return (pattern === '*' ? matchers.wildcard : _utils.is.array(pattern) ? matchers.array : _utils.is.stringableFunc(pattern) ? matchers.default : _utils.is.func(pattern) ? matchers.predicate : matchers.default)(pattern);
	}

	/**
	  Used to track a parent task and its forks
	  In the new fork model, forked tasks are attached by default to their parent
	  We model this using the concept of Parent task && main Task
	  main task is the main flow of the current Generator, the parent tasks is the
	  aggregation of the main tasks + all its forked tasks.
	  Thus the whole model represents an execution tree with multiple branches (vs the
	  linear execution tree in sequential (non parallel) programming)

	  A parent tasks has the following semantics
	  - It completes if all its forks either complete or all cancelled
	  - If it's cancelled, all forks are cancelled as well
	  - It aborts if any uncaught error bubbles up from forks
	  - If it completes, the return value is the one returned by the main task
	**/
	function forkQueue(name, mainTask, cb) {
	  var tasks = [],
	      result = void 0,
	      completed = false;
	  addTask(mainTask);

	  function abort(err) {
	    cancelAll();
	    cb(err, true);
	  }

	  function addTask(task) {
	    tasks.push(task);
	    task.cont = function (res, isErr) {
	      if (completed) {
	        return;
	      }

	      (0, _utils.remove)(tasks, task);
	      task.cont = _utils.noop;
	      if (isErr) {
	        abort(res);
	      } else {
	        if (task === mainTask) {
	          result = res;
	        }
	        if (!tasks.length) {
	          completed = true;
	          cb(result);
	        }
	      }
	    };
	    // task.cont.cancel = task.cancel
	  }

	  function cancelAll() {
	    if (completed) {
	      return;
	    }
	    completed = true;
	    tasks.forEach(function (t) {
	      t.cont = _utils.noop;
	      t.cancel();
	    });
	    tasks = [];
	  }

	  return {
	    addTask: addTask,
	    cancelAll: cancelAll,
	    abort: abort,
	    getTasks: function getTasks() {
	      return tasks;
	    },
	    taskNames: function taskNames() {
	      return tasks.map(function (t) {
	        return t.name;
	      });
	    }
	  };
	}

	function createTaskIterator(_ref) {
	  var context = _ref.context,
	      fn = _ref.fn,
	      args = _ref.args;

	  if (_utils.is.iterator(fn)) {
	    return fn;
	  }

	  // catch synchronous failures; see #152 and #441
	  var result = void 0,
	      error = void 0;
	  try {
	    result = fn.apply(context, args);
	  } catch (err) {
	    error = err;
	  }

	  // i.e. a generator function returns an iterator
	  if (_utils.is.iterator(result)) {
	    return result;
	  }

	  // do not bubble up synchronous failures for detached forks
	  // instead create a failed task. See #152 and #441
	  return error ? (0, _utils.makeIterator)(function () {
	    throw error;
	  }) : (0, _utils.makeIterator)(function () {
	    var pc = void 0;
	    var eff = { done: false, value: result };
	    var ret = function ret(value) {
	      return { done: true, value: value };
	    };
	    return function (arg) {
	      if (!pc) {
	        pc = true;
	        return eff;
	      } else {
	        return ret(arg);
	      }
	    };
	  }());
	}

	var wrapHelper = function wrapHelper(helper) {
	  return { fn: helper };
	};

	function proc(iterator) {
	  var subscribe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
	    return _utils.noop;
	  };
	  var dispatch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _utils.noop;
	  var getState = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _utils.noop;
	  var parentContext = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
	  var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
	  var parentEffectId = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
	  var name = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 'anonymous';
	  var cont = arguments[8];

	  (0, _utils.check)(iterator, _utils.is.iterator, NOT_ITERATOR_ERROR);

	  var effectsString = '[...effects]';
	  var runParallelEffect = (0, _utils.deprecate)(runAllEffect, (0, _utils.updateIncentive)(effectsString, 'all(' + effectsString + ')'));

	  var sagaMonitor = options.sagaMonitor,
	      logger = options.logger,
	      onError = options.onError;

	  var log = logger || _utils.log;
	  var logError = function logError(err) {
	    var message = err.sagaStack;

	    if (!message && err.stack) {
	      message = err.stack.split('\n')[0].indexOf(err.message) !== -1 ? err.stack : 'Error: ' + err.message + '\n' + err.stack;
	    }

	    log('error', 'uncaught at ' + name, message || err.message || err);
	  };
	  var stdChannel = (0, _channel.stdChannel)(subscribe);
	  var taskContext = Object.create(parentContext);
	  /**
	    Tracks the current effect cancellation
	    Each time the generator progresses. calling runEffect will set a new value
	    on it. It allows propagating cancellation to child effects
	  **/
	  next.cancel = _utils.noop;

	  /**
	    Creates a new task descriptor for this generator, We'll also create a main task
	    to track the main flow (besides other forked tasks)
	  **/
	  var task = newTask(parentEffectId, name, iterator, cont);
	  var mainTask = { name: name, cancel: cancelMain, isRunning: true };
	  var taskQueue = forkQueue(name, mainTask, end);

	  /**
	    cancellation of the main task. We'll simply resume the Generator with a Cancel
	  **/
	  function cancelMain() {
	    if (mainTask.isRunning && !mainTask.isCancelled) {
	      mainTask.isCancelled = true;
	      next(TASK_CANCEL);
	    }
	  }

	  /**
	    This may be called by a parent generator to trigger/propagate cancellation
	    cancel all pending tasks (including the main task), then end the current task.
	     Cancellation propagates down to the whole execution tree holded by this Parent task
	    It's also propagated to all joiners of this task and their execution tree/joiners
	     Cancellation is noop for terminated/Cancelled tasks tasks
	  **/
	  function cancel() {
	    /**
	      We need to check both Running and Cancelled status
	      Tasks can be Cancelled but still Running
	    **/
	    if (iterator._isRunning && !iterator._isCancelled) {
	      iterator._isCancelled = true;
	      taskQueue.cancelAll();
	      /**
	        Ending with a Never result will propagate the Cancellation to all joiners
	      **/
	      end(TASK_CANCEL);
	    }
	  }
	  /**
	    attaches cancellation logic to this task's continuation
	    this will permit cancellation to propagate down the call chain
	  **/
	  cont && (cont.cancel = cancel);

	  // tracks the running status
	  iterator._isRunning = true;

	  // kicks up the generator
	  next();

	  // then return the task descriptor to the caller
	  return task;

	  /**
	    This is the generator driver
	    It's a recursive async/continuation function which calls itself
	    until the generator terminates or throws
	  **/
	  function next(arg, isErr) {
	    // Preventive measure. If we end up here, then there is really something wrong
	    if (!mainTask.isRunning) {
	      throw new Error('Trying to resume an already finished generator');
	    }

	    try {
	      var result = void 0;
	      if (isErr) {
	        result = iterator.throw(arg);
	      } else if (arg === TASK_CANCEL) {
	        /**
	          getting TASK_CANCEL automatically cancels the main task
	          We can get this value here
	           - By cancelling the parent task manually
	          - By joining a Cancelled task
	        **/
	        mainTask.isCancelled = true;
	        /**
	          Cancels the current effect; this will propagate the cancellation down to any called tasks
	        **/
	        next.cancel();
	        /**
	          If this Generator has a `return` method then invokes it
	          This will jump to the finally block
	        **/
	        result = _utils.is.func(iterator.return) ? iterator.return(TASK_CANCEL) : { done: true, value: TASK_CANCEL };
	      } else if (arg === CHANNEL_END) {
	        // We get CHANNEL_END by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
	        result = _utils.is.func(iterator.return) ? iterator.return() : { done: true };
	      } else {
	        result = iterator.next(arg);
	      }

	      if (!result.done) {
	        runEffect(result.value, parentEffectId, '', next);
	      } else {
	        /**
	          This Generator has ended, terminate the main task and notify the fork queue
	        **/
	        mainTask.isMainRunning = false;
	        mainTask.cont && mainTask.cont(result.value);
	      }
	    } catch (error) {
	      if (mainTask.isCancelled) {
	        logError(error);
	      }
	      mainTask.isMainRunning = false;
	      mainTask.cont(error, true);
	    }
	  }

	  function end(result, isErr) {
	    iterator._isRunning = false;
	    stdChannel.close();
	    if (!isErr) {
	      iterator._result = result;
	      iterator._deferredEnd && iterator._deferredEnd.resolve(result);
	    } else {
	      if (result instanceof Error) {
	        Object.defineProperty(result, 'sagaStack', {
	          value: 'at ' + name + ' \n ' + (result.sagaStack || result.stack),
	          configurable: true
	        });
	      }
	      if (!task.cont) {
	        if (result instanceof Error && onError) {
	          onError(result);
	        } else {
	          logError(result);
	        }
	      }
	      iterator._error = result;
	      iterator._isAborted = true;
	      iterator._deferredEnd && iterator._deferredEnd.reject(result);
	    }
	    task.cont && task.cont(result, isErr);
	    task.joiners.forEach(function (j) {
	      return j.cb(result, isErr);
	    });
	    task.joiners = null;
	  }

	  function runEffect(effect, parentEffectId) {
	    var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
	    var cb = arguments[3];

	    var effectId = (0, _utils.uid)();
	    sagaMonitor && sagaMonitor.effectTriggered({ effectId: effectId, parentEffectId: parentEffectId, label: label, effect: effect });

	    /**
	      completion callback and cancel callback are mutually exclusive
	      We can't cancel an already completed effect
	      And We can't complete an already cancelled effectId
	    **/
	    var effectSettled = void 0;

	    // Completion callback passed to the appropriate effect runner
	    function currCb(res, isErr) {
	      if (effectSettled) {
	        return;
	      }

	      effectSettled = true;
	      cb.cancel = _utils.noop; // defensive measure
	      if (sagaMonitor) {
	        isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
	      }
	      cb(res, isErr);
	    }
	    // tracks down the current cancel
	    currCb.cancel = _utils.noop;

	    // setup cancellation logic on the parent cb
	    cb.cancel = function () {
	      // prevents cancelling an already completed effect
	      if (effectSettled) {
	        return;
	      }

	      effectSettled = true;
	      /**
	        propagates cancel downward
	        catch uncaught cancellations errors; since we can no longer call the completion
	        callback, log errors raised during cancellations into the console
	      **/
	      try {
	        currCb.cancel();
	      } catch (err) {
	        logError(err);
	      }
	      currCb.cancel = _utils.noop; // defensive measure

	      sagaMonitor && sagaMonitor.effectCancelled(effectId);
	    };

	    /**
	      each effect runner must attach its own logic of cancellation to the provided callback
	      it allows this generator to propagate cancellation downward.
	       ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
	      And the setup must occur before calling the callback
	       This is a sort of inversion of control: called async functions are responsible
	      for completing the flow by calling the provided continuation; while caller functions
	      are responsible for aborting the current flow by calling the attached cancel function
	       Library users can attach their own cancellation logic to promises by defining a
	      promise[CANCEL] method in their returned promises
	      ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
	    **/
	    var data = void 0;
	    // prettier-ignore
	    return (
	      // Non declarative effect
	      _utils.is.promise(effect) ? resolvePromise(effect, currCb) : _utils.is.helper(effect) ? runForkEffect(wrapHelper(effect), effectId, currCb) : _utils.is.iterator(effect) ? resolveIterator(effect, effectId, name, currCb)

	      // declarative effects
	      : _utils.is.array(effect) ? runParallelEffect(effect, effectId, currCb) : (data = _io.asEffect.take(effect)) ? runTakeEffect(data, currCb) : (data = _io.asEffect.put(effect)) ? runPutEffect(data, currCb) : (data = _io.asEffect.all(effect)) ? runAllEffect(data, effectId, currCb) : (data = _io.asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : (data = _io.asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : (data = _io.asEffect.cps(effect)) ? runCPSEffect(data, currCb) : (data = _io.asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : (data = _io.asEffect.join(effect)) ? runJoinEffect(data, currCb) : (data = _io.asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : (data = _io.asEffect.select(effect)) ? runSelectEffect(data, currCb) : (data = _io.asEffect.actionChannel(effect)) ? runChannelEffect(data, currCb) : (data = _io.asEffect.flush(effect)) ? runFlushEffect(data, currCb) : (data = _io.asEffect.cancelled(effect)) ? runCancelledEffect(data, currCb) : (data = _io.asEffect.getContext(effect)) ? runGetContextEffect(data, currCb) : (data = _io.asEffect.setContext(effect)) ? runSetContextEffect(data, currCb) : /* anything else returned as is */currCb(effect)
	    );
	  }

	  function resolvePromise(promise, cb) {
	    var cancelPromise = promise[_utils.CANCEL];
	    if (_utils.is.func(cancelPromise)) {
	      cb.cancel = cancelPromise;
	    } else if (_utils.is.func(promise.abort)) {
	      cb.cancel = function () {
	        return promise.abort();
	      };
	      // TODO: add support for the fetch API, whenever they get around to
	      // adding cancel support
	    }
	    promise.then(cb, function (error) {
	      return cb(error, true);
	    });
	  }

	  function resolveIterator(iterator, effectId, name, cb) {
	    proc(iterator, subscribe, dispatch, getState, taskContext, options, effectId, name, cb);
	  }

	  function runTakeEffect(_ref2, cb) {
	    var channel = _ref2.channel,
	        pattern = _ref2.pattern,
	        maybe = _ref2.maybe;

	    channel = channel || stdChannel;
	    var takeCb = function takeCb(inp) {
	      return inp instanceof Error ? cb(inp, true) : (0, _channel.isEnd)(inp) && !maybe ? cb(CHANNEL_END) : cb(inp);
	    };
	    try {
	      channel.take(takeCb, matcher(pattern));
	    } catch (err) {
	      return cb(err, true);
	    }
	    cb.cancel = takeCb.cancel;
	  }

	  function runPutEffect(_ref3, cb) {
	    var channel = _ref3.channel,
	        action = _ref3.action,
	        resolve = _ref3.resolve;

	    /**
	      Schedule the put in case another saga is holding a lock.
	      The put will be executed atomically. ie nested puts will execute after
	      this put has terminated.
	    **/
	    (0, _scheduler.asap)(function () {
	      var result = void 0;
	      try {
	        result = (channel ? channel.put : dispatch)(action);
	      } catch (error) {
	        // If we have a channel or `put.resolve` was used then bubble up the error.
	        if (channel || resolve) return cb(error, true);
	        logError(error);
	      }

	      if (resolve && _utils.is.promise(result)) {
	        resolvePromise(result, cb);
	      } else {
	        return cb(result);
	      }
	    });
	    // Put effects are non cancellables
	  }

	  function runCallEffect(_ref4, effectId, cb) {
	    var context = _ref4.context,
	        fn = _ref4.fn,
	        args = _ref4.args;

	    var result = void 0;
	    // catch synchronous failures; see #152
	    try {
	      result = fn.apply(context, args);
	    } catch (error) {
	      return cb(error, true);
	    }
	    return _utils.is.promise(result) ? resolvePromise(result, cb) : _utils.is.iterator(result) ? resolveIterator(result, effectId, fn.name, cb) : cb(result);
	  }

	  function runCPSEffect(_ref5, cb) {
	    var context = _ref5.context,
	        fn = _ref5.fn,
	        args = _ref5.args;

	    // CPS (ie node style functions) can define their own cancellation logic
	    // by setting cancel field on the cb

	    // catch synchronous failures; see #152
	    try {
	      var cpsCb = function cpsCb(err, res) {
	        return _utils.is.undef(err) ? cb(res) : cb(err, true);
	      };
	      fn.apply(context, args.concat(cpsCb));
	      if (cpsCb.cancel) {
	        cb.cancel = function () {
	          return cpsCb.cancel();
	        };
	      }
	    } catch (error) {
	      return cb(error, true);
	    }
	  }

	  function runForkEffect(_ref6, effectId, cb) {
	    var context = _ref6.context,
	        fn = _ref6.fn,
	        args = _ref6.args,
	        detached = _ref6.detached;

	    var taskIterator = createTaskIterator({ context: context, fn: fn, args: args });

	    try {
	      (0, _scheduler.suspend)();
	      var _task = proc(taskIterator, subscribe, dispatch, getState, taskContext, options, effectId, fn.name, detached ? null : _utils.noop);

	      if (detached) {
	        cb(_task);
	      } else {
	        if (taskIterator._isRunning) {
	          taskQueue.addTask(_task);
	          cb(_task);
	        } else if (taskIterator._error) {
	          taskQueue.abort(taskIterator._error);
	        } else {
	          cb(_task);
	        }
	      }
	    } finally {
	      (0, _scheduler.flush)();
	    }
	    // Fork effects are non cancellables
	  }

	  function runJoinEffect(t, cb) {
	    if (t.isRunning()) {
	      var joiner = { task: task, cb: cb };
	      cb.cancel = function () {
	        return (0, _utils.remove)(t.joiners, joiner);
	      };
	      t.joiners.push(joiner);
	    } else {
	      t.isAborted() ? cb(t.error(), true) : cb(t.result());
	    }
	  }

	  function runCancelEffect(taskToCancel, cb) {
	    if (taskToCancel === _utils.SELF_CANCELLATION) {
	      taskToCancel = task;
	    }
	    if (taskToCancel.isRunning()) {
	      taskToCancel.cancel();
	    }
	    cb();
	    // cancel effects are non cancellables
	  }

	  function runAllEffect(effects, effectId, cb) {
	    var keys = Object.keys(effects);

	    if (!keys.length) {
	      return cb(_utils.is.array(effects) ? [] : {});
	    }

	    var completedCount = 0;
	    var completed = void 0;
	    var results = {};
	    var childCbs = {};

	    function checkEffectEnd() {
	      if (completedCount === keys.length) {
	        completed = true;
	        cb(_utils.is.array(effects) ? _utils.array.from(_extends({}, results, { length: keys.length })) : results);
	      }
	    }

	    keys.forEach(function (key) {
	      var chCbAtKey = function chCbAtKey(res, isErr) {
	        if (completed) {
	          return;
	        }
	        if (isErr || (0, _channel.isEnd)(res) || res === CHANNEL_END || res === TASK_CANCEL) {
	          cb.cancel();
	          cb(res, isErr);
	        } else {
	          results[key] = res;
	          completedCount++;
	          checkEffectEnd();
	        }
	      };
	      chCbAtKey.cancel = _utils.noop;
	      childCbs[key] = chCbAtKey;
	    });

	    cb.cancel = function () {
	      if (!completed) {
	        completed = true;
	        keys.forEach(function (key) {
	          return childCbs[key].cancel();
	        });
	      }
	    };

	    keys.forEach(function (key) {
	      return runEffect(effects[key], effectId, key, childCbs[key]);
	    });
	  }

	  function runRaceEffect(effects, effectId, cb) {
	    var completed = void 0;
	    var keys = Object.keys(effects);
	    var childCbs = {};

	    keys.forEach(function (key) {
	      var chCbAtKey = function chCbAtKey(res, isErr) {
	        if (completed) {
	          return;
	        }

	        if (isErr) {
	          // Race Auto cancellation
	          cb.cancel();
	          cb(res, true);
	        } else if (!(0, _channel.isEnd)(res) && res !== CHANNEL_END && res !== TASK_CANCEL) {
	          var _response;

	          cb.cancel();
	          completed = true;
	          var response = (_response = {}, _response[key] = res, _response);
	          cb(_utils.is.array(effects) ? [].slice.call(_extends({}, response, { length: keys.length })) : response);
	        }
	      };
	      chCbAtKey.cancel = _utils.noop;
	      childCbs[key] = chCbAtKey;
	    });

	    cb.cancel = function () {
	      // prevents unnecessary cancellation
	      if (!completed) {
	        completed = true;
	        keys.forEach(function (key) {
	          return childCbs[key].cancel();
	        });
	      }
	    };
	    keys.forEach(function (key) {
	      if (completed) {
	        return;
	      }
	      runEffect(effects[key], effectId, key, childCbs[key]);
	    });
	  }

	  function runSelectEffect(_ref7, cb) {
	    var selector = _ref7.selector,
	        args = _ref7.args;

	    try {
	      var state = selector.apply(undefined, [getState()].concat(args));
	      cb(state);
	    } catch (error) {
	      cb(error, true);
	    }
	  }

	  function runChannelEffect(_ref8, cb) {
	    var pattern = _ref8.pattern,
	        buffer = _ref8.buffer;

	    var match = matcher(pattern);
	    match.pattern = pattern;
	    cb((0, _channel.eventChannel)(subscribe, buffer || _buffers.buffers.fixed(), match));
	  }

	  function runCancelledEffect(data, cb) {
	    cb(!!mainTask.isCancelled);
	  }

	  function runFlushEffect(channel, cb) {
	    channel.flush(cb);
	  }

	  function runGetContextEffect(prop, cb) {
	    cb(taskContext[prop]);
	  }

	  function runSetContextEffect(props, cb) {
	    _utils.object.assign(taskContext, props);
	    cb();
	  }

	  function newTask(id, name, iterator, cont) {
	    var _done, _ref9, _mutatorMap;

	    iterator._deferredEnd = null;
	    return _ref9 = {}, _ref9[_utils.TASK] = true, _ref9.id = id, _ref9.name = name, _done = 'done', _mutatorMap = {}, _mutatorMap[_done] = _mutatorMap[_done] || {}, _mutatorMap[_done].get = function () {
	      if (iterator._deferredEnd) {
	        return iterator._deferredEnd.promise;
	      } else {
	        var def = (0, _utils.deferred)();
	        iterator._deferredEnd = def;
	        if (!iterator._isRunning) {
	          iterator._error ? def.reject(iterator._error) : def.resolve(iterator._result);
	        }
	        return def.promise;
	      }
	    }, _ref9.cont = cont, _ref9.joiners = [], _ref9.cancel = cancel, _ref9.isRunning = function isRunning() {
	      return iterator._isRunning;
	    }, _ref9.isCancelled = function isCancelled() {
	      return iterator._isCancelled;
	    }, _ref9.isAborted = function isAborted() {
	      return iterator._isAborted;
	    }, _ref9.result = function result() {
	      return iterator._result;
	    }, _ref9.error = function error() {
	      return iterator._error;
	    }, _ref9.setContext = function setContext(props) {
	      (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)('task', props));
	      _utils.object.assign(taskContext, props);
	    }, _defineEnumerableProperties(_ref9, _mutatorMap), _ref9;
	  }
	}

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.runSaga = runSaga;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var _proc = /*#__PURE__*/__webpack_require__(133);

	var _proc2 = /*#__PURE__*/_interopRequireDefault(_proc);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var RUN_SAGA_SIGNATURE = 'runSaga(storeInterface, saga, ...args)';
	var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ': saga argument must be a Generator function!';

	function runSaga(storeInterface, saga) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  var iterator = void 0;

	  if (_utils.is.iterator(storeInterface)) {
	    if (true) {
	      (0, _utils.log)('warn', 'runSaga(iterator, storeInterface) has been deprecated in favor of ' + RUN_SAGA_SIGNATURE);
	    }
	    iterator = storeInterface;
	    storeInterface = saga;
	  } else {
	    (0, _utils.check)(saga, _utils.is.func, NON_GENERATOR_ERR);
	    iterator = saga.apply(undefined, args);
	    (0, _utils.check)(iterator, _utils.is.iterator, NON_GENERATOR_ERR);
	  }

	  var _storeInterface = storeInterface,
	      subscribe = _storeInterface.subscribe,
	      dispatch = _storeInterface.dispatch,
	      getState = _storeInterface.getState,
	      context = _storeInterface.context,
	      sagaMonitor = _storeInterface.sagaMonitor,
	      logger = _storeInterface.logger,
	      onError = _storeInterface.onError;


	  var effectId = (0, _utils.uid)();

	  if (sagaMonitor) {
	    // monitors are expected to have a certain interface, let's fill-in any missing ones
	    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || _utils.noop;
	    sagaMonitor.effectResolved = sagaMonitor.effectResolved || _utils.noop;
	    sagaMonitor.effectRejected = sagaMonitor.effectRejected || _utils.noop;
	    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || _utils.noop;
	    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || _utils.noop;

	    sagaMonitor.effectTriggered({ effectId: effectId, root: true, parentEffectId: 0, effect: { root: true, saga: saga, args: args } });
	  }

	  var task = (0, _proc2.default)(iterator, subscribe, (0, _utils.wrapSagaDispatch)(dispatch), getState, context, { sagaMonitor: sagaMonitor, logger: logger, onError: onError }, effectId, saga.name);

	  if (sagaMonitor) {
	    sagaMonitor.effectResolved(effectId, task);
	  }

	  return task;
	}

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.throttleHelper = exports.takeLatestHelper = exports.takeEveryHelper = exports.throttle = exports.takeLatest = exports.takeEvery = undefined;

	var _takeEvery = /*#__PURE__*/__webpack_require__(243);

	var _takeEvery2 = /*#__PURE__*/_interopRequireDefault(_takeEvery);

	var _takeLatest = /*#__PURE__*/__webpack_require__(244);

	var _takeLatest2 = /*#__PURE__*/_interopRequireDefault(_takeLatest);

	var _throttle = /*#__PURE__*/__webpack_require__(245);

	var _throttle2 = /*#__PURE__*/_interopRequireDefault(_throttle);

	var _utils = /*#__PURE__*/__webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var deprecationWarning = function deprecationWarning(helperName) {
	  return 'import { ' + helperName + ' } from \'redux-saga\' has been deprecated in favor of import { ' + helperName + ' } from \'redux-saga/effects\'.\nThe latter will not work with yield*, as helper effects are wrapped automatically for you in fork effect.\nTherefore yield ' + helperName + ' will return task descriptor to your saga and execute next lines of code.';
	};

	var takeEvery = /*#__PURE__*/(0, _utils.deprecate)(_takeEvery2.default, /*#__PURE__*/deprecationWarning('takeEvery'));
	var takeLatest = /*#__PURE__*/(0, _utils.deprecate)(_takeLatest2.default, /*#__PURE__*/deprecationWarning('takeLatest'));
	var throttle = /*#__PURE__*/(0, _utils.deprecate)(_throttle2.default, /*#__PURE__*/deprecationWarning('throttle'));

	exports.takeEvery = takeEvery;
	exports.takeLatest = takeLatest;
	exports.throttle = throttle;
	exports.takeEveryHelper = _takeEvery2.default;
	exports.takeLatestHelper = _takeLatest2.default;
	exports.throttleHelper = _throttle2.default;

/***/ },
/* 136 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports.asap = asap;
	exports.suspend = suspend;
	exports.flush = flush;
	var queue = [];
	/**
	  Variable to hold a counting semaphore
	  - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
	    already suspended)
	  - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
	    triggers flushing the queued tasks.
	**/
	var semaphore = 0;

	/**
	  Executes a task 'atomically'. Tasks scheduled during this execution will be queued
	  and flushed after this task has finished (assuming the scheduler endup in a released
	  state).
	**/
	function exec(task) {
	  try {
	    suspend();
	    task();
	  } finally {
	    release();
	  }
	}

	/**
	  Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
	**/
	function asap(task) {
	  queue.push(task);

	  if (!semaphore) {
	    suspend();
	    flush();
	  }
	}

	/**
	  Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
	  scheduler is released.
	**/
	function suspend() {
	  semaphore++;
	}

	/**
	  Puts the scheduler in a `released` state.
	**/
	function release() {
	  semaphore--;
	}

	/**
	  Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
	**/
	function flush() {
	  release();

	  var task = void 0;
	  while (!semaphore && (task = queue.shift()) !== undefined) {
	    exec(task);
	  }
	}

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var ObjectUnsubscribedError_1 = __webpack_require__(64);
	var BehaviorSubject = (function (_super) {
	    __extends(BehaviorSubject, _super);
	    function BehaviorSubject(_value) {
	        var _this = _super.call(this) || this;
	        _this._value = _value;
	        return _this;
	    }
	    Object.defineProperty(BehaviorSubject.prototype, "value", {
	        get: function () {
	            return this.getValue();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BehaviorSubject.prototype._subscribe = function (subscriber) {
	        var subscription = _super.prototype._subscribe.call(this, subscriber);
	        if (subscription && !subscription.closed) {
	            subscriber.next(this._value);
	        }
	        return subscription;
	    };
	    BehaviorSubject.prototype.getValue = function () {
	        if (this.hasError) {
	            throw this.thrownError;
	        }
	        else if (this.closed) {
	            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
	        }
	        else {
	            return this._value;
	        }
	    };
	    BehaviorSubject.prototype.next = function (value) {
	        _super.prototype.next.call(this, this._value = value);
	    };
	    return BehaviorSubject;
	}(Subject_1.Subject));
	exports.BehaviorSubject = BehaviorSubject;
	//# sourceMappingURL=BehaviorSubject.js.map

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var config_1 = __webpack_require__(59);
	var hostReportError_1 = __webpack_require__(98);
	exports.empty = {
	    closed: true,
	    next: function (value) { },
	    error: function (err) {
	        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
	            throw err;
	        }
	        else {
	            hostReportError_1.hostReportError(err);
	        }
	    },
	    complete: function () { }
	};
	//# sourceMappingURL=Observer.js.map

/***/ },
/* 139 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Scheduler = (function () {
	    function Scheduler(SchedulerAction, now) {
	        if (now === void 0) { now = Scheduler.now; }
	        this.SchedulerAction = SchedulerAction;
	        this.now = now;
	    }
	    Scheduler.prototype.schedule = function (work, delay, state) {
	        if (delay === void 0) { delay = 0; }
	        return new this.SchedulerAction(this, work).schedule(state, delay);
	    };
	    Scheduler.now = function () { return Date.now(); };
	    return Scheduler;
	}());
	exports.Scheduler = Scheduler;
	//# sourceMappingURL=Scheduler.js.map

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscription_1 = __webpack_require__(5);
	var SubjectSubscription = (function (_super) {
	    __extends(SubjectSubscription, _super);
	    function SubjectSubscription(subject, subscriber) {
	        var _this = _super.call(this) || this;
	        _this.subject = subject;
	        _this.subscriber = subscriber;
	        _this.closed = false;
	        return _this;
	    }
	    SubjectSubscription.prototype.unsubscribe = function () {
	        if (this.closed) {
	            return;
	        }
	        this.closed = true;
	        var subject = this.subject;
	        var observers = subject.observers;
	        this.subject = null;
	        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
	            return;
	        }
	        var subscriberIndex = observers.indexOf(this.subscriber);
	        if (subscriberIndex !== -1) {
	            observers.splice(subscriberIndex, 1);
	        }
	    };
	    return SubjectSubscription;
	}(Subscription_1.Subscription));
	exports.SubjectSubscription = SubjectSubscription;
	//# sourceMappingURL=SubjectSubscription.js.map

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var Observable_1 = __webpack_require__(2);
	var Subscriber_1 = __webpack_require__(1);
	var Subscription_1 = __webpack_require__(5);
	var refCount_1 = __webpack_require__(90);
	var ConnectableObservable = (function (_super) {
	    __extends(ConnectableObservable, _super);
	    function ConnectableObservable(source, subjectFactory) {
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.subjectFactory = subjectFactory;
	        _this._refCount = 0;
	        _this._isComplete = false;
	        return _this;
	    }
	    ConnectableObservable.prototype._subscribe = function (subscriber) {
	        return this.getSubject().subscribe(subscriber);
	    };
	    ConnectableObservable.prototype.getSubject = function () {
	        var subject = this._subject;
	        if (!subject || subject.isStopped) {
	            this._subject = this.subjectFactory();
	        }
	        return this._subject;
	    };
	    ConnectableObservable.prototype.connect = function () {
	        var connection = this._connection;
	        if (!connection) {
	            this._isComplete = false;
	            connection = this._connection = new Subscription_1.Subscription();
	            connection.add(this.source
	                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
	            if (connection.closed) {
	                this._connection = null;
	                connection = Subscription_1.Subscription.EMPTY;
	            }
	        }
	        return connection;
	    };
	    ConnectableObservable.prototype.refCount = function () {
	        return refCount_1.refCount()(this);
	    };
	    return ConnectableObservable;
	}(Observable_1.Observable));
	exports.ConnectableObservable = ConnectableObservable;
	var connectableProto = ConnectableObservable.prototype;
	exports.connectableObservableDescriptor = {
	    operator: { value: null },
	    _refCount: { value: 0, writable: true },
	    _subject: { value: null, writable: true },
	    _connection: { value: null, writable: true },
	    _subscribe: { value: connectableProto._subscribe },
	    _isComplete: { value: connectableProto._isComplete, writable: true },
	    getSubject: { value: connectableProto.getSubject },
	    connect: { value: connectableProto.connect },
	    refCount: { value: connectableProto.refCount }
	};
	var ConnectableSubscriber = (function (_super) {
	    __extends(ConnectableSubscriber, _super);
	    function ConnectableSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    ConnectableSubscriber.prototype._error = function (err) {
	        this._unsubscribe();
	        _super.prototype._error.call(this, err);
	    };
	    ConnectableSubscriber.prototype._complete = function () {
	        this.connectable._isComplete = true;
	        this._unsubscribe();
	        _super.prototype._complete.call(this);
	    };
	    ConnectableSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (connectable) {
	            this.connectable = null;
	            var connection = connectable._connection;
	            connectable._refCount = 0;
	            connectable._subject = null;
	            connectable._connection = null;
	            if (connection) {
	                connection.unsubscribe();
	            }
	        }
	    };
	    return ConnectableSubscriber;
	}(Subject_1.SubjectSubscriber));
	var RefCountOperator = (function () {
	    function RefCountOperator(connectable) {
	        this.connectable = connectable;
	    }
	    RefCountOperator.prototype.call = function (subscriber, source) {
	        var connectable = this.connectable;
	        connectable._refCount++;
	        var refCounter = new RefCountSubscriber(subscriber, connectable);
	        var subscription = source.subscribe(refCounter);
	        if (!refCounter.closed) {
	            refCounter.connection = connectable.connect();
	        }
	        return subscription;
	    };
	    return RefCountOperator;
	}());
	var RefCountSubscriber = (function (_super) {
	    __extends(RefCountSubscriber, _super);
	    function RefCountSubscriber(destination, connectable) {
	        var _this = _super.call(this, destination) || this;
	        _this.connectable = connectable;
	        return _this;
	    }
	    RefCountSubscriber.prototype._unsubscribe = function () {
	        var connectable = this.connectable;
	        if (!connectable) {
	            this.connection = null;
	            return;
	        }
	        this.connectable = null;
	        var refCount = connectable._refCount;
	        if (refCount <= 0) {
	            this.connection = null;
	            return;
	        }
	        connectable._refCount = refCount - 1;
	        if (refCount > 1) {
	            this.connection = null;
	            return;
	        }
	        var connection = this.connection;
	        var sharedConnection = connectable._connection;
	        this.connection = null;
	        if (sharedConnection && (!connection || sharedConnection === connection)) {
	            sharedConnection.unsubscribe();
	        }
	    };
	    return RefCountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=ConnectableObservable.js.map

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var isScheduler_1 = __webpack_require__(16);
	var mergeAll_1 = __webpack_require__(89);
	var fromArray_1 = __webpack_require__(37);
	function merge() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var concurrent = Number.POSITIVE_INFINITY;
	    var scheduler = null;
	    var last = observables[observables.length - 1];
	    if (isScheduler_1.isScheduler(last)) {
	        scheduler = observables.pop();
	        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
	            concurrent = observables.pop();
	        }
	    }
	    else if (typeof last === 'number') {
	        concurrent = observables.pop();
	    }
	    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable_1.Observable) {
	        return observables[0];
	    }
	    return mergeAll_1.mergeAll(concurrent)(fromArray_1.fromArray(observables, scheduler));
	}
	exports.merge = merge;
	//# sourceMappingURL=merge.js.map

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var noop_1 = __webpack_require__(66);
	exports.NEVER = new Observable_1.Observable(noop_1.noop);
	function never() {
	    return exports.NEVER;
	}
	exports.never = never;
	//# sourceMappingURL=never.js.map

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var isArray_1 = __webpack_require__(8);
	var fromArray_1 = __webpack_require__(37);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function race() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    if (observables.length === 1) {
	        if (isArray_1.isArray(observables[0])) {
	            observables = observables[0];
	        }
	        else {
	            return observables[0];
	        }
	    }
	    return fromArray_1.fromArray(observables, undefined).lift(new RaceOperator());
	}
	exports.race = race;
	var RaceOperator = (function () {
	    function RaceOperator() {
	    }
	    RaceOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new RaceSubscriber(subscriber));
	    };
	    return RaceOperator;
	}());
	exports.RaceOperator = RaceOperator;
	var RaceSubscriber = (function (_super) {
	    __extends(RaceSubscriber, _super);
	    function RaceSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasFirst = false;
	        _this.observables = [];
	        _this.subscriptions = [];
	        return _this;
	    }
	    RaceSubscriber.prototype._next = function (observable) {
	        this.observables.push(observable);
	    };
	    RaceSubscriber.prototype._complete = function () {
	        var observables = this.observables;
	        var len = observables.length;
	        if (len === 0) {
	            this.destination.complete();
	        }
	        else {
	            for (var i = 0; i < len && !this.hasFirst; i++) {
	                var observable = observables[i];
	                var subscription = subscribeToResult_1.subscribeToResult(this, observable, observable, i);
	                if (this.subscriptions) {
	                    this.subscriptions.push(subscription);
	                }
	                this.add(subscription);
	            }
	            this.observables = null;
	        }
	    };
	    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        if (!this.hasFirst) {
	            this.hasFirst = true;
	            for (var i = 0; i < this.subscriptions.length; i++) {
	                if (i !== outerIndex) {
	                    var subscription = this.subscriptions[i];
	                    subscription.unsubscribe();
	                    this.remove(subscription);
	                }
	            }
	            this.subscriptions = null;
	        }
	        this.destination.next(innerValue);
	    };
	    return RaceSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.RaceSubscriber = RaceSubscriber;
	//# sourceMappingURL=race.js.map

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var async_1 = __webpack_require__(7);
	var isNumeric_1 = __webpack_require__(65);
	var isScheduler_1 = __webpack_require__(16);
	function timer(dueTime, periodOrScheduler, scheduler) {
	    if (dueTime === void 0) { dueTime = 0; }
	    var period = -1;
	    if (isNumeric_1.isNumeric(periodOrScheduler)) {
	        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
	    }
	    else if (isScheduler_1.isScheduler(periodOrScheduler)) {
	        scheduler = periodOrScheduler;
	    }
	    if (!isScheduler_1.isScheduler(scheduler)) {
	        scheduler = async_1.async;
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        var due = isNumeric_1.isNumeric(dueTime)
	            ? dueTime
	            : (+dueTime - scheduler.now());
	        return scheduler.schedule(dispatch, due, {
	            index: 0, period: period, subscriber: subscriber
	        });
	    });
	}
	exports.timer = timer;
	function dispatch(state) {
	    var index = state.index, period = state.period, subscriber = state.subscriber;
	    subscriber.next(index);
	    if (subscriber.closed) {
	        return;
	    }
	    else if (period === -1) {
	        return subscriber.complete();
	    }
	    state.index = index + 1;
	    this.schedule(state, period);
	}
	//# sourceMappingURL=timer.js.map

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function audit(durationSelector) {
	    return function auditOperatorFunction(source) {
	        return source.lift(new AuditOperator(durationSelector));
	    };
	}
	exports.audit = audit;
	var AuditOperator = (function () {
	    function AuditOperator(durationSelector) {
	        this.durationSelector = durationSelector;
	    }
	    AuditOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
	    };
	    return AuditOperator;
	}());
	var AuditSubscriber = (function (_super) {
	    __extends(AuditSubscriber, _super);
	    function AuditSubscriber(destination, durationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.durationSelector = durationSelector;
	        _this.hasValue = false;
	        return _this;
	    }
	    AuditSubscriber.prototype._next = function (value) {
	        this.value = value;
	        this.hasValue = true;
	        if (!this.throttled) {
	            var duration = void 0;
	            try {
	                var durationSelector = this.durationSelector;
	                duration = durationSelector(value);
	            }
	            catch (err) {
	                return this.destination.error(err);
	            }
	            var innerSubscription = subscribeToResult_1.subscribeToResult(this, duration);
	            if (!innerSubscription || innerSubscription.closed) {
	                this.clearThrottle();
	            }
	            else {
	                this.add(this.throttled = innerSubscription);
	            }
	        }
	    };
	    AuditSubscriber.prototype.clearThrottle = function () {
	        var _a = this, value = _a.value, hasValue = _a.hasValue, throttled = _a.throttled;
	        if (throttled) {
	            this.remove(throttled);
	            this.throttled = null;
	            throttled.unsubscribe();
	        }
	        if (hasValue) {
	            this.value = null;
	            this.hasValue = false;
	            this.destination.next(value);
	        }
	    };
	    AuditSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex) {
	        this.clearThrottle();
	    };
	    AuditSubscriber.prototype.notifyComplete = function () {
	        this.clearThrottle();
	    };
	    return AuditSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=audit.js.map

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var mergeAll_1 = __webpack_require__(89);
	function concatAll() {
	    return mergeAll_1.mergeAll(1);
	}
	exports.concatAll = concatAll;
	//# sourceMappingURL=concatAll.js.map

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var mergeMap_1 = __webpack_require__(39);
	function concatMap(project, resultSelector) {
	    return mergeMap_1.mergeMap(project, resultSelector, 1);
	}
	exports.concatMap = concatMap;
	//# sourceMappingURL=concatMap.js.map

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function distinctUntilChanged(compare, keySelector) {
	    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
	}
	exports.distinctUntilChanged = distinctUntilChanged;
	var DistinctUntilChangedOperator = (function () {
	    function DistinctUntilChangedOperator(compare, keySelector) {
	        this.compare = compare;
	        this.keySelector = keySelector;
	    }
	    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
	    };
	    return DistinctUntilChangedOperator;
	}());
	var DistinctUntilChangedSubscriber = (function (_super) {
	    __extends(DistinctUntilChangedSubscriber, _super);
	    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.hasKey = false;
	        if (typeof compare === 'function') {
	            _this.compare = compare;
	        }
	        return _this;
	    }
	    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
	        return x === y;
	    };
	    DistinctUntilChangedSubscriber.prototype._next = function (value) {
	        var key;
	        try {
	            var keySelector = this.keySelector;
	            key = keySelector ? keySelector(value) : value;
	        }
	        catch (err) {
	            return this.destination.error(err);
	        }
	        var result = false;
	        if (this.hasKey) {
	            try {
	                var compare = this.compare;
	                result = compare(this.key, key);
	            }
	            catch (err) {
	                return this.destination.error(err);
	            }
	        }
	        else {
	            this.hasKey = true;
	        }
	        if (!result) {
	            this.key = key;
	            this.destination.next(value);
	        }
	    };
	    return DistinctUntilChangedSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=distinctUntilChanged.js.map

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function find(predicate, thisArg) {
	    if (typeof predicate !== 'function') {
	        throw new TypeError('predicate is not a function');
	    }
	    return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
	}
	exports.find = find;
	var FindValueOperator = (function () {
	    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
	        this.predicate = predicate;
	        this.source = source;
	        this.yieldIndex = yieldIndex;
	        this.thisArg = thisArg;
	    }
	    FindValueOperator.prototype.call = function (observer, source) {
	        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
	    };
	    return FindValueOperator;
	}());
	exports.FindValueOperator = FindValueOperator;
	var FindValueSubscriber = (function (_super) {
	    __extends(FindValueSubscriber, _super);
	    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.source = source;
	        _this.yieldIndex = yieldIndex;
	        _this.thisArg = thisArg;
	        _this.index = 0;
	        return _this;
	    }
	    FindValueSubscriber.prototype.notifyComplete = function (value) {
	        var destination = this.destination;
	        destination.next(value);
	        destination.complete();
	        this.unsubscribe();
	    };
	    FindValueSubscriber.prototype._next = function (value) {
	        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
	        var index = this.index++;
	        try {
	            var result = predicate.call(thisArg || this, value, index, this.source);
	            if (result) {
	                this.notifyComplete(this.yieldIndex ? index : value);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    FindValueSubscriber.prototype._complete = function () {
	        this.notifyComplete(this.yieldIndex ? -1 : undefined);
	    };
	    return FindValueSubscriber;
	}(Subscriber_1.Subscriber));
	exports.FindValueSubscriber = FindValueSubscriber;
	//# sourceMappingURL=find.js.map

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var Subscription_1 = __webpack_require__(5);
	var Observable_1 = __webpack_require__(2);
	var Subject_1 = __webpack_require__(6);
	function groupBy(keySelector, elementSelector, durationSelector, subjectSelector) {
	    return function (source) {
	        return source.lift(new GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector));
	    };
	}
	exports.groupBy = groupBy;
	var GroupByOperator = (function () {
	    function GroupByOperator(keySelector, elementSelector, durationSelector, subjectSelector) {
	        this.keySelector = keySelector;
	        this.elementSelector = elementSelector;
	        this.durationSelector = durationSelector;
	        this.subjectSelector = subjectSelector;
	    }
	    GroupByOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new GroupBySubscriber(subscriber, this.keySelector, this.elementSelector, this.durationSelector, this.subjectSelector));
	    };
	    return GroupByOperator;
	}());
	var GroupBySubscriber = (function (_super) {
	    __extends(GroupBySubscriber, _super);
	    function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.elementSelector = elementSelector;
	        _this.durationSelector = durationSelector;
	        _this.subjectSelector = subjectSelector;
	        _this.groups = null;
	        _this.attemptedToUnsubscribe = false;
	        _this.count = 0;
	        return _this;
	    }
	    GroupBySubscriber.prototype._next = function (value) {
	        var key;
	        try {
	            key = this.keySelector(value);
	        }
	        catch (err) {
	            this.error(err);
	            return;
	        }
	        this._group(value, key);
	    };
	    GroupBySubscriber.prototype._group = function (value, key) {
	        var groups = this.groups;
	        if (!groups) {
	            groups = this.groups = new Map();
	        }
	        var group = groups.get(key);
	        var element;
	        if (this.elementSelector) {
	            try {
	                element = this.elementSelector(value);
	            }
	            catch (err) {
	                this.error(err);
	            }
	        }
	        else {
	            element = value;
	        }
	        if (!group) {
	            group = (this.subjectSelector ? this.subjectSelector() : new Subject_1.Subject());
	            groups.set(key, group);
	            var groupedObservable = new GroupedObservable(key, group, this);
	            this.destination.next(groupedObservable);
	            if (this.durationSelector) {
	                var duration = void 0;
	                try {
	                    duration = this.durationSelector(new GroupedObservable(key, group));
	                }
	                catch (err) {
	                    this.error(err);
	                    return;
	                }
	                this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
	            }
	        }
	        if (!group.closed) {
	            group.next(element);
	        }
	    };
	    GroupBySubscriber.prototype._error = function (err) {
	        var groups = this.groups;
	        if (groups) {
	            groups.forEach(function (group, key) {
	                group.error(err);
	            });
	            groups.clear();
	        }
	        this.destination.error(err);
	    };
	    GroupBySubscriber.prototype._complete = function () {
	        var groups = this.groups;
	        if (groups) {
	            groups.forEach(function (group, key) {
	                group.complete();
	            });
	            groups.clear();
	        }
	        this.destination.complete();
	    };
	    GroupBySubscriber.prototype.removeGroup = function (key) {
	        this.groups.delete(key);
	    };
	    GroupBySubscriber.prototype.unsubscribe = function () {
	        if (!this.closed) {
	            this.attemptedToUnsubscribe = true;
	            if (this.count === 0) {
	                _super.prototype.unsubscribe.call(this);
	            }
	        }
	    };
	    return GroupBySubscriber;
	}(Subscriber_1.Subscriber));
	var GroupDurationSubscriber = (function (_super) {
	    __extends(GroupDurationSubscriber, _super);
	    function GroupDurationSubscriber(key, group, parent) {
	        var _this = _super.call(this, group) || this;
	        _this.key = key;
	        _this.group = group;
	        _this.parent = parent;
	        return _this;
	    }
	    GroupDurationSubscriber.prototype._next = function (value) {
	        this.complete();
	    };
	    GroupDurationSubscriber.prototype._unsubscribe = function () {
	        var _a = this, parent = _a.parent, key = _a.key;
	        this.key = this.parent = null;
	        if (parent) {
	            parent.removeGroup(key);
	        }
	    };
	    return GroupDurationSubscriber;
	}(Subscriber_1.Subscriber));
	var GroupedObservable = (function (_super) {
	    __extends(GroupedObservable, _super);
	    function GroupedObservable(key, groupSubject, refCountSubscription) {
	        var _this = _super.call(this) || this;
	        _this.key = key;
	        _this.groupSubject = groupSubject;
	        _this.refCountSubscription = refCountSubscription;
	        return _this;
	    }
	    GroupedObservable.prototype._subscribe = function (subscriber) {
	        var subscription = new Subscription_1.Subscription();
	        var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
	        if (refCountSubscription && !refCountSubscription.closed) {
	            subscription.add(new InnerRefCountSubscription(refCountSubscription));
	        }
	        subscription.add(groupSubject.subscribe(subscriber));
	        return subscription;
	    };
	    return GroupedObservable;
	}(Observable_1.Observable));
	exports.GroupedObservable = GroupedObservable;
	var InnerRefCountSubscription = (function (_super) {
	    __extends(InnerRefCountSubscription, _super);
	    function InnerRefCountSubscription(parent) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        parent.count++;
	        return _this;
	    }
	    InnerRefCountSubscription.prototype.unsubscribe = function () {
	        var parent = this.parent;
	        if (!parent.closed && !this.closed) {
	            _super.prototype.unsubscribe.call(this);
	            parent.count -= 1;
	            if (parent.count === 0 && parent.attemptedToUnsubscribe) {
	                parent.unsubscribe();
	            }
	        }
	    };
	    return InnerRefCountSubscription;
	}(Subscription_1.Subscription));
	//# sourceMappingURL=groupBy.js.map

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var Notification_1 = __webpack_require__(58);
	function observeOn(scheduler, delay) {
	    if (delay === void 0) { delay = 0; }
	    return function observeOnOperatorFunction(source) {
	        return source.lift(new ObserveOnOperator(scheduler, delay));
	    };
	}
	exports.observeOn = observeOn;
	var ObserveOnOperator = (function () {
	    function ObserveOnOperator(scheduler, delay) {
	        if (delay === void 0) { delay = 0; }
	        this.scheduler = scheduler;
	        this.delay = delay;
	    }
	    ObserveOnOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
	    };
	    return ObserveOnOperator;
	}());
	exports.ObserveOnOperator = ObserveOnOperator;
	var ObserveOnSubscriber = (function (_super) {
	    __extends(ObserveOnSubscriber, _super);
	    function ObserveOnSubscriber(destination, scheduler, delay) {
	        if (delay === void 0) { delay = 0; }
	        var _this = _super.call(this, destination) || this;
	        _this.scheduler = scheduler;
	        _this.delay = delay;
	        return _this;
	    }
	    ObserveOnSubscriber.dispatch = function (arg) {
	        var notification = arg.notification, destination = arg.destination;
	        notification.observe(destination);
	        this.unsubscribe();
	    };
	    ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
	        var destination = this.destination;
	        destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
	    };
	    ObserveOnSubscriber.prototype._next = function (value) {
	        this.scheduleMessage(Notification_1.Notification.createNext(value));
	    };
	    ObserveOnSubscriber.prototype._error = function (err) {
	        this.scheduleMessage(Notification_1.Notification.createError(err));
	        this.unsubscribe();
	    };
	    ObserveOnSubscriber.prototype._complete = function () {
	        this.scheduleMessage(Notification_1.Notification.createComplete());
	        this.unsubscribe();
	    };
	    return ObserveOnSubscriber;
	}(Subscriber_1.Subscriber));
	exports.ObserveOnSubscriber = ObserveOnSubscriber;
	var ObserveOnMessage = (function () {
	    function ObserveOnMessage(notification, destination) {
	        this.notification = notification;
	        this.destination = destination;
	    }
	    return ObserveOnMessage;
	}());
	exports.ObserveOnMessage = ObserveOnMessage;
	//# sourceMappingURL=observeOn.js.map

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	exports.defaultThrottleConfig = {
	    leading: true,
	    trailing: false
	};
	function throttle(durationSelector, config) {
	    if (config === void 0) { config = exports.defaultThrottleConfig; }
	    return function (source) { return source.lift(new ThrottleOperator(durationSelector, config.leading, config.trailing)); };
	}
	exports.throttle = throttle;
	var ThrottleOperator = (function () {
	    function ThrottleOperator(durationSelector, leading, trailing) {
	        this.durationSelector = durationSelector;
	        this.leading = leading;
	        this.trailing = trailing;
	    }
	    ThrottleOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
	    };
	    return ThrottleOperator;
	}());
	var ThrottleSubscriber = (function (_super) {
	    __extends(ThrottleSubscriber, _super);
	    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.durationSelector = durationSelector;
	        _this._leading = _leading;
	        _this._trailing = _trailing;
	        _this._hasValue = false;
	        return _this;
	    }
	    ThrottleSubscriber.prototype._next = function (value) {
	        this._hasValue = true;
	        this._sendValue = value;
	        if (!this._throttled) {
	            if (this._leading) {
	                this.send();
	            }
	            else {
	                this.throttle(value);
	            }
	        }
	    };
	    ThrottleSubscriber.prototype.send = function () {
	        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
	        if (_hasValue) {
	            this.destination.next(_sendValue);
	            this.throttle(_sendValue);
	        }
	        this._hasValue = false;
	        this._sendValue = null;
	    };
	    ThrottleSubscriber.prototype.throttle = function (value) {
	        var duration = this.tryDurationSelector(value);
	        if (!!duration) {
	            this.add(this._throttled = subscribeToResult_1.subscribeToResult(this, duration));
	        }
	    };
	    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
	        try {
	            return this.durationSelector(value);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return null;
	        }
	    };
	    ThrottleSubscriber.prototype.throttlingDone = function () {
	        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
	        if (_throttled) {
	            _throttled.unsubscribe();
	        }
	        this._throttled = null;
	        if (_trailing) {
	            this.send();
	        }
	    };
	    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.throttlingDone();
	    };
	    ThrottleSubscriber.prototype.notifyComplete = function () {
	        this.throttlingDone();
	    };
	    return ThrottleSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=throttle.js.map

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var isDate_1 = __webpack_require__(161);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function timeoutWith(due, withObservable, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return function (source) {
	        var absoluteTimeout = isDate_1.isDate(due);
	        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
	        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
	    };
	}
	exports.timeoutWith = timeoutWith;
	var TimeoutWithOperator = (function () {
	    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
	        this.waitFor = waitFor;
	        this.absoluteTimeout = absoluteTimeout;
	        this.withObservable = withObservable;
	        this.scheduler = scheduler;
	    }
	    TimeoutWithOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
	    };
	    return TimeoutWithOperator;
	}());
	var TimeoutWithSubscriber = (function (_super) {
	    __extends(TimeoutWithSubscriber, _super);
	    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.absoluteTimeout = absoluteTimeout;
	        _this.waitFor = waitFor;
	        _this.withObservable = withObservable;
	        _this.scheduler = scheduler;
	        _this.action = null;
	        _this.scheduleTimeout();
	        return _this;
	    }
	    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
	        var withObservable = subscriber.withObservable;
	        subscriber._unsubscribeAndRecycle();
	        subscriber.add(subscribeToResult_1.subscribeToResult(subscriber, withObservable));
	    };
	    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
	        var action = this.action;
	        if (action) {
	            this.action = action.schedule(this, this.waitFor);
	        }
	        else {
	            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
	        }
	    };
	    TimeoutWithSubscriber.prototype._next = function (value) {
	        if (!this.absoluteTimeout) {
	            this.scheduleTimeout();
	        }
	        _super.prototype._next.call(this, value);
	    };
	    TimeoutWithSubscriber.prototype._unsubscribe = function () {
	        this.action = null;
	        this.scheduler = null;
	        this.withObservable = null;
	    };
	    return TimeoutWithSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=timeoutWith.js.map

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var scheduleObservable_1 = __webpack_require__(345);
	var schedulePromise_1 = __webpack_require__(346);
	var scheduleArray_1 = __webpack_require__(95);
	var scheduleIterable_1 = __webpack_require__(344);
	var isInteropObservable_1 = __webpack_require__(357);
	var isPromise_1 = __webpack_require__(162);
	var isArrayLike_1 = __webpack_require__(160);
	var isIterable_1 = __webpack_require__(358);
	function scheduled(input, scheduler) {
	    if (input != null) {
	        if (isInteropObservable_1.isInteropObservable(input)) {
	            return scheduleObservable_1.scheduleObservable(input, scheduler);
	        }
	        else if (isPromise_1.isPromise(input)) {
	            return schedulePromise_1.schedulePromise(input, scheduler);
	        }
	        else if (isArrayLike_1.isArrayLike(input)) {
	            return scheduleArray_1.scheduleArray(input, scheduler);
	        }
	        else if (isIterable_1.isIterable(input) || typeof input === 'string') {
	            return scheduleIterable_1.scheduleIterable(input, scheduler);
	        }
	    }
	    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
	}
	exports.scheduled = scheduled;
	//# sourceMappingURL=scheduled.js.map

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsapAction_1 = __webpack_require__(350);
	var AsapScheduler_1 = __webpack_require__(351);
	exports.asap = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
	//# sourceMappingURL=asap.js.map

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var QueueAction_1 = __webpack_require__(352);
	var QueueScheduler_1 = __webpack_require__(353);
	exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
	//# sourceMappingURL=queue.js.map

/***/ },
/* 158 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function TimeoutErrorImpl() {
	    Error.call(this);
	    this.message = 'Timeout has occurred';
	    this.name = 'TimeoutError';
	    return this;
	}
	TimeoutErrorImpl.prototype = Object.create(Error.prototype);
	exports.TimeoutError = TimeoutErrorImpl;
	//# sourceMappingURL=TimeoutError.js.map

/***/ },
/* 159 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function UnsubscriptionErrorImpl(errors) {
	    Error.call(this);
	    this.message = errors ?
	        errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
	    this.name = 'UnsubscriptionError';
	    this.errors = errors;
	    return this;
	}
	UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
	exports.UnsubscriptionError = UnsubscriptionErrorImpl;
	//# sourceMappingURL=UnsubscriptionError.js.map

/***/ },
/* 160 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });
	//# sourceMappingURL=isArrayLike.js.map

/***/ },
/* 161 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function isDate(value) {
	    return value instanceof Date && !isNaN(+value);
	}
	exports.isDate = isDate;
	//# sourceMappingURL=isDate.js.map

/***/ },
/* 162 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function isPromise(value) {
	    return !!value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
	}
	exports.isPromise = isPromise;
	//# sourceMappingURL=isPromise.js.map

/***/ },
/* 163 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function not(pred, thisArg) {
	    function notPred() {
	        return !(notPred.pred.apply(notPred.thisArg, arguments));
	    }
	    notPred.pred = pred;
	    notPred.thisArg = thisArg;
	    return notPred;
	}
	exports.not = not;
	//# sourceMappingURL=not.js.map

/***/ },
/* 164 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.subscribeToArray = function (array) { return function (subscriber) {
	    for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
	        subscriber.next(array[i]);
	    }
	    subscriber.complete();
	}; };
	//# sourceMappingURL=subscribeToArray.js.map

/***/ },
/* 165 */
/***/ function(module, exports) {

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	module.exports = _assertThisInitialized;

/***/ },
/* 166 */
/***/ function(module, exports) {

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	module.exports = _inheritsLoose;

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(46);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(47);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _toConsumableArray2 = __webpack_require__(105);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _rxjs = __webpack_require__(36);

	var _operators = __webpack_require__(102);

	var _reduxObservable = __webpack_require__(239);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getAllProperties(obj) {
	  var p = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	  if (obj == null) return p;
	  return getAllProperties(Object.getPrototypeOf(obj), [].concat((0, _toConsumableArray3.default)(p), (0, _toConsumableArray3.default)(Object.getOwnPropertyNames(obj))));
	}

	var RxRelieverPlugin = function () {
	  function RxRelieverPlugin() {
	    (0, _classCallCheck3.default)(this, RxRelieverPlugin);

	    if (!RxRelieverPlugin.instance) {
	      this.store$ = new _rxjs.ReplaySubject();
	      this.middleware = null;
	      this.epics = [];
	      RxRelieverPlugin.instance = this;
	    }
	    return RxRelieverPlugin.instance;
	  }

	  (0, _createClass3.default)(RxRelieverPlugin, [{
	    key: 'setupStore',
	    value: function setupStore(store) {
	      var _this = this;

	      this.store$.next(store);
	      this.store$ = this.store$.asObservable();

	      var input = function input(action$, state$) {
	        var stream$ = _this.middlewareOptions.input ? _this.middlewareOptions.input(action$, state$) : action$;
	        if (!RxRelieverPlugin.instance.action$) {
	          RxRelieverPlugin.instance.action$ = stream$;
	        }
	        if (!RxRelieverPlugin.instance.state$) {
	          RxRelieverPlugin.instance.state$ = state$;
	        }
	        return stream$;
	      };
	      var output = function output(action$, state$) {
	        var stream$ = action$.pipe((0, _operators.filter)(function (action) {
	          return action && action.type;
	        }));
	        return _this.middlewareOptions.output ? _this.middlewareOptions.output(stream$, state$) : stream$;
	      };
	      var adapter = function adapter() {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	          args[_key] = arguments[_key];
	        }

	        var action$ = args[0],
	            rest = args.slice(1);

	        return output.apply(undefined, [_reduxObservable.combineEpics.apply(undefined, (0, _toConsumableArray3.default)(_this.epics)).apply(undefined, [input.apply(undefined, [action$].concat((0, _toConsumableArray3.default)(rest)))].concat((0, _toConsumableArray3.default)(rest)))].concat((0, _toConsumableArray3.default)(rest)));
	      };
	      this.middleware.run(adapter);
	    }
	  }, {
	    key: 'createMiddleware',
	    value: function createMiddleware(reliever) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      var epics = getAllProperties(reliever).filter(function (key) {
	        return key.endsWith('Epic');
	      }).map(function (key) {
	        return reliever[key].bind(reliever);
	      });

	      this.epics = this.epics.concat(epics);

	      if (!this.middleware) {
	        this.middleware = (0, _reduxObservable.createEpicMiddleware)();
	        this.middlewareOptions = options;
	        return this.middleware;
	      }
	      return null;
	    }
	  }, {
	    key: 'extensions',
	    value: function extensions() {
	      var getStore = function getStore() {
	        return RxRelieverPlugin.instance.store$;
	      };
	      var getState = function getState(module) {
	        return getStore().pipe((0, _operators.map)(function (store) {
	          var state = store.getState();
	          return module ? state[module] : state;
	        }));
	      };
	      var reduxActionStream = function reduxActionStream() {
	        return RxRelieverPlugin.instance.action$;
	      };
	      var observeState = function observeState(module) {
	        return RxRelieverPlugin.instance.state$.pipe((0, _operators.map)(function (state) {
	          return module ? state[module] : state;
	        }), (0, _operators.distinctUntilChanged)());
	      };
	      return {
	        getStore: getStore,
	        getState: getState,
	        reduxActionStream: reduxActionStream,
	        observeState: observeState
	      };
	    }
	  }]);
	  return RxRelieverPlugin;
	}();

	exports.default = RxRelieverPlugin;

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _regenerator = __webpack_require__(181);

	var _regenerator2 = _interopRequireDefault(_regenerator);

	var _classCallCheck2 = __webpack_require__(46);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(47);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _effects = __webpack_require__(132);

	var _reduxSaga = __webpack_require__(240);

	var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SagaRelieverPlugin = function () {
	  function SagaRelieverPlugin() {
	    (0, _classCallCheck3.default)(this, SagaRelieverPlugin);

	    if (!SagaRelieverPlugin.instance) {
	      SagaRelieverPlugin.instance = this;
	      this.sagas = [];
	    }
	    return SagaRelieverPlugin.instance;
	  }

	  (0, _createClass3.default)(SagaRelieverPlugin, [{
	    key: 'addSaga',
	    value: function addSaga(saga) {
	      this.sagas.push(saga);
	      return this;
	    }
	  }, {
	    key: 'setupStore',
	    value: function setupStore() {
	      var sagas = this.sagas.map(function (saga) {
	        return saga();
	      });
	      var rootSaga = /*#__PURE__*/_regenerator2.default.mark(function rootSaga() {
	        return _regenerator2.default.wrap(function rootSaga$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                _context.next = 2;
	                return (0, _effects.all)(sagas);

	              case 2:
	              case 'end':
	                return _context.stop();
	            }
	          }
	        }, rootSaga, this);
	      });
	      this.middleware.run(rootSaga);
	    }
	  }, {
	    key: 'createMiddleware',
	    value: function createMiddleware(reliever) {
	      var saga = reliever.saga;
	      if (!saga) return;
	      this.sagas.push(saga.bind(reliever));
	      if (!this.middleware) {
	        this.middleware = (0, _reduxSaga2.default)();
	        return this.middleware;
	      }
	      return null;
	    }
	  }], [{
	    key: 'addSaga',
	    value: function addSaga(saga) {
	      return new SagaRelieverPlugin().addSaga(saga);
	    }
	  }]);
	  return SagaRelieverPlugin;
	}();

	exports.default = SagaRelieverPlugin;

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _toConsumableArray2 = __webpack_require__(105);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _defineProperty2 = __webpack_require__(177);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _extends4 = __webpack_require__(178);

	var _extends5 = _interopRequireDefault(_extends4);

	var _classCallCheck2 = __webpack_require__(46);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(47);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _redux = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"redux\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _reactRedux = __webpack_require__(234);

	var _shallowEqual = __webpack_require__(364);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var RelieverRegistry = function () {
	  function RelieverRegistry() {
	    (0, _classCallCheck3.default)(this, RelieverRegistry);

	    if (!RelieverRegistry.instance) {
	      this.modules = {};
	      this.modulesRootReducerKey = undefined;
	      this.reducerConstructed = false;
	      RelieverRegistry.instance = this;
	      this.plugins = [];
	    }
	    return RelieverRegistry.instance;
	  }

	  (0, _createClass3.default)(RelieverRegistry, [{
	    key: 'setupStore',
	    value: function setupStore(store) {
	      this.plugins.forEach(function (plugin) {
	        return plugin.instance.setupStore(store, plugin.options);
	      });
	    }
	  }, {
	    key: 'use',
	    value: function use(plugin, options) {
	      this.plugins.push({ instance: new plugin(), options: options });
	      return this;
	    }
	  }, {
	    key: 'register',
	    value: function register(reliever, moduleName) {
	      var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	          reducerKey = _ref.reducerKey;

	      if (this.reducerConstructed) console.warn('You are registering a new module but the modules reducer has already been built. This should not happen.');
	      var relievedComponent = new reliever();
	      var reducer = relievedComponent.reducer.bind(relievedComponent);
	      var actions = relievedComponent.getActions();
	      reducerKey = reducerKey || moduleName;
	      this.modules[moduleName] = { reliever: relievedComponent, reducer: reducer, reducerKey: reducerKey, actions: actions, name: moduleName };
	    }
	  }, {
	    key: 'changeModuleReducerKey',
	    value: function changeModuleReducerKey(moduleName, reducerKey) {
	      if (this.reducerConstructed) console.warn("Changing the modules reducer's keys after it has been built has no effect.");
	      this.modules[moduleName].reducerKey = reducerKey;
	    }
	  }, {
	    key: 'buildRootReducer',
	    value: function buildRootReducer() {
	      var rootReducer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var modulesRootReducerKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

	      if (this.reducerConstructed) console.warn('The reducer has already been built. This should not happen.');
	      this.reducerConstructed = true;
	      var moduleReducers = Object.values(this.modules).reduce(function (r, m) {
	        return (0, _extends5.default)({}, r, (0, _defineProperty3.default)({}, m.reducerKey, m.reducer));
	      }, {});
	      if (modulesRootReducerKey !== undefined) {
	        this.modulesRootReducerKey = modulesRootReducerKey;
	        return (0, _redux.combineReducers)((0, _extends5.default)({}, rootReducer, (0, _defineProperty3.default)({}, modulesRootReducerKey, (0, _redux.combineReducers)(moduleReducers))));
	      }
	      return (0, _redux.combineReducers)((0, _extends5.default)({}, moduleReducers, rootReducer));
	    }
	  }, {
	    key: 'connect',
	    value: function connect(_ref2) {
	      var props = _ref2.props,
	          functions = _ref2.functions,
	          _ref2$connectOptions = _ref2.connectOptions,
	          connectOptions = _ref2$connectOptions === undefined ? {} : _ref2$connectOptions;

	      if (!props) props = function props(state, ownProps) {
	        return ownProps;
	      };
	      if (!functions) functions = function functions() {
	        return {};
	      };
	      return (0, _reactRedux.connectAdvanced)(function (dispatch) {
	        var prevResult = {};
	        var prevProps = {};
	        return function (state, ownProps) {
	          var nextProps = props(state, ownProps);
	          if ((0, _shallowEqual.shallowEqualObjects)(prevProps, nextProps)) return prevResult;
	          var nextResult = (0, _extends5.default)({}, nextProps, functions(nextProps, dispatch));
	          prevResult = nextResult;
	          return nextResult;
	        };
	      }, (0, _extends5.default)({
	        getDisplayName: function getDisplayName(name) {
	          return 'RelievedConnect(' + name + ')';
	        },
	        methodName: 'reliever.connect'
	      }, connectOptions));
	    }
	  }, {
	    key: 'moduleState',
	    value: function moduleState(moduleName, state) {
	      if (this.modulesRootReducerKey) return state[this.modulesRootReducerKey][this.modules[moduleName].reducerKey];
	      return state[this.modules[moduleName].reducerKey];
	    }
	  }, {
	    key: 'moduleActions',
	    value: function moduleActions(moduleName) {
	      return this.modules[moduleName].actions;
	    }
	  }, {
	    key: 'middlewares',
	    value: function middlewares() {
	      var _this = this;

	      return this.plugins.map(function (plugin) {
	        return Object.keys(_this.modules).map(function (key) {
	          return _this.modules[key];
	        }).map(function (module) {
	          return plugin.instance.createMiddleware(module.reliever, plugin.options, module);
	        }).filter(function (middleware) {
	          return middleware;
	        });
	      }).reduce(function (p, c) {
	        return [].concat((0, _toConsumableArray3.default)(p), (0, _toConsumableArray3.default)(c));
	      }, []);
	    }
	  }]);
	  return RelieverRegistry;
	}();

	exports.default = new RelieverRegistry();

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.OVERWRITE = exports.DEL = undefined;

	var _slicedToArray2 = __webpack_require__(179);

	var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

	var _typeof2 = __webpack_require__(180);

	var _typeof3 = _interopRequireDefault(_typeof2);

	exports.default = merger;

	var _immutable = __webpack_require__(118);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DEL = exports.DEL = '__DEL__';
	var OVERWRITE = exports.OVERWRITE = '__OVERWRITE__';

	// https://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects/5878101#5878101
	function isPlainObject(obj) {
	  if ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) == 'object' && obj !== null) {
	    if (typeof Object.getPrototypeOf == 'function') {
	      var proto = Object.getPrototypeOf(obj);
	      return proto === Object.prototype || proto === null;
	    }
	    return Object.prototype.toString.call(obj) == '[object Object]';
	  }
	  return false;
	}

	function merger(a, b) {
	  // Overwrite handling OVERWRITE
	  if (b && (isPlainObject(b) && b[OVERWRITE] || (0, _immutable.isImmutable)(b) && b.get(OVERWRITE))) {
	    if ((0, _immutable.isImmutable)(b)) b = b.delete(OVERWRITE);else delete b[OVERWRITE];
	    return b;
	  }

	  // Deletion handling DEL
	  if (a && (_immutable.Map.isMap(a) || isPlainObject(a)) && b && (_immutable.Map.isMap(b) || isPlainObject(b))) {
	    ((0, _immutable.isImmutable)(b) ? b.entrySeq() : Object.entries(b)).forEach(function (_ref) {
	      var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
	          k = _ref2[0],
	          v = _ref2[1];

	      if (v === DEL) {
	        if ((0, _immutable.isImmutable)(b)) b = b.delete(k);else delete b[k];
	        if ((0, _immutable.isImmutable)(a)) a = a.delete(k);else delete a[k];
	      }
	    });
	  }

	  // Regular merge
	  if (a && a.mergeWith && !_immutable.List.isList(a) && b !== null && (_immutable.Map.isMap(b) || isPlainObject(b))) {
	    return a.mergeWith(merger, b);
	  }
	  return b;
	}

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(182), __esModule: true };

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(183), __esModule: true };

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(184), __esModule: true };

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(185), __esModule: true };

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(187), __esModule: true };

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(188), __esModule: true };

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(104);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(174);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _isIterable2 = __webpack_require__(173);

	var _isIterable3 = _interopRequireDefault(_isIterable2);

	var _getIterator2 = __webpack_require__(172);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if ((0, _isIterable3.default)(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	}();

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(176);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(175);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(247);


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(53);
	__webpack_require__(211);
	module.exports = __webpack_require__(13).Array.from;


/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(80);
	__webpack_require__(53);
	module.exports = __webpack_require__(209);


/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(80);
	__webpack_require__(53);
	module.exports = __webpack_require__(210);


/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(213);
	module.exports = __webpack_require__(13).Object.assign;


/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(214);
	var $Object = __webpack_require__(13).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(216);
	__webpack_require__(215);
	__webpack_require__(217);
	__webpack_require__(218);
	module.exports = __webpack_require__(13).Symbol;


/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(53);
	__webpack_require__(80);
	module.exports = __webpack_require__(79).f('iterator');


/***/ },
/* 189 */
/***/ function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ },
/* 190 */
/***/ function(module, exports) {

	module.exports = function () { /* empty */ };


/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(26);
	var toLength = __webpack_require__(116);
	var toAbsoluteIndex = __webpack_require__(208);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(19);
	var createDesc = __webpack_require__(35);

	module.exports = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(49);
	var gOPS = __webpack_require__(72);
	var pIE = __webpack_require__(50);
	module.exports = function (it) {
	  var result = getKeys(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	var document = __webpack_require__(18).document;
	module.exports = document && document.documentElement;


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(25);
	var ITERATOR = __webpack_require__(11)('iterator');
	var ArrayProto = Array.prototype;

	module.exports = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};


/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(69);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(23);
	module.exports = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject(ret.call(iterator));
	    throw e;
	  }
	};


/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(112);
	var descriptor = __webpack_require__(35);
	var setToStringTag = __webpack_require__(73);
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(24)(IteratorPrototype, __webpack_require__(11)('iterator'), function () { return this; });

	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR = __webpack_require__(11)('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }

	module.exports = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};


/***/ },
/* 200 */
/***/ function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	var META = __webpack_require__(52)('meta');
	var isObject = __webpack_require__(34);
	var has = __webpack_require__(22);
	var setDesc = __webpack_require__(19).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(33)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};


/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var DESCRIPTORS = __webpack_require__(17);
	var getKeys = __webpack_require__(49);
	var gOPS = __webpack_require__(72);
	var pIE = __webpack_require__(50);
	var toObject = __webpack_require__(51);
	var IObject = __webpack_require__(110);
	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(33)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;


/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(19);
	var anObject = __webpack_require__(23);
	var getKeys = __webpack_require__(49);

	module.exports = __webpack_require__(17) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(50);
	var createDesc = __webpack_require__(35);
	var toIObject = __webpack_require__(26);
	var toPrimitive = __webpack_require__(77);
	var has = __webpack_require__(22);
	var IE8_DOM_DEFINE = __webpack_require__(109);
	var gOPD = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(17) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(26);
	var gOPN = __webpack_require__(113).f;
	var toString = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(22);
	var toObject = __webpack_require__(51);
	var IE_PROTO = __webpack_require__(74)('IE_PROTO');
	var ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(76);
	var defined = __webpack_require__(70);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(76);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(23);
	var get = __webpack_require__(117);
	module.exports = __webpack_require__(13).getIterator = function (it) {
	  var iterFn = get(it);
	  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};


/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	var classof = __webpack_require__(106);
	var ITERATOR = __webpack_require__(11)('iterator');
	var Iterators = __webpack_require__(25);
	module.exports = __webpack_require__(13).isIterable = function (it) {
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    // eslint-disable-next-line no-prototype-builtins
	    || Iterators.hasOwnProperty(classof(O));
	};


/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx = __webpack_require__(107);
	var $export = __webpack_require__(32);
	var toObject = __webpack_require__(51);
	var call = __webpack_require__(197);
	var isArrayIter = __webpack_require__(195);
	var toLength = __webpack_require__(116);
	var createProperty = __webpack_require__(192);
	var getIterFn = __webpack_require__(117);

	$export($export.S + $export.F * !__webpack_require__(199)(function (iter) { Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = getIterFn(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(190);
	var step = __webpack_require__(200);
	var Iterators = __webpack_require__(25);
	var toIObject = __webpack_require__(26);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(111)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(32);

	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(202) });


/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(32);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(17), 'Object', { defineProperty: __webpack_require__(19).f });


/***/ },
/* 215 */
/***/ function(module, exports) {

	

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(18);
	var has = __webpack_require__(22);
	var DESCRIPTORS = __webpack_require__(17);
	var $export = __webpack_require__(32);
	var redefine = __webpack_require__(115);
	var META = __webpack_require__(201).KEY;
	var $fails = __webpack_require__(33);
	var shared = __webpack_require__(75);
	var setToStringTag = __webpack_require__(73);
	var uid = __webpack_require__(52);
	var wks = __webpack_require__(11);
	var wksExt = __webpack_require__(79);
	var wksDefine = __webpack_require__(78);
	var enumKeys = __webpack_require__(193);
	var isArray = __webpack_require__(196);
	var anObject = __webpack_require__(23);
	var isObject = __webpack_require__(34);
	var toObject = __webpack_require__(51);
	var toIObject = __webpack_require__(26);
	var toPrimitive = __webpack_require__(77);
	var createDesc = __webpack_require__(35);
	var _create = __webpack_require__(112);
	var gOPNExt = __webpack_require__(205);
	var $GOPD = __webpack_require__(204);
	var $GOPS = __webpack_require__(72);
	var $DP = __webpack_require__(19);
	var $keys = __webpack_require__(49);
	var gOPD = $GOPD.f;
	var dP = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global.Symbol;
	var $JSON = global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
	var QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function () { return dP(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(113).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(50).f = $propertyIsEnumerable;
	  $GOPS.f = $getOwnPropertySymbols;

	  if (DESCRIPTORS && !__webpack_require__(48)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

	$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return $GOPS.f(toObject(it));
	  }
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(24)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(78)('asyncIterator');


/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(78)('observable');


/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Copyright 2015, Yahoo! Inc.
	 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
	 */
	var ReactIs = __webpack_require__(54);
	var REACT_STATICS = {
	    childContextTypes: true,
	    contextType: true,
	    contextTypes: true,
	    defaultProps: true,
	    displayName: true,
	    getDefaultProps: true,
	    getDerivedStateFromError: true,
	    getDerivedStateFromProps: true,
	    mixins: true,
	    propTypes: true,
	    type: true
	};

	var KNOWN_STATICS = {
	    name: true,
	    length: true,
	    prototype: true,
	    caller: true,
	    callee: true,
	    arguments: true,
	    arity: true
	};

	var FORWARD_REF_STATICS = {
	    '$$typeof': true,
	    render: true,
	    defaultProps: true,
	    displayName: true,
	    propTypes: true
	};

	var MEMO_STATICS = {
	    '$$typeof': true,
	    compare: true,
	    defaultProps: true,
	    displayName: true,
	    propTypes: true,
	    type: true
	};

	var TYPE_STATICS = {};
	TYPE_STATICS[ReactIs.ForwardRef] = FORWARD_REF_STATICS;

	function getStatics(component) {
	    if (ReactIs.isMemo(component)) {
	        return MEMO_STATICS;
	    }
	    return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
	}

	var defineProperty = Object.defineProperty;
	var getOwnPropertyNames = Object.getOwnPropertyNames;
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var getPrototypeOf = Object.getPrototypeOf;
	var objectPrototype = Object.prototype;

	function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
	    if (typeof sourceComponent !== 'string') {
	        // don't hoist over string (html) components

	        if (objectPrototype) {
	            var inheritedComponent = getPrototypeOf(sourceComponent);
	            if (inheritedComponent && inheritedComponent !== objectPrototype) {
	                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
	            }
	        }

	        var keys = getOwnPropertyNames(sourceComponent);

	        if (getOwnPropertySymbols) {
	            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
	        }

	        var targetStatics = getStatics(targetComponent);
	        var sourceStatics = getStatics(sourceComponent);

	        for (var i = 0; i < keys.length; ++i) {
	            var key = keys[i];
	            if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
	                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
	                try {
	                    // Avoid failures from read-only properties
	                    defineProperty(targetComponent, key, descriptor);
	                } catch (e) {}
	            }
	        }

	        return targetComponent;
	    }

	    return targetComponent;
	}

	module.exports = hoistNonReactStatics;


/***/ },
/* 220 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var printWarning = function() {};

	if (true) {
	  var ReactPropTypesSecret = __webpack_require__(119);
	  var loggedTypeFailures = {};
	  var has = Function.call.bind(Object.prototype.hasOwnProperty);

	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}

	/**
	 * Assert that the values match with the type specs.
	 * Error messages are memorized and will only be shown once.
	 *
	 * @param {object} typeSpecs Map of name to a ReactPropType
	 * @param {object} values Runtime values that need to be type-checked
	 * @param {string} location e.g. "prop", "context", "child context"
	 * @param {string} componentName Name of the component for error messages.
	 * @param {?Function} getStack Returns the component stack.
	 * @private
	 */
	function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
	  if (true) {
	    for (var typeSpecName in typeSpecs) {
	      if (has(typeSpecs, typeSpecName)) {
	        var error;
	        // Prop type validation may throw. In case they do, we don't want to
	        // fail the render phase where it didn't fail before. So we log it.
	        // After these have been cleaned up, we'll let them throw.
	        try {
	          // This is intentionally an invariant that gets caught. It's the same
	          // behavior as without this statement except with a better message.
	          if (typeof typeSpecs[typeSpecName] !== 'function') {
	            var err = Error(
	              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
	              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
	            );
	            err.name = 'Invariant Violation';
	            throw err;
	          }
	          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
	        } catch (ex) {
	          error = ex;
	        }
	        if (error && !(error instanceof Error)) {
	          printWarning(
	            (componentName || 'React class') + ': type specification of ' +
	            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
	            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
	            'You may have forgotten to pass an argument to the type checker ' +
	            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
	            'shape all require an argument).'
	          );
	        }
	        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
	          // Only monitor this failure once because there tends to be a lot of the
	          // same error.
	          loggedTypeFailures[error.message] = true;

	          var stack = getStack ? getStack() : '';

	          printWarning(
	            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
	          );
	        }
	      }
	    }
	  }
	}

	/**
	 * Resets warning cache when testing.
	 *
	 * @private
	 */
	checkPropTypes.resetWarningCache = function() {
	  if (true) {
	    loggedTypeFailures = {};
	  }
	}

	module.exports = checkPropTypes;


/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';

	var ReactIs = __webpack_require__(54);
	var assign = __webpack_require__(220);

	var ReactPropTypesSecret = __webpack_require__(119);
	var checkPropTypes = __webpack_require__(221);

	var has = Function.call.bind(Object.prototype.hasOwnProperty);
	var printWarning = function() {};

	if (true) {
	  printWarning = function(text) {
	    var message = 'Warning: ' + text;
	    if (typeof console !== 'undefined') {
	      console.error(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };
	}

	function emptyFunctionThatReturnsNull() {
	  return null;
	}

	module.exports = function(isValidElement, throwOnDirectAccess) {
	  /* global Symbol */
	  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
	  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

	  /**
	   * Returns the iterator method function contained on the iterable object.
	   *
	   * Be sure to invoke the function with the iterable as context:
	   *
	   *     var iteratorFn = getIteratorFn(myIterable);
	   *     if (iteratorFn) {
	   *       var iterator = iteratorFn.call(myIterable);
	   *       ...
	   *     }
	   *
	   * @param {?object} maybeIterable
	   * @return {?function}
	   */
	  function getIteratorFn(maybeIterable) {
	    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
	    if (typeof iteratorFn === 'function') {
	      return iteratorFn;
	    }
	  }

	  /**
	   * Collection of methods that allow declaration and validation of props that are
	   * supplied to React components. Example usage:
	   *
	   *   var Props = require('ReactPropTypes');
	   *   var MyArticle = React.createClass({
	   *     propTypes: {
	   *       // An optional string prop named "description".
	   *       description: Props.string,
	   *
	   *       // A required enum prop named "category".
	   *       category: Props.oneOf(['News','Photos']).isRequired,
	   *
	   *       // A prop named "dialog" that requires an instance of Dialog.
	   *       dialog: Props.instanceOf(Dialog).isRequired
	   *     },
	   *     render: function() { ... }
	   *   });
	   *
	   * A more formal specification of how these methods are used:
	   *
	   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
	   *   decl := ReactPropTypes.{type}(.isRequired)?
	   *
	   * Each and every declaration produces a function with the same signature. This
	   * allows the creation of custom validation functions. For example:
	   *
	   *  var MyLink = React.createClass({
	   *    propTypes: {
	   *      // An optional string or URI prop named "href".
	   *      href: function(props, propName, componentName) {
	   *        var propValue = props[propName];
	   *        if (propValue != null && typeof propValue !== 'string' &&
	   *            !(propValue instanceof URI)) {
	   *          return new Error(
	   *            'Expected a string or an URI for ' + propName + ' in ' +
	   *            componentName
	   *          );
	   *        }
	   *      }
	   *    },
	   *    render: function() {...}
	   *  });
	   *
	   * @internal
	   */

	  var ANONYMOUS = '<<anonymous>>';

	  // Important!
	  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
	  var ReactPropTypes = {
	    array: createPrimitiveTypeChecker('array'),
	    bool: createPrimitiveTypeChecker('boolean'),
	    func: createPrimitiveTypeChecker('function'),
	    number: createPrimitiveTypeChecker('number'),
	    object: createPrimitiveTypeChecker('object'),
	    string: createPrimitiveTypeChecker('string'),
	    symbol: createPrimitiveTypeChecker('symbol'),

	    any: createAnyTypeChecker(),
	    arrayOf: createArrayOfTypeChecker,
	    element: createElementTypeChecker(),
	    elementType: createElementTypeTypeChecker(),
	    instanceOf: createInstanceTypeChecker,
	    node: createNodeChecker(),
	    objectOf: createObjectOfTypeChecker,
	    oneOf: createEnumTypeChecker,
	    oneOfType: createUnionTypeChecker,
	    shape: createShapeTypeChecker,
	    exact: createStrictShapeTypeChecker,
	  };

	  /**
	   * inlined Object.is polyfill to avoid requiring consumers ship their own
	   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
	   */
	  /*eslint-disable no-self-compare*/
	  function is(x, y) {
	    // SameValue algorithm
	    if (x === y) {
	      // Steps 1-5, 7-10
	      // Steps 6.b-6.e: +0 != -0
	      return x !== 0 || 1 / x === 1 / y;
	    } else {
	      // Step 6.a: NaN == NaN
	      return x !== x && y !== y;
	    }
	  }
	  /*eslint-enable no-self-compare*/

	  /**
	   * We use an Error-like object for backward compatibility as people may call
	   * PropTypes directly and inspect their output. However, we don't use real
	   * Errors anymore. We don't inspect their stack anyway, and creating them
	   * is prohibitively expensive if they are created too often, such as what
	   * happens in oneOfType() for any type before the one that matched.
	   */
	  function PropTypeError(message) {
	    this.message = message;
	    this.stack = '';
	  }
	  // Make `instanceof Error` still work for returned errors.
	  PropTypeError.prototype = Error.prototype;

	  function createChainableTypeChecker(validate) {
	    if (true) {
	      var manualPropTypeCallCache = {};
	      var manualPropTypeWarningCount = 0;
	    }
	    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
	      componentName = componentName || ANONYMOUS;
	      propFullName = propFullName || propName;

	      if (secret !== ReactPropTypesSecret) {
	        if (throwOnDirectAccess) {
	          // New behavior only for users of `prop-types` package
	          var err = new Error(
	            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
	            'Use `PropTypes.checkPropTypes()` to call them. ' +
	            'Read more at http://fb.me/use-check-prop-types'
	          );
	          err.name = 'Invariant Violation';
	          throw err;
	        } else if (("development") !== 'production' && typeof console !== 'undefined') {
	          // Old behavior for people using React.PropTypes
	          var cacheKey = componentName + ':' + propName;
	          if (
	            !manualPropTypeCallCache[cacheKey] &&
	            // Avoid spamming the console because they are often not actionable except for lib authors
	            manualPropTypeWarningCount < 3
	          ) {
	            printWarning(
	              'You are manually calling a React.PropTypes validation ' +
	              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
	              'and will throw in the standalone `prop-types` package. ' +
	              'You may be seeing this warning due to a third-party PropTypes ' +
	              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
	            );
	            manualPropTypeCallCache[cacheKey] = true;
	            manualPropTypeWarningCount++;
	          }
	        }
	      }
	      if (props[propName] == null) {
	        if (isRequired) {
	          if (props[propName] === null) {
	            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
	          }
	          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
	        }
	        return null;
	      } else {
	        return validate(props, propName, componentName, location, propFullName);
	      }
	    }

	    var chainedCheckType = checkType.bind(null, false);
	    chainedCheckType.isRequired = checkType.bind(null, true);

	    return chainedCheckType;
	  }

	  function createPrimitiveTypeChecker(expectedType) {
	    function validate(props, propName, componentName, location, propFullName, secret) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== expectedType) {
	        // `propValue` being instance of, say, date/regexp, pass the 'object'
	        // check, but we can offer a more precise error message here rather than
	        // 'of type `object`'.
	        var preciseType = getPreciseType(propValue);

	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createAnyTypeChecker() {
	    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
	  }

	  function createArrayOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
	      }
	      var propValue = props[propName];
	      if (!Array.isArray(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
	      }
	      for (var i = 0; i < propValue.length; i++) {
	        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
	        if (error instanceof Error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!isValidElement(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createElementTypeTypeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      if (!ReactIs.isValidElementType(propValue)) {
	        var propType = getPropType(propValue);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement type.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createInstanceTypeChecker(expectedClass) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!(props[propName] instanceof expectedClass)) {
	        var expectedClassName = expectedClass.name || ANONYMOUS;
	        var actualClassName = getClassName(props[propName]);
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createEnumTypeChecker(expectedValues) {
	    if (!Array.isArray(expectedValues)) {
	      if (true) {
	        if (arguments.length > 1) {
	          printWarning(
	            'Invalid arguments supplied to oneOf, expected an array, got ' + arguments.length + ' arguments. ' +
	            'A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).'
	          );
	        } else {
	          printWarning('Invalid argument supplied to oneOf, expected an array.');
	        }
	      }
	      return emptyFunctionThatReturnsNull;
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      for (var i = 0; i < expectedValues.length; i++) {
	        if (is(propValue, expectedValues[i])) {
	          return null;
	        }
	      }

	      var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
	        var type = getPreciseType(value);
	        if (type === 'symbol') {
	          return String(value);
	        }
	        return value;
	      });
	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + String(propValue) + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createObjectOfTypeChecker(typeChecker) {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (typeof typeChecker !== 'function') {
	        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
	      }
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
	      }
	      for (var key in propValue) {
	        if (has(propValue, key)) {
	          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	          if (error instanceof Error) {
	            return error;
	          }
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createUnionTypeChecker(arrayOfTypeCheckers) {
	    if (!Array.isArray(arrayOfTypeCheckers)) {
	       true ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
	      return emptyFunctionThatReturnsNull;
	    }

	    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	      var checker = arrayOfTypeCheckers[i];
	      if (typeof checker !== 'function') {
	        printWarning(
	          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
	          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
	        );
	        return emptyFunctionThatReturnsNull;
	      }
	    }

	    function validate(props, propName, componentName, location, propFullName) {
	      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
	        var checker = arrayOfTypeCheckers[i];
	        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
	          return null;
	        }
	      }

	      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createNodeChecker() {
	    function validate(props, propName, componentName, location, propFullName) {
	      if (!isNode(props[propName])) {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      for (var key in shapeTypes) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          continue;
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }
	    return createChainableTypeChecker(validate);
	  }

	  function createStrictShapeTypeChecker(shapeTypes) {
	    function validate(props, propName, componentName, location, propFullName) {
	      var propValue = props[propName];
	      var propType = getPropType(propValue);
	      if (propType !== 'object') {
	        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
	      }
	      // We need to check all keys in case some are required but missing from
	      // props.
	      var allKeys = assign({}, props[propName], shapeTypes);
	      for (var key in allKeys) {
	        var checker = shapeTypes[key];
	        if (!checker) {
	          return new PropTypeError(
	            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
	            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
	            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
	          );
	        }
	        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
	        if (error) {
	          return error;
	        }
	      }
	      return null;
	    }

	    return createChainableTypeChecker(validate);
	  }

	  function isNode(propValue) {
	    switch (typeof propValue) {
	      case 'number':
	      case 'string':
	      case 'undefined':
	        return true;
	      case 'boolean':
	        return !propValue;
	      case 'object':
	        if (Array.isArray(propValue)) {
	          return propValue.every(isNode);
	        }
	        if (propValue === null || isValidElement(propValue)) {
	          return true;
	        }

	        var iteratorFn = getIteratorFn(propValue);
	        if (iteratorFn) {
	          var iterator = iteratorFn.call(propValue);
	          var step;
	          if (iteratorFn !== propValue.entries) {
	            while (!(step = iterator.next()).done) {
	              if (!isNode(step.value)) {
	                return false;
	              }
	            }
	          } else {
	            // Iterator will provide entry [k,v] tuples rather than values.
	            while (!(step = iterator.next()).done) {
	              var entry = step.value;
	              if (entry) {
	                if (!isNode(entry[1])) {
	                  return false;
	                }
	              }
	            }
	          }
	        } else {
	          return false;
	        }

	        return true;
	      default:
	        return false;
	    }
	  }

	  function isSymbol(propType, propValue) {
	    // Native Symbol.
	    if (propType === 'symbol') {
	      return true;
	    }

	    // falsy value can't be a Symbol
	    if (!propValue) {
	      return false;
	    }

	    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
	    if (propValue['@@toStringTag'] === 'Symbol') {
	      return true;
	    }

	    // Fallback for non-spec compliant Symbols which are polyfilled.
	    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
	      return true;
	    }

	    return false;
	  }

	  // Equivalent of `typeof` but with special handling for array and regexp.
	  function getPropType(propValue) {
	    var propType = typeof propValue;
	    if (Array.isArray(propValue)) {
	      return 'array';
	    }
	    if (propValue instanceof RegExp) {
	      // Old webkits (at least until Android 4.0) return 'function' rather than
	      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
	      // passes PropTypes.object.
	      return 'object';
	    }
	    if (isSymbol(propType, propValue)) {
	      return 'symbol';
	    }
	    return propType;
	  }

	  // This handles more types than `getPropType`. Only used for error messages.
	  // See `createPrimitiveTypeChecker`.
	  function getPreciseType(propValue) {
	    if (typeof propValue === 'undefined' || propValue === null) {
	      return '' + propValue;
	    }
	    var propType = getPropType(propValue);
	    if (propType === 'object') {
	      if (propValue instanceof Date) {
	        return 'date';
	      } else if (propValue instanceof RegExp) {
	        return 'regexp';
	      }
	    }
	    return propType;
	  }

	  // Returns a string that is postfixed to a warning about an invalid type.
	  // For example, "undefined" or "of type array"
	  function getPostfixForTypeWarning(value) {
	    var type = getPreciseType(value);
	    switch (type) {
	      case 'array':
	      case 'object':
	        return 'an ' + type;
	      case 'boolean':
	      case 'date':
	      case 'regexp':
	        return 'a ' + type;
	      default:
	        return type;
	    }
	  }

	  // Returns class name of the object, if any.
	  function getClassName(propValue) {
	    if (!propValue.constructor || !propValue.constructor.name) {
	      return ANONYMOUS;
	    }
	    return propValue.constructor.name;
	  }

	  ReactPropTypes.checkPropTypes = checkPropTypes;
	  ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
	  ReactPropTypes.PropTypes = ReactPropTypes;

	  return ReactPropTypes;
	};


/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2013-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	if (true) {
	  var ReactIs = __webpack_require__(54);

	  // By explicitly using `prop-types` you are opting into new development behavior.
	  // http://fb.me/prop-types-in-prod
	  var throwOnDirectAccess = true;
	  module.exports = __webpack_require__(222)(ReactIs.isElement, throwOnDirectAccess);
	} else {
	  // By explicitly using `prop-types` you are opting into new production behavior.
	  // http://fb.me/prop-types-in-prod
	  module.exports = require('./factoryWithThrowingShims')();
	}


/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	/** @license React v16.8.6
	 * react-is.development.js
	 *
	 * Copyright (c) Facebook, Inc. and its affiliates.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	'use strict';



	if (true) {
	  (function() {
	'use strict';

	Object.defineProperty(exports, '__esModule', { value: true });

	// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
	// nor polyfill, then a plain number is used for performance.
	var hasSymbol = typeof Symbol === 'function' && Symbol.for;

	var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
	var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
	var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
	var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
	var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
	var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
	var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
	var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for('react.async_mode') : 0xeacf;
	var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
	var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
	var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
	var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
	var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

	function isValidElementType(type) {
	  return typeof type === 'string' || typeof type === 'function' ||
	  // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
	  type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
	}

	/**
	 * Forked from fbjs/warning:
	 * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
	 *
	 * Only change is we use console.warn instead of console.error,
	 * and do nothing when 'console' is not supported.
	 * This really simplifies the code.
	 * ---
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var lowPriorityWarning = function () {};

	{
	  var printWarning = function (format) {
	    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      args[_key - 1] = arguments[_key];
	    }

	    var argIndex = 0;
	    var message = 'Warning: ' + format.replace(/%s/g, function () {
	      return args[argIndex++];
	    });
	    if (typeof console !== 'undefined') {
	      console.warn(message);
	    }
	    try {
	      // --- Welcome to debugging React ---
	      // This error was thrown as a convenience so that you can use this stack
	      // to find the callsite that caused this warning to fire.
	      throw new Error(message);
	    } catch (x) {}
	  };

	  lowPriorityWarning = function (condition, format) {
	    if (format === undefined) {
	      throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
	    }
	    if (!condition) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	        args[_key2 - 2] = arguments[_key2];
	      }

	      printWarning.apply(undefined, [format].concat(args));
	    }
	  };
	}

	var lowPriorityWarning$1 = lowPriorityWarning;

	function typeOf(object) {
	  if (typeof object === 'object' && object !== null) {
	    var $$typeof = object.$$typeof;
	    switch ($$typeof) {
	      case REACT_ELEMENT_TYPE:
	        var type = object.type;

	        switch (type) {
	          case REACT_ASYNC_MODE_TYPE:
	          case REACT_CONCURRENT_MODE_TYPE:
	          case REACT_FRAGMENT_TYPE:
	          case REACT_PROFILER_TYPE:
	          case REACT_STRICT_MODE_TYPE:
	          case REACT_SUSPENSE_TYPE:
	            return type;
	          default:
	            var $$typeofType = type && type.$$typeof;

	            switch ($$typeofType) {
	              case REACT_CONTEXT_TYPE:
	              case REACT_FORWARD_REF_TYPE:
	              case REACT_PROVIDER_TYPE:
	                return $$typeofType;
	              default:
	                return $$typeof;
	            }
	        }
	      case REACT_LAZY_TYPE:
	      case REACT_MEMO_TYPE:
	      case REACT_PORTAL_TYPE:
	        return $$typeof;
	    }
	  }

	  return undefined;
	}

	// AsyncMode is deprecated along with isAsyncMode
	var AsyncMode = REACT_ASYNC_MODE_TYPE;
	var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
	var ContextConsumer = REACT_CONTEXT_TYPE;
	var ContextProvider = REACT_PROVIDER_TYPE;
	var Element = REACT_ELEMENT_TYPE;
	var ForwardRef = REACT_FORWARD_REF_TYPE;
	var Fragment = REACT_FRAGMENT_TYPE;
	var Lazy = REACT_LAZY_TYPE;
	var Memo = REACT_MEMO_TYPE;
	var Portal = REACT_PORTAL_TYPE;
	var Profiler = REACT_PROFILER_TYPE;
	var StrictMode = REACT_STRICT_MODE_TYPE;
	var Suspense = REACT_SUSPENSE_TYPE;

	var hasWarnedAboutDeprecatedIsAsyncMode = false;

	// AsyncMode should be deprecated
	function isAsyncMode(object) {
	  {
	    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
	      hasWarnedAboutDeprecatedIsAsyncMode = true;
	      lowPriorityWarning$1(false, 'The ReactIs.isAsyncMode() alias has been deprecated, ' + 'and will be removed in React 17+. Update your code to use ' + 'ReactIs.isConcurrentMode() instead. It has the exact same API.');
	    }
	  }
	  return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
	}
	function isConcurrentMode(object) {
	  return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
	}
	function isContextConsumer(object) {
	  return typeOf(object) === REACT_CONTEXT_TYPE;
	}
	function isContextProvider(object) {
	  return typeOf(object) === REACT_PROVIDER_TYPE;
	}
	function isElement(object) {
	  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function isForwardRef(object) {
	  return typeOf(object) === REACT_FORWARD_REF_TYPE;
	}
	function isFragment(object) {
	  return typeOf(object) === REACT_FRAGMENT_TYPE;
	}
	function isLazy(object) {
	  return typeOf(object) === REACT_LAZY_TYPE;
	}
	function isMemo(object) {
	  return typeOf(object) === REACT_MEMO_TYPE;
	}
	function isPortal(object) {
	  return typeOf(object) === REACT_PORTAL_TYPE;
	}
	function isProfiler(object) {
	  return typeOf(object) === REACT_PROFILER_TYPE;
	}
	function isStrictMode(object) {
	  return typeOf(object) === REACT_STRICT_MODE_TYPE;
	}
	function isSuspense(object) {
	  return typeOf(object) === REACT_SUSPENSE_TYPE;
	}

	exports.typeOf = typeOf;
	exports.AsyncMode = AsyncMode;
	exports.ConcurrentMode = ConcurrentMode;
	exports.ContextConsumer = ContextConsumer;
	exports.ContextProvider = ContextProvider;
	exports.Element = Element;
	exports.ForwardRef = ForwardRef;
	exports.Fragment = Fragment;
	exports.Lazy = Lazy;
	exports.Memo = Memo;
	exports.Portal = Portal;
	exports.Profiler = Profiler;
	exports.StrictMode = StrictMode;
	exports.Suspense = Suspense;
	exports.isValidElementType = isValidElementType;
	exports.isAsyncMode = isAsyncMode;
	exports.isConcurrentMode = isConcurrentMode;
	exports.isContextConsumer = isContextConsumer;
	exports.isContextProvider = isContextProvider;
	exports.isElement = isElement;
	exports.isForwardRef = isForwardRef;
	exports.isFragment = isFragment;
	exports.isLazy = isLazy;
	exports.isMemo = isMemo;
	exports.isPortal = isPortal;
	exports.isProfiler = isProfiler;
	exports.isStrictMode = isStrictMode;
	exports.isSuspense = isSuspense;
	  })();
	}


/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireWildcard = __webpack_require__(103);

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports["default"] = void 0;

	var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(165));

	var _inheritsLoose2 = _interopRequireDefault(__webpack_require__(166));

	var _react = _interopRequireWildcard(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));

	var _propTypes = _interopRequireDefault(__webpack_require__(223));

	var _Context = __webpack_require__(55);

	var _Subscription = _interopRequireDefault(__webpack_require__(82));

	var Provider =
	/*#__PURE__*/
	function (_Component) {
	  (0, _inheritsLoose2["default"])(Provider, _Component);

	  function Provider(props) {
	    var _this;

	    _this = _Component.call(this, props) || this;
	    var store = props.store;
	    _this.notifySubscribers = _this.notifySubscribers.bind((0, _assertThisInitialized2["default"])(_this));
	    var subscription = new _Subscription["default"](store);
	    subscription.onStateChange = _this.notifySubscribers;
	    _this.state = {
	      store: store,
	      subscription: subscription
	    };
	    _this.previousState = store.getState();
	    return _this;
	  }

	  var _proto = Provider.prototype;

	  _proto.componentDidMount = function componentDidMount() {
	    this._isMounted = true;
	    this.state.subscription.trySubscribe();

	    if (this.previousState !== this.props.store.getState()) {
	      this.state.subscription.notifyNestedSubs();
	    }
	  };

	  _proto.componentWillUnmount = function componentWillUnmount() {
	    if (this.unsubscribe) this.unsubscribe();
	    this.state.subscription.tryUnsubscribe();
	    this._isMounted = false;
	  };

	  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
	    if (this.props.store !== prevProps.store) {
	      this.state.subscription.tryUnsubscribe();
	      var subscription = new _Subscription["default"](this.props.store);
	      subscription.onStateChange = this.notifySubscribers;
	      this.setState({
	        store: this.props.store,
	        subscription: subscription
	      });
	    }
	  };

	  _proto.notifySubscribers = function notifySubscribers() {
	    this.state.subscription.notifyNestedSubs();
	  };

	  _proto.render = function render() {
	    var Context = this.props.context || _Context.ReactReduxContext;
	    return _react["default"].createElement(Context.Provider, {
	      value: this.state
	    }, this.props.children);
	  };

	  return Provider;
	}(_react.Component);

	Provider.propTypes = {
	  store: _propTypes["default"].shape({
	    subscribe: _propTypes["default"].func.isRequired,
	    dispatch: _propTypes["default"].func.isRequired,
	    getState: _propTypes["default"].func.isRequired
	  }),
	  context: _propTypes["default"].object,
	  children: _propTypes["default"].any
	};
	var _default = Provider;
	exports["default"] = _default;

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports.createConnect = createConnect;
	exports["default"] = void 0;

	var _extends2 = _interopRequireDefault(__webpack_require__(67));

	var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(68));

	var _connectAdvanced = _interopRequireDefault(__webpack_require__(120));

	var _shallowEqual = _interopRequireDefault(__webpack_require__(125));

	var _mapDispatchToProps = _interopRequireDefault(__webpack_require__(227));

	var _mapStateToProps = _interopRequireDefault(__webpack_require__(228));

	var _mergeProps = _interopRequireDefault(__webpack_require__(229));

	var _selectorFactory = _interopRequireDefault(__webpack_require__(230));

	/*
	  connect is a facade over connectAdvanced. It turns its args into a compatible
	  selectorFactory, which has the signature:

	    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
	  
	  connect passes its args to connectAdvanced as options, which will in turn pass them to
	  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

	  selectorFactory returns a final props selector from its mapStateToProps,
	  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
	  mergePropsFactories, and pure args.

	  The resulting final props selector is called by the Connect component instance whenever
	  it receives new props or store state.
	 */
	function match(arg, factories, name) {
	  for (var i = factories.length - 1; i >= 0; i--) {
	    var result = factories[i](arg);
	    if (result) return result;
	  }

	  return function (dispatch, options) {
	    throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
	  };
	}

	function strictEqual(a, b) {
	  return a === b;
	} // createConnect with default args builds the 'official' connect behavior. Calling it with
	// different options opens up some testing and extensibility scenarios


	function createConnect(_temp) {
	  var _ref = _temp === void 0 ? {} : _temp,
	      _ref$connectHOC = _ref.connectHOC,
	      connectHOC = _ref$connectHOC === void 0 ? _connectAdvanced["default"] : _ref$connectHOC,
	      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
	      mapStateToPropsFactories = _ref$mapStateToPropsF === void 0 ? _mapStateToProps["default"] : _ref$mapStateToPropsF,
	      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
	      mapDispatchToPropsFactories = _ref$mapDispatchToPro === void 0 ? _mapDispatchToProps["default"] : _ref$mapDispatchToPro,
	      _ref$mergePropsFactor = _ref.mergePropsFactories,
	      mergePropsFactories = _ref$mergePropsFactor === void 0 ? _mergeProps["default"] : _ref$mergePropsFactor,
	      _ref$selectorFactory = _ref.selectorFactory,
	      selectorFactory = _ref$selectorFactory === void 0 ? _selectorFactory["default"] : _ref$selectorFactory;

	  return function connect(mapStateToProps, mapDispatchToProps, mergeProps, _ref2) {
	    if (_ref2 === void 0) {
	      _ref2 = {};
	    }

	    var _ref3 = _ref2,
	        _ref3$pure = _ref3.pure,
	        pure = _ref3$pure === void 0 ? true : _ref3$pure,
	        _ref3$areStatesEqual = _ref3.areStatesEqual,
	        areStatesEqual = _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual,
	        _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual,
	        areOwnPropsEqual = _ref3$areOwnPropsEqua === void 0 ? _shallowEqual["default"] : _ref3$areOwnPropsEqua,
	        _ref3$areStatePropsEq = _ref3.areStatePropsEqual,
	        areStatePropsEqual = _ref3$areStatePropsEq === void 0 ? _shallowEqual["default"] : _ref3$areStatePropsEq,
	        _ref3$areMergedPropsE = _ref3.areMergedPropsEqual,
	        areMergedPropsEqual = _ref3$areMergedPropsE === void 0 ? _shallowEqual["default"] : _ref3$areMergedPropsE,
	        extraOptions = (0, _objectWithoutPropertiesLoose2["default"])(_ref3, ["pure", "areStatesEqual", "areOwnPropsEqual", "areStatePropsEqual", "areMergedPropsEqual"]);
	    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
	    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
	    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
	    return connectHOC(selectorFactory, (0, _extends2["default"])({
	      // used in error messages
	      methodName: 'connect',
	      // used to compute Connect's displayName from the wrapped component's displayName.
	      getDisplayName: function getDisplayName(name) {
	        return "Connect(" + name + ")";
	      },
	      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
	      shouldHandleStateChanges: Boolean(mapStateToProps),
	      // passed through to selectorFactory
	      initMapStateToProps: initMapStateToProps,
	      initMapDispatchToProps: initMapDispatchToProps,
	      initMergeProps: initMergeProps,
	      pure: pure,
	      areStatesEqual: areStatesEqual,
	      areOwnPropsEqual: areOwnPropsEqual,
	      areStatePropsEqual: areStatePropsEqual,
	      areMergedPropsEqual: areMergedPropsEqual
	    }, extraOptions));
	  };
	}

	var _default = createConnect();

	exports["default"] = _default;

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.whenMapDispatchToPropsIsFunction = whenMapDispatchToPropsIsFunction;
	exports.whenMapDispatchToPropsIsMissing = whenMapDispatchToPropsIsMissing;
	exports.whenMapDispatchToPropsIsObject = whenMapDispatchToPropsIsObject;
	exports["default"] = void 0;

	var _redux = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"redux\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _wrapMapToProps = __webpack_require__(121);

	function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
	  return typeof mapDispatchToProps === 'function' ? (0, _wrapMapToProps.wrapMapToPropsFunc)(mapDispatchToProps, 'mapDispatchToProps') : undefined;
	}

	function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
	  return !mapDispatchToProps ? (0, _wrapMapToProps.wrapMapToPropsConstant)(function (dispatch) {
	    return {
	      dispatch: dispatch
	    };
	  }) : undefined;
	}

	function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
	  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? (0, _wrapMapToProps.wrapMapToPropsConstant)(function (dispatch) {
	    return (0, _redux.bindActionCreators)(mapDispatchToProps, dispatch);
	  }) : undefined;
	}

	var _default = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];
	exports["default"] = _default;

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.whenMapStateToPropsIsFunction = whenMapStateToPropsIsFunction;
	exports.whenMapStateToPropsIsMissing = whenMapStateToPropsIsMissing;
	exports["default"] = void 0;

	var _wrapMapToProps = __webpack_require__(121);

	function whenMapStateToPropsIsFunction(mapStateToProps) {
	  return typeof mapStateToProps === 'function' ? (0, _wrapMapToProps.wrapMapToPropsFunc)(mapStateToProps, 'mapStateToProps') : undefined;
	}

	function whenMapStateToPropsIsMissing(mapStateToProps) {
	  return !mapStateToProps ? (0, _wrapMapToProps.wrapMapToPropsConstant)(function () {
	    return {};
	  }) : undefined;
	}

	var _default = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];
	exports["default"] = _default;

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports.defaultMergeProps = defaultMergeProps;
	exports.wrapMergePropsFunc = wrapMergePropsFunc;
	exports.whenMergePropsIsFunction = whenMergePropsIsFunction;
	exports.whenMergePropsIsOmitted = whenMergePropsIsOmitted;
	exports["default"] = void 0;

	var _extends2 = _interopRequireDefault(__webpack_require__(67));

	var _verifyPlainObject = _interopRequireDefault(__webpack_require__(126));

	function defaultMergeProps(stateProps, dispatchProps, ownProps) {
	  return (0, _extends2["default"])({}, ownProps, stateProps, dispatchProps);
	}

	function wrapMergePropsFunc(mergeProps) {
	  return function initMergePropsProxy(dispatch, _ref) {
	    var displayName = _ref.displayName,
	        pure = _ref.pure,
	        areMergedPropsEqual = _ref.areMergedPropsEqual;
	    var hasRunOnce = false;
	    var mergedProps;
	    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
	      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

	      if (hasRunOnce) {
	        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
	      } else {
	        hasRunOnce = true;
	        mergedProps = nextMergedProps;
	        if (true) (0, _verifyPlainObject["default"])(mergedProps, displayName, 'mergeProps');
	      }

	      return mergedProps;
	    };
	  };
	}

	function whenMergePropsIsFunction(mergeProps) {
	  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
	}

	function whenMergePropsIsOmitted(mergeProps) {
	  return !mergeProps ? function () {
	    return defaultMergeProps;
	  } : undefined;
	}

	var _default = [whenMergePropsIsFunction, whenMergePropsIsOmitted];
	exports["default"] = _default;

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports.impureFinalPropsSelectorFactory = impureFinalPropsSelectorFactory;
	exports.pureFinalPropsSelectorFactory = pureFinalPropsSelectorFactory;
	exports["default"] = finalPropsSelectorFactory;

	var _objectWithoutPropertiesLoose2 = _interopRequireDefault(__webpack_require__(68));

	var _verifySubselectors = _interopRequireDefault(__webpack_require__(231));

	function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
	  return function impureFinalPropsSelector(state, ownProps) {
	    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
	  };
	}

	function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
	  var areStatesEqual = _ref.areStatesEqual,
	      areOwnPropsEqual = _ref.areOwnPropsEqual,
	      areStatePropsEqual = _ref.areStatePropsEqual;
	  var hasRunAtLeastOnce = false;
	  var state;
	  var ownProps;
	  var stateProps;
	  var dispatchProps;
	  var mergedProps;

	  function handleFirstCall(firstState, firstOwnProps) {
	    state = firstState;
	    ownProps = firstOwnProps;
	    stateProps = mapStateToProps(state, ownProps);
	    dispatchProps = mapDispatchToProps(dispatch, ownProps);
	    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
	    hasRunAtLeastOnce = true;
	    return mergedProps;
	  }

	  function handleNewPropsAndNewState() {
	    stateProps = mapStateToProps(state, ownProps);
	    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
	    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
	    return mergedProps;
	  }

	  function handleNewProps() {
	    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);
	    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);
	    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
	    return mergedProps;
	  }

	  function handleNewState() {
	    var nextStateProps = mapStateToProps(state, ownProps);
	    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
	    stateProps = nextStateProps;
	    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
	    return mergedProps;
	  }

	  function handleSubsequentCalls(nextState, nextOwnProps) {
	    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
	    var stateChanged = !areStatesEqual(nextState, state);
	    state = nextState;
	    ownProps = nextOwnProps;
	    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
	    if (propsChanged) return handleNewProps();
	    if (stateChanged) return handleNewState();
	    return mergedProps;
	  }

	  return function pureFinalPropsSelector(nextState, nextOwnProps) {
	    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
	  };
	} // TODO: Add more comments
	// If pure is true, the selector returned by selectorFactory will memoize its results,
	// allowing connectAdvanced's shouldComponentUpdate to return false if final
	// props have not changed. If false, the selector will always return a new
	// object and shouldComponentUpdate will always return true.


	function finalPropsSelectorFactory(dispatch, _ref2) {
	  var initMapStateToProps = _ref2.initMapStateToProps,
	      initMapDispatchToProps = _ref2.initMapDispatchToProps,
	      initMergeProps = _ref2.initMergeProps,
	      options = (0, _objectWithoutPropertiesLoose2["default"])(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);
	  var mapStateToProps = initMapStateToProps(dispatch, options);
	  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
	  var mergeProps = initMergeProps(dispatch, options);

	  if (true) {
	    (0, _verifySubselectors["default"])(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
	  }

	  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
	  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
	}

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports["default"] = verifySubselectors;

	var _warning = _interopRequireDefault(__webpack_require__(127));

	function verify(selector, methodName, displayName) {
	  if (!selector) {
	    throw new Error("Unexpected value for " + methodName + " in " + displayName + ".");
	  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
	    if (!selector.hasOwnProperty('dependsOnOwnProps')) {
	      (0, _warning["default"])("The selector for " + methodName + " of " + displayName + " did not specify a value for dependsOnOwnProps.");
	    }
	  }
	}

	function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
	  verify(mapStateToProps, 'mapStateToProps', displayName);
	  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
	  verify(mergeProps, 'mergeProps', displayName);
	}

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.useDispatch = useDispatch;

	var _useStore = __webpack_require__(123);

	/**
	 * A hook to access the redux `dispatch` function. Note that in most cases where you
	 * might want to use this hook it is recommended to use `useActions` instead to bind
	 * action creators to the `dispatch` function.
	 *
	 * @returns {any|function} redux store's `dispatch` function
	 *
	 * @example
	 *
	 * import React, { useCallback } from 'react'
	 * import { useReduxDispatch } from 'react-redux'
	 *
	 * export const CounterComponent = ({ value }) => {
	 *   const dispatch = useDispatch()
	 *   const increaseCounter = useCallback(() => dispatch({ type: 'increase-counter' }), [])
	 *   return (
	 *     <div>
	 *       <span>{value}</span>
	 *       <button onClick={increaseCounter}>Increase counter</button>
	 *     </div>
	 *   )
	 * }
	 */
	function useDispatch() {
	  var store = (0, _useStore.useStore)();
	  return store.dispatch;
	}

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;
	exports.useSelector = useSelector;

	var _react = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var _invariant = _interopRequireDefault(__webpack_require__(81));

	var _useReduxContext2 = __webpack_require__(122);

	var _Subscription = _interopRequireDefault(__webpack_require__(82));

	// React currently throws a warning when using useLayoutEffect on the server.
	// To get around it, we can conditionally useEffect on the server (no-op) and
	// useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
	// subscription callback always has the selector from the latest render commit
	// available, otherwise a store update may happen between render and the effect,
	// which may cause missed updates; we also must ensure the store subscription
	// is created synchronously, otherwise a store update may occur before the
	// subscription is created and an inconsistent state may be observed
	var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? _react.useLayoutEffect : _react.useEffect;

	var refEquality = function refEquality(a, b) {
	  return a === b;
	};
	/**
	 * A hook to access the redux store's state. This hook takes a selector function
	 * as an argument. The selector is called with the store state.
	 *
	 * This hook takes an optional equality comparison function as the second parameter
	 * that allows you to customize the way the selected state is compared to determine
	 * whether the component needs to be re-rendered.
	 *
	 * @param {Function} selector the selector function
	 * @param {Function=} equalityFn the function that will be used to determine equality
	 *
	 * @returns {any} the selected state
	 *
	 * @example
	 *
	 * import React from 'react'
	 * import { useSelector } from 'react-redux'
	 *
	 * export const CounterComponent = () => {
	 *   const counter = useSelector(state => state.counter)
	 *   return <div>{counter}</div>
	 * }
	 */


	function useSelector(selector, equalityFn) {
	  if (equalityFn === void 0) {
	    equalityFn = refEquality;
	  }

	  (0, _invariant["default"])(selector, "You must pass a selector to useSelectors");

	  var _useReduxContext = (0, _useReduxContext2.useReduxContext)(),
	      store = _useReduxContext.store,
	      contextSub = _useReduxContext.subscription;

	  var _useReducer = (0, _react.useReducer)(function (s) {
	    return s + 1;
	  }, 0),
	      forceRender = _useReducer[1];

	  var subscription = (0, _react.useMemo)(function () {
	    return new _Subscription["default"](store, contextSub);
	  }, [store, contextSub]);
	  var latestSubscriptionCallbackError = (0, _react.useRef)();
	  var latestSelector = (0, _react.useRef)();
	  var latestSelectedState = (0, _react.useRef)();
	  var selectedState;

	  try {
	    if (selector !== latestSelector.current || latestSubscriptionCallbackError.current) {
	      selectedState = selector(store.getState());
	    } else {
	      selectedState = latestSelectedState.current;
	    }
	  } catch (err) {
	    var errorMessage = "An error occured while selecting the store state: " + err.message + ".";

	    if (latestSubscriptionCallbackError.current) {
	      errorMessage += "\nThe error may be correlated with this previous error:\n" + latestSubscriptionCallbackError.current.stack + "\n\nOriginal stack trace:";
	    }

	    throw new Error(errorMessage);
	  }

	  useIsomorphicLayoutEffect(function () {
	    latestSelector.current = selector;
	    latestSelectedState.current = selectedState;
	    latestSubscriptionCallbackError.current = undefined;
	  });
	  useIsomorphicLayoutEffect(function () {
	    function checkForUpdates() {
	      try {
	        var newSelectedState = latestSelector.current(store.getState());

	        if (equalityFn(newSelectedState, latestSelectedState.current)) {
	          return;
	        }

	        latestSelectedState.current = newSelectedState;
	      } catch (err) {
	        // we ignore all errors here, since when the component
	        // is re-rendered, the selectors are called again, and
	        // will throw again, if neither props nor store state
	        // changed
	        latestSubscriptionCallbackError.current = err;
	      }

	      forceRender({});
	    }

	    subscription.onStateChange = checkForUpdates;
	    subscription.trySubscribe();
	    checkForUpdates();
	    return function () {
	      return subscription.tryUnsubscribe();
	    };
	  }, [store, subscription]);
	  return selectedState;
	}

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequireDefault = __webpack_require__(9);

	exports.__esModule = true;

	var _Provider = _interopRequireDefault(__webpack_require__(225));

	exports.Provider = _Provider["default"];

	var _connectAdvanced = _interopRequireDefault(__webpack_require__(120));

	exports.connectAdvanced = _connectAdvanced["default"];

	var _Context = __webpack_require__(55);

	exports.ReactReduxContext = _Context.ReactReduxContext;

	var _connect = _interopRequireDefault(__webpack_require__(226));

	exports.connect = _connect["default"];

	var _useDispatch = __webpack_require__(232);

	exports.useDispatch = _useDispatch.useDispatch;

	var _useSelector = __webpack_require__(233);

	exports.useSelector = _useSelector.useSelector;

	var _useStore = __webpack_require__(123);

	exports.useStore = _useStore.useStore;

	var _batch = __webpack_require__(124);

	var _reactBatchedUpdates = __webpack_require__(236);

	exports.batch = _reactBatchedUpdates.unstable_batchedUpdates;

	var _shallowEqual = _interopRequireDefault(__webpack_require__(125));

	exports.shallowEqual = _shallowEqual["default"];
	(0, _batch.setBatch)(_reactBatchedUpdates.unstable_batchedUpdates);

/***/ },
/* 235 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = isPlainObject;

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	function isPlainObject(obj) {
	  if (typeof obj !== 'object' || obj === null) return false;
	  var proto = Object.getPrototypeOf(obj);
	  if (proto === null) return true;
	  var baseProto = proto;

	  while (Object.getPrototypeOf(baseProto) !== null) {
	    baseProto = Object.getPrototypeOf(baseProto);
	  }

	  return proto === baseProto;
	}

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;
	exports.unstable_batchedUpdates = void 0;

	var _reactDom = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react-dom\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	exports.unstable_batchedUpdates = _reactDom.unstable_batchedUpdates;

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.combineEpics = undefined;

	var _rxjs = __webpack_require__(36);

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	  Merges all epics into a single one.
	 */
	var combineEpics = exports.combineEpics = function combineEpics() {
	  for (var _len = arguments.length, epics = Array(_len), _key = 0; _key < _len; _key++) {
	    epics[_key] = arguments[_key];
	  }

	  var merger = function merger() {
	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    return _rxjs.merge.apply(undefined, _toConsumableArray(epics.map(function (epic) {
	      var output$ = epic.apply(undefined, args);
	      if (!output$) {
	        throw new TypeError('combineEpics: one of the provided Epics "' + (epic.name || '<anonymous>') + '" does not return a stream. Double check you\'re not missing a return statement!');
	      }
	      return output$;
	    })));
	  };

	  // Technically the `name` property on Function's are supposed to be read-only.
	  // While some JS runtimes allow it anyway (so this is useful in debugging)
	  // some actually throw an exception when you attempt to do so.
	  try {
	    Object.defineProperty(merger, 'name', {
	      value: 'combineEpics(' + epics.map(function (epic) {
	        return epic.name || '<anonymous>';
	      }).join(', ') + ')'
	    });
	  } catch (e) {}

	  return merger;
	};

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createEpicMiddleware = createEpicMiddleware;

	var _rxjs = __webpack_require__(36);

	var _operators = __webpack_require__(102);

	var _ActionsObservable = __webpack_require__(128);

	var _StateObservable = __webpack_require__(129);

	function createEpicMiddleware() {
	  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  // This isn't great. RxJS doesn't publicly export the constructor for
	  // QueueScheduler nor QueueAction, so we reach in. We need to do this because
	  // we don't want our internal queuing mechanism to be on the same queue as any
	  // other RxJS code outside of redux-observable internals.
	  var QueueScheduler = _rxjs.queueScheduler.constructor;
	  var uniqueQueueScheduler = new QueueScheduler(_rxjs.queueScheduler.SchedulerAction);

	  if (("development") !== 'production' && typeof options === 'function') {
	    throw new TypeError('Providing your root Epic to `createEpicMiddleware(rootEpic)` is no longer supported, instead use `epicMiddleware.run(rootEpic)`\n\nLearn more: https://redux-observable.js.org/MIGRATION.html#setting-up-the-middleware');
	  }

	  var epic$ = new _rxjs.Subject();
	  var store = void 0;

	  var epicMiddleware = function epicMiddleware(_store) {
	    if (("development") !== 'production' && store) {
	      // https://github.com/redux-observable/redux-observable/issues/389
	      __webpack_require__(131).warn('this middleware is already associated with a store. createEpicMiddleware should be called for every store.\n\nLearn more: https://goo.gl/2GQ7Da');
	    }
	    store = _store;
	    var actionSubject$ = new _rxjs.Subject().pipe((0, _operators.observeOn)(uniqueQueueScheduler));
	    var stateSubject$ = new _rxjs.Subject().pipe((0, _operators.observeOn)(uniqueQueueScheduler));
	    var action$ = new _ActionsObservable.ActionsObservable(actionSubject$);
	    var state$ = new _StateObservable.StateObservable(stateSubject$, store.getState());

	    var result$ = epic$.pipe((0, _operators.map)(function (epic) {
	      var output$ = 'dependencies' in options ? epic(action$, state$, options.dependencies) : epic(action$, state$);

	      if (!output$) {
	        throw new TypeError('Your root Epic "' + (epic.name || '<anonymous>') + '" does not return a stream. Double check you\'re not missing a return statement!');
	      }

	      return output$;
	    }), (0, _operators.mergeMap)(function (output$) {
	      return (0, _rxjs.from)(output$).pipe((0, _operators.subscribeOn)(uniqueQueueScheduler), (0, _operators.observeOn)(uniqueQueueScheduler));
	    }));

	    result$.subscribe(store.dispatch);

	    return function (next) {
	      return function (action) {
	        // Downstream middleware gets the action first,
	        // which includes their reducers, so state is
	        // updated before epics receive the action
	        var result = next(action);

	        // It's important to update the state$ before we emit
	        // the action because otherwise it would be stale
	        stateSubject$.next(store.getState());
	        actionSubject$.next(action);

	        return result;
	      };
	    };
	  };

	  epicMiddleware.run = function (rootEpic) {
	    if (("development") !== 'production' && !store) {
	      __webpack_require__(131).warn('epicMiddleware.run(rootEpic) called before the middleware has been setup by redux. Provide the epicMiddleware instance to createStore() first.');
	    }
	    epic$.next(rootEpic);
	  };

	  return epicMiddleware;
	}

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createEpicMiddleware = __webpack_require__(238);

	Object.defineProperty(exports, 'createEpicMiddleware', {
	  enumerable: true,
	  get: function get() {
	    return _createEpicMiddleware.createEpicMiddleware;
	  }
	});

	var _ActionsObservable = __webpack_require__(128);

	Object.defineProperty(exports, 'ActionsObservable', {
	  enumerable: true,
	  get: function get() {
	    return _ActionsObservable.ActionsObservable;
	  }
	});

	var _StateObservable = __webpack_require__(129);

	Object.defineProperty(exports, 'StateObservable', {
	  enumerable: true,
	  get: function get() {
	    return _StateObservable.StateObservable;
	  }
	});

	var _combineEpics = __webpack_require__(237);

	Object.defineProperty(exports, 'combineEpics', {
	  enumerable: true,
	  get: function get() {
	    return _combineEpics.combineEpics;
	  }
	});

	var _operators = __webpack_require__(130);

	Object.defineProperty(exports, 'ofType', {
	  enumerable: true,
	  get: function get() {
	    return _operators.ofType;
	  }
	});

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.utils = exports.effects = exports.detach = exports.CANCEL = exports.delay = exports.throttle = exports.takeLatest = exports.takeEvery = exports.buffers = exports.channel = exports.eventChannel = exports.END = exports.runSaga = undefined;

	var _runSaga = /*#__PURE__*/__webpack_require__(134);

	Object.defineProperty(exports, 'runSaga', {
	  enumerable: true,
	  get: function get() {
	    return _runSaga.runSaga;
	  }
	});

	var _channel = /*#__PURE__*/__webpack_require__(27);

	Object.defineProperty(exports, 'END', {
	  enumerable: true,
	  get: function get() {
	    return _channel.END;
	  }
	});
	Object.defineProperty(exports, 'eventChannel', {
	  enumerable: true,
	  get: function get() {
	    return _channel.eventChannel;
	  }
	});
	Object.defineProperty(exports, 'channel', {
	  enumerable: true,
	  get: function get() {
	    return _channel.channel;
	  }
	});

	var _buffers = /*#__PURE__*/__webpack_require__(56);

	Object.defineProperty(exports, 'buffers', {
	  enumerable: true,
	  get: function get() {
	    return _buffers.buffers;
	  }
	});

	var _sagaHelpers = /*#__PURE__*/__webpack_require__(135);

	Object.defineProperty(exports, 'takeEvery', {
	  enumerable: true,
	  get: function get() {
	    return _sagaHelpers.takeEvery;
	  }
	});
	Object.defineProperty(exports, 'takeLatest', {
	  enumerable: true,
	  get: function get() {
	    return _sagaHelpers.takeLatest;
	  }
	});
	Object.defineProperty(exports, 'throttle', {
	  enumerable: true,
	  get: function get() {
	    return _sagaHelpers.throttle;
	  }
	});

	var _utils = /*#__PURE__*/__webpack_require__(12);

	Object.defineProperty(exports, 'delay', {
	  enumerable: true,
	  get: function get() {
	    return _utils.delay;
	  }
	});
	Object.defineProperty(exports, 'CANCEL', {
	  enumerable: true,
	  get: function get() {
	    return _utils.CANCEL;
	  }
	});

	var _io = /*#__PURE__*/__webpack_require__(20);

	Object.defineProperty(exports, 'detach', {
	  enumerable: true,
	  get: function get() {
	    return _io.detach;
	  }
	});

	var _middleware = /*#__PURE__*/__webpack_require__(242);

	var _middleware2 = /*#__PURE__*/_interopRequireDefault(_middleware);

	var _effects = /*#__PURE__*/__webpack_require__(132);

	var effects = /*#__PURE__*/_interopRequireWildcard(_effects);

	var _utils2 = /*#__PURE__*/__webpack_require__(246);

	var utils = /*#__PURE__*/_interopRequireWildcard(_utils2);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _middleware2.default;
	exports.effects = effects;
	exports.utils = utils;

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.takeEvery = takeEvery;
	exports.takeLatest = takeLatest;
	exports.throttle = throttle;

	var _io = /*#__PURE__*/__webpack_require__(20);

	var _sagaHelpers = /*#__PURE__*/__webpack_require__(135);

	function takeEvery(patternOrChannel, worker) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  return _io.fork.apply(undefined, [_sagaHelpers.takeEveryHelper, patternOrChannel, worker].concat(args));
	}

	function takeLatest(patternOrChannel, worker) {
	  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	    args[_key2 - 2] = arguments[_key2];
	  }

	  return _io.fork.apply(undefined, [_sagaHelpers.takeLatestHelper, patternOrChannel, worker].concat(args));
	}

	function throttle(ms, pattern, worker) {
	  for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
	    args[_key3 - 3] = arguments[_key3];
	  }

	  return _io.fork.apply(undefined, [_sagaHelpers.throttleHelper, ms, pattern, worker].concat(args));
	}

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = sagaMiddlewareFactory;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	var _channel = /*#__PURE__*/__webpack_require__(27);

	var _runSaga = /*#__PURE__*/__webpack_require__(134);

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function sagaMiddlewareFactory() {
	  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	  var _ref$context = _ref.context,
	      context = _ref$context === undefined ? {} : _ref$context,
	      options = _objectWithoutProperties(_ref, ['context']);

	  var sagaMonitor = options.sagaMonitor,
	      logger = options.logger,
	      onError = options.onError;


	  if (_utils.is.func(options)) {
	    if (false) {
	      throw new Error('Saga middleware no longer accept Generator functions. Use sagaMiddleware.run instead');
	    } else {
	      throw new Error('You passed a function to the Saga middleware. You are likely trying to start a        Saga by directly passing it to the middleware. This is no longer possible starting from 0.10.0.        To run a Saga, you must do it dynamically AFTER mounting the middleware into the store.\n        Example:\n          import createSagaMiddleware from \'redux-saga\'\n          ... other imports\n\n          const sagaMiddleware = createSagaMiddleware()\n          const store = createStore(reducer, applyMiddleware(sagaMiddleware))\n          sagaMiddleware.run(saga, ...args)\n      ');
	    }
	  }

	  if (logger && !_utils.is.func(logger)) {
	    throw new Error('`options.logger` passed to the Saga middleware is not a function!');
	  }

	  if (("development") === 'development' && options.onerror) {
	    throw new Error('`options.onerror` was removed. Use `options.onError` instead.');
	  }

	  if (onError && !_utils.is.func(onError)) {
	    throw new Error('`options.onError` passed to the Saga middleware is not a function!');
	  }

	  if (options.emitter && !_utils.is.func(options.emitter)) {
	    throw new Error('`options.emitter` passed to the Saga middleware is not a function!');
	  }

	  function sagaMiddleware(_ref2) {
	    var getState = _ref2.getState,
	        dispatch = _ref2.dispatch;

	    var sagaEmitter = (0, _channel.emitter)();
	    sagaEmitter.emit = (options.emitter || _utils.ident)(sagaEmitter.emit);

	    sagaMiddleware.run = _runSaga.runSaga.bind(null, {
	      context: context,
	      subscribe: sagaEmitter.subscribe,
	      dispatch: dispatch,
	      getState: getState,
	      sagaMonitor: sagaMonitor,
	      logger: logger,
	      onError: onError
	    });

	    return function (next) {
	      return function (action) {
	        if (sagaMonitor && sagaMonitor.actionDispatched) {
	          sagaMonitor.actionDispatched(action);
	        }
	        var result = next(action); // hit reducers
	        sagaEmitter.emit(action);
	        return result;
	      };
	    };
	  }

	  sagaMiddleware.run = function () {
	    throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
	  };

	  sagaMiddleware.setContext = function (props) {
	    (0, _utils.check)(props, _utils.is.object, (0, _utils.createSetContextWarning)('sagaMiddleware', props));
	    _utils.object.assign(context, props);
	  };

	  return sagaMiddleware;
	}

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = takeEvery;

	var _fsmIterator = /*#__PURE__*/__webpack_require__(83);

	var _fsmIterator2 = /*#__PURE__*/_interopRequireDefault(_fsmIterator);

	var _io = /*#__PURE__*/__webpack_require__(20);

	var _channel = /*#__PURE__*/__webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function takeEvery(patternOrChannel, worker) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  var yTake = { done: false, value: (0, _io.take)(patternOrChannel) };
	  var yFork = function yFork(ac) {
	    return { done: false, value: _io.fork.apply(undefined, [worker].concat(args, [ac])) };
	  };

	  var action = void 0,
	      setAction = function setAction(ac) {
	    return action = ac;
	  };

	  return (0, _fsmIterator2.default)({
	    q1: function q1() {
	      return ['q2', yTake, setAction];
	    },
	    q2: function q2() {
	      return action === _channel.END ? [_fsmIterator.qEnd] : ['q1', yFork(action)];
	    }
	  }, 'q1', 'takeEvery(' + (0, _fsmIterator.safeName)(patternOrChannel) + ', ' + worker.name + ')');
	}

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = takeLatest;

	var _fsmIterator = /*#__PURE__*/__webpack_require__(83);

	var _fsmIterator2 = /*#__PURE__*/_interopRequireDefault(_fsmIterator);

	var _io = /*#__PURE__*/__webpack_require__(20);

	var _channel = /*#__PURE__*/__webpack_require__(27);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function takeLatest(patternOrChannel, worker) {
	  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  var yTake = { done: false, value: (0, _io.take)(patternOrChannel) };
	  var yFork = function yFork(ac) {
	    return { done: false, value: _io.fork.apply(undefined, [worker].concat(args, [ac])) };
	  };
	  var yCancel = function yCancel(task) {
	    return { done: false, value: (0, _io.cancel)(task) };
	  };

	  var task = void 0,
	      action = void 0;
	  var setTask = function setTask(t) {
	    return task = t;
	  };
	  var setAction = function setAction(ac) {
	    return action = ac;
	  };

	  return (0, _fsmIterator2.default)({
	    q1: function q1() {
	      return ['q2', yTake, setAction];
	    },
	    q2: function q2() {
	      return action === _channel.END ? [_fsmIterator.qEnd] : task ? ['q3', yCancel(task)] : ['q1', yFork(action), setTask];
	    },
	    q3: function q3() {
	      return ['q1', yFork(action), setTask];
	    }
	  }, 'q1', 'takeLatest(' + (0, _fsmIterator.safeName)(patternOrChannel) + ', ' + worker.name + ')');
	}

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.default = throttle;

	var _fsmIterator = /*#__PURE__*/__webpack_require__(83);

	var _fsmIterator2 = /*#__PURE__*/_interopRequireDefault(_fsmIterator);

	var _io = /*#__PURE__*/__webpack_require__(20);

	var _channel = /*#__PURE__*/__webpack_require__(27);

	var _buffers = /*#__PURE__*/__webpack_require__(56);

	var _utils = /*#__PURE__*/__webpack_require__(12);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function throttle(delayLength, pattern, worker) {
	  for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
	    args[_key - 3] = arguments[_key];
	  }

	  var action = void 0,
	      channel = void 0;

	  var yActionChannel = { done: false, value: (0, _io.actionChannel)(pattern, _buffers.buffers.sliding(1)) };
	  var yTake = function yTake() {
	    return { done: false, value: (0, _io.take)(channel) };
	  };
	  var yFork = function yFork(ac) {
	    return { done: false, value: _io.fork.apply(undefined, [worker].concat(args, [ac])) };
	  };
	  var yDelay = { done: false, value: (0, _io.call)(_utils.delay, delayLength) };

	  var setAction = function setAction(ac) {
	    return action = ac;
	  };
	  var setChannel = function setChannel(ch) {
	    return channel = ch;
	  };

	  return (0, _fsmIterator2.default)({
	    q1: function q1() {
	      return ['q2', yActionChannel, setChannel];
	    },
	    q2: function q2() {
	      return ['q3', yTake(), setAction];
	    },
	    q3: function q3() {
	      return action === _channel.END ? [_fsmIterator.qEnd] : ['q4', yFork(action)];
	    },
	    q4: function q4() {
	      return ['q2', yDelay];
	    }
	  }, 'q1', 'throttle(' + (0, _fsmIterator.safeName)(pattern) + ', ' + worker.name + ')');
	}

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = /*#__PURE__*/__webpack_require__(12);

	Object.defineProperty(exports, 'TASK', {
	  enumerable: true,
	  get: function get() {
	    return _utils.TASK;
	  }
	});
	Object.defineProperty(exports, 'SAGA_ACTION', {
	  enumerable: true,
	  get: function get() {
	    return _utils.SAGA_ACTION;
	  }
	});
	Object.defineProperty(exports, 'noop', {
	  enumerable: true,
	  get: function get() {
	    return _utils.noop;
	  }
	});
	Object.defineProperty(exports, 'is', {
	  enumerable: true,
	  get: function get() {
	    return _utils.is;
	  }
	});
	Object.defineProperty(exports, 'deferred', {
	  enumerable: true,
	  get: function get() {
	    return _utils.deferred;
	  }
	});
	Object.defineProperty(exports, 'arrayOfDeffered', {
	  enumerable: true,
	  get: function get() {
	    return _utils.arrayOfDeffered;
	  }
	});
	Object.defineProperty(exports, 'createMockTask', {
	  enumerable: true,
	  get: function get() {
	    return _utils.createMockTask;
	  }
	});
	Object.defineProperty(exports, 'cloneableGenerator', {
	  enumerable: true,
	  get: function get() {
	    return _utils.cloneableGenerator;
	  }
	});

	var _io = /*#__PURE__*/__webpack_require__(20);

	Object.defineProperty(exports, 'asEffect', {
	  enumerable: true,
	  get: function get() {
	    return _io.asEffect;
	  }
	});

	var _proc = /*#__PURE__*/__webpack_require__(133);

	Object.defineProperty(exports, 'CHANNEL_END', {
	  enumerable: true,
	  get: function get() {
	    return _proc.CHANNEL_END;
	  }
	});

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g = (function() { return this })() || Function("return this")();

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	module.exports = __webpack_require__(248);

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}


/***/ },
/* 248 */
/***/ function(module, exports) {

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	!(function(global) {
	  "use strict";

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  runtime.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }

	      return ContinueSentinel;
	    }
	  };
	})(
	  // In sloppy mode, unbound `this` refers to the global object, fallback to
	  // Function constructor if we're in global strict mode. That is sadly a form
	  // of indirect eval which violates Content Security Policy.
	  (function() { return this })() || Function("return this")()
	);


/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var asap_1 = __webpack_require__(156);
	var isNumeric_1 = __webpack_require__(65);
	var SubscribeOnObservable = (function (_super) {
	    __extends(SubscribeOnObservable, _super);
	    function SubscribeOnObservable(source, delayTime, scheduler) {
	        if (delayTime === void 0) { delayTime = 0; }
	        if (scheduler === void 0) { scheduler = asap_1.asap; }
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.delayTime = delayTime;
	        _this.scheduler = scheduler;
	        if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
	            _this.delayTime = 0;
	        }
	        if (!scheduler || typeof scheduler.schedule !== 'function') {
	            _this.scheduler = asap_1.asap;
	        }
	        return _this;
	    }
	    SubscribeOnObservable.create = function (source, delay, scheduler) {
	        if (delay === void 0) { delay = 0; }
	        if (scheduler === void 0) { scheduler = asap_1.asap; }
	        return new SubscribeOnObservable(source, delay, scheduler);
	    };
	    SubscribeOnObservable.dispatch = function (arg) {
	        var source = arg.source, subscriber = arg.subscriber;
	        return this.add(source.subscribe(subscriber));
	    };
	    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
	        var delay = this.delayTime;
	        var source = this.source;
	        var scheduler = this.scheduler;
	        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
	            source: source, subscriber: subscriber
	        });
	    };
	    return SubscribeOnObservable;
	}(Observable_1.Observable));
	exports.SubscribeOnObservable = SubscribeOnObservable;
	//# sourceMappingURL=SubscribeOnObservable.js.map

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var AsyncSubject_1 = __webpack_require__(57);
	var map_1 = __webpack_require__(10);
	var canReportError_1 = __webpack_require__(97);
	var isArray_1 = __webpack_require__(8);
	var isScheduler_1 = __webpack_require__(16);
	function bindCallback(callbackFunc, resultSelector, scheduler) {
	    if (resultSelector) {
	        if (isScheduler_1.isScheduler(resultSelector)) {
	            scheduler = resultSelector;
	        }
	        else {
	            return function () {
	                var args = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    args[_i] = arguments[_i];
	                }
	                return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
	            };
	        }
	    }
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var context = this;
	        var subject;
	        var params = {
	            context: context,
	            subject: subject,
	            callbackFunc: callbackFunc,
	            scheduler: scheduler,
	        };
	        return new Observable_1.Observable(function (subscriber) {
	            if (!scheduler) {
	                if (!subject) {
	                    subject = new AsyncSubject_1.AsyncSubject();
	                    var handler = function () {
	                        var innerArgs = [];
	                        for (var _i = 0; _i < arguments.length; _i++) {
	                            innerArgs[_i] = arguments[_i];
	                        }
	                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
	                        subject.complete();
	                    };
	                    try {
	                        callbackFunc.apply(context, args.concat([handler]));
	                    }
	                    catch (err) {
	                        if (canReportError_1.canReportError(subject)) {
	                            subject.error(err);
	                        }
	                        else {
	                            console.warn(err);
	                        }
	                    }
	                }
	                return subject.subscribe(subscriber);
	            }
	            else {
	                var state = {
	                    args: args, subscriber: subscriber, params: params,
	                };
	                return scheduler.schedule(dispatch, 0, state);
	            }
	        });
	    };
	}
	exports.bindCallback = bindCallback;
	function dispatch(state) {
	    var _this = this;
	    var self = this;
	    var args = state.args, subscriber = state.subscriber, params = state.params;
	    var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
	    var subject = params.subject;
	    if (!subject) {
	        subject = params.subject = new AsyncSubject_1.AsyncSubject();
	        var handler = function () {
	            var innerArgs = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                innerArgs[_i] = arguments[_i];
	            }
	            var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
	            _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
	        };
	        try {
	            callbackFunc.apply(context, args.concat([handler]));
	        }
	        catch (err) {
	            subject.error(err);
	        }
	    }
	    this.add(subject.subscribe(subscriber));
	}
	function dispatchNext(state) {
	    var value = state.value, subject = state.subject;
	    subject.next(value);
	    subject.complete();
	}
	function dispatchError(state) {
	    var err = state.err, subject = state.subject;
	    subject.error(err);
	}
	//# sourceMappingURL=bindCallback.js.map

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var AsyncSubject_1 = __webpack_require__(57);
	var map_1 = __webpack_require__(10);
	var canReportError_1 = __webpack_require__(97);
	var isScheduler_1 = __webpack_require__(16);
	var isArray_1 = __webpack_require__(8);
	function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
	    if (resultSelector) {
	        if (isScheduler_1.isScheduler(resultSelector)) {
	            scheduler = resultSelector;
	        }
	        else {
	            return function () {
	                var args = [];
	                for (var _i = 0; _i < arguments.length; _i++) {
	                    args[_i] = arguments[_i];
	                }
	                return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
	            };
	        }
	    }
	    return function () {
	        var args = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            args[_i] = arguments[_i];
	        }
	        var params = {
	            subject: undefined,
	            args: args,
	            callbackFunc: callbackFunc,
	            scheduler: scheduler,
	            context: this,
	        };
	        return new Observable_1.Observable(function (subscriber) {
	            var context = params.context;
	            var subject = params.subject;
	            if (!scheduler) {
	                if (!subject) {
	                    subject = params.subject = new AsyncSubject_1.AsyncSubject();
	                    var handler = function () {
	                        var innerArgs = [];
	                        for (var _i = 0; _i < arguments.length; _i++) {
	                            innerArgs[_i] = arguments[_i];
	                        }
	                        var err = innerArgs.shift();
	                        if (err) {
	                            subject.error(err);
	                            return;
	                        }
	                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
	                        subject.complete();
	                    };
	                    try {
	                        callbackFunc.apply(context, args.concat([handler]));
	                    }
	                    catch (err) {
	                        if (canReportError_1.canReportError(subject)) {
	                            subject.error(err);
	                        }
	                        else {
	                            console.warn(err);
	                        }
	                    }
	                }
	                return subject.subscribe(subscriber);
	            }
	            else {
	                return scheduler.schedule(dispatch, 0, { params: params, subscriber: subscriber, context: context });
	            }
	        });
	    };
	}
	exports.bindNodeCallback = bindNodeCallback;
	function dispatch(state) {
	    var _this = this;
	    var params = state.params, subscriber = state.subscriber, context = state.context;
	    var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
	    var subject = params.subject;
	    if (!subject) {
	        subject = params.subject = new AsyncSubject_1.AsyncSubject();
	        var handler = function () {
	            var innerArgs = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                innerArgs[_i] = arguments[_i];
	            }
	            var err = innerArgs.shift();
	            if (err) {
	                _this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
	            }
	            else {
	                var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
	                _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
	            }
	        };
	        try {
	            callbackFunc.apply(context, args.concat([handler]));
	        }
	        catch (err) {
	            this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
	        }
	    }
	    this.add(subject.subscribe(subscriber));
	}
	function dispatchNext(arg) {
	    var value = arg.value, subject = arg.subject;
	    subject.next(value);
	    subject.complete();
	}
	function dispatchError(arg) {
	    var err = arg.err, subject = arg.subject;
	    subject.error(err);
	}
	//# sourceMappingURL=bindNodeCallback.js.map

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var isArray_1 = __webpack_require__(8);
	var map_1 = __webpack_require__(10);
	var isObject_1 = __webpack_require__(99);
	var from_1 = __webpack_require__(15);
	function forkJoin() {
	    var sources = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        sources[_i] = arguments[_i];
	    }
	    if (sources.length === 1) {
	        var first_1 = sources[0];
	        if (isArray_1.isArray(first_1)) {
	            return forkJoinInternal(first_1, null);
	        }
	        if (isObject_1.isObject(first_1) && Object.getPrototypeOf(first_1) === Object.prototype) {
	            var keys = Object.keys(first_1);
	            return forkJoinInternal(keys.map(function (key) { return first_1[key]; }), keys);
	        }
	    }
	    if (typeof sources[sources.length - 1] === 'function') {
	        var resultSelector_1 = sources.pop();
	        sources = (sources.length === 1 && isArray_1.isArray(sources[0])) ? sources[0] : sources;
	        return forkJoinInternal(sources, null).pipe(map_1.map(function (args) { return resultSelector_1.apply(void 0, args); }));
	    }
	    return forkJoinInternal(sources, null);
	}
	exports.forkJoin = forkJoin;
	function forkJoinInternal(sources, keys) {
	    return new Observable_1.Observable(function (subscriber) {
	        var len = sources.length;
	        if (len === 0) {
	            subscriber.complete();
	            return;
	        }
	        var values = new Array(len);
	        var completed = 0;
	        var emitted = 0;
	        var _loop_1 = function (i) {
	            var source = from_1.from(sources[i]);
	            var hasValue = false;
	            subscriber.add(source.subscribe({
	                next: function (value) {
	                    if (!hasValue) {
	                        hasValue = true;
	                        emitted++;
	                    }
	                    values[i] = value;
	                },
	                error: function (err) { return subscriber.error(err); },
	                complete: function () {
	                    completed++;
	                    if (completed === len || !hasValue) {
	                        if (emitted === len) {
	                            subscriber.next(keys ?
	                                keys.reduce(function (result, key, i) { return (result[key] = values[i], result); }, {}) :
	                                values);
	                        }
	                        subscriber.complete();
	                    }
	                }
	            }));
	        };
	        for (var i = 0; i < len; i++) {
	            _loop_1(i);
	        }
	    });
	}
	//# sourceMappingURL=forkJoin.js.map

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var isArray_1 = __webpack_require__(8);
	var isFunction_1 = __webpack_require__(45);
	var map_1 = __webpack_require__(10);
	var toString = Object.prototype.toString;
	function fromEvent(target, eventName, options, resultSelector) {
	    if (isFunction_1.isFunction(options)) {
	        resultSelector = options;
	        options = undefined;
	    }
	    if (resultSelector) {
	        return fromEvent(target, eventName, options).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        function handler(e) {
	            if (arguments.length > 1) {
	                subscriber.next(Array.prototype.slice.call(arguments));
	            }
	            else {
	                subscriber.next(e);
	            }
	        }
	        setupSubscription(target, eventName, handler, subscriber, options);
	    });
	}
	exports.fromEvent = fromEvent;
	function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
	    var unsubscribe;
	    if (isEventTarget(sourceObj)) {
	        var source_1 = sourceObj;
	        sourceObj.addEventListener(eventName, handler, options);
	        unsubscribe = function () { return source_1.removeEventListener(eventName, handler, options); };
	    }
	    else if (isJQueryStyleEventEmitter(sourceObj)) {
	        var source_2 = sourceObj;
	        sourceObj.on(eventName, handler);
	        unsubscribe = function () { return source_2.off(eventName, handler); };
	    }
	    else if (isNodeStyleEventEmitter(sourceObj)) {
	        var source_3 = sourceObj;
	        sourceObj.addListener(eventName, handler);
	        unsubscribe = function () { return source_3.removeListener(eventName, handler); };
	    }
	    else if (sourceObj && sourceObj.length) {
	        for (var i = 0, len = sourceObj.length; i < len; i++) {
	            setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
	        }
	    }
	    else {
	        throw new TypeError('Invalid event target');
	    }
	    subscriber.add(unsubscribe);
	}
	function isNodeStyleEventEmitter(sourceObj) {
	    return sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
	}
	function isJQueryStyleEventEmitter(sourceObj) {
	    return sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
	}
	function isEventTarget(sourceObj) {
	    return sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
	}
	//# sourceMappingURL=fromEvent.js.map

/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var isArray_1 = __webpack_require__(8);
	var isFunction_1 = __webpack_require__(45);
	var map_1 = __webpack_require__(10);
	function fromEventPattern(addHandler, removeHandler, resultSelector) {
	    if (resultSelector) {
	        return fromEventPattern(addHandler, removeHandler).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        var handler = function () {
	            var e = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                e[_i] = arguments[_i];
	            }
	            return subscriber.next(e.length === 1 ? e[0] : e);
	        };
	        var retValue;
	        try {
	            retValue = addHandler(handler);
	        }
	        catch (err) {
	            subscriber.error(err);
	            return undefined;
	        }
	        if (!isFunction_1.isFunction(removeHandler)) {
	            return undefined;
	        }
	        return function () { return removeHandler(handler, retValue); };
	    });
	}
	exports.fromEventPattern = fromEventPattern;
	//# sourceMappingURL=fromEventPattern.js.map

/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var identity_1 = __webpack_require__(31);
	var isScheduler_1 = __webpack_require__(16);
	function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
	    var resultSelector;
	    var initialState;
	    if (arguments.length == 1) {
	        var options = initialStateOrOptions;
	        initialState = options.initialState;
	        condition = options.condition;
	        iterate = options.iterate;
	        resultSelector = options.resultSelector || identity_1.identity;
	        scheduler = options.scheduler;
	    }
	    else if (resultSelectorOrObservable === undefined || isScheduler_1.isScheduler(resultSelectorOrObservable)) {
	        initialState = initialStateOrOptions;
	        resultSelector = identity_1.identity;
	        scheduler = resultSelectorOrObservable;
	    }
	    else {
	        initialState = initialStateOrOptions;
	        resultSelector = resultSelectorOrObservable;
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        var state = initialState;
	        if (scheduler) {
	            return scheduler.schedule(dispatch, 0, {
	                subscriber: subscriber,
	                iterate: iterate,
	                condition: condition,
	                resultSelector: resultSelector,
	                state: state
	            });
	        }
	        do {
	            if (condition) {
	                var conditionResult = void 0;
	                try {
	                    conditionResult = condition(state);
	                }
	                catch (err) {
	                    subscriber.error(err);
	                    return undefined;
	                }
	                if (!conditionResult) {
	                    subscriber.complete();
	                    break;
	                }
	            }
	            var value = void 0;
	            try {
	                value = resultSelector(state);
	            }
	            catch (err) {
	                subscriber.error(err);
	                return undefined;
	            }
	            subscriber.next(value);
	            if (subscriber.closed) {
	                break;
	            }
	            try {
	                state = iterate(state);
	            }
	            catch (err) {
	                subscriber.error(err);
	                return undefined;
	            }
	        } while (true);
	        return undefined;
	    });
	}
	exports.generate = generate;
	function dispatch(state) {
	    var subscriber = state.subscriber, condition = state.condition;
	    if (subscriber.closed) {
	        return undefined;
	    }
	    if (state.needIterate) {
	        try {
	            state.state = state.iterate(state.state);
	        }
	        catch (err) {
	            subscriber.error(err);
	            return undefined;
	        }
	    }
	    else {
	        state.needIterate = true;
	    }
	    if (condition) {
	        var conditionResult = void 0;
	        try {
	            conditionResult = condition(state.state);
	        }
	        catch (err) {
	            subscriber.error(err);
	            return undefined;
	        }
	        if (!conditionResult) {
	            subscriber.complete();
	            return undefined;
	        }
	        if (subscriber.closed) {
	            return undefined;
	        }
	    }
	    var value;
	    try {
	        value = state.resultSelector(state.state);
	    }
	    catch (err) {
	        subscriber.error(err);
	        return undefined;
	    }
	    if (subscriber.closed) {
	        return undefined;
	    }
	    subscriber.next(value);
	    if (subscriber.closed) {
	        return undefined;
	    }
	    return this.schedule(state);
	}
	//# sourceMappingURL=generate.js.map

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var defer_1 = __webpack_require__(86);
	var empty_1 = __webpack_require__(14);
	function iif(condition, trueResult, falseResult) {
	    if (trueResult === void 0) { trueResult = empty_1.EMPTY; }
	    if (falseResult === void 0) { falseResult = empty_1.EMPTY; }
	    return defer_1.defer(function () { return condition() ? trueResult : falseResult; });
	}
	exports.iif = iif;
	//# sourceMappingURL=iif.js.map

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var async_1 = __webpack_require__(7);
	var isNumeric_1 = __webpack_require__(65);
	function interval(period, scheduler) {
	    if (period === void 0) { period = 0; }
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    if (!isNumeric_1.isNumeric(period) || period < 0) {
	        period = 0;
	    }
	    if (!scheduler || typeof scheduler.schedule !== 'function') {
	        scheduler = async_1.async;
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        subscriber.add(scheduler.schedule(dispatch, period, { subscriber: subscriber, counter: 0, period: period }));
	        return subscriber;
	    });
	}
	exports.interval = interval;
	function dispatch(state) {
	    var subscriber = state.subscriber, counter = state.counter, period = state.period;
	    subscriber.next(counter);
	    this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
	}
	//# sourceMappingURL=interval.js.map

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var from_1 = __webpack_require__(15);
	var isArray_1 = __webpack_require__(8);
	var empty_1 = __webpack_require__(14);
	function onErrorResumeNext() {
	    var sources = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        sources[_i] = arguments[_i];
	    }
	    if (sources.length === 0) {
	        return empty_1.EMPTY;
	    }
	    var first = sources[0], remainder = sources.slice(1);
	    if (sources.length === 1 && isArray_1.isArray(first)) {
	        return onErrorResumeNext.apply(void 0, first);
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        var subNext = function () { return subscriber.add(onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber)); };
	        return from_1.from(first).subscribe({
	            next: function (value) { subscriber.next(value); },
	            error: subNext,
	            complete: subNext,
	        });
	    });
	}
	exports.onErrorResumeNext = onErrorResumeNext;
	//# sourceMappingURL=onErrorResumeNext.js.map

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var Subscription_1 = __webpack_require__(5);
	function pairs(obj, scheduler) {
	    if (!scheduler) {
	        return new Observable_1.Observable(function (subscriber) {
	            var keys = Object.keys(obj);
	            for (var i = 0; i < keys.length && !subscriber.closed; i++) {
	                var key = keys[i];
	                if (obj.hasOwnProperty(key)) {
	                    subscriber.next([key, obj[key]]);
	                }
	            }
	            subscriber.complete();
	        });
	    }
	    else {
	        return new Observable_1.Observable(function (subscriber) {
	            var keys = Object.keys(obj);
	            var subscription = new Subscription_1.Subscription();
	            subscription.add(scheduler.schedule(dispatch, 0, { keys: keys, index: 0, subscriber: subscriber, subscription: subscription, obj: obj }));
	            return subscription;
	        });
	    }
	}
	exports.pairs = pairs;
	function dispatch(state) {
	    var keys = state.keys, index = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
	    if (!subscriber.closed) {
	        if (index < keys.length) {
	            var key = keys[index];
	            subscriber.next([key, obj[key]]);
	            subscription.add(this.schedule({ keys: keys, index: index + 1, subscriber: subscriber, subscription: subscription, obj: obj }));
	        }
	        else {
	            subscriber.complete();
	        }
	    }
	}
	exports.dispatch = dispatch;
	//# sourceMappingURL=pairs.js.map

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var not_1 = __webpack_require__(163);
	var subscribeTo_1 = __webpack_require__(101);
	var filter_1 = __webpack_require__(28);
	var Observable_1 = __webpack_require__(2);
	function partition(source, predicate, thisArg) {
	    return [
	        filter_1.filter(predicate, thisArg)(new Observable_1.Observable(subscribeTo_1.subscribeTo(source))),
	        filter_1.filter(not_1.not(predicate, thisArg))(new Observable_1.Observable(subscribeTo_1.subscribeTo(source)))
	    ];
	}
	exports.partition = partition;
	//# sourceMappingURL=partition.js.map

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	function range(start, count, scheduler) {
	    if (start === void 0) { start = 0; }
	    return new Observable_1.Observable(function (subscriber) {
	        if (count === undefined) {
	            count = start;
	            start = 0;
	        }
	        var index = 0;
	        var current = start;
	        if (scheduler) {
	            return scheduler.schedule(dispatch, 0, {
	                index: index, count: count, start: start, subscriber: subscriber
	            });
	        }
	        else {
	            do {
	                if (index++ >= count) {
	                    subscriber.complete();
	                    break;
	                }
	                subscriber.next(current++);
	                if (subscriber.closed) {
	                    break;
	                }
	            } while (true);
	        }
	        return undefined;
	    });
	}
	exports.range = range;
	function dispatch(state) {
	    var start = state.start, index = state.index, count = state.count, subscriber = state.subscriber;
	    if (index >= count) {
	        subscriber.complete();
	        return;
	    }
	    subscriber.next(start);
	    if (subscriber.closed) {
	        return;
	    }
	    state.index = index + 1;
	    state.start = start + 1;
	    this.schedule(state);
	}
	exports.dispatch = dispatch;
	//# sourceMappingURL=range.js.map

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var from_1 = __webpack_require__(15);
	var empty_1 = __webpack_require__(14);
	function using(resourceFactory, observableFactory) {
	    return new Observable_1.Observable(function (subscriber) {
	        var resource;
	        try {
	            resource = resourceFactory();
	        }
	        catch (err) {
	            subscriber.error(err);
	            return undefined;
	        }
	        var result;
	        try {
	            result = observableFactory(resource);
	        }
	        catch (err) {
	            subscriber.error(err);
	            return undefined;
	        }
	        var source = result ? from_1.from(result) : empty_1.EMPTY;
	        var subscription = source.subscribe(subscriber);
	        return function () {
	            subscription.unsubscribe();
	            if (resource) {
	                resource.unsubscribe();
	            }
	        };
	    });
	}
	exports.using = using;
	//# sourceMappingURL=using.js.map

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var audit_1 = __webpack_require__(146);
	var timer_1 = __webpack_require__(145);
	function auditTime(duration, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return audit_1.audit(function () { return timer_1.timer(duration, scheduler); });
	}
	exports.auditTime = auditTime;
	//# sourceMappingURL=auditTime.js.map

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function buffer(closingNotifier) {
	    return function bufferOperatorFunction(source) {
	        return source.lift(new BufferOperator(closingNotifier));
	    };
	}
	exports.buffer = buffer;
	var BufferOperator = (function () {
	    function BufferOperator(closingNotifier) {
	        this.closingNotifier = closingNotifier;
	    }
	    BufferOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
	    };
	    return BufferOperator;
	}());
	var BufferSubscriber = (function (_super) {
	    __extends(BufferSubscriber, _super);
	    function BufferSubscriber(destination, closingNotifier) {
	        var _this = _super.call(this, destination) || this;
	        _this.buffer = [];
	        _this.add(subscribeToResult_1.subscribeToResult(_this, closingNotifier));
	        return _this;
	    }
	    BufferSubscriber.prototype._next = function (value) {
	        this.buffer.push(value);
	    };
	    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var buffer = this.buffer;
	        this.buffer = [];
	        this.destination.next(buffer);
	    };
	    return BufferSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=buffer.js.map

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function bufferCount(bufferSize, startBufferEvery) {
	    if (startBufferEvery === void 0) { startBufferEvery = null; }
	    return function bufferCountOperatorFunction(source) {
	        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
	    };
	}
	exports.bufferCount = bufferCount;
	var BufferCountOperator = (function () {
	    function BufferCountOperator(bufferSize, startBufferEvery) {
	        this.bufferSize = bufferSize;
	        this.startBufferEvery = startBufferEvery;
	        if (!startBufferEvery || bufferSize === startBufferEvery) {
	            this.subscriberClass = BufferCountSubscriber;
	        }
	        else {
	            this.subscriberClass = BufferSkipCountSubscriber;
	        }
	    }
	    BufferCountOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
	    };
	    return BufferCountOperator;
	}());
	var BufferCountSubscriber = (function (_super) {
	    __extends(BufferCountSubscriber, _super);
	    function BufferCountSubscriber(destination, bufferSize) {
	        var _this = _super.call(this, destination) || this;
	        _this.bufferSize = bufferSize;
	        _this.buffer = [];
	        return _this;
	    }
	    BufferCountSubscriber.prototype._next = function (value) {
	        var buffer = this.buffer;
	        buffer.push(value);
	        if (buffer.length == this.bufferSize) {
	            this.destination.next(buffer);
	            this.buffer = [];
	        }
	    };
	    BufferCountSubscriber.prototype._complete = function () {
	        var buffer = this.buffer;
	        if (buffer.length > 0) {
	            this.destination.next(buffer);
	        }
	        _super.prototype._complete.call(this);
	    };
	    return BufferCountSubscriber;
	}(Subscriber_1.Subscriber));
	var BufferSkipCountSubscriber = (function (_super) {
	    __extends(BufferSkipCountSubscriber, _super);
	    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
	        var _this = _super.call(this, destination) || this;
	        _this.bufferSize = bufferSize;
	        _this.startBufferEvery = startBufferEvery;
	        _this.buffers = [];
	        _this.count = 0;
	        return _this;
	    }
	    BufferSkipCountSubscriber.prototype._next = function (value) {
	        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
	        this.count++;
	        if (count % startBufferEvery === 0) {
	            buffers.push([]);
	        }
	        for (var i = buffers.length; i--;) {
	            var buffer = buffers[i];
	            buffer.push(value);
	            if (buffer.length === bufferSize) {
	                buffers.splice(i, 1);
	                this.destination.next(buffer);
	            }
	        }
	    };
	    BufferSkipCountSubscriber.prototype._complete = function () {
	        var _a = this, buffers = _a.buffers, destination = _a.destination;
	        while (buffers.length > 0) {
	            var buffer = buffers.shift();
	            if (buffer.length > 0) {
	                destination.next(buffer);
	            }
	        }
	        _super.prototype._complete.call(this);
	    };
	    return BufferSkipCountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=bufferCount.js.map

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var Subscriber_1 = __webpack_require__(1);
	var isScheduler_1 = __webpack_require__(16);
	function bufferTime(bufferTimeSpan) {
	    var length = arguments.length;
	    var scheduler = async_1.async;
	    if (isScheduler_1.isScheduler(arguments[arguments.length - 1])) {
	        scheduler = arguments[arguments.length - 1];
	        length--;
	    }
	    var bufferCreationInterval = null;
	    if (length >= 2) {
	        bufferCreationInterval = arguments[1];
	    }
	    var maxBufferSize = Number.POSITIVE_INFINITY;
	    if (length >= 3) {
	        maxBufferSize = arguments[2];
	    }
	    return function bufferTimeOperatorFunction(source) {
	        return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
	    };
	}
	exports.bufferTime = bufferTime;
	var BufferTimeOperator = (function () {
	    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
	        this.bufferTimeSpan = bufferTimeSpan;
	        this.bufferCreationInterval = bufferCreationInterval;
	        this.maxBufferSize = maxBufferSize;
	        this.scheduler = scheduler;
	    }
	    BufferTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
	    };
	    return BufferTimeOperator;
	}());
	var Context = (function () {
	    function Context() {
	        this.buffer = [];
	    }
	    return Context;
	}());
	var BufferTimeSubscriber = (function (_super) {
	    __extends(BufferTimeSubscriber, _super);
	    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.bufferTimeSpan = bufferTimeSpan;
	        _this.bufferCreationInterval = bufferCreationInterval;
	        _this.maxBufferSize = maxBufferSize;
	        _this.scheduler = scheduler;
	        _this.contexts = [];
	        var context = _this.openContext();
	        _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
	        if (_this.timespanOnly) {
	            var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
	            _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
	        }
	        else {
	            var closeState = { subscriber: _this, context: context };
	            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
	            _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
	            _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
	        }
	        return _this;
	    }
	    BufferTimeSubscriber.prototype._next = function (value) {
	        var contexts = this.contexts;
	        var len = contexts.length;
	        var filledBufferContext;
	        for (var i = 0; i < len; i++) {
	            var context_1 = contexts[i];
	            var buffer = context_1.buffer;
	            buffer.push(value);
	            if (buffer.length == this.maxBufferSize) {
	                filledBufferContext = context_1;
	            }
	        }
	        if (filledBufferContext) {
	            this.onBufferFull(filledBufferContext);
	        }
	    };
	    BufferTimeSubscriber.prototype._error = function (err) {
	        this.contexts.length = 0;
	        _super.prototype._error.call(this, err);
	    };
	    BufferTimeSubscriber.prototype._complete = function () {
	        var _a = this, contexts = _a.contexts, destination = _a.destination;
	        while (contexts.length > 0) {
	            var context_2 = contexts.shift();
	            destination.next(context_2.buffer);
	        }
	        _super.prototype._complete.call(this);
	    };
	    BufferTimeSubscriber.prototype._unsubscribe = function () {
	        this.contexts = null;
	    };
	    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
	        this.closeContext(context);
	        var closeAction = context.closeAction;
	        closeAction.unsubscribe();
	        this.remove(closeAction);
	        if (!this.closed && this.timespanOnly) {
	            context = this.openContext();
	            var bufferTimeSpan = this.bufferTimeSpan;
	            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
	            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
	        }
	    };
	    BufferTimeSubscriber.prototype.openContext = function () {
	        var context = new Context();
	        this.contexts.push(context);
	        return context;
	    };
	    BufferTimeSubscriber.prototype.closeContext = function (context) {
	        this.destination.next(context.buffer);
	        var contexts = this.contexts;
	        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
	        if (spliceIndex >= 0) {
	            contexts.splice(contexts.indexOf(context), 1);
	        }
	    };
	    return BufferTimeSubscriber;
	}(Subscriber_1.Subscriber));
	function dispatchBufferTimeSpanOnly(state) {
	    var subscriber = state.subscriber;
	    var prevContext = state.context;
	    if (prevContext) {
	        subscriber.closeContext(prevContext);
	    }
	    if (!subscriber.closed) {
	        state.context = subscriber.openContext();
	        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
	    }
	}
	function dispatchBufferCreation(state) {
	    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
	    var context = subscriber.openContext();
	    var action = this;
	    if (!subscriber.closed) {
	        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
	        action.schedule(state, bufferCreationInterval);
	    }
	}
	function dispatchBufferClose(arg) {
	    var subscriber = arg.subscriber, context = arg.context;
	    subscriber.closeContext(context);
	}
	//# sourceMappingURL=bufferTime.js.map

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscription_1 = __webpack_require__(5);
	var subscribeToResult_1 = __webpack_require__(4);
	var OuterSubscriber_1 = __webpack_require__(3);
	function bufferToggle(openings, closingSelector) {
	    return function bufferToggleOperatorFunction(source) {
	        return source.lift(new BufferToggleOperator(openings, closingSelector));
	    };
	}
	exports.bufferToggle = bufferToggle;
	var BufferToggleOperator = (function () {
	    function BufferToggleOperator(openings, closingSelector) {
	        this.openings = openings;
	        this.closingSelector = closingSelector;
	    }
	    BufferToggleOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
	    };
	    return BufferToggleOperator;
	}());
	var BufferToggleSubscriber = (function (_super) {
	    __extends(BufferToggleSubscriber, _super);
	    function BufferToggleSubscriber(destination, openings, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.openings = openings;
	        _this.closingSelector = closingSelector;
	        _this.contexts = [];
	        _this.add(subscribeToResult_1.subscribeToResult(_this, openings));
	        return _this;
	    }
	    BufferToggleSubscriber.prototype._next = function (value) {
	        var contexts = this.contexts;
	        var len = contexts.length;
	        for (var i = 0; i < len; i++) {
	            contexts[i].buffer.push(value);
	        }
	    };
	    BufferToggleSubscriber.prototype._error = function (err) {
	        var contexts = this.contexts;
	        while (contexts.length > 0) {
	            var context_1 = contexts.shift();
	            context_1.subscription.unsubscribe();
	            context_1.buffer = null;
	            context_1.subscription = null;
	        }
	        this.contexts = null;
	        _super.prototype._error.call(this, err);
	    };
	    BufferToggleSubscriber.prototype._complete = function () {
	        var contexts = this.contexts;
	        while (contexts.length > 0) {
	            var context_2 = contexts.shift();
	            this.destination.next(context_2.buffer);
	            context_2.subscription.unsubscribe();
	            context_2.buffer = null;
	            context_2.subscription = null;
	        }
	        this.contexts = null;
	        _super.prototype._complete.call(this);
	    };
	    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
	    };
	    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.closeBuffer(innerSub.context);
	    };
	    BufferToggleSubscriber.prototype.openBuffer = function (value) {
	        try {
	            var closingSelector = this.closingSelector;
	            var closingNotifier = closingSelector.call(this, value);
	            if (closingNotifier) {
	                this.trySubscribe(closingNotifier);
	            }
	        }
	        catch (err) {
	            this._error(err);
	        }
	    };
	    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
	        var contexts = this.contexts;
	        if (contexts && context) {
	            var buffer = context.buffer, subscription = context.subscription;
	            this.destination.next(buffer);
	            contexts.splice(contexts.indexOf(context), 1);
	            this.remove(subscription);
	            subscription.unsubscribe();
	        }
	    };
	    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
	        var contexts = this.contexts;
	        var buffer = [];
	        var subscription = new Subscription_1.Subscription();
	        var context = { buffer: buffer, subscription: subscription };
	        contexts.push(context);
	        var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
	        if (!innerSubscription || innerSubscription.closed) {
	            this.closeBuffer(context);
	        }
	        else {
	            innerSubscription.context = context;
	            this.add(innerSubscription);
	            subscription.add(innerSubscription);
	        }
	    };
	    return BufferToggleSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=bufferToggle.js.map

/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscription_1 = __webpack_require__(5);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function bufferWhen(closingSelector) {
	    return function (source) {
	        return source.lift(new BufferWhenOperator(closingSelector));
	    };
	}
	exports.bufferWhen = bufferWhen;
	var BufferWhenOperator = (function () {
	    function BufferWhenOperator(closingSelector) {
	        this.closingSelector = closingSelector;
	    }
	    BufferWhenOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
	    };
	    return BufferWhenOperator;
	}());
	var BufferWhenSubscriber = (function (_super) {
	    __extends(BufferWhenSubscriber, _super);
	    function BufferWhenSubscriber(destination, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.closingSelector = closingSelector;
	        _this.subscribing = false;
	        _this.openBuffer();
	        return _this;
	    }
	    BufferWhenSubscriber.prototype._next = function (value) {
	        this.buffer.push(value);
	    };
	    BufferWhenSubscriber.prototype._complete = function () {
	        var buffer = this.buffer;
	        if (buffer) {
	            this.destination.next(buffer);
	        }
	        _super.prototype._complete.call(this);
	    };
	    BufferWhenSubscriber.prototype._unsubscribe = function () {
	        this.buffer = null;
	        this.subscribing = false;
	    };
	    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.openBuffer();
	    };
	    BufferWhenSubscriber.prototype.notifyComplete = function () {
	        if (this.subscribing) {
	            this.complete();
	        }
	        else {
	            this.openBuffer();
	        }
	    };
	    BufferWhenSubscriber.prototype.openBuffer = function () {
	        var closingSubscription = this.closingSubscription;
	        if (closingSubscription) {
	            this.remove(closingSubscription);
	            closingSubscription.unsubscribe();
	        }
	        var buffer = this.buffer;
	        if (this.buffer) {
	            this.destination.next(buffer);
	        }
	        this.buffer = [];
	        var closingNotifier;
	        try {
	            var closingSelector = this.closingSelector;
	            closingNotifier = closingSelector();
	        }
	        catch (err) {
	            return this.error(err);
	        }
	        closingSubscription = new Subscription_1.Subscription();
	        this.closingSubscription = closingSubscription;
	        this.add(closingSubscription);
	        this.subscribing = true;
	        closingSubscription.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
	        this.subscribing = false;
	    };
	    return BufferWhenSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=bufferWhen.js.map

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	var subscribeToResult_1 = __webpack_require__(4);
	function catchError(selector) {
	    return function catchErrorOperatorFunction(source) {
	        var operator = new CatchOperator(selector);
	        var caught = source.lift(operator);
	        return (operator.caught = caught);
	    };
	}
	exports.catchError = catchError;
	var CatchOperator = (function () {
	    function CatchOperator(selector) {
	        this.selector = selector;
	    }
	    CatchOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
	    };
	    return CatchOperator;
	}());
	var CatchSubscriber = (function (_super) {
	    __extends(CatchSubscriber, _super);
	    function CatchSubscriber(destination, selector, caught) {
	        var _this = _super.call(this, destination) || this;
	        _this.selector = selector;
	        _this.caught = caught;
	        return _this;
	    }
	    CatchSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var result = void 0;
	            try {
	                result = this.selector(err, this.caught);
	            }
	            catch (err2) {
	                _super.prototype.error.call(this, err2);
	                return;
	            }
	            this._unsubscribeAndRecycle();
	            var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
	            this.add(innerSubscriber);
	            subscribeToResult_1.subscribeToResult(this, result, undefined, undefined, innerSubscriber);
	        }
	    };
	    return CatchSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=catchError.js.map

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var combineLatest_1 = __webpack_require__(85);
	function combineAll(project) {
	    return function (source) { return source.lift(new combineLatest_1.CombineLatestOperator(project)); };
	}
	exports.combineAll = combineAll;
	//# sourceMappingURL=combineAll.js.map

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isArray_1 = __webpack_require__(8);
	var combineLatest_1 = __webpack_require__(85);
	var from_1 = __webpack_require__(15);
	var none = {};
	function combineLatest() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    var project = null;
	    if (typeof observables[observables.length - 1] === 'function') {
	        project = observables.pop();
	    }
	    if (observables.length === 1 && isArray_1.isArray(observables[0])) {
	        observables = observables[0].slice();
	    }
	    return function (source) { return source.lift.call(from_1.from([source].concat(observables)), new combineLatest_1.CombineLatestOperator(project)); };
	}
	exports.combineLatest = combineLatest;
	//# sourceMappingURL=combineLatest.js.map

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var concat_1 = __webpack_require__(60);
	function concat() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    return function (source) { return source.lift.call(concat_1.concat.apply(void 0, [source].concat(observables))); };
	}
	exports.concat = concat;
	//# sourceMappingURL=concat.js.map

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var concatMap_1 = __webpack_require__(148);
	function concatMapTo(innerObservable, resultSelector) {
	    return concatMap_1.concatMap(function () { return innerObservable; }, resultSelector);
	}
	exports.concatMapTo = concatMapTo;
	//# sourceMappingURL=concatMapTo.js.map

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function count(predicate) {
	    return function (source) { return source.lift(new CountOperator(predicate, source)); };
	}
	exports.count = count;
	var CountOperator = (function () {
	    function CountOperator(predicate, source) {
	        this.predicate = predicate;
	        this.source = source;
	    }
	    CountOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
	    };
	    return CountOperator;
	}());
	var CountSubscriber = (function (_super) {
	    __extends(CountSubscriber, _super);
	    function CountSubscriber(destination, predicate, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.source = source;
	        _this.count = 0;
	        _this.index = 0;
	        return _this;
	    }
	    CountSubscriber.prototype._next = function (value) {
	        if (this.predicate) {
	            this._tryPredicate(value);
	        }
	        else {
	            this.count++;
	        }
	    };
	    CountSubscriber.prototype._tryPredicate = function (value) {
	        var result;
	        try {
	            result = this.predicate(value, this.index++, this.source);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (result) {
	            this.count++;
	        }
	    };
	    CountSubscriber.prototype._complete = function () {
	        this.destination.next(this.count);
	        this.destination.complete();
	    };
	    return CountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=count.js.map

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function debounce(durationSelector) {
	    return function (source) { return source.lift(new DebounceOperator(durationSelector)); };
	}
	exports.debounce = debounce;
	var DebounceOperator = (function () {
	    function DebounceOperator(durationSelector) {
	        this.durationSelector = durationSelector;
	    }
	    DebounceOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
	    };
	    return DebounceOperator;
	}());
	var DebounceSubscriber = (function (_super) {
	    __extends(DebounceSubscriber, _super);
	    function DebounceSubscriber(destination, durationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.durationSelector = durationSelector;
	        _this.hasValue = false;
	        _this.durationSubscription = null;
	        return _this;
	    }
	    DebounceSubscriber.prototype._next = function (value) {
	        try {
	            var result = this.durationSelector.call(this, value);
	            if (result) {
	                this._tryNext(value, result);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    DebounceSubscriber.prototype._complete = function () {
	        this.emitValue();
	        this.destination.complete();
	    };
	    DebounceSubscriber.prototype._tryNext = function (value, duration) {
	        var subscription = this.durationSubscription;
	        this.value = value;
	        this.hasValue = true;
	        if (subscription) {
	            subscription.unsubscribe();
	            this.remove(subscription);
	        }
	        subscription = subscribeToResult_1.subscribeToResult(this, duration);
	        if (subscription && !subscription.closed) {
	            this.add(this.durationSubscription = subscription);
	        }
	    };
	    DebounceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.emitValue();
	    };
	    DebounceSubscriber.prototype.notifyComplete = function () {
	        this.emitValue();
	    };
	    DebounceSubscriber.prototype.emitValue = function () {
	        if (this.hasValue) {
	            var value = this.value;
	            var subscription = this.durationSubscription;
	            if (subscription) {
	                this.durationSubscription = null;
	                subscription.unsubscribe();
	                this.remove(subscription);
	            }
	            this.value = null;
	            this.hasValue = false;
	            _super.prototype._next.call(this, value);
	        }
	    };
	    return DebounceSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=debounce.js.map

/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var async_1 = __webpack_require__(7);
	function debounceTime(dueTime, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
	}
	exports.debounceTime = debounceTime;
	var DebounceTimeOperator = (function () {
	    function DebounceTimeOperator(dueTime, scheduler) {
	        this.dueTime = dueTime;
	        this.scheduler = scheduler;
	    }
	    DebounceTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
	    };
	    return DebounceTimeOperator;
	}());
	var DebounceTimeSubscriber = (function (_super) {
	    __extends(DebounceTimeSubscriber, _super);
	    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.dueTime = dueTime;
	        _this.scheduler = scheduler;
	        _this.debouncedSubscription = null;
	        _this.lastValue = null;
	        _this.hasValue = false;
	        return _this;
	    }
	    DebounceTimeSubscriber.prototype._next = function (value) {
	        this.clearDebounce();
	        this.lastValue = value;
	        this.hasValue = true;
	        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
	    };
	    DebounceTimeSubscriber.prototype._complete = function () {
	        this.debouncedNext();
	        this.destination.complete();
	    };
	    DebounceTimeSubscriber.prototype.debouncedNext = function () {
	        this.clearDebounce();
	        if (this.hasValue) {
	            var lastValue = this.lastValue;
	            this.lastValue = null;
	            this.hasValue = false;
	            this.destination.next(lastValue);
	        }
	    };
	    DebounceTimeSubscriber.prototype.clearDebounce = function () {
	        var debouncedSubscription = this.debouncedSubscription;
	        if (debouncedSubscription !== null) {
	            this.remove(debouncedSubscription);
	            debouncedSubscription.unsubscribe();
	            this.debouncedSubscription = null;
	        }
	    };
	    return DebounceTimeSubscriber;
	}(Subscriber_1.Subscriber));
	function dispatchNext(subscriber) {
	    subscriber.debouncedNext();
	}
	//# sourceMappingURL=debounceTime.js.map

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var isDate_1 = __webpack_require__(161);
	var Subscriber_1 = __webpack_require__(1);
	var Notification_1 = __webpack_require__(58);
	function delay(delay, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    var absoluteDelay = isDate_1.isDate(delay);
	    var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
	    return function (source) { return source.lift(new DelayOperator(delayFor, scheduler)); };
	}
	exports.delay = delay;
	var DelayOperator = (function () {
	    function DelayOperator(delay, scheduler) {
	        this.delay = delay;
	        this.scheduler = scheduler;
	    }
	    DelayOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
	    };
	    return DelayOperator;
	}());
	var DelaySubscriber = (function (_super) {
	    __extends(DelaySubscriber, _super);
	    function DelaySubscriber(destination, delay, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.delay = delay;
	        _this.scheduler = scheduler;
	        _this.queue = [];
	        _this.active = false;
	        _this.errored = false;
	        return _this;
	    }
	    DelaySubscriber.dispatch = function (state) {
	        var source = state.source;
	        var queue = source.queue;
	        var scheduler = state.scheduler;
	        var destination = state.destination;
	        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
	            queue.shift().notification.observe(destination);
	        }
	        if (queue.length > 0) {
	            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
	            this.schedule(state, delay_1);
	        }
	        else {
	            this.unsubscribe();
	            source.active = false;
	        }
	    };
	    DelaySubscriber.prototype._schedule = function (scheduler) {
	        this.active = true;
	        var destination = this.destination;
	        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
	            source: this, destination: this.destination, scheduler: scheduler
	        }));
	    };
	    DelaySubscriber.prototype.scheduleNotification = function (notification) {
	        if (this.errored === true) {
	            return;
	        }
	        var scheduler = this.scheduler;
	        var message = new DelayMessage(scheduler.now() + this.delay, notification);
	        this.queue.push(message);
	        if (this.active === false) {
	            this._schedule(scheduler);
	        }
	    };
	    DelaySubscriber.prototype._next = function (value) {
	        this.scheduleNotification(Notification_1.Notification.createNext(value));
	    };
	    DelaySubscriber.prototype._error = function (err) {
	        this.errored = true;
	        this.queue = [];
	        this.destination.error(err);
	        this.unsubscribe();
	    };
	    DelaySubscriber.prototype._complete = function () {
	        this.scheduleNotification(Notification_1.Notification.createComplete());
	        this.unsubscribe();
	    };
	    return DelaySubscriber;
	}(Subscriber_1.Subscriber));
	var DelayMessage = (function () {
	    function DelayMessage(time, notification) {
	        this.time = time;
	        this.notification = notification;
	    }
	    return DelayMessage;
	}());
	//# sourceMappingURL=delay.js.map

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var Observable_1 = __webpack_require__(2);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function delayWhen(delayDurationSelector, subscriptionDelay) {
	    if (subscriptionDelay) {
	        return function (source) {
	            return new SubscriptionDelayObservable(source, subscriptionDelay)
	                .lift(new DelayWhenOperator(delayDurationSelector));
	        };
	    }
	    return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
	}
	exports.delayWhen = delayWhen;
	var DelayWhenOperator = (function () {
	    function DelayWhenOperator(delayDurationSelector) {
	        this.delayDurationSelector = delayDurationSelector;
	    }
	    DelayWhenOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
	    };
	    return DelayWhenOperator;
	}());
	var DelayWhenSubscriber = (function (_super) {
	    __extends(DelayWhenSubscriber, _super);
	    function DelayWhenSubscriber(destination, delayDurationSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.delayDurationSelector = delayDurationSelector;
	        _this.completed = false;
	        _this.delayNotifierSubscriptions = [];
	        _this.index = 0;
	        return _this;
	    }
	    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(outerValue);
	        this.removeSubscription(innerSub);
	        this.tryComplete();
	    };
	    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
	        var value = this.removeSubscription(innerSub);
	        if (value) {
	            this.destination.next(value);
	        }
	        this.tryComplete();
	    };
	    DelayWhenSubscriber.prototype._next = function (value) {
	        var index = this.index++;
	        try {
	            var delayNotifier = this.delayDurationSelector(value, index);
	            if (delayNotifier) {
	                this.tryDelay(delayNotifier, value);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    DelayWhenSubscriber.prototype._complete = function () {
	        this.completed = true;
	        this.tryComplete();
	        this.unsubscribe();
	    };
	    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
	        subscription.unsubscribe();
	        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
	        if (subscriptionIdx !== -1) {
	            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
	        }
	        return subscription.outerValue;
	    };
	    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
	        var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
	        if (notifierSubscription && !notifierSubscription.closed) {
	            var destination = this.destination;
	            destination.add(notifierSubscription);
	            this.delayNotifierSubscriptions.push(notifierSubscription);
	        }
	    };
	    DelayWhenSubscriber.prototype.tryComplete = function () {
	        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
	            this.destination.complete();
	        }
	    };
	    return DelayWhenSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	var SubscriptionDelayObservable = (function (_super) {
	    __extends(SubscriptionDelayObservable, _super);
	    function SubscriptionDelayObservable(source, subscriptionDelay) {
	        var _this = _super.call(this) || this;
	        _this.source = source;
	        _this.subscriptionDelay = subscriptionDelay;
	        return _this;
	    }
	    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
	        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
	    };
	    return SubscriptionDelayObservable;
	}(Observable_1.Observable));
	var SubscriptionDelaySubscriber = (function (_super) {
	    __extends(SubscriptionDelaySubscriber, _super);
	    function SubscriptionDelaySubscriber(parent, source) {
	        var _this = _super.call(this) || this;
	        _this.parent = parent;
	        _this.source = source;
	        _this.sourceSubscribed = false;
	        return _this;
	    }
	    SubscriptionDelaySubscriber.prototype._next = function (unused) {
	        this.subscribeToSource();
	    };
	    SubscriptionDelaySubscriber.prototype._error = function (err) {
	        this.unsubscribe();
	        this.parent.error(err);
	    };
	    SubscriptionDelaySubscriber.prototype._complete = function () {
	        this.unsubscribe();
	        this.subscribeToSource();
	    };
	    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
	        if (!this.sourceSubscribed) {
	            this.sourceSubscribed = true;
	            this.unsubscribe();
	            this.source.subscribe(this.parent);
	        }
	    };
	    return SubscriptionDelaySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=delayWhen.js.map

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function dematerialize() {
	    return function dematerializeOperatorFunction(source) {
	        return source.lift(new DeMaterializeOperator());
	    };
	}
	exports.dematerialize = dematerialize;
	var DeMaterializeOperator = (function () {
	    function DeMaterializeOperator() {
	    }
	    DeMaterializeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DeMaterializeSubscriber(subscriber));
	    };
	    return DeMaterializeOperator;
	}());
	var DeMaterializeSubscriber = (function (_super) {
	    __extends(DeMaterializeSubscriber, _super);
	    function DeMaterializeSubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    DeMaterializeSubscriber.prototype._next = function (value) {
	        value.observe(this.destination);
	    };
	    return DeMaterializeSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=dematerialize.js.map

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function distinct(keySelector, flushes) {
	    return function (source) { return source.lift(new DistinctOperator(keySelector, flushes)); };
	}
	exports.distinct = distinct;
	var DistinctOperator = (function () {
	    function DistinctOperator(keySelector, flushes) {
	        this.keySelector = keySelector;
	        this.flushes = flushes;
	    }
	    DistinctOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
	    };
	    return DistinctOperator;
	}());
	var DistinctSubscriber = (function (_super) {
	    __extends(DistinctSubscriber, _super);
	    function DistinctSubscriber(destination, keySelector, flushes) {
	        var _this = _super.call(this, destination) || this;
	        _this.keySelector = keySelector;
	        _this.values = new Set();
	        if (flushes) {
	            _this.add(subscribeToResult_1.subscribeToResult(_this, flushes));
	        }
	        return _this;
	    }
	    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.values.clear();
	    };
	    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    DistinctSubscriber.prototype._next = function (value) {
	        if (this.keySelector) {
	            this._useKeySelector(value);
	        }
	        else {
	            this._finalizeNext(value, value);
	        }
	    };
	    DistinctSubscriber.prototype._useKeySelector = function (value) {
	        var key;
	        var destination = this.destination;
	        try {
	            key = this.keySelector(value);
	        }
	        catch (err) {
	            destination.error(err);
	            return;
	        }
	        this._finalizeNext(key, value);
	    };
	    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
	        var values = this.values;
	        if (!values.has(key)) {
	            values.add(key);
	            this.destination.next(value);
	        }
	    };
	    return DistinctSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.DistinctSubscriber = DistinctSubscriber;
	//# sourceMappingURL=distinct.js.map

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var distinctUntilChanged_1 = __webpack_require__(149);
	function distinctUntilKeyChanged(key, compare) {
	    return distinctUntilChanged_1.distinctUntilChanged(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
	}
	exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
	//# sourceMappingURL=distinctUntilKeyChanged.js.map

/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ArgumentOutOfRangeError_1 = __webpack_require__(43);
	var filter_1 = __webpack_require__(28);
	var throwIfEmpty_1 = __webpack_require__(63);
	var defaultIfEmpty_1 = __webpack_require__(38);
	var take_1 = __webpack_require__(93);
	function elementAt(index, defaultValue) {
	    if (index < 0) {
	        throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
	    }
	    var hasDefaultValue = arguments.length >= 2;
	    return function (source) { return source.pipe(filter_1.filter(function (v, i) { return i === index; }), take_1.take(1), hasDefaultValue
	        ? defaultIfEmpty_1.defaultIfEmpty(defaultValue)
	        : throwIfEmpty_1.throwIfEmpty(function () { return new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError(); })); };
	}
	exports.elementAt = elementAt;
	//# sourceMappingURL=elementAt.js.map

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var concat_1 = __webpack_require__(60);
	var of_1 = __webpack_require__(61);
	function endWith() {
	    var array = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        array[_i] = arguments[_i];
	    }
	    return function (source) { return concat_1.concat(source, of_1.of.apply(void 0, array)); };
	}
	exports.endWith = endWith;
	//# sourceMappingURL=endWith.js.map

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function every(predicate, thisArg) {
	    return function (source) { return source.lift(new EveryOperator(predicate, thisArg, source)); };
	}
	exports.every = every;
	var EveryOperator = (function () {
	    function EveryOperator(predicate, thisArg, source) {
	        this.predicate = predicate;
	        this.thisArg = thisArg;
	        this.source = source;
	    }
	    EveryOperator.prototype.call = function (observer, source) {
	        return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
	    };
	    return EveryOperator;
	}());
	var EverySubscriber = (function (_super) {
	    __extends(EverySubscriber, _super);
	    function EverySubscriber(destination, predicate, thisArg, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.thisArg = thisArg;
	        _this.source = source;
	        _this.index = 0;
	        _this.thisArg = thisArg || _this;
	        return _this;
	    }
	    EverySubscriber.prototype.notifyComplete = function (everyValueMatch) {
	        this.destination.next(everyValueMatch);
	        this.destination.complete();
	    };
	    EverySubscriber.prototype._next = function (value) {
	        var result = false;
	        try {
	            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        if (!result) {
	            this.notifyComplete(false);
	        }
	    };
	    EverySubscriber.prototype._complete = function () {
	        this.notifyComplete(true);
	    };
	    return EverySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=every.js.map

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function exhaust() {
	    return function (source) { return source.lift(new SwitchFirstOperator()); };
	}
	exports.exhaust = exhaust;
	var SwitchFirstOperator = (function () {
	    function SwitchFirstOperator() {
	    }
	    SwitchFirstOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SwitchFirstSubscriber(subscriber));
	    };
	    return SwitchFirstOperator;
	}());
	var SwitchFirstSubscriber = (function (_super) {
	    __extends(SwitchFirstSubscriber, _super);
	    function SwitchFirstSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasCompleted = false;
	        _this.hasSubscription = false;
	        return _this;
	    }
	    SwitchFirstSubscriber.prototype._next = function (value) {
	        if (!this.hasSubscription) {
	            this.hasSubscription = true;
	            this.add(subscribeToResult_1.subscribeToResult(this, value));
	        }
	    };
	    SwitchFirstSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (!this.hasSubscription) {
	            this.destination.complete();
	        }
	    };
	    SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.remove(innerSub);
	        this.hasSubscription = false;
	        if (this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return SwitchFirstSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=exhaust.js.map

/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	var subscribeToResult_1 = __webpack_require__(4);
	var map_1 = __webpack_require__(10);
	var from_1 = __webpack_require__(15);
	function exhaustMap(project, resultSelector) {
	    if (resultSelector) {
	        return function (source) { return source.pipe(exhaustMap(function (a, i) { return from_1.from(project(a, i)).pipe(map_1.map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
	    }
	    return function (source) {
	        return source.lift(new ExhaustMapOperator(project));
	    };
	}
	exports.exhaustMap = exhaustMap;
	var ExhaustMapOperator = (function () {
	    function ExhaustMapOperator(project) {
	        this.project = project;
	    }
	    ExhaustMapOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
	    };
	    return ExhaustMapOperator;
	}());
	var ExhaustMapSubscriber = (function (_super) {
	    __extends(ExhaustMapSubscriber, _super);
	    function ExhaustMapSubscriber(destination, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.hasSubscription = false;
	        _this.hasCompleted = false;
	        _this.index = 0;
	        return _this;
	    }
	    ExhaustMapSubscriber.prototype._next = function (value) {
	        if (!this.hasSubscription) {
	            this.tryNext(value);
	        }
	    };
	    ExhaustMapSubscriber.prototype.tryNext = function (value) {
	        var result;
	        var index = this.index++;
	        try {
	            result = this.project(value, index);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.hasSubscription = true;
	        this._innerSub(result, value, index);
	    };
	    ExhaustMapSubscriber.prototype._innerSub = function (result, value, index) {
	        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        subscribeToResult_1.subscribeToResult(this, result, value, index, innerSubscriber);
	    };
	    ExhaustMapSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (!this.hasSubscription) {
	            this.destination.complete();
	        }
	        this.unsubscribe();
	    };
	    ExhaustMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.destination.next(innerValue);
	    };
	    ExhaustMapSubscriber.prototype.notifyError = function (err) {
	        this.destination.error(err);
	    };
	    ExhaustMapSubscriber.prototype.notifyComplete = function (innerSub) {
	        var destination = this.destination;
	        destination.remove(innerSub);
	        this.hasSubscription = false;
	        if (this.hasCompleted) {
	            this.destination.complete();
	        }
	    };
	    return ExhaustMapSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=exhaustMap.js.map

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function expand(project, concurrent, scheduler) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    if (scheduler === void 0) { scheduler = undefined; }
	    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
	    return function (source) { return source.lift(new ExpandOperator(project, concurrent, scheduler)); };
	}
	exports.expand = expand;
	var ExpandOperator = (function () {
	    function ExpandOperator(project, concurrent, scheduler) {
	        this.project = project;
	        this.concurrent = concurrent;
	        this.scheduler = scheduler;
	    }
	    ExpandOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
	    };
	    return ExpandOperator;
	}());
	exports.ExpandOperator = ExpandOperator;
	var ExpandSubscriber = (function (_super) {
	    __extends(ExpandSubscriber, _super);
	    function ExpandSubscriber(destination, project, concurrent, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.project = project;
	        _this.concurrent = concurrent;
	        _this.scheduler = scheduler;
	        _this.index = 0;
	        _this.active = 0;
	        _this.hasCompleted = false;
	        if (concurrent < Number.POSITIVE_INFINITY) {
	            _this.buffer = [];
	        }
	        return _this;
	    }
	    ExpandSubscriber.dispatch = function (arg) {
	        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
	        subscriber.subscribeToProjection(result, value, index);
	    };
	    ExpandSubscriber.prototype._next = function (value) {
	        var destination = this.destination;
	        if (destination.closed) {
	            this._complete();
	            return;
	        }
	        var index = this.index++;
	        if (this.active < this.concurrent) {
	            destination.next(value);
	            try {
	                var project = this.project;
	                var result = project(value, index);
	                if (!this.scheduler) {
	                    this.subscribeToProjection(result, value, index);
	                }
	                else {
	                    var state = { subscriber: this, result: result, value: value, index: index };
	                    var destination_1 = this.destination;
	                    destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
	                }
	            }
	            catch (e) {
	                destination.error(e);
	            }
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
	        this.active++;
	        var destination = this.destination;
	        destination.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
	    };
	    ExpandSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.hasCompleted && this.active === 0) {
	            this.destination.complete();
	        }
	        this.unsubscribe();
	    };
	    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this._next(innerValue);
	    };
	    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        var destination = this.destination;
	        destination.remove(innerSub);
	        this.active--;
	        if (buffer && buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        if (this.hasCompleted && this.active === 0) {
	            this.destination.complete();
	        }
	    };
	    return ExpandSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.ExpandSubscriber = ExpandSubscriber;
	//# sourceMappingURL=expand.js.map

/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var Subscription_1 = __webpack_require__(5);
	function finalize(callback) {
	    return function (source) { return source.lift(new FinallyOperator(callback)); };
	}
	exports.finalize = finalize;
	var FinallyOperator = (function () {
	    function FinallyOperator(callback) {
	        this.callback = callback;
	    }
	    FinallyOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new FinallySubscriber(subscriber, this.callback));
	    };
	    return FinallyOperator;
	}());
	var FinallySubscriber = (function (_super) {
	    __extends(FinallySubscriber, _super);
	    function FinallySubscriber(destination, callback) {
	        var _this = _super.call(this, destination) || this;
	        _this.add(new Subscription_1.Subscription(callback));
	        return _this;
	    }
	    return FinallySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=finalize.js.map

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var find_1 = __webpack_require__(150);
	function findIndex(predicate, thisArg) {
	    return function (source) { return source.lift(new find_1.FindValueOperator(predicate, source, true, thisArg)); };
	}
	exports.findIndex = findIndex;
	//# sourceMappingURL=findIndex.js.map

/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var EmptyError_1 = __webpack_require__(44);
	var filter_1 = __webpack_require__(28);
	var take_1 = __webpack_require__(93);
	var defaultIfEmpty_1 = __webpack_require__(38);
	var throwIfEmpty_1 = __webpack_require__(63);
	var identity_1 = __webpack_require__(31);
	function first(predicate, defaultValue) {
	    var hasDefaultValue = arguments.length >= 2;
	    return function (source) { return source.pipe(predicate ? filter_1.filter(function (v, i) { return predicate(v, i, source); }) : identity_1.identity, take_1.take(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function () { return new EmptyError_1.EmptyError(); })); };
	}
	exports.first = first;
	//# sourceMappingURL=first.js.map

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function ignoreElements() {
	    return function ignoreElementsOperatorFunction(source) {
	        return source.lift(new IgnoreElementsOperator());
	    };
	}
	exports.ignoreElements = ignoreElements;
	var IgnoreElementsOperator = (function () {
	    function IgnoreElementsOperator() {
	    }
	    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
	    };
	    return IgnoreElementsOperator;
	}());
	var IgnoreElementsSubscriber = (function (_super) {
	    __extends(IgnoreElementsSubscriber, _super);
	    function IgnoreElementsSubscriber() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    IgnoreElementsSubscriber.prototype._next = function (unused) {
	    };
	    return IgnoreElementsSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=ignoreElements.js.map

/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function isEmpty() {
	    return function (source) { return source.lift(new IsEmptyOperator()); };
	}
	exports.isEmpty = isEmpty;
	var IsEmptyOperator = (function () {
	    function IsEmptyOperator() {
	    }
	    IsEmptyOperator.prototype.call = function (observer, source) {
	        return source.subscribe(new IsEmptySubscriber(observer));
	    };
	    return IsEmptyOperator;
	}());
	var IsEmptySubscriber = (function (_super) {
	    __extends(IsEmptySubscriber, _super);
	    function IsEmptySubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    IsEmptySubscriber.prototype.notifyComplete = function (isEmpty) {
	        var destination = this.destination;
	        destination.next(isEmpty);
	        destination.complete();
	    };
	    IsEmptySubscriber.prototype._next = function (value) {
	        this.notifyComplete(false);
	    };
	    IsEmptySubscriber.prototype._complete = function () {
	        this.notifyComplete(true);
	    };
	    return IsEmptySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=isEmpty.js.map

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var EmptyError_1 = __webpack_require__(44);
	var filter_1 = __webpack_require__(28);
	var takeLast_1 = __webpack_require__(94);
	var throwIfEmpty_1 = __webpack_require__(63);
	var defaultIfEmpty_1 = __webpack_require__(38);
	var identity_1 = __webpack_require__(31);
	function last(predicate, defaultValue) {
	    var hasDefaultValue = arguments.length >= 2;
	    return function (source) { return source.pipe(predicate ? filter_1.filter(function (v, i) { return predicate(v, i, source); }) : identity_1.identity, takeLast_1.takeLast(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function () { return new EmptyError_1.EmptyError(); })); };
	}
	exports.last = last;
	//# sourceMappingURL=last.js.map

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function mapTo(value) {
	    return function (source) { return source.lift(new MapToOperator(value)); };
	}
	exports.mapTo = mapTo;
	var MapToOperator = (function () {
	    function MapToOperator(value) {
	        this.value = value;
	    }
	    MapToOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MapToSubscriber(subscriber, this.value));
	    };
	    return MapToOperator;
	}());
	var MapToSubscriber = (function (_super) {
	    __extends(MapToSubscriber, _super);
	    function MapToSubscriber(destination, value) {
	        var _this = _super.call(this, destination) || this;
	        _this.value = value;
	        return _this;
	    }
	    MapToSubscriber.prototype._next = function (x) {
	        this.destination.next(this.value);
	    };
	    return MapToSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=mapTo.js.map

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var Notification_1 = __webpack_require__(58);
	function materialize() {
	    return function materializeOperatorFunction(source) {
	        return source.lift(new MaterializeOperator());
	    };
	}
	exports.materialize = materialize;
	var MaterializeOperator = (function () {
	    function MaterializeOperator() {
	    }
	    MaterializeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MaterializeSubscriber(subscriber));
	    };
	    return MaterializeOperator;
	}());
	var MaterializeSubscriber = (function (_super) {
	    __extends(MaterializeSubscriber, _super);
	    function MaterializeSubscriber(destination) {
	        return _super.call(this, destination) || this;
	    }
	    MaterializeSubscriber.prototype._next = function (value) {
	        this.destination.next(Notification_1.Notification.createNext(value));
	    };
	    MaterializeSubscriber.prototype._error = function (err) {
	        var destination = this.destination;
	        destination.next(Notification_1.Notification.createError(err));
	        destination.complete();
	    };
	    MaterializeSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        destination.next(Notification_1.Notification.createComplete());
	        destination.complete();
	    };
	    return MaterializeSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=materialize.js.map

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var reduce_1 = __webpack_require__(62);
	function max(comparer) {
	    var max = (typeof comparer === 'function')
	        ? function (x, y) { return comparer(x, y) > 0 ? x : y; }
	        : function (x, y) { return x > y ? x : y; };
	    return reduce_1.reduce(max);
	}
	exports.max = max;
	//# sourceMappingURL=max.js.map

/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var merge_1 = __webpack_require__(142);
	function merge() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    return function (source) { return source.lift.call(merge_1.merge.apply(void 0, [source].concat(observables))); };
	}
	exports.merge = merge;
	//# sourceMappingURL=merge.js.map

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var mergeMap_1 = __webpack_require__(39);
	function mergeMapTo(innerObservable, resultSelector, concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    if (typeof resultSelector === 'function') {
	        return mergeMap_1.mergeMap(function () { return innerObservable; }, resultSelector, concurrent);
	    }
	    if (typeof resultSelector === 'number') {
	        concurrent = resultSelector;
	    }
	    return mergeMap_1.mergeMap(function () { return innerObservable; }, concurrent);
	}
	exports.mergeMapTo = mergeMapTo;
	//# sourceMappingURL=mergeMapTo.js.map

/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var subscribeToResult_1 = __webpack_require__(4);
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	function mergeScan(accumulator, seed, concurrent) {
	    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
	    return function (source) { return source.lift(new MergeScanOperator(accumulator, seed, concurrent)); };
	}
	exports.mergeScan = mergeScan;
	var MergeScanOperator = (function () {
	    function MergeScanOperator(accumulator, seed, concurrent) {
	        this.accumulator = accumulator;
	        this.seed = seed;
	        this.concurrent = concurrent;
	    }
	    MergeScanOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
	    };
	    return MergeScanOperator;
	}());
	exports.MergeScanOperator = MergeScanOperator;
	var MergeScanSubscriber = (function (_super) {
	    __extends(MergeScanSubscriber, _super);
	    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
	        var _this = _super.call(this, destination) || this;
	        _this.accumulator = accumulator;
	        _this.acc = acc;
	        _this.concurrent = concurrent;
	        _this.hasValue = false;
	        _this.hasCompleted = false;
	        _this.buffer = [];
	        _this.active = 0;
	        _this.index = 0;
	        return _this;
	    }
	    MergeScanSubscriber.prototype._next = function (value) {
	        if (this.active < this.concurrent) {
	            var index = this.index++;
	            var destination = this.destination;
	            var ish = void 0;
	            try {
	                var accumulator = this.accumulator;
	                ish = accumulator(this.acc, value, index);
	            }
	            catch (e) {
	                return destination.error(e);
	            }
	            this.active++;
	            this._innerSub(ish, value, index);
	        }
	        else {
	            this.buffer.push(value);
	        }
	    };
	    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
	        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
	        var destination = this.destination;
	        destination.add(innerSubscriber);
	        subscribeToResult_1.subscribeToResult(this, ish, value, index, innerSubscriber);
	    };
	    MergeScanSubscriber.prototype._complete = function () {
	        this.hasCompleted = true;
	        if (this.active === 0 && this.buffer.length === 0) {
	            if (this.hasValue === false) {
	                this.destination.next(this.acc);
	            }
	            this.destination.complete();
	        }
	        this.unsubscribe();
	    };
	    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var destination = this.destination;
	        this.acc = innerValue;
	        this.hasValue = true;
	        destination.next(innerValue);
	    };
	    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
	        var buffer = this.buffer;
	        var destination = this.destination;
	        destination.remove(innerSub);
	        this.active--;
	        if (buffer.length > 0) {
	            this._next(buffer.shift());
	        }
	        else if (this.active === 0 && this.hasCompleted) {
	            if (this.hasValue === false) {
	                this.destination.next(this.acc);
	            }
	            this.destination.complete();
	        }
	    };
	    return MergeScanSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	exports.MergeScanSubscriber = MergeScanSubscriber;
	//# sourceMappingURL=mergeScan.js.map

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var reduce_1 = __webpack_require__(62);
	function min(comparer) {
	    var min = (typeof comparer === 'function')
	        ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
	        : function (x, y) { return x < y ? x : y; };
	    return reduce_1.reduce(min);
	}
	exports.min = min;
	//# sourceMappingURL=min.js.map

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var from_1 = __webpack_require__(15);
	var isArray_1 = __webpack_require__(8);
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	var subscribeToResult_1 = __webpack_require__(4);
	function onErrorResumeNext() {
	    var nextSources = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        nextSources[_i] = arguments[_i];
	    }
	    if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
	        nextSources = nextSources[0];
	    }
	    return function (source) { return source.lift(new OnErrorResumeNextOperator(nextSources)); };
	}
	exports.onErrorResumeNext = onErrorResumeNext;
	function onErrorResumeNextStatic() {
	    var nextSources = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        nextSources[_i] = arguments[_i];
	    }
	    var source = null;
	    if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
	        nextSources = nextSources[0];
	    }
	    source = nextSources.shift();
	    return from_1.from(source, null).lift(new OnErrorResumeNextOperator(nextSources));
	}
	exports.onErrorResumeNextStatic = onErrorResumeNextStatic;
	var OnErrorResumeNextOperator = (function () {
	    function OnErrorResumeNextOperator(nextSources) {
	        this.nextSources = nextSources;
	    }
	    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
	    };
	    return OnErrorResumeNextOperator;
	}());
	var OnErrorResumeNextSubscriber = (function (_super) {
	    __extends(OnErrorResumeNextSubscriber, _super);
	    function OnErrorResumeNextSubscriber(destination, nextSources) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.nextSources = nextSources;
	        return _this;
	    }
	    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
	        this.subscribeToNextSource();
	    };
	    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.subscribeToNextSource();
	    };
	    OnErrorResumeNextSubscriber.prototype._error = function (err) {
	        this.subscribeToNextSource();
	        this.unsubscribe();
	    };
	    OnErrorResumeNextSubscriber.prototype._complete = function () {
	        this.subscribeToNextSource();
	        this.unsubscribe();
	    };
	    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
	        var next = this.nextSources.shift();
	        if (!!next) {
	            var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
	            var destination = this.destination;
	            destination.add(innerSubscriber);
	            subscribeToResult_1.subscribeToResult(this, next, undefined, undefined, innerSubscriber);
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    return OnErrorResumeNextSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=onErrorResumeNext.js.map

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function pairwise() {
	    return function (source) { return source.lift(new PairwiseOperator()); };
	}
	exports.pairwise = pairwise;
	var PairwiseOperator = (function () {
	    function PairwiseOperator() {
	    }
	    PairwiseOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new PairwiseSubscriber(subscriber));
	    };
	    return PairwiseOperator;
	}());
	var PairwiseSubscriber = (function (_super) {
	    __extends(PairwiseSubscriber, _super);
	    function PairwiseSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasPrev = false;
	        return _this;
	    }
	    PairwiseSubscriber.prototype._next = function (value) {
	        var pair;
	        if (this.hasPrev) {
	            pair = [this.prev, value];
	        }
	        else {
	            this.hasPrev = true;
	        }
	        this.prev = value;
	        if (pair) {
	            this.destination.next(pair);
	        }
	    };
	    return PairwiseSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=pairwise.js.map

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var not_1 = __webpack_require__(163);
	var filter_1 = __webpack_require__(28);
	function partition(predicate, thisArg) {
	    return function (source) { return [
	        filter_1.filter(predicate, thisArg)(source),
	        filter_1.filter(not_1.not(predicate, thisArg))(source)
	    ]; };
	}
	exports.partition = partition;
	//# sourceMappingURL=partition.js.map

/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var map_1 = __webpack_require__(10);
	function pluck() {
	    var properties = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        properties[_i] = arguments[_i];
	    }
	    var length = properties.length;
	    if (length === 0) {
	        throw new Error('list of properties cannot be empty.');
	    }
	    return function (source) { return map_1.map(plucker(properties, length))(source); };
	}
	exports.pluck = pluck;
	function plucker(props, length) {
	    var mapper = function (x) {
	        var currentProp = x;
	        for (var i = 0; i < length; i++) {
	            var p = currentProp[props[i]];
	            if (typeof p !== 'undefined') {
	                currentProp = p;
	            }
	            else {
	                return undefined;
	            }
	        }
	        return currentProp;
	    };
	    return mapper;
	}
	//# sourceMappingURL=pluck.js.map

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var multicast_1 = __webpack_require__(29);
	function publish(selector) {
	    return selector ?
	        multicast_1.multicast(function () { return new Subject_1.Subject(); }, selector) :
	        multicast_1.multicast(new Subject_1.Subject());
	}
	exports.publish = publish;
	//# sourceMappingURL=publish.js.map

/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var BehaviorSubject_1 = __webpack_require__(137);
	var multicast_1 = __webpack_require__(29);
	function publishBehavior(value) {
	    return function (source) { return multicast_1.multicast(new BehaviorSubject_1.BehaviorSubject(value))(source); };
	}
	exports.publishBehavior = publishBehavior;
	//# sourceMappingURL=publishBehavior.js.map

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncSubject_1 = __webpack_require__(57);
	var multicast_1 = __webpack_require__(29);
	function publishLast() {
	    return function (source) { return multicast_1.multicast(new AsyncSubject_1.AsyncSubject())(source); };
	}
	exports.publishLast = publishLast;
	//# sourceMappingURL=publishLast.js.map

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ReplaySubject_1 = __webpack_require__(84);
	var multicast_1 = __webpack_require__(29);
	function publishReplay(bufferSize, windowTime, selectorOrScheduler, scheduler) {
	    if (selectorOrScheduler && typeof selectorOrScheduler !== 'function') {
	        scheduler = selectorOrScheduler;
	    }
	    var selector = typeof selectorOrScheduler === 'function' ? selectorOrScheduler : undefined;
	    var subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
	    return function (source) { return multicast_1.multicast(function () { return subject; }, selector)(source); };
	}
	exports.publishReplay = publishReplay;
	//# sourceMappingURL=publishReplay.js.map

/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var isArray_1 = __webpack_require__(8);
	var race_1 = __webpack_require__(144);
	function race() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    return function raceOperatorFunction(source) {
	        if (observables.length === 1 && isArray_1.isArray(observables[0])) {
	            observables = observables[0];
	        }
	        return source.lift.call(race_1.race.apply(void 0, [source].concat(observables)));
	    };
	}
	exports.race = race;
	//# sourceMappingURL=race.js.map

/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var empty_1 = __webpack_require__(14);
	function repeat(count) {
	    if (count === void 0) { count = -1; }
	    return function (source) {
	        if (count === 0) {
	            return empty_1.empty();
	        }
	        else if (count < 0) {
	            return source.lift(new RepeatOperator(-1, source));
	        }
	        else {
	            return source.lift(new RepeatOperator(count - 1, source));
	        }
	    };
	}
	exports.repeat = repeat;
	var RepeatOperator = (function () {
	    function RepeatOperator(count, source) {
	        this.count = count;
	        this.source = source;
	    }
	    RepeatOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
	    };
	    return RepeatOperator;
	}());
	var RepeatSubscriber = (function (_super) {
	    __extends(RepeatSubscriber, _super);
	    function RepeatSubscriber(destination, count, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.count = count;
	        _this.source = source;
	        return _this;
	    }
	    RepeatSubscriber.prototype.complete = function () {
	        if (!this.isStopped) {
	            var _a = this, source = _a.source, count = _a.count;
	            if (count === 0) {
	                return _super.prototype.complete.call(this);
	            }
	            else if (count > -1) {
	                this.count = count - 1;
	            }
	            source.subscribe(this._unsubscribeAndRecycle());
	        }
	    };
	    return RepeatSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=repeat.js.map

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function repeatWhen(notifier) {
	    return function (source) { return source.lift(new RepeatWhenOperator(notifier)); };
	}
	exports.repeatWhen = repeatWhen;
	var RepeatWhenOperator = (function () {
	    function RepeatWhenOperator(notifier) {
	        this.notifier = notifier;
	    }
	    RepeatWhenOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
	    };
	    return RepeatWhenOperator;
	}());
	var RepeatWhenSubscriber = (function (_super) {
	    __extends(RepeatWhenSubscriber, _super);
	    function RepeatWhenSubscriber(destination, notifier, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.notifier = notifier;
	        _this.source = source;
	        _this.sourceIsBeingSubscribedTo = true;
	        return _this;
	    }
	    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.sourceIsBeingSubscribedTo = true;
	        this.source.subscribe(this);
	    };
	    RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
	        if (this.sourceIsBeingSubscribedTo === false) {
	            return _super.prototype.complete.call(this);
	        }
	    };
	    RepeatWhenSubscriber.prototype.complete = function () {
	        this.sourceIsBeingSubscribedTo = false;
	        if (!this.isStopped) {
	            if (!this.retries) {
	                this.subscribeToRetries();
	            }
	            if (!this.retriesSubscription || this.retriesSubscription.closed) {
	                return _super.prototype.complete.call(this);
	            }
	            this._unsubscribeAndRecycle();
	            this.notifications.next();
	        }
	    };
	    RepeatWhenSubscriber.prototype._unsubscribe = function () {
	        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
	        if (notifications) {
	            notifications.unsubscribe();
	            this.notifications = null;
	        }
	        if (retriesSubscription) {
	            retriesSubscription.unsubscribe();
	            this.retriesSubscription = null;
	        }
	        this.retries = null;
	    };
	    RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
	        var _unsubscribe = this._unsubscribe;
	        this._unsubscribe = null;
	        _super.prototype._unsubscribeAndRecycle.call(this);
	        this._unsubscribe = _unsubscribe;
	        return this;
	    };
	    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
	        this.notifications = new Subject_1.Subject();
	        var retries;
	        try {
	            var notifier = this.notifier;
	            retries = notifier(this.notifications);
	        }
	        catch (e) {
	            return _super.prototype.complete.call(this);
	        }
	        this.retries = retries;
	        this.retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
	    };
	    return RepeatWhenSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=repeatWhen.js.map

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function retry(count) {
	    if (count === void 0) { count = -1; }
	    return function (source) { return source.lift(new RetryOperator(count, source)); };
	}
	exports.retry = retry;
	var RetryOperator = (function () {
	    function RetryOperator(count, source) {
	        this.count = count;
	        this.source = source;
	    }
	    RetryOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
	    };
	    return RetryOperator;
	}());
	var RetrySubscriber = (function (_super) {
	    __extends(RetrySubscriber, _super);
	    function RetrySubscriber(destination, count, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.count = count;
	        _this.source = source;
	        return _this;
	    }
	    RetrySubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var _a = this, source = _a.source, count = _a.count;
	            if (count === 0) {
	                return _super.prototype.error.call(this, err);
	            }
	            else if (count > -1) {
	                this.count = count - 1;
	            }
	            source.subscribe(this._unsubscribeAndRecycle());
	        }
	    };
	    return RetrySubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=retry.js.map

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function retryWhen(notifier) {
	    return function (source) { return source.lift(new RetryWhenOperator(notifier, source)); };
	}
	exports.retryWhen = retryWhen;
	var RetryWhenOperator = (function () {
	    function RetryWhenOperator(notifier, source) {
	        this.notifier = notifier;
	        this.source = source;
	    }
	    RetryWhenOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
	    };
	    return RetryWhenOperator;
	}());
	var RetryWhenSubscriber = (function (_super) {
	    __extends(RetryWhenSubscriber, _super);
	    function RetryWhenSubscriber(destination, notifier, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.notifier = notifier;
	        _this.source = source;
	        return _this;
	    }
	    RetryWhenSubscriber.prototype.error = function (err) {
	        if (!this.isStopped) {
	            var errors = this.errors;
	            var retries = this.retries;
	            var retriesSubscription = this.retriesSubscription;
	            if (!retries) {
	                errors = new Subject_1.Subject();
	                try {
	                    var notifier = this.notifier;
	                    retries = notifier(errors);
	                }
	                catch (e) {
	                    return _super.prototype.error.call(this, e);
	                }
	                retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
	            }
	            else {
	                this.errors = null;
	                this.retriesSubscription = null;
	            }
	            this._unsubscribeAndRecycle();
	            this.errors = errors;
	            this.retries = retries;
	            this.retriesSubscription = retriesSubscription;
	            errors.next(err);
	        }
	    };
	    RetryWhenSubscriber.prototype._unsubscribe = function () {
	        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
	        if (errors) {
	            errors.unsubscribe();
	            this.errors = null;
	        }
	        if (retriesSubscription) {
	            retriesSubscription.unsubscribe();
	            this.retriesSubscription = null;
	        }
	        this.retries = null;
	    };
	    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        var _unsubscribe = this._unsubscribe;
	        this._unsubscribe = null;
	        this._unsubscribeAndRecycle();
	        this._unsubscribe = _unsubscribe;
	        this.source.subscribe(this);
	    };
	    return RetryWhenSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=retryWhen.js.map

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function sample(notifier) {
	    return function (source) { return source.lift(new SampleOperator(notifier)); };
	}
	exports.sample = sample;
	var SampleOperator = (function () {
	    function SampleOperator(notifier) {
	        this.notifier = notifier;
	    }
	    SampleOperator.prototype.call = function (subscriber, source) {
	        var sampleSubscriber = new SampleSubscriber(subscriber);
	        var subscription = source.subscribe(sampleSubscriber);
	        subscription.add(subscribeToResult_1.subscribeToResult(sampleSubscriber, this.notifier));
	        return subscription;
	    };
	    return SampleOperator;
	}());
	var SampleSubscriber = (function (_super) {
	    __extends(SampleSubscriber, _super);
	    function SampleSubscriber() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this.hasValue = false;
	        return _this;
	    }
	    SampleSubscriber.prototype._next = function (value) {
	        this.value = value;
	        this.hasValue = true;
	    };
	    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.emitValue();
	    };
	    SampleSubscriber.prototype.notifyComplete = function () {
	        this.emitValue();
	    };
	    SampleSubscriber.prototype.emitValue = function () {
	        if (this.hasValue) {
	            this.hasValue = false;
	            this.destination.next(this.value);
	        }
	    };
	    return SampleSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=sample.js.map

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var async_1 = __webpack_require__(7);
	function sampleTime(period, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
	}
	exports.sampleTime = sampleTime;
	var SampleTimeOperator = (function () {
	    function SampleTimeOperator(period, scheduler) {
	        this.period = period;
	        this.scheduler = scheduler;
	    }
	    SampleTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
	    };
	    return SampleTimeOperator;
	}());
	var SampleTimeSubscriber = (function (_super) {
	    __extends(SampleTimeSubscriber, _super);
	    function SampleTimeSubscriber(destination, period, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.period = period;
	        _this.scheduler = scheduler;
	        _this.hasValue = false;
	        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
	        return _this;
	    }
	    SampleTimeSubscriber.prototype._next = function (value) {
	        this.lastValue = value;
	        this.hasValue = true;
	    };
	    SampleTimeSubscriber.prototype.notifyNext = function () {
	        if (this.hasValue) {
	            this.hasValue = false;
	            this.destination.next(this.lastValue);
	        }
	    };
	    return SampleTimeSubscriber;
	}(Subscriber_1.Subscriber));
	function dispatchNotification(state) {
	    var subscriber = state.subscriber, period = state.period;
	    subscriber.notifyNext();
	    this.schedule(state, period);
	}
	//# sourceMappingURL=sampleTime.js.map

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function sequenceEqual(compareTo, comparator) {
	    return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparator)); };
	}
	exports.sequenceEqual = sequenceEqual;
	var SequenceEqualOperator = (function () {
	    function SequenceEqualOperator(compareTo, comparator) {
	        this.compareTo = compareTo;
	        this.comparator = comparator;
	    }
	    SequenceEqualOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparator));
	    };
	    return SequenceEqualOperator;
	}());
	exports.SequenceEqualOperator = SequenceEqualOperator;
	var SequenceEqualSubscriber = (function (_super) {
	    __extends(SequenceEqualSubscriber, _super);
	    function SequenceEqualSubscriber(destination, compareTo, comparator) {
	        var _this = _super.call(this, destination) || this;
	        _this.compareTo = compareTo;
	        _this.comparator = comparator;
	        _this._a = [];
	        _this._b = [];
	        _this._oneComplete = false;
	        _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
	        return _this;
	    }
	    SequenceEqualSubscriber.prototype._next = function (value) {
	        if (this._oneComplete && this._b.length === 0) {
	            this.emit(false);
	        }
	        else {
	            this._a.push(value);
	            this.checkValues();
	        }
	    };
	    SequenceEqualSubscriber.prototype._complete = function () {
	        if (this._oneComplete) {
	            this.emit(this._a.length === 0 && this._b.length === 0);
	        }
	        else {
	            this._oneComplete = true;
	        }
	        this.unsubscribe();
	    };
	    SequenceEqualSubscriber.prototype.checkValues = function () {
	        var _c = this, _a = _c._a, _b = _c._b, comparator = _c.comparator;
	        while (_a.length > 0 && _b.length > 0) {
	            var a = _a.shift();
	            var b = _b.shift();
	            var areEqual = false;
	            try {
	                areEqual = comparator ? comparator(a, b) : a === b;
	            }
	            catch (e) {
	                this.destination.error(e);
	            }
	            if (!areEqual) {
	                this.emit(false);
	            }
	        }
	    };
	    SequenceEqualSubscriber.prototype.emit = function (value) {
	        var destination = this.destination;
	        destination.next(value);
	        destination.complete();
	    };
	    SequenceEqualSubscriber.prototype.nextB = function (value) {
	        if (this._oneComplete && this._a.length === 0) {
	            this.emit(false);
	        }
	        else {
	            this._b.push(value);
	            this.checkValues();
	        }
	    };
	    SequenceEqualSubscriber.prototype.completeB = function () {
	        if (this._oneComplete) {
	            this.emit(this._a.length === 0 && this._b.length === 0);
	        }
	        else {
	            this._oneComplete = true;
	        }
	    };
	    return SequenceEqualSubscriber;
	}(Subscriber_1.Subscriber));
	exports.SequenceEqualSubscriber = SequenceEqualSubscriber;
	var SequenceEqualCompareToSubscriber = (function (_super) {
	    __extends(SequenceEqualCompareToSubscriber, _super);
	    function SequenceEqualCompareToSubscriber(destination, parent) {
	        var _this = _super.call(this, destination) || this;
	        _this.parent = parent;
	        return _this;
	    }
	    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
	        this.parent.nextB(value);
	    };
	    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
	        this.parent.error(err);
	        this.unsubscribe();
	    };
	    SequenceEqualCompareToSubscriber.prototype._complete = function () {
	        this.parent.completeB();
	        this.unsubscribe();
	    };
	    return SequenceEqualCompareToSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=sequenceEqual.js.map

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var multicast_1 = __webpack_require__(29);
	var refCount_1 = __webpack_require__(90);
	var Subject_1 = __webpack_require__(6);
	function shareSubjectFactory() {
	    return new Subject_1.Subject();
	}
	function share() {
	    return function (source) { return refCount_1.refCount()(multicast_1.multicast(shareSubjectFactory)(source)); };
	}
	exports.share = share;
	//# sourceMappingURL=share.js.map

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var ReplaySubject_1 = __webpack_require__(84);
	function shareReplay(configOrBufferSize, windowTime, scheduler) {
	    var config;
	    if (configOrBufferSize && typeof configOrBufferSize === 'object') {
	        config = configOrBufferSize;
	    }
	    else {
	        config = {
	            bufferSize: configOrBufferSize,
	            windowTime: windowTime,
	            refCount: false,
	            scheduler: scheduler
	        };
	    }
	    return function (source) { return source.lift(shareReplayOperator(config)); };
	}
	exports.shareReplay = shareReplay;
	function shareReplayOperator(_a) {
	    var _b = _a.bufferSize, bufferSize = _b === void 0 ? Number.POSITIVE_INFINITY : _b, _c = _a.windowTime, windowTime = _c === void 0 ? Number.POSITIVE_INFINITY : _c, useRefCount = _a.refCount, scheduler = _a.scheduler;
	    var subject;
	    var refCount = 0;
	    var subscription;
	    var hasError = false;
	    var isComplete = false;
	    return function shareReplayOperation(source) {
	        refCount++;
	        if (!subject || hasError) {
	            hasError = false;
	            subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
	            subscription = source.subscribe({
	                next: function (value) { subject.next(value); },
	                error: function (err) {
	                    hasError = true;
	                    subject.error(err);
	                },
	                complete: function () {
	                    isComplete = true;
	                    subject.complete();
	                },
	            });
	        }
	        var innerSub = subject.subscribe(this);
	        this.add(function () {
	            refCount--;
	            innerSub.unsubscribe();
	            if (subscription && !isComplete && useRefCount && refCount === 0) {
	                subscription.unsubscribe();
	                subscription = undefined;
	                subject = undefined;
	            }
	        });
	    };
	}
	//# sourceMappingURL=shareReplay.js.map

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var EmptyError_1 = __webpack_require__(44);
	function single(predicate) {
	    return function (source) { return source.lift(new SingleOperator(predicate, source)); };
	}
	exports.single = single;
	var SingleOperator = (function () {
	    function SingleOperator(predicate, source) {
	        this.predicate = predicate;
	        this.source = source;
	    }
	    SingleOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
	    };
	    return SingleOperator;
	}());
	var SingleSubscriber = (function (_super) {
	    __extends(SingleSubscriber, _super);
	    function SingleSubscriber(destination, predicate, source) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.source = source;
	        _this.seenValue = false;
	        _this.index = 0;
	        return _this;
	    }
	    SingleSubscriber.prototype.applySingleValue = function (value) {
	        if (this.seenValue) {
	            this.destination.error('Sequence contains more than one element');
	        }
	        else {
	            this.seenValue = true;
	            this.singleValue = value;
	        }
	    };
	    SingleSubscriber.prototype._next = function (value) {
	        var index = this.index++;
	        if (this.predicate) {
	            this.tryNext(value, index);
	        }
	        else {
	            this.applySingleValue(value);
	        }
	    };
	    SingleSubscriber.prototype.tryNext = function (value, index) {
	        try {
	            if (this.predicate(value, index, this.source)) {
	                this.applySingleValue(value);
	            }
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    SingleSubscriber.prototype._complete = function () {
	        var destination = this.destination;
	        if (this.index > 0) {
	            destination.next(this.seenValue ? this.singleValue : undefined);
	            destination.complete();
	        }
	        else {
	            destination.error(new EmptyError_1.EmptyError);
	        }
	    };
	    return SingleSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=single.js.map

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function skip(count) {
	    return function (source) { return source.lift(new SkipOperator(count)); };
	}
	exports.skip = skip;
	var SkipOperator = (function () {
	    function SkipOperator(total) {
	        this.total = total;
	    }
	    SkipOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SkipSubscriber(subscriber, this.total));
	    };
	    return SkipOperator;
	}());
	var SkipSubscriber = (function (_super) {
	    __extends(SkipSubscriber, _super);
	    function SkipSubscriber(destination, total) {
	        var _this = _super.call(this, destination) || this;
	        _this.total = total;
	        _this.count = 0;
	        return _this;
	    }
	    SkipSubscriber.prototype._next = function (x) {
	        if (++this.count > this.total) {
	            this.destination.next(x);
	        }
	    };
	    return SkipSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=skip.js.map

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var ArgumentOutOfRangeError_1 = __webpack_require__(43);
	function skipLast(count) {
	    return function (source) { return source.lift(new SkipLastOperator(count)); };
	}
	exports.skipLast = skipLast;
	var SkipLastOperator = (function () {
	    function SkipLastOperator(_skipCount) {
	        this._skipCount = _skipCount;
	        if (this._skipCount < 0) {
	            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
	        }
	    }
	    SkipLastOperator.prototype.call = function (subscriber, source) {
	        if (this._skipCount === 0) {
	            return source.subscribe(new Subscriber_1.Subscriber(subscriber));
	        }
	        else {
	            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
	        }
	    };
	    return SkipLastOperator;
	}());
	var SkipLastSubscriber = (function (_super) {
	    __extends(SkipLastSubscriber, _super);
	    function SkipLastSubscriber(destination, _skipCount) {
	        var _this = _super.call(this, destination) || this;
	        _this._skipCount = _skipCount;
	        _this._count = 0;
	        _this._ring = new Array(_skipCount);
	        return _this;
	    }
	    SkipLastSubscriber.prototype._next = function (value) {
	        var skipCount = this._skipCount;
	        var count = this._count++;
	        if (count < skipCount) {
	            this._ring[count] = value;
	        }
	        else {
	            var currentIndex = count % skipCount;
	            var ring = this._ring;
	            var oldValue = ring[currentIndex];
	            ring[currentIndex] = value;
	            this.destination.next(oldValue);
	        }
	    };
	    return SkipLastSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=skipLast.js.map

/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var InnerSubscriber_1 = __webpack_require__(21);
	var subscribeToResult_1 = __webpack_require__(4);
	function skipUntil(notifier) {
	    return function (source) { return source.lift(new SkipUntilOperator(notifier)); };
	}
	exports.skipUntil = skipUntil;
	var SkipUntilOperator = (function () {
	    function SkipUntilOperator(notifier) {
	        this.notifier = notifier;
	    }
	    SkipUntilOperator.prototype.call = function (destination, source) {
	        return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
	    };
	    return SkipUntilOperator;
	}());
	var SkipUntilSubscriber = (function (_super) {
	    __extends(SkipUntilSubscriber, _super);
	    function SkipUntilSubscriber(destination, notifier) {
	        var _this = _super.call(this, destination) || this;
	        _this.hasValue = false;
	        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(_this, undefined, undefined);
	        _this.add(innerSubscriber);
	        _this.innerSubscription = innerSubscriber;
	        subscribeToResult_1.subscribeToResult(_this, notifier, undefined, undefined, innerSubscriber);
	        return _this;
	    }
	    SkipUntilSubscriber.prototype._next = function (value) {
	        if (this.hasValue) {
	            _super.prototype._next.call(this, value);
	        }
	    };
	    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.hasValue = true;
	        if (this.innerSubscription) {
	            this.innerSubscription.unsubscribe();
	        }
	    };
	    SkipUntilSubscriber.prototype.notifyComplete = function () {
	    };
	    return SkipUntilSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=skipUntil.js.map

/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function skipWhile(predicate) {
	    return function (source) { return source.lift(new SkipWhileOperator(predicate)); };
	}
	exports.skipWhile = skipWhile;
	var SkipWhileOperator = (function () {
	    function SkipWhileOperator(predicate) {
	        this.predicate = predicate;
	    }
	    SkipWhileOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new SkipWhileSubscriber(subscriber, this.predicate));
	    };
	    return SkipWhileOperator;
	}());
	var SkipWhileSubscriber = (function (_super) {
	    __extends(SkipWhileSubscriber, _super);
	    function SkipWhileSubscriber(destination, predicate) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.skipping = true;
	        _this.index = 0;
	        return _this;
	    }
	    SkipWhileSubscriber.prototype._next = function (value) {
	        var destination = this.destination;
	        if (this.skipping) {
	            this.tryCallPredicate(value);
	        }
	        if (!this.skipping) {
	            destination.next(value);
	        }
	    };
	    SkipWhileSubscriber.prototype.tryCallPredicate = function (value) {
	        try {
	            var result = this.predicate(value, this.index++);
	            this.skipping = Boolean(result);
	        }
	        catch (err) {
	            this.destination.error(err);
	        }
	    };
	    return SkipWhileSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=skipWhile.js.map

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var concat_1 = __webpack_require__(60);
	var isScheduler_1 = __webpack_require__(16);
	function startWith() {
	    var array = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        array[_i] = arguments[_i];
	    }
	    var scheduler = array[array.length - 1];
	    if (isScheduler_1.isScheduler(scheduler)) {
	        array.pop();
	        return function (source) { return concat_1.concat(array, source, scheduler); };
	    }
	    else {
	        return function (source) { return concat_1.concat(array, source); };
	    }
	}
	exports.startWith = startWith;
	//# sourceMappingURL=startWith.js.map

/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var SubscribeOnObservable_1 = __webpack_require__(249);
	function subscribeOn(scheduler, delay) {
	    if (delay === void 0) { delay = 0; }
	    return function subscribeOnOperatorFunction(source) {
	        return source.lift(new SubscribeOnOperator(scheduler, delay));
	    };
	}
	exports.subscribeOn = subscribeOn;
	var SubscribeOnOperator = (function () {
	    function SubscribeOnOperator(scheduler, delay) {
	        this.scheduler = scheduler;
	        this.delay = delay;
	    }
	    SubscribeOnOperator.prototype.call = function (subscriber, source) {
	        return new SubscribeOnObservable_1.SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
	    };
	    return SubscribeOnOperator;
	}());
	//# sourceMappingURL=subscribeOn.js.map

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var switchMap_1 = __webpack_require__(92);
	var identity_1 = __webpack_require__(31);
	function switchAll() {
	    return switchMap_1.switchMap(identity_1.identity);
	}
	exports.switchAll = switchAll;
	//# sourceMappingURL=switchAll.js.map

/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var switchMap_1 = __webpack_require__(92);
	function switchMapTo(innerObservable, resultSelector) {
	    return resultSelector ? switchMap_1.switchMap(function () { return innerObservable; }, resultSelector) : switchMap_1.switchMap(function () { return innerObservable; });
	}
	exports.switchMapTo = switchMapTo;
	//# sourceMappingURL=switchMapTo.js.map

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function takeUntil(notifier) {
	    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
	}
	exports.takeUntil = takeUntil;
	var TakeUntilOperator = (function () {
	    function TakeUntilOperator(notifier) {
	        this.notifier = notifier;
	    }
	    TakeUntilOperator.prototype.call = function (subscriber, source) {
	        var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
	        var notifierSubscription = subscribeToResult_1.subscribeToResult(takeUntilSubscriber, this.notifier);
	        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
	            takeUntilSubscriber.add(notifierSubscription);
	            return source.subscribe(takeUntilSubscriber);
	        }
	        return takeUntilSubscriber;
	    };
	    return TakeUntilOperator;
	}());
	var TakeUntilSubscriber = (function (_super) {
	    __extends(TakeUntilSubscriber, _super);
	    function TakeUntilSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.seenValue = false;
	        return _this;
	    }
	    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.seenValue = true;
	        this.complete();
	    };
	    TakeUntilSubscriber.prototype.notifyComplete = function () {
	    };
	    return TakeUntilSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=takeUntil.js.map

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	function takeWhile(predicate, inclusive) {
	    if (inclusive === void 0) { inclusive = false; }
	    return function (source) {
	        return source.lift(new TakeWhileOperator(predicate, inclusive));
	    };
	}
	exports.takeWhile = takeWhile;
	var TakeWhileOperator = (function () {
	    function TakeWhileOperator(predicate, inclusive) {
	        this.predicate = predicate;
	        this.inclusive = inclusive;
	    }
	    TakeWhileOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
	    };
	    return TakeWhileOperator;
	}());
	var TakeWhileSubscriber = (function (_super) {
	    __extends(TakeWhileSubscriber, _super);
	    function TakeWhileSubscriber(destination, predicate, inclusive) {
	        var _this = _super.call(this, destination) || this;
	        _this.predicate = predicate;
	        _this.inclusive = inclusive;
	        _this.index = 0;
	        return _this;
	    }
	    TakeWhileSubscriber.prototype._next = function (value) {
	        var destination = this.destination;
	        var result;
	        try {
	            result = this.predicate(value, this.index++);
	        }
	        catch (err) {
	            destination.error(err);
	            return;
	        }
	        this.nextOrComplete(value, result);
	    };
	    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
	        var destination = this.destination;
	        if (Boolean(predicateResult)) {
	            destination.next(value);
	        }
	        else {
	            if (this.inclusive) {
	                destination.next(value);
	            }
	            destination.complete();
	        }
	    };
	    return TakeWhileSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=takeWhile.js.map

/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var noop_1 = __webpack_require__(66);
	var isFunction_1 = __webpack_require__(45);
	function tap(nextOrObserver, error, complete) {
	    return function tapOperatorFunction(source) {
	        return source.lift(new DoOperator(nextOrObserver, error, complete));
	    };
	}
	exports.tap = tap;
	var DoOperator = (function () {
	    function DoOperator(nextOrObserver, error, complete) {
	        this.nextOrObserver = nextOrObserver;
	        this.error = error;
	        this.complete = complete;
	    }
	    DoOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
	    };
	    return DoOperator;
	}());
	var TapSubscriber = (function (_super) {
	    __extends(TapSubscriber, _super);
	    function TapSubscriber(destination, observerOrNext, error, complete) {
	        var _this = _super.call(this, destination) || this;
	        _this._tapNext = noop_1.noop;
	        _this._tapError = noop_1.noop;
	        _this._tapComplete = noop_1.noop;
	        _this._tapError = error || noop_1.noop;
	        _this._tapComplete = complete || noop_1.noop;
	        if (isFunction_1.isFunction(observerOrNext)) {
	            _this._context = _this;
	            _this._tapNext = observerOrNext;
	        }
	        else if (observerOrNext) {
	            _this._context = observerOrNext;
	            _this._tapNext = observerOrNext.next || noop_1.noop;
	            _this._tapError = observerOrNext.error || noop_1.noop;
	            _this._tapComplete = observerOrNext.complete || noop_1.noop;
	        }
	        return _this;
	    }
	    TapSubscriber.prototype._next = function (value) {
	        try {
	            this._tapNext.call(this._context, value);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(value);
	    };
	    TapSubscriber.prototype._error = function (err) {
	        try {
	            this._tapError.call(this._context, err);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.error(err);
	    };
	    TapSubscriber.prototype._complete = function () {
	        try {
	            this._tapComplete.call(this._context);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        return this.destination.complete();
	    };
	    return TapSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=tap.js.map

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var async_1 = __webpack_require__(7);
	var throttle_1 = __webpack_require__(153);
	function throttleTime(duration, scheduler, config) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    if (config === void 0) { config = throttle_1.defaultThrottleConfig; }
	    return function (source) { return source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing)); };
	}
	exports.throttleTime = throttleTime;
	var ThrottleTimeOperator = (function () {
	    function ThrottleTimeOperator(duration, scheduler, leading, trailing) {
	        this.duration = duration;
	        this.scheduler = scheduler;
	        this.leading = leading;
	        this.trailing = trailing;
	    }
	    ThrottleTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
	    };
	    return ThrottleTimeOperator;
	}());
	var ThrottleTimeSubscriber = (function (_super) {
	    __extends(ThrottleTimeSubscriber, _super);
	    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
	        var _this = _super.call(this, destination) || this;
	        _this.duration = duration;
	        _this.scheduler = scheduler;
	        _this.leading = leading;
	        _this.trailing = trailing;
	        _this._hasTrailingValue = false;
	        _this._trailingValue = null;
	        return _this;
	    }
	    ThrottleTimeSubscriber.prototype._next = function (value) {
	        if (this.throttled) {
	            if (this.trailing) {
	                this._trailingValue = value;
	                this._hasTrailingValue = true;
	            }
	        }
	        else {
	            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
	            if (this.leading) {
	                this.destination.next(value);
	            }
	            else if (this.trailing) {
	                this._trailingValue = value;
	                this._hasTrailingValue = true;
	            }
	        }
	    };
	    ThrottleTimeSubscriber.prototype._complete = function () {
	        if (this._hasTrailingValue) {
	            this.destination.next(this._trailingValue);
	            this.destination.complete();
	        }
	        else {
	            this.destination.complete();
	        }
	    };
	    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
	        var throttled = this.throttled;
	        if (throttled) {
	            if (this.trailing && this._hasTrailingValue) {
	                this.destination.next(this._trailingValue);
	                this._trailingValue = null;
	                this._hasTrailingValue = false;
	            }
	            throttled.unsubscribe();
	            this.remove(throttled);
	            this.throttled = null;
	        }
	    };
	    return ThrottleTimeSubscriber;
	}(Subscriber_1.Subscriber));
	function dispatchNext(arg) {
	    var subscriber = arg.subscriber;
	    subscriber.clearThrottle();
	}
	//# sourceMappingURL=throttleTime.js.map

/***/ },
/* 332 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var scan_1 = __webpack_require__(91);
	var defer_1 = __webpack_require__(86);
	var map_1 = __webpack_require__(10);
	function timeInterval(scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return function (source) { return defer_1.defer(function () {
	        return source.pipe(scan_1.scan(function (_a, value) {
	            var current = _a.current;
	            return ({ value: value, current: scheduler.now(), last: current });
	        }, { current: scheduler.now(), value: undefined, last: undefined }), map_1.map(function (_a) {
	            var current = _a.current, last = _a.last, value = _a.value;
	            return new TimeInterval(value, current - last);
	        }));
	    }); };
	}
	exports.timeInterval = timeInterval;
	var TimeInterval = (function () {
	    function TimeInterval(value, interval) {
	        this.value = value;
	        this.interval = interval;
	    }
	    return TimeInterval;
	}());
	exports.TimeInterval = TimeInterval;
	//# sourceMappingURL=timeInterval.js.map

/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var TimeoutError_1 = __webpack_require__(158);
	var timeoutWith_1 = __webpack_require__(154);
	var throwError_1 = __webpack_require__(87);
	function timeout(due, scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return timeoutWith_1.timeoutWith(due, throwError_1.throwError(new TimeoutError_1.TimeoutError()), scheduler);
	}
	exports.timeout = timeout;
	//# sourceMappingURL=timeout.js.map

/***/ },
/* 334 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var async_1 = __webpack_require__(7);
	var map_1 = __webpack_require__(10);
	function timestamp(scheduler) {
	    if (scheduler === void 0) { scheduler = async_1.async; }
	    return map_1.map(function (value) { return new Timestamp(value, scheduler.now()); });
	}
	exports.timestamp = timestamp;
	var Timestamp = (function () {
	    function Timestamp(value, timestamp) {
	        this.value = value;
	        this.timestamp = timestamp;
	    }
	    return Timestamp;
	}());
	exports.Timestamp = Timestamp;
	//# sourceMappingURL=timestamp.js.map

/***/ },
/* 335 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var reduce_1 = __webpack_require__(62);
	function toArrayReducer(arr, item, index) {
	    if (index === 0) {
	        return [item];
	    }
	    arr.push(item);
	    return arr;
	}
	function toArray() {
	    return reduce_1.reduce(toArrayReducer, []);
	}
	exports.toArray = toArray;
	//# sourceMappingURL=toArray.js.map

/***/ },
/* 336 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function window(windowBoundaries) {
	    return function windowOperatorFunction(source) {
	        return source.lift(new WindowOperator(windowBoundaries));
	    };
	}
	exports.window = window;
	var WindowOperator = (function () {
	    function WindowOperator(windowBoundaries) {
	        this.windowBoundaries = windowBoundaries;
	    }
	    WindowOperator.prototype.call = function (subscriber, source) {
	        var windowSubscriber = new WindowSubscriber(subscriber);
	        var sourceSubscription = source.subscribe(windowSubscriber);
	        if (!sourceSubscription.closed) {
	            windowSubscriber.add(subscribeToResult_1.subscribeToResult(windowSubscriber, this.windowBoundaries));
	        }
	        return sourceSubscription;
	    };
	    return WindowOperator;
	}());
	var WindowSubscriber = (function (_super) {
	    __extends(WindowSubscriber, _super);
	    function WindowSubscriber(destination) {
	        var _this = _super.call(this, destination) || this;
	        _this.window = new Subject_1.Subject();
	        destination.next(_this.window);
	        return _this;
	    }
	    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.openWindow();
	    };
	    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
	        this._complete();
	    };
	    WindowSubscriber.prototype._next = function (value) {
	        this.window.next(value);
	    };
	    WindowSubscriber.prototype._error = function (err) {
	        this.window.error(err);
	        this.destination.error(err);
	    };
	    WindowSubscriber.prototype._complete = function () {
	        this.window.complete();
	        this.destination.complete();
	    };
	    WindowSubscriber.prototype._unsubscribe = function () {
	        this.window = null;
	    };
	    WindowSubscriber.prototype.openWindow = function () {
	        var prevWindow = this.window;
	        if (prevWindow) {
	            prevWindow.complete();
	        }
	        var destination = this.destination;
	        var newWindow = this.window = new Subject_1.Subject();
	        destination.next(newWindow);
	    };
	    return WindowSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=window.js.map

/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var Subject_1 = __webpack_require__(6);
	function windowCount(windowSize, startWindowEvery) {
	    if (startWindowEvery === void 0) { startWindowEvery = 0; }
	    return function windowCountOperatorFunction(source) {
	        return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
	    };
	}
	exports.windowCount = windowCount;
	var WindowCountOperator = (function () {
	    function WindowCountOperator(windowSize, startWindowEvery) {
	        this.windowSize = windowSize;
	        this.startWindowEvery = startWindowEvery;
	    }
	    WindowCountOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
	    };
	    return WindowCountOperator;
	}());
	var WindowCountSubscriber = (function (_super) {
	    __extends(WindowCountSubscriber, _super);
	    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.windowSize = windowSize;
	        _this.startWindowEvery = startWindowEvery;
	        _this.windows = [new Subject_1.Subject()];
	        _this.count = 0;
	        destination.next(_this.windows[0]);
	        return _this;
	    }
	    WindowCountSubscriber.prototype._next = function (value) {
	        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
	        var destination = this.destination;
	        var windowSize = this.windowSize;
	        var windows = this.windows;
	        var len = windows.length;
	        for (var i = 0; i < len && !this.closed; i++) {
	            windows[i].next(value);
	        }
	        var c = this.count - windowSize + 1;
	        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
	            windows.shift().complete();
	        }
	        if (++this.count % startWindowEvery === 0 && !this.closed) {
	            var window_1 = new Subject_1.Subject();
	            windows.push(window_1);
	            destination.next(window_1);
	        }
	    };
	    WindowCountSubscriber.prototype._error = function (err) {
	        var windows = this.windows;
	        if (windows) {
	            while (windows.length > 0 && !this.closed) {
	                windows.shift().error(err);
	            }
	        }
	        this.destination.error(err);
	    };
	    WindowCountSubscriber.prototype._complete = function () {
	        var windows = this.windows;
	        if (windows) {
	            while (windows.length > 0 && !this.closed) {
	                windows.shift().complete();
	            }
	        }
	        this.destination.complete();
	    };
	    WindowCountSubscriber.prototype._unsubscribe = function () {
	        this.count = 0;
	        this.windows = null;
	    };
	    return WindowCountSubscriber;
	}(Subscriber_1.Subscriber));
	//# sourceMappingURL=windowCount.js.map

/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var async_1 = __webpack_require__(7);
	var Subscriber_1 = __webpack_require__(1);
	var isNumeric_1 = __webpack_require__(65);
	var isScheduler_1 = __webpack_require__(16);
	function windowTime(windowTimeSpan) {
	    var scheduler = async_1.async;
	    var windowCreationInterval = null;
	    var maxWindowSize = Number.POSITIVE_INFINITY;
	    if (isScheduler_1.isScheduler(arguments[3])) {
	        scheduler = arguments[3];
	    }
	    if (isScheduler_1.isScheduler(arguments[2])) {
	        scheduler = arguments[2];
	    }
	    else if (isNumeric_1.isNumeric(arguments[2])) {
	        maxWindowSize = arguments[2];
	    }
	    if (isScheduler_1.isScheduler(arguments[1])) {
	        scheduler = arguments[1];
	    }
	    else if (isNumeric_1.isNumeric(arguments[1])) {
	        windowCreationInterval = arguments[1];
	    }
	    return function windowTimeOperatorFunction(source) {
	        return source.lift(new WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler));
	    };
	}
	exports.windowTime = windowTime;
	var WindowTimeOperator = (function () {
	    function WindowTimeOperator(windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
	        this.windowTimeSpan = windowTimeSpan;
	        this.windowCreationInterval = windowCreationInterval;
	        this.maxWindowSize = maxWindowSize;
	        this.scheduler = scheduler;
	    }
	    WindowTimeOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new WindowTimeSubscriber(subscriber, this.windowTimeSpan, this.windowCreationInterval, this.maxWindowSize, this.scheduler));
	    };
	    return WindowTimeOperator;
	}());
	var CountedSubject = (function (_super) {
	    __extends(CountedSubject, _super);
	    function CountedSubject() {
	        var _this = _super !== null && _super.apply(this, arguments) || this;
	        _this._numberOfNextedValues = 0;
	        return _this;
	    }
	    CountedSubject.prototype.next = function (value) {
	        this._numberOfNextedValues++;
	        _super.prototype.next.call(this, value);
	    };
	    Object.defineProperty(CountedSubject.prototype, "numberOfNextedValues", {
	        get: function () {
	            return this._numberOfNextedValues;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return CountedSubject;
	}(Subject_1.Subject));
	var WindowTimeSubscriber = (function (_super) {
	    __extends(WindowTimeSubscriber, _super);
	    function WindowTimeSubscriber(destination, windowTimeSpan, windowCreationInterval, maxWindowSize, scheduler) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.windowTimeSpan = windowTimeSpan;
	        _this.windowCreationInterval = windowCreationInterval;
	        _this.maxWindowSize = maxWindowSize;
	        _this.scheduler = scheduler;
	        _this.windows = [];
	        var window = _this.openWindow();
	        if (windowCreationInterval !== null && windowCreationInterval >= 0) {
	            var closeState = { subscriber: _this, window: window, context: null };
	            var creationState = { windowTimeSpan: windowTimeSpan, windowCreationInterval: windowCreationInterval, subscriber: _this, scheduler: scheduler };
	            _this.add(scheduler.schedule(dispatchWindowClose, windowTimeSpan, closeState));
	            _this.add(scheduler.schedule(dispatchWindowCreation, windowCreationInterval, creationState));
	        }
	        else {
	            var timeSpanOnlyState = { subscriber: _this, window: window, windowTimeSpan: windowTimeSpan };
	            _this.add(scheduler.schedule(dispatchWindowTimeSpanOnly, windowTimeSpan, timeSpanOnlyState));
	        }
	        return _this;
	    }
	    WindowTimeSubscriber.prototype._next = function (value) {
	        var windows = this.windows;
	        var len = windows.length;
	        for (var i = 0; i < len; i++) {
	            var window_1 = windows[i];
	            if (!window_1.closed) {
	                window_1.next(value);
	                if (window_1.numberOfNextedValues >= this.maxWindowSize) {
	                    this.closeWindow(window_1);
	                }
	            }
	        }
	    };
	    WindowTimeSubscriber.prototype._error = function (err) {
	        var windows = this.windows;
	        while (windows.length > 0) {
	            windows.shift().error(err);
	        }
	        this.destination.error(err);
	    };
	    WindowTimeSubscriber.prototype._complete = function () {
	        var windows = this.windows;
	        while (windows.length > 0) {
	            var window_2 = windows.shift();
	            if (!window_2.closed) {
	                window_2.complete();
	            }
	        }
	        this.destination.complete();
	    };
	    WindowTimeSubscriber.prototype.openWindow = function () {
	        var window = new CountedSubject();
	        this.windows.push(window);
	        var destination = this.destination;
	        destination.next(window);
	        return window;
	    };
	    WindowTimeSubscriber.prototype.closeWindow = function (window) {
	        window.complete();
	        var windows = this.windows;
	        windows.splice(windows.indexOf(window), 1);
	    };
	    return WindowTimeSubscriber;
	}(Subscriber_1.Subscriber));
	function dispatchWindowTimeSpanOnly(state) {
	    var subscriber = state.subscriber, windowTimeSpan = state.windowTimeSpan, window = state.window;
	    if (window) {
	        subscriber.closeWindow(window);
	    }
	    state.window = subscriber.openWindow();
	    this.schedule(state, windowTimeSpan);
	}
	function dispatchWindowCreation(state) {
	    var windowTimeSpan = state.windowTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler, windowCreationInterval = state.windowCreationInterval;
	    var window = subscriber.openWindow();
	    var action = this;
	    var context = { action: action, subscription: null };
	    var timeSpanState = { subscriber: subscriber, window: window, context: context };
	    context.subscription = scheduler.schedule(dispatchWindowClose, windowTimeSpan, timeSpanState);
	    action.add(context.subscription);
	    action.schedule(state, windowCreationInterval);
	}
	function dispatchWindowClose(state) {
	    var subscriber = state.subscriber, window = state.window, context = state.context;
	    if (context && context.action && context.subscription) {
	        context.action.remove(context.subscription);
	    }
	    subscriber.closeWindow(window);
	}
	//# sourceMappingURL=windowTime.js.map

/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var Subscription_1 = __webpack_require__(5);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function windowToggle(openings, closingSelector) {
	    return function (source) { return source.lift(new WindowToggleOperator(openings, closingSelector)); };
	}
	exports.windowToggle = windowToggle;
	var WindowToggleOperator = (function () {
	    function WindowToggleOperator(openings, closingSelector) {
	        this.openings = openings;
	        this.closingSelector = closingSelector;
	    }
	    WindowToggleOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
	    };
	    return WindowToggleOperator;
	}());
	var WindowToggleSubscriber = (function (_super) {
	    __extends(WindowToggleSubscriber, _super);
	    function WindowToggleSubscriber(destination, openings, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.openings = openings;
	        _this.closingSelector = closingSelector;
	        _this.contexts = [];
	        _this.add(_this.openSubscription = subscribeToResult_1.subscribeToResult(_this, openings, openings));
	        return _this;
	    }
	    WindowToggleSubscriber.prototype._next = function (value) {
	        var contexts = this.contexts;
	        if (contexts) {
	            var len = contexts.length;
	            for (var i = 0; i < len; i++) {
	                contexts[i].window.next(value);
	            }
	        }
	    };
	    WindowToggleSubscriber.prototype._error = function (err) {
	        var contexts = this.contexts;
	        this.contexts = null;
	        if (contexts) {
	            var len = contexts.length;
	            var index = -1;
	            while (++index < len) {
	                var context_1 = contexts[index];
	                context_1.window.error(err);
	                context_1.subscription.unsubscribe();
	            }
	        }
	        _super.prototype._error.call(this, err);
	    };
	    WindowToggleSubscriber.prototype._complete = function () {
	        var contexts = this.contexts;
	        this.contexts = null;
	        if (contexts) {
	            var len = contexts.length;
	            var index = -1;
	            while (++index < len) {
	                var context_2 = contexts[index];
	                context_2.window.complete();
	                context_2.subscription.unsubscribe();
	            }
	        }
	        _super.prototype._complete.call(this);
	    };
	    WindowToggleSubscriber.prototype._unsubscribe = function () {
	        var contexts = this.contexts;
	        this.contexts = null;
	        if (contexts) {
	            var len = contexts.length;
	            var index = -1;
	            while (++index < len) {
	                var context_3 = contexts[index];
	                context_3.window.unsubscribe();
	                context_3.subscription.unsubscribe();
	            }
	        }
	    };
	    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        if (outerValue === this.openings) {
	            var closingNotifier = void 0;
	            try {
	                var closingSelector = this.closingSelector;
	                closingNotifier = closingSelector(innerValue);
	            }
	            catch (e) {
	                return this.error(e);
	            }
	            var window_1 = new Subject_1.Subject();
	            var subscription = new Subscription_1.Subscription();
	            var context_4 = { window: window_1, subscription: subscription };
	            this.contexts.push(context_4);
	            var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context_4);
	            if (innerSubscription.closed) {
	                this.closeWindow(this.contexts.length - 1);
	            }
	            else {
	                innerSubscription.context = context_4;
	                subscription.add(innerSubscription);
	            }
	            this.destination.next(window_1);
	        }
	        else {
	            this.closeWindow(this.contexts.indexOf(outerValue));
	        }
	    };
	    WindowToggleSubscriber.prototype.notifyError = function (err) {
	        this.error(err);
	    };
	    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
	        if (inner !== this.openSubscription) {
	            this.closeWindow(this.contexts.indexOf(inner.context));
	        }
	    };
	    WindowToggleSubscriber.prototype.closeWindow = function (index) {
	        if (index === -1) {
	            return;
	        }
	        var contexts = this.contexts;
	        var context = contexts[index];
	        var window = context.window, subscription = context.subscription;
	        contexts.splice(index, 1);
	        window.complete();
	        subscription.unsubscribe();
	    };
	    return WindowToggleSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=windowToggle.js.map

/***/ },
/* 340 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subject_1 = __webpack_require__(6);
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function windowWhen(closingSelector) {
	    return function windowWhenOperatorFunction(source) {
	        return source.lift(new WindowOperator(closingSelector));
	    };
	}
	exports.windowWhen = windowWhen;
	var WindowOperator = (function () {
	    function WindowOperator(closingSelector) {
	        this.closingSelector = closingSelector;
	    }
	    WindowOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
	    };
	    return WindowOperator;
	}());
	var WindowSubscriber = (function (_super) {
	    __extends(WindowSubscriber, _super);
	    function WindowSubscriber(destination, closingSelector) {
	        var _this = _super.call(this, destination) || this;
	        _this.destination = destination;
	        _this.closingSelector = closingSelector;
	        _this.openWindow();
	        return _this;
	    }
	    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.openWindow(innerSub);
	    };
	    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
	        this._error(error);
	    };
	    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
	        this.openWindow(innerSub);
	    };
	    WindowSubscriber.prototype._next = function (value) {
	        this.window.next(value);
	    };
	    WindowSubscriber.prototype._error = function (err) {
	        this.window.error(err);
	        this.destination.error(err);
	        this.unsubscribeClosingNotification();
	    };
	    WindowSubscriber.prototype._complete = function () {
	        this.window.complete();
	        this.destination.complete();
	        this.unsubscribeClosingNotification();
	    };
	    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
	        if (this.closingNotification) {
	            this.closingNotification.unsubscribe();
	        }
	    };
	    WindowSubscriber.prototype.openWindow = function (innerSub) {
	        if (innerSub === void 0) { innerSub = null; }
	        if (innerSub) {
	            this.remove(innerSub);
	            innerSub.unsubscribe();
	        }
	        var prevWindow = this.window;
	        if (prevWindow) {
	            prevWindow.complete();
	        }
	        var window = this.window = new Subject_1.Subject();
	        this.destination.next(window);
	        var closingNotifier;
	        try {
	            var closingSelector = this.closingSelector;
	            closingNotifier = closingSelector();
	        }
	        catch (e) {
	            this.destination.error(e);
	            this.window.error(e);
	            return;
	        }
	        this.add(this.closingNotification = subscribeToResult_1.subscribeToResult(this, closingNotifier));
	    };
	    return WindowSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=windowWhen.js.map

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var OuterSubscriber_1 = __webpack_require__(3);
	var subscribeToResult_1 = __webpack_require__(4);
	function withLatestFrom() {
	    var args = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	    }
	    return function (source) {
	        var project;
	        if (typeof args[args.length - 1] === 'function') {
	            project = args.pop();
	        }
	        var observables = args;
	        return source.lift(new WithLatestFromOperator(observables, project));
	    };
	}
	exports.withLatestFrom = withLatestFrom;
	var WithLatestFromOperator = (function () {
	    function WithLatestFromOperator(observables, project) {
	        this.observables = observables;
	        this.project = project;
	    }
	    WithLatestFromOperator.prototype.call = function (subscriber, source) {
	        return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
	    };
	    return WithLatestFromOperator;
	}());
	var WithLatestFromSubscriber = (function (_super) {
	    __extends(WithLatestFromSubscriber, _super);
	    function WithLatestFromSubscriber(destination, observables, project) {
	        var _this = _super.call(this, destination) || this;
	        _this.observables = observables;
	        _this.project = project;
	        _this.toRespond = [];
	        var len = observables.length;
	        _this.values = new Array(len);
	        for (var i = 0; i < len; i++) {
	            _this.toRespond.push(i);
	        }
	        for (var i = 0; i < len; i++) {
	            var observable = observables[i];
	            _this.add(subscribeToResult_1.subscribeToResult(_this, observable, observable, i));
	        }
	        return _this;
	    }
	    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
	        this.values[outerIndex] = innerValue;
	        var toRespond = this.toRespond;
	        if (toRespond.length > 0) {
	            var found = toRespond.indexOf(outerIndex);
	            if (found !== -1) {
	                toRespond.splice(found, 1);
	            }
	        }
	    };
	    WithLatestFromSubscriber.prototype.notifyComplete = function () {
	    };
	    WithLatestFromSubscriber.prototype._next = function (value) {
	        if (this.toRespond.length === 0) {
	            var args = [value].concat(this.values);
	            if (this.project) {
	                this._tryProject(args);
	            }
	            else {
	                this.destination.next(args);
	            }
	        }
	    };
	    WithLatestFromSubscriber.prototype._tryProject = function (args) {
	        var result;
	        try {
	            result = this.project.apply(this, args);
	        }
	        catch (err) {
	            this.destination.error(err);
	            return;
	        }
	        this.destination.next(result);
	    };
	    return WithLatestFromSubscriber;
	}(OuterSubscriber_1.OuterSubscriber));
	//# sourceMappingURL=withLatestFrom.js.map

/***/ },
/* 342 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var zip_1 = __webpack_require__(88);
	function zip() {
	    var observables = [];
	    for (var _i = 0; _i < arguments.length; _i++) {
	        observables[_i] = arguments[_i];
	    }
	    return function zipOperatorFunction(source) {
	        return source.lift.call(zip_1.zip.apply(void 0, [source].concat(observables)));
	    };
	}
	exports.zip = zip;
	//# sourceMappingURL=zip.js.map

/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var zip_1 = __webpack_require__(88);
	function zipAll(project) {
	    return function (source) { return source.lift(new zip_1.ZipOperator(project)); };
	}
	exports.zipAll = zipAll;
	//# sourceMappingURL=zipAll.js.map

/***/ },
/* 344 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var Subscription_1 = __webpack_require__(5);
	var iterator_1 = __webpack_require__(42);
	function scheduleIterable(input, scheduler) {
	    if (!input) {
	        throw new Error('Iterable cannot be null');
	    }
	    return new Observable_1.Observable(function (subscriber) {
	        var sub = new Subscription_1.Subscription();
	        var iterator;
	        sub.add(function () {
	            if (iterator && typeof iterator.return === 'function') {
	                iterator.return();
	            }
	        });
	        sub.add(scheduler.schedule(function () {
	            iterator = input[iterator_1.iterator]();
	            sub.add(scheduler.schedule(function () {
	                if (subscriber.closed) {
	                    return;
	                }
	                var value;
	                var done;
	                try {
	                    var result = iterator.next();
	                    value = result.value;
	                    done = result.done;
	                }
	                catch (err) {
	                    subscriber.error(err);
	                    return;
	                }
	                if (done) {
	                    subscriber.complete();
	                }
	                else {
	                    subscriber.next(value);
	                    this.schedule();
	                }
	            }));
	        }));
	        return sub;
	    });
	}
	exports.scheduleIterable = scheduleIterable;
	//# sourceMappingURL=scheduleIterable.js.map

/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var Subscription_1 = __webpack_require__(5);
	var observable_1 = __webpack_require__(30);
	function scheduleObservable(input, scheduler) {
	    return new Observable_1.Observable(function (subscriber) {
	        var sub = new Subscription_1.Subscription();
	        sub.add(scheduler.schedule(function () {
	            var observable = input[observable_1.observable]();
	            sub.add(observable.subscribe({
	                next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
	                error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
	                complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
	            }));
	        }));
	        return sub;
	    });
	}
	exports.scheduleObservable = scheduleObservable;
	//# sourceMappingURL=scheduleObservable.js.map

/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	var Subscription_1 = __webpack_require__(5);
	function schedulePromise(input, scheduler) {
	    return new Observable_1.Observable(function (subscriber) {
	        var sub = new Subscription_1.Subscription();
	        sub.add(scheduler.schedule(function () { return input.then(function (value) {
	            sub.add(scheduler.schedule(function () {
	                subscriber.next(value);
	                sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
	            }));
	        }, function (err) {
	            sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
	        }); }));
	        return sub;
	    });
	}
	exports.schedulePromise = schedulePromise;
	//# sourceMappingURL=schedulePromise.js.map

/***/ },
/* 347 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscription_1 = __webpack_require__(5);
	var Action = (function (_super) {
	    __extends(Action, _super);
	    function Action(scheduler, work) {
	        return _super.call(this) || this;
	    }
	    Action.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        return this;
	    };
	    return Action;
	}(Subscription_1.Subscription));
	exports.Action = Action;
	//# sourceMappingURL=Action.js.map

/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncAction_1 = __webpack_require__(40);
	var AnimationFrameAction = (function (_super) {
	    __extends(AnimationFrameAction, _super);
	    function AnimationFrameAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (delay !== null && delay > 0) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        scheduler.actions.push(this);
	        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
	    };
	    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
	        }
	        if (scheduler.actions.length === 0) {
	            cancelAnimationFrame(id);
	            scheduler.scheduled = undefined;
	        }
	        return undefined;
	    };
	    return AnimationFrameAction;
	}(AsyncAction_1.AsyncAction));
	exports.AnimationFrameAction = AnimationFrameAction;
	//# sourceMappingURL=AnimationFrameAction.js.map

/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncScheduler_1 = __webpack_require__(41);
	var AnimationFrameScheduler = (function (_super) {
	    __extends(AnimationFrameScheduler, _super);
	    function AnimationFrameScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AnimationFrameScheduler.prototype.flush = function (action) {
	        this.active = true;
	        this.scheduled = undefined;
	        var actions = this.actions;
	        var error;
	        var index = -1;
	        var count = actions.length;
	        action = action || actions.shift();
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (++index < count && (action = actions.shift()));
	        this.active = false;
	        if (error) {
	            while (++index < count && (action = actions.shift())) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AnimationFrameScheduler;
	}(AsyncScheduler_1.AsyncScheduler));
	exports.AnimationFrameScheduler = AnimationFrameScheduler;
	//# sourceMappingURL=AnimationFrameScheduler.js.map

/***/ },
/* 350 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var Immediate_1 = __webpack_require__(356);
	var AsyncAction_1 = __webpack_require__(40);
	var AsapAction = (function (_super) {
	    __extends(AsapAction, _super);
	    function AsapAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (delay !== null && delay > 0) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        scheduler.actions.push(this);
	        return scheduler.scheduled || (scheduler.scheduled = Immediate_1.Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
	    };
	    AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
	        }
	        if (scheduler.actions.length === 0) {
	            Immediate_1.Immediate.clearImmediate(id);
	            scheduler.scheduled = undefined;
	        }
	        return undefined;
	    };
	    return AsapAction;
	}(AsyncAction_1.AsyncAction));
	exports.AsapAction = AsapAction;
	//# sourceMappingURL=AsapAction.js.map

/***/ },
/* 351 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncScheduler_1 = __webpack_require__(41);
	var AsapScheduler = (function (_super) {
	    __extends(AsapScheduler, _super);
	    function AsapScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    AsapScheduler.prototype.flush = function (action) {
	        this.active = true;
	        this.scheduled = undefined;
	        var actions = this.actions;
	        var error;
	        var index = -1;
	        var count = actions.length;
	        action = action || actions.shift();
	        do {
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        } while (++index < count && (action = actions.shift()));
	        this.active = false;
	        if (error) {
	            while (++index < count && (action = actions.shift())) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    return AsapScheduler;
	}(AsyncScheduler_1.AsyncScheduler));
	exports.AsapScheduler = AsapScheduler;
	//# sourceMappingURL=AsapScheduler.js.map

/***/ },
/* 352 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncAction_1 = __webpack_require__(40);
	var QueueAction = (function (_super) {
	    __extends(QueueAction, _super);
	    function QueueAction(scheduler, work) {
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        return _this;
	    }
	    QueueAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (delay > 0) {
	            return _super.prototype.schedule.call(this, state, delay);
	        }
	        this.delay = delay;
	        this.state = state;
	        this.scheduler.flush(this);
	        return this;
	    };
	    QueueAction.prototype.execute = function (state, delay) {
	        return (delay > 0 || this.closed) ?
	            _super.prototype.execute.call(this, state, delay) :
	            this._execute(state, delay);
	    };
	    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
	            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
	        }
	        return scheduler.flush(this);
	    };
	    return QueueAction;
	}(AsyncAction_1.AsyncAction));
	exports.QueueAction = QueueAction;
	//# sourceMappingURL=QueueAction.js.map

/***/ },
/* 353 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncScheduler_1 = __webpack_require__(41);
	var QueueScheduler = (function (_super) {
	    __extends(QueueScheduler, _super);
	    function QueueScheduler() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    return QueueScheduler;
	}(AsyncScheduler_1.AsyncScheduler));
	exports.QueueScheduler = QueueScheduler;
	//# sourceMappingURL=QueueScheduler.js.map

/***/ },
/* 354 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    }
	    return function (d, b) {
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	var AsyncAction_1 = __webpack_require__(40);
	var AsyncScheduler_1 = __webpack_require__(41);
	var VirtualTimeScheduler = (function (_super) {
	    __extends(VirtualTimeScheduler, _super);
	    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
	        if (SchedulerAction === void 0) { SchedulerAction = VirtualAction; }
	        if (maxFrames === void 0) { maxFrames = Number.POSITIVE_INFINITY; }
	        var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
	        _this.maxFrames = maxFrames;
	        _this.frame = 0;
	        _this.index = -1;
	        return _this;
	    }
	    VirtualTimeScheduler.prototype.flush = function () {
	        var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
	        var error, action;
	        while ((action = actions[0]) && action.delay <= maxFrames) {
	            actions.shift();
	            this.frame = action.delay;
	            if (error = action.execute(action.state, action.delay)) {
	                break;
	            }
	        }
	        if (error) {
	            while (action = actions.shift()) {
	                action.unsubscribe();
	            }
	            throw error;
	        }
	    };
	    VirtualTimeScheduler.frameTimeFactor = 10;
	    return VirtualTimeScheduler;
	}(AsyncScheduler_1.AsyncScheduler));
	exports.VirtualTimeScheduler = VirtualTimeScheduler;
	var VirtualAction = (function (_super) {
	    __extends(VirtualAction, _super);
	    function VirtualAction(scheduler, work, index) {
	        if (index === void 0) { index = scheduler.index += 1; }
	        var _this = _super.call(this, scheduler, work) || this;
	        _this.scheduler = scheduler;
	        _this.work = work;
	        _this.index = index;
	        _this.active = true;
	        _this.index = scheduler.index = index;
	        return _this;
	    }
	    VirtualAction.prototype.schedule = function (state, delay) {
	        if (delay === void 0) { delay = 0; }
	        if (!this.id) {
	            return _super.prototype.schedule.call(this, state, delay);
	        }
	        this.active = false;
	        var action = new VirtualAction(this.scheduler, this.work);
	        this.add(action);
	        return action.schedule(state, delay);
	    };
	    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        this.delay = scheduler.frame + delay;
	        var actions = scheduler.actions;
	        actions.push(this);
	        actions.sort(VirtualAction.sortActions);
	        return true;
	    };
	    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
	        if (delay === void 0) { delay = 0; }
	        return undefined;
	    };
	    VirtualAction.prototype._execute = function (state, delay) {
	        if (this.active === true) {
	            return _super.prototype._execute.call(this, state, delay);
	        }
	    };
	    VirtualAction.sortActions = function (a, b) {
	        if (a.delay === b.delay) {
	            if (a.index === b.index) {
	                return 0;
	            }
	            else if (a.index > b.index) {
	                return 1;
	            }
	            else {
	                return -1;
	            }
	        }
	        else if (a.delay > b.delay) {
	            return 1;
	        }
	        else {
	            return -1;
	        }
	    };
	    return VirtualAction;
	}(AsyncAction_1.AsyncAction));
	exports.VirtualAction = VirtualAction;
	//# sourceMappingURL=VirtualTimeScheduler.js.map

/***/ },
/* 355 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var AnimationFrameAction_1 = __webpack_require__(348);
	var AnimationFrameScheduler_1 = __webpack_require__(349);
	exports.animationFrame = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
	//# sourceMappingURL=animationFrame.js.map

/***/ },
/* 356 */
/***/ function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var nextHandle = 1;
	var tasksByHandle = {};
	function runIfPresent(handle) {
	    var cb = tasksByHandle[handle];
	    if (cb) {
	        cb();
	    }
	}
	exports.Immediate = {
	    setImmediate: function (cb) {
	        var handle = nextHandle++;
	        tasksByHandle[handle] = cb;
	        Promise.resolve().then(function () { return runIfPresent(handle); });
	        return handle;
	    },
	    clearImmediate: function (handle) {
	        delete tasksByHandle[handle];
	    },
	};
	//# sourceMappingURL=Immediate.js.map

/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var observable_1 = __webpack_require__(30);
	function isInteropObservable(input) {
	    return input && typeof input[observable_1.observable] === 'function';
	}
	exports.isInteropObservable = isInteropObservable;
	//# sourceMappingURL=isInteropObservable.js.map

/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var iterator_1 = __webpack_require__(42);
	function isIterable(input) {
	    return input && typeof input[iterator_1.iterator] === 'function';
	}
	exports.isIterable = isIterable;
	//# sourceMappingURL=isIterable.js.map

/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Observable_1 = __webpack_require__(2);
	function isObservable(obj) {
	    return !!obj && (obj instanceof Observable_1.Observable || (typeof obj.lift === 'function' && typeof obj.subscribe === 'function'));
	}
	exports.isObservable = isObservable;
	//# sourceMappingURL=isObservable.js.map

/***/ },
/* 360 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var iterator_1 = __webpack_require__(42);
	exports.subscribeToIterable = function (iterable) { return function (subscriber) {
	    var iterator = iterable[iterator_1.iterator]();
	    do {
	        var item = iterator.next();
	        if (item.done) {
	            subscriber.complete();
	            break;
	        }
	        subscriber.next(item.value);
	        if (subscriber.closed) {
	            break;
	        }
	    } while (true);
	    if (typeof iterator.return === 'function') {
	        subscriber.add(function () {
	            if (iterator.return) {
	                iterator.return();
	            }
	        });
	    }
	    return subscriber;
	}; };
	//# sourceMappingURL=subscribeToIterable.js.map

/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var observable_1 = __webpack_require__(30);
	exports.subscribeToObservable = function (obj) { return function (subscriber) {
	    var obs = obj[observable_1.observable]();
	    if (typeof obs.subscribe !== 'function') {
	        throw new TypeError('Provided object does not correctly implement Symbol.observable');
	    }
	    else {
	        return obs.subscribe(subscriber);
	    }
	}; };
	//# sourceMappingURL=subscribeToObservable.js.map

/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var hostReportError_1 = __webpack_require__(98);
	exports.subscribeToPromise = function (promise) { return function (subscriber) {
	    promise.then(function (value) {
	        if (!subscriber.closed) {
	            subscriber.next(value);
	            subscriber.complete();
	        }
	    }, function (err) { return subscriber.error(err); })
	        .then(null, hostReportError_1.hostReportError);
	    return subscriber;
	}; };
	//# sourceMappingURL=subscribeToPromise.js.map

/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Subscriber_1 = __webpack_require__(1);
	var rxSubscriber_1 = __webpack_require__(96);
	var Observer_1 = __webpack_require__(138);
	function toSubscriber(nextOrObserver, error, complete) {
	    if (nextOrObserver) {
	        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
	            return nextOrObserver;
	        }
	        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
	            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
	        }
	    }
	    if (!nextOrObserver && !error && !complete) {
	        return new Subscriber_1.Subscriber(Observer_1.empty);
	    }
	    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
	}
	exports.toSubscriber = toSubscriber;
	//# sourceMappingURL=toSubscriber.js.map

/***/ },
/* 364 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', { value: true });

	function shallowEqualObjects(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }

	  if (!objA || !objB) {
	    return false;
	  }

	  var aKeys = Object.keys(objA);
	  var bKeys = Object.keys(objB);
	  var len = aKeys.length;

	  if (bKeys.length !== len) {
	    return false;
	  }

	  for (var i = 0; i < len; i++) {
	    var key = aKeys[i];

	    if (objA[key] !== objB[key]) {
	      return false;
	    }
	  }

	  return true;
	}

	function shallowEqualArrays(arrA, arrB) {
	  if (arrA === arrB) {
	    return true;
	  }

	  if (!arrA || !arrB) {
	    return false;
	  }

	  var len = arrA.length;

	  if (arrB.length !== len) {
	    return false;
	  }

	  for (var i = 0; i < len; i++) {
	    if (arrA[i] !== arrB[i]) {
	      return false;
	    }
	  }

	  return true;
	}

	exports.shallowEqualArrays = shallowEqualArrays;
	exports.shallowEqualObjects = shallowEqualObjects;


/***/ }
/******/ ])
});
;