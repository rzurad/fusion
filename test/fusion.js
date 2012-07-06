(function () {
    "use strict";

    var buster = this.buster || require('buster'),
        Fusion = this.Fusion || require('fusion');

    buster.testCase('Namespace', {
        tearDown: function () {
            Fusion = Fusion.createNamespace();
        },

        globalDefined: function () {
            assert.isObject(Fusion, 'Fusion global object not defined');
        },

        namespaceNoArgs: function () {
            var error = 'Fusion.namespace does not return itself ' +
                        'if called with no arguments',
                NS = Fusion.createNamespace();

            assert.same(Fusion.namespace(), Fusion, error);
            assert.same(NS.namespace(), NS, error);
        },

        namespaceArgNotString: function () {
            assert.exception(function () {
                Fusion.namespace(123);
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace([]);
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace({});
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace(/\w/);
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace(true);
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace(function () {});
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace(NaN);
            }, 'TypeError');

            assert.exception(function () {
                Fusion.namespace(void 0);
            }, 'TypeError');
        },

        namespaceIgnoreRestArgs: function () {
            var error = 'Fusion.namespace did not ignore additional arguments';

            Fusion.namespace('One', 'Two');

            assert.isObject(Fusion.One, error);
            refute.defined(Fusion.Two, error);
        },

        namespaceSingleToken: function () {
            var error = 'Fusion.namespace did not create single token ' +
                        'namespace correctly';

            Fusion.namespace('One');
            Fusion.namespace('Two');

            assert.isObject(Fusion.One, error);
            assert.isObject(Fusion.Two, error);
        },

        namespaceNestedTokens: function () {
            var error = 'Fusion.namespace did not create nested namespace ' +
                        'objects correctly';

            Fusion.namespace('One.Two');

            assert.isObject(Fusion.One, error);
            assert.isObject(Fusion.One.Two, error);

            //make sure subsequent calls don't destroy the namespace
            Fusion.One.foo = true;
            Fusion.One.Two.bar = false;

            Fusion.namespace('One.Two.Three');

            assert(Fusion.One.foo === true, error);
            assert(Fusion.One.Two.bar === false, error);
            assert.isObject(Fusion.One.Two.Three, error);
        },

        createNamespace: function () {
            var error = 'Fusion.createNamespace failed to create a new ' +
                        'object that shared the Fusion prototype',
                ns = Fusion.createNamespace();

            //make sure Fusion and ns have the same prototype, are
            //different objects, and only namespace onto themselves
            assert.isObject(ns, error);
            assert.same(
                Fusion.constructor.prototype,
                ns.constructor.prototype,
                error
            );

            refute.same(ns, Fusion, error);

            Fusion.namespace('One');
            ns.namespace('Two');

            assert.isObject(Fusion.One, error);
            assert.isObject(ns.Two, error);
            refute.defined(ns.One, error);
            refute.defined(Fusion.Two, error);
        },

        isFusionNamespace: function () {
            var error = 'Fusion.isFusionNamespace incorrectly identified ' +
                        'object as a Fusion namespace',
                ns = Fusion.createNamespace();

            assert(Fusion.isFusionNamespace(Fusion) === true);
            assert(Fusion.isFusionNamespace(ns) === true);

            assert(Fusion.isFusionNamespace(123) === false);
            assert(Fusion.isFusionNamespace({}) === false);
            assert(Fusion.isFusionNamespace([]) === false);
            assert(Fusion.isFusionNamespace(true) === false);
            assert(Fusion.isFusionNamespace(/\w/) === false);
            assert(Fusion.isFusionNamespace(function () {}) === false);
            assert(Fusion.isFusionNamespace(NaN) === false);
            assert(Fusion.isFusionNamespace(void 0) === false);
        }
    });
}).call(this);
