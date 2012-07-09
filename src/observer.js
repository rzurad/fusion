/**
 * Look to for interface:
 * Gang of 4 Book
 * Domain Driven Design Book
 * eve.js
 * TDDJS
 * Diaz book
 */
(function () {
    "use strict";

    var F = this.Fusion,
        fusionPrototype = F.constructor.prototype,
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
        }
    };

    //add to Fusion prototype
    fusionPrototype.Subscription = Subscription;

/*
    Subject = Publisher = Observable = {
        on: function (eventName, callback, {
            context: this,
        })
        attach: function (typeof observer === 'function'),
        detatch: function (typeof observer === 'function' || Subscription),
        notify: function ('event-name[:before, :after]', eObj)
    };

    Observer = Subscriber = EventTarget = Subscription = {
        callback: function () {},
        eventName: 'eventName',
        eventModifier: 
    } || function (EventFacade e) {}
    //do we need observables and observers? (subscription object?)
    //changing z-index
    //getting a list of all event subscriptions (hand them the gun?)
    Fusion.Observable = {
        publish: function ('eventName:before', { opts }) {},
        hasObserver: function (callback, obj?) {},
        subscribe: function ('eventName:after', callback, context),
        on: ^
        publishes: function ('eventName', { opts }
        delegate: function ('eventName', callback, target, context) {},
        unsubscribe: function ('eventName', callback, context) {}
        off: ^
    };

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
