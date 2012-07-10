(function () {
    "use strict";

    var buster = this.buster || require('buster'),
        Fusion = this.Fusion || require('fusion'),

        NOOP = function () {};

    buster.testCase('Observer', {
        setUp: function () {
            this.observable = new Fusion.Observable();
            this.subscription = new Fusion.Subscription('foo', NOOP);
        },

        attachReturnsSubscription: function () {
            var error = 'Observable.attach did not return ' +
                        'a Subscription object',
                sub = this.observable.attach('foo', NOOP);

            assert.same(
                sub.constructor.prototype,
                Fusion.Subscription.prototype,
                error
            );
        },

        subscriptionInterface: function () {
            var obj = {},
                eventName = 'foo',
                error = 'Subscription object does not conform to the ' +
                        'expected interface',
                sub = new Fusion.Subscription(eventName, NOOP, obj);

            assert(typeof sub.eventName === 'string', error);
            assert(typeof sub.callback === 'function', error);
            assert(typeof sub.context === 'object', error);
            assert(typeof this.subscription.context === 'undefined', error);
            assert.same(sub.eventName, eventName, error);
            assert.same(sub.callback, NOOP, error);
            assert.same(sub.context, obj, error);

            assert.isFunction(sub.notify, error);
            assert.isFunction(sub.setError, error);
            assert.isFunction(sub.clearError, error);
            assert.isFunction(sub.isError, error);
        },

        subscriptionArgs: function () {

        },

        subscriptionNotify: function () {

        },

        subscriptionNotifyError: function () {
            
        }
    });
}).call(this);
