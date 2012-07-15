(function () {
    "use strict";

    var F = this.Fusion,
        Observable,
        fProto,
        indexOf;

    if (typeof F === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('Fusion namespace not defined. Exiting');
        }

        return;
    }

    indexOf = F.array.indexOf;
    fProto = F.constructor.prototype;

    /**
     * Subscription object. Common object returned by Observables
     * after attaching a observer function that provides an interface to
     * notify its observer and check if the notification callback
     * threw an error.
     *
     * @Object  Subscription
     * @param   {String}    name - key of the event
     * @param   {Function}  callback - function to execute whenever event
     *                                 with the given name is fired
     * @param   {Object}    context - context to execute callback in
     */
    function Subscription(name, callback, context) {
        var error;

        if (typeof name !== 'string') {
            error = 'Subscription requires string name';
            throw new TypeError(error);
        }

        if (typeof callback !== 'function') {
            error = 'Subscription requires a callable function callback';
            throw new TypeError(error);
        }

        this.name = name;
        this.callback = callback;

        if (context) {
            this.context = context;
        }
    }

    Subscription.prototype = {
        constructor: Subscription,

        /**
         * notify the observer function managed by this Subscription
         *
         * @param   {Object}    args - object of parameters to pass to Observer
         */
        notify: function (args) {
            this.callback.call(this.context, args);
        }
    };

    Observable = {
        notify: function (name, args) {
            var observers = this._observers = this._observers || {},
                current,
                length,
                i,
                listeners = observers[name];

            if (!listeners) {
                return;
            }

            for (i = 0, length = listeners.length; i < length; i++) {
                current = listeners[i];

                if (current instanceof Subscription) {
                    try {
                        current.notify({ args: args });
                        current.error = null;
                    } catch (e) {
                        F.logger.error(
                            'Observable.notify: Subscription callback',
                            current,
                            'threw an Error. Skipping'
                        );

                        current.error = e;
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
        
        attach: function (name, callback, context) {
            var observers = this._observers = this._observers || {},
                listeners = observers[name] || (observers[name] = []),
                context = context || this,
                subscription = new Subscription(name, callback, context);

            listeners.push(subscription);

            return subscription;
        },

        detach: function (arg) {
            var observers = this._observers = this._observers || {},
                listeners,
                subscription = arg instanceof Subscription ? arg : void 0,
                str = typeof arg === 'string' ? arg : void 0,
                index;

            if (!str && !subscription) {
                //no args detaches everything
                this._observers = {};

                return true;
            } else if (str) {
                //string arg detaches all with that name
                if (!observers[str] || !observers[str].length) {
                    return false;
                }

                observers[str] = [];

                return true;
            } else if (subscription) {
                //subscription arg detaches just that subscription
                listeners = observers[subscription.name];
                index = indexOf(listeners, subscription);

                if (index === -1) {
                    return false;
                }

                listeners.splice(index, 1);

                return true;
            }

            return false;
        },

        hasObserver: function (subscription) {
            if (!subscription) {
                return false;
            }

            var observers = this._observers = this._observers || {},
                name = subscription.name,
                listeners = observers[name],
                i,
                length;

            if (!listeners || !listeners.length) {
                return false;
            }

            return indexOf(listeners, subscription) !== -1;
        }
    };

    //add to Fusion prototype
    fProto.Subscription = Subscription;
    fProto.Observable = Observable;

    //mixin function to make any object observable
    fProto.makeObservable = function (obj) {
        var key;

        if (!obj || typeof obj !== 'object') {
            throw new TypeError('argument must be an object');
        }

        //TODO: replace with a framework `mix` function
        for (key in Observable) {
            if (Observable.hasOwnProperty(key)) {
                obj[key] = Observable[key];
            }
        }

        return obj;
    };
}).call(this);
