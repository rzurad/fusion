(function () {
    "use strict";

    if (typeof this.fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('fusion namespace not defined. Exiting');
        }

        return;
    }

    var f = this.fusion,
        object = f.object,
        array = f.array,
        func = f.func,

        keys = object.keys,
        forEach = array.forEach,
        indexOf = array.indexOf,

        Observable,

        /**
         * Subscription object. Common object returned by Observables
         * after attaching a observer function that provides an interface to
         * notify its observer and check if the notification callback
         * threw an error.
         */
        Subscription = {
            notify: function (args) {
                this.callback.call(this.context, args);
            }
        },

        _createSubscription = function (name, callback, context) {
            if (typeof name !== 'string') {
                throw new TypeError('Subscription requires string name');
            }

            if (!func.isFunction(callback)) {
                throw new TypeError ('Subscription requires callback function');
            }

            var sub = object.create(Subscription);

            sub.name = name;
            sub.callback = callback;
            sub.context = context;

            return sub;
        },

        fProto = f.constructor.prototype;


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

            //clone the array in case any observers detach in response to
            //this notification and change the size of the listeners array
            listeners = listeners.slice(0);

            //beware that there is nothing preventing a subscriber from
            //calling detach in response to an event, meaning the listeners
            //array can change while we are iterating. this forEach protects
            //against that.
            forEach(listeners, function (subscription) {
                if (Subscription.isPrototypeOf(subscription)) {
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
                subscription = _createSubscription(name, callback, context);

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
                subscription = Subscription.isPrototypeOf(arg) ? arg : void 0,
                str = typeof arg === 'string' ? arg : void 0,
                index, key;

            if (!str && !subscription) {
                //no args detaches everything
                forEach(keys(observers), function (key) {
                    forEach(observers[key], function (sub) {
                        if (Subscription.isPrototypeOf(sub)) {
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

        return object.decorate(obj, Observable, true);
    };
}).call(this);
