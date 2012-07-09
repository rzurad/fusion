(function () {
    "use strict";

    var F = this.Fusion,
        prototype = F.constructor.prototype,
        indexOf;

    if (typeof this.Fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('Fusion namespace not defined. Exiting');
        }

        return;
    }

    indexOf = F.array.indexOf;

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

    Observable = {
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
    prototype.Subscription = Subscription;
    prototype.Observable = Observable;

/*
    //changing z-index
    //getting a list of all event subscriptions (hand them the gun?)

    /* YUI had performance issues when initializing all the observer
     * events and attribute properties on instance creation, which
     * is why they deferred them. no other library I can think of right
     * now does this. What's the merit of doing so? Was it just YUI
     * cruft issues or is there real merit in doing this?
     *
     * It pretty much needs to be a mixin, since we can't do multiple
     * inheritance. augment on creation? augment on first call?
     * manage everything through closures and not actual inheritance?
     * does that even make sense?
     *
     * Look into require and node packages. See if you can leverage
     * this for building, testing, readability
     *
     */
}).call(this);