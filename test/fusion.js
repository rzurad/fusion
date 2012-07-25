(function () {
    "use strict";

    var buster = this.buster,
        fusion = this.fusion;

    buster.testCase('Namespace', {
        tearDown: function () {
            fusion = fusion.createNamespace();
        },

        globalDefined: function () {
            assert.isObject(fusion, 'fusion global object not defined');
        },

        namespaceNoArgs: function () {
            var error = 'fusion.namespace does not return itself ' +
                        'if called with no arguments',
                NS = fusion.createNamespace();

            assert.same(fusion.namespace(), fusion, error);
            assert.same(NS.namespace(), NS, error);
        },

        namespaceArgNotString: function () {
            assert.exception(function () {
                fusion.namespace(123);
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace([]);
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace({});
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace(/\w/);
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace(true);
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace(function () {});
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace(NaN);
            }, 'TypeError');

            assert.exception(function () {
                fusion.namespace(void 0);
            }, 'TypeError');
        },

        namespaceIgnoreRestArgs: function () {
            var error = 'fusion.namespace did not ignore additional arguments';

            fusion.namespace('One', 'Two');

            assert.isObject(fusion.One, error);
            refute.defined(fusion.Two, error);
        },

        namespaceSingleToken: function () {
            var error = 'fusion.namespace did not create single token ' +
                        'namespace correctly';

            fusion.namespace('One');
            fusion.namespace('Two');

            assert.isObject(fusion.One, error);
            assert.isObject(fusion.Two, error);
        },

        namespaceNestedTokens: function () {
            var error = 'fusion.namespace did not create nested namespace ' +
                        'objects correctly';

            fusion.namespace('One.Two');

            assert.isObject(fusion.One, error);
            assert.isObject(fusion.One.Two, error);

            //make sure subsequent calls don't destroy the namespace
            fusion.One.foo = true;
            fusion.One.Two.bar = false;

            fusion.namespace('One.Two.Three');

            assert(fusion.One.foo === true, error);
            assert(fusion.One.Two.bar === false, error);
            assert.isObject(fusion.One.Two.Three, error);
        },

        createNamespace: function () {
            var error = 'fusion.createNamespace failed to create a new ' +
                        'object that shared the fusion prototype',
                ns = fusion.createNamespace();

            //make sure fusion and ns have the same prototype, are
            //different objects, and only namespace onto themselves
            assert.isObject(ns, error);
            assert.same(
                fusion.constructor.prototype,
                ns.constructor.prototype,
                error
            );

            refute.same(ns, fusion, error);

            fusion.namespace('One');
            ns.namespace('Two');

            assert.isObject(fusion.One, error);
            assert.isObject(ns.Two, error);
            refute.defined(ns.One, error);
            refute.defined(fusion.Two, error);
        },

        isFusionNamespace: function () {
            var error = 'fusion.isFusionNamespace incorrectly identified ' +
                        'object as a fusion namespace',
                ns = fusion.createNamespace();

            assert(fusion.isFusionNamespace(fusion) === true);
            assert(fusion.isFusionNamespace(ns) === true);

            assert(fusion.isFusionNamespace(123) === false);
            assert(fusion.isFusionNamespace({}) === false);
            assert(fusion.isFusionNamespace([]) === false);
            assert(fusion.isFusionNamespace(true) === false);
            assert(fusion.isFusionNamespace(/\w/) === false);
            assert(fusion.isFusionNamespace(function () {}) === false);
            assert(fusion.isFusionNamespace(NaN) === false);
            assert(fusion.isFusionNamespace(void 0) === false);
        }
    });
}).call(this);
