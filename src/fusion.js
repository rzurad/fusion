(function () {
    "use strict";

    function Fusion () {}

    var global = this,
        NOOP = function () { return this; }, 
        F,
        prototype = {
            //Follow in the footsteps of all native ECMA5 Objects
            constructor: Fusion,

            /**
             * Adds a namespace object or nested objects on
             * the calling object (`this` context)
             *
             * @method  namespace
             * @param   {String}    namespace: key to add to the namespace. Use
             *                          periods to signify nested objects.
             * @returns {Object}
             */
            namespace: function (tokens) {
                var scope = this,
                    i, token, error, length;

                if (!arguments.length) {
                    return this;
                } else if (typeof tokens !== 'string') {
                    error = 'namespace: expecting string as first argument';
                    throw new TypeError(error);
                }

                tokens = tokens.split('.');

                for (i = 0, length = tokens.length; i < length; i++) {
                    token = tokens[i];

                    if (scope[token]) {
                        //current token is already defined. continue iterating
                        scope = scope[token];
                    } else {
                        //current token is not defined. create object
                        scope[token] = {};
                        scope = scope[token];
                    }
                }

                return scope;
            },

            /**
             * Returns an object that shares the same prototype as the global
             * Fusion object, essentially creating a completely seperate
             * namespace object that is identical to the Fusion global that
             * will not clobber the Fusion namespace while still having a
             * low memory footprint (the only additional properties that are
             * created are specific to the instances themselves).
             *
             * @method  createNamespace
             * @return  {Object}
             */
            createNamespace: function () {
                return new Fusion();
            },

            /**
             * Returns true if the argument object shares the same prototype
             * as the Fusion global
             *
             * @method isFusionNamespace
             * @param   {Object}
             * @return  {Boolean}
             */
            isFusionNamespace: function (obj) {
                if (typeof obj !== 'object' || !obj.constructor) {
                    return false;
                }

                return prototype === obj.constructor.prototype;
            },

            /**
             * Empty function
             *
             * @method: NOOP
             * @return {Object}
             */
            NOOP: NOOP,

            Logger: global.console || {
                log: NOOP,
                warn: NOOP,
                error: NOOP,
                info: NOOP
            }
        };

    Fusion.prototype = prototype;

    F = new Fusion();

    if (typeof global.Fusion !== 'undefined') {
        F.Logger.warn(
            'Fusion is already defined in this scope and will be clobbered.'
        );
    }

    global.Fusion = F;

    //static
    F.VERSION = '-∞';
    F.toString = function () {
        return 'Fusion.js: VERSION ' + F.VERSION;
    };

    //configurable settings the bootstapper will use to determine how
    //it should initialize itself
    F.ENV = global.ENV || {
        EXTEND_PROTOTYPES: true
    };

    //TODO: this is probably where we should start a new file
/*
(function () {
    F.Observable = {
        notify: function (eventName, args) {
            var observers = this._observers,
                current,
                length,
                i,
                listeners;

            if (!observers) {
                return;
            }

            listeners = observers[eventName];

            if (!listeners) {
                return;
            }

            for (i = 0, length = listeners.length; i < length; i++) {
                current = listeners[i];

                if (current && typeof current.notify === 'function') {
                    try {
                        current.notify(args);
                    } catch (e) {
                        F.logger.error(
                            'Observable.notify: Subscription callback',
                            current,
                            'threw an Error. Skipping'
                        );

                        current.setError(e);
                    }
                } else {
                    F.logger.warn(
                        'Observable.notify:',
                        current,
                        'is not a callable function. Skipping.'
                    );
                }
            }
        },

        attach: function (eventName, callback, context) {
            //TODO: validate arguments
            var observers = this._observers || {};
                listeners = observers[eventName] || [];
                subscription = new Subscription(eventName, callback, context);

            listeners.push(subscription);

            return subscription;
        },

        detach: function (subscription) {
            var observers = this._observers;
                listeners,
                index;

            if (!observers || !subscription) {
                return false;
            }

            listeners = observers[subscription.eventName];
            index = indexOf.call(listeners, subscription);

            if (index === -1) {
                return false;
            }

            observers.splice(index, 1);
            return true;
        }
    };
}).call(this);
*/
}).call(this);
