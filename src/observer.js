(function () {
    "use strict";

    var F = this.Fusion,
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
     * after attaching a Subscriber that provides an interface to
     * notify its observer and check if the notification callback
     * threw an error.
     *
     * @Object  Subscription
     * @param   {String}    eventName - key of the event
     * @param   {Function}  callback - function to execute whenever event
     *                                 with the given eventName is fired
     * @param   {Object}    context - context to execute callback in
     */
    function Subscription(eventName, callback, context) {
        var error;

        if (typeof eventName !== 'string') {
            error = 'Subscription requires string eventName';
            throw new TypeError(error);
        }

        if (typeof callback !== 'function') {
            error = 'Subscription requires a callable function callback';
            throw new TypeError(error);
        }

        this.eventName = eventName;
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
            if (this.context) {
                this.callback.call(context, args);
            } else {
                this.callback(args);
            }
        },

        /**
         * Set this Subscription to be marked as error
         *
         * @param   {Error}     e - Error object from the generated Exception
         */
        setError: function (e) {
            this._isError = true;
            this._error = e;
        },

        /**
         * Returns true if an Error was thrown the last time this 
         * Subscription is called.
         *
         * @return  {Boolean}
         */
        isError: function () {
            return !!this._isError;
        },

        /**
         * Clears the error state.
         */
        clearError: function () {
            this._error = null;
            this._isError = false;
        }
    };

    function Observable() {
        this._observers = {};
    }

    Observable.prototype = {
        constructor: Observable,

        notify: function (eventName, args) {
            var observers = this._observers,
                current,
                length,
                i,
                listeners;

            listeners = observers[eventName];

            if (!listeners) {
                return;
            }

            for (i = 0, length = listeners.length; i < length; i++) {
                current = listeners[i];

                if (current && typeof current.notify === 'function') {
                    try {
                        current.notify(args);
                        current.clearError();
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
            var observers = this._observers = this._observers || {},
                listeners = observers[eventName] || [],
                subscription = new Subscription(eventName, callback, context);

            listeners.push(subscription);

            return subscription;
        },

        detach: function (subscription) {
            var observers = this._observers,
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
        },

        hasObserver: function (subscription) {
            var observers = this._observers,
                name = subscription.name,
                i,
                length;

            if (!observers || !(name in observers)) {
                return false;
            }

            return indexOf.call(listeners, subscription) !== -1;
        }
    };

    //add to Fusion prototype
    fProto.Subscription = Subscription;
    fProto.Observable = Observable;

    //mixin function to make any object observable
    fProto.makeObservable = function (obj) {
        if (!obj || typeof obj !== 'object') {
            throw new TypeError('argument must be an object');
        }

        F.mix(obj, Observable.prototype);
        Observable.call(obj);
    };

/*
    //changing z-index
    //getting a list of all event subscriptions (hand them the gun?)

     * Look into require and node packages. See if you can leverage
     * this for building, testing, readability
     *
     */
}).call(this);
