(function () {
    "use strict";

    if (typeof this.fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('fusion namespace not defined. Exiting');
        }

        return;
    }

    var f = this.fusion,
        Observable,
        fProto = f.constructor.prototype,
        keys = f.object.keys,
        forEach = f.array.forEach,
        indexOf = f.array.indexOf;

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
        this.context = context;
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
            var observers = this._observers || (this._observers = {}),
                current,
                length,
                i,
                listeners = observers[name];

            if (!listeners) {
                return;
            }

            //beware that there is nothing preventing a subscriber from
            //calling detach in response to an event, meaning the listeners
            //array can change while we are iterating. this forEach protects
            //against that.
            forEach(listeners, function (subscription) {
                if (subscription instanceof Subscription) {
                    try {
                        subscription.notify({ args: args });
                        subscription.error = null;
                    } catch (e) {
                        f.logger.error(
                            'Observable.notify: Subscription callback',
                            subscription,
                            'threw an Error. Skipping'
                        );

                        subscription.error = e;
                    }
                } else {
                    f.logger.warn(
                        'Observable.notify:',
                        subscription,
                        'is not a callable function. Skipping.'
                    );
                }
            });
        },
        
        attach: function (name, callback, context) {
            var observers = this._observers || (this._observers = {}),
                listeners = observers[name] || (observers[name] = []),
                context = context || this,
                subscription = new Subscription(name, callback, context);

            listeners.push(subscription);

            return subscription;
        },

        once: function (name, callback, context) {
            var instance = this,
                context = arguments.length === 3 ? context : this,
                fn = function () {
                    var result = callback.apply(context, arguments);

                    instance.detach(sub);
                    return result;
                },
                sub = instance.attach(name, fn, context);

            return sub;
        },

        detach: function (arg) {
            var observers = this._observers || (this._observers = {}),
                listeners,
                subscription = arg instanceof Subscription ? arg : void 0,
                str = typeof arg === 'string' ? arg : void 0,
                index, key;

            if (!str && !subscription) {
                //no args detaches everything
                forEach(keys(observers), function (key) {
                    forEach(observers[key], function (sub) {
                        if (sub instanceof Subscription) {
                            sub.detached = true;
                        }
                    });
                });

                this._observers = {};

                return true;
            } else if (str) {
                //string arg detaches all with that name
                if (!observers[str] || !observers[str].length) {
                    return false;
                }

                forEach(observers[str], function (sub) {
                    sub.detached = true;
                });

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
                subscription.detached = true;

                return true;
            }

            return false;
        },

        hasObserver: function (subscription) {
            if (!subscription) {
                return false;
            }

            var observers = this._observers || (this._observers = {}),
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

    //add to fusion prototype
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
