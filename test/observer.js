(function () {
    "use strict";

    var buster = this.buster,
        fusion = this.fusion,

        NOOP = function () {};

    buster.testCase('Observer', {
        setUp: function () {
            this.observable = fusion.makeObservable({});
        },

        attachReturnsSubscription: function () {
            var sub = this.observable.attach('foo', NOOP),
                obj = { fizz: 'buzz' };

            //test the Subscription interface
            assert(sub instanceof fusion.Subscription);
            assert.same(sub.name, 'foo');
            assert.same(sub.callback, NOOP);
            assert.isFunction(sub.notify);

            sub = this.observable.attach('foo', NOOP, obj);

            assert.same(sub.context, obj);
        },

        notifyBadCallbacks: function () {
            var o = this.observable,
                called = false,
                sub = o.attach('foo', function () { throw new Error(); });

            fusion.logger.log('expecting Subscription notify callback error');
            o.attach('foo', function () { called = true; });
            o.notify('foo');

            assert(called);
            assert(sub.error);
        },

        notifyWithArgs: function () {
            var o = this.observable;

            o.attach('foo', function (e) {
                assert.same(e.args.foo, 'bar');
                assert.same(e.args.fizz, 'buzz');
            });

            o.notify('foo', {
                foo: 'bar',
                fizz: 'buzz'
            });

            o.attach('bar', function (e) {
                assert.same(e.args, true);
            });

            o.notify('bar', true);
        },

        'notify default context is the observable': function () {
            var o = this.observable;

            o.attach('foo', function (e) {
                assert.same(this, o);
            });

            o.notify('foo');
        },

        once: function () {
            var o = this.observable,
                obj = {},
                foo = [];

            o.once('foo', function () {
                assert.same(this, o);
                foo.push(true);
            });

            o.attach('foo', function () { foo.push(true); });

            o.once('foo', function () {
                assert.same(this, obj);
                foo.push(true);
            }, obj);

            o.attach('foo', function () { foo.push(true); });

            o.notify('foo');
            o.notify('foo');

            assert.same(foo.length, 6);
        },

        notifyWithContext: function () {
            var o = this.observable,
                context = { foo: 'bar' };

            o.attach('foo', function () {
                assert.same(this.foo, 'bar');

                this.fizz = 'buzz';
            }, context);

            o.notify('foo');

            assert.same(context.fizz, 'buzz');
        },

        observableInterface: function () {
            var o = this.observable;

            assert.isFunction(o.notify);
            assert.isFunction(o.detach);
            assert.isFunction(o.attach);
            assert.isFunction(o.hasObserver);
        },

        makeObservable: function () {
            var obj = fusion.makeObservable({ foo: 'bar' }),
                obj2 = fusion.makeObservable({ fizz: 'buzz' }),
                foo = [],
                fn = function () {
                    foo.push(true);
                };

            assert.isObject(obj);
            assert.same(obj.foo, 'bar');

            assert.isFunction(obj.notify);
            assert.isFunction(obj.detach);
            assert.isFunction(obj.attach);
            assert.isFunction(obj.hasObserver);

            obj.attach('foo', fn);
            obj2.attach('foo', fn);

            obj.notify('foo');

            assert.same(foo.length, 1);
        },

        makeObservableBadArgs: function () {
            assert.exception(function () {
                fusion.makeObservable(123);
            });

            assert.exception(function () {
                fusion.makeObservable(true);
            });

            assert.exception(function () {
                fusion.makeObservable(NaN);
            });

            assert.exception(function () {
                fusion.makeObservable(void 0);
            });
        },

        detachSubscription: function () {
            var o = this.observable,
                sub,
                foo = [],
                bar = [],
                fn = function () {
                    foo.push(true);
                };

            sub = o.attach('foo', fn);

            refute(sub.detached);

            o.attach('foo', fn);
            o.attach('foo', fn);
            o.attach('bar', function () { bar.push(true); });
            o.detach(sub);
            o.notify('foo');
            o.notify('bar');
            
            assert(sub.detached);
            assert.same(foo.length, 2);
            assert.same(bar.length, 1);
        },

        detachAll: function () {
            var o = this.observable,
                foo = [],
                bar = [],
                sub1 = o.attach('foo', function () { foo.push(true); }),
                sub2 = o.attach('bar', function () { bar.push(true); });

            o.detach();

            assert(sub1.detached);
            assert(sub2.detached);
            assert.same(foo.length, 0);
            assert.same(bar.length, 0);
        },

        detachAllWithName: function () {
            var o = this.observable,
                foo = [],
                bar = [],
                fn = function () {
                    foo.push(true);
                },
                sub1 = o.attach('foo', fn),
                sub2 = o.attach('bar', function () { bar.push(true); });

            o.notify('foo');
            o.notify('bar');

            assert.same(foo.length, 1);
            assert.same(bar.length, 1);

            o.detach('foo');

            o.notify('foo');
            o.notify('bar');

            assert(sub1.detached);
            refute(sub2.detached);
            assert.same(foo.length, 1);
            assert.same(bar.length, 2);
        },

        notifyIsStack: function () {
            var o = this.observable,
                foo = [],
                bar = [];

            o.attach('foo', function () { foo.push('sub1'); });
            o.attach('bar', function () { bar.push('sub2'); });
            o.attach('foo', function () { foo.push('sub3'); });

            o.notify('foo');

            assert.same(foo.length, 2);
            assert.same(foo[0], 'sub1');
            assert.same(foo[1], 'sub3');
            assert.same(bar.length, 0);

            o.notify('bar');

            assert.same(bar.length, 1);
            assert.same(bar[0], 'sub2');
            assert.same(foo.length, 2);
        },

        attachBadArgs: function () {
            var o = this.observable;

            assert.exception(function () {
                o.attach([], []);
            });

            assert.exception(function () {
                o.attach();
            });
        },

        hasObserver: function () {
            var o1 = fusion.makeObservable({}),
                o2 = fusion.makeObservable({}),
                sub1 = o1.attach('foo', NOOP),
                sub2 = o2.attach('bar', NOOP);

            assert(o1.hasObserver(sub1));
            refute(o1.hasObserver(sub2));
        },

        hasObserverBadArgs: function () {
            var o = this.observable;

            refute(o.hasObserver());
            refute(o.hasObserver({}));
            refute(o.hasObserver([]));
            refute(o.hasObserver(123));
            refute(o.hasObserver(true));
            refute(o.hasObserver(/\w/));
            refute(o.hasObserver(NOOP));
            refute(o.hasObserver(NaN));
            refute(o.hasObserver(void 0));
        }
    });
}).call(this);
