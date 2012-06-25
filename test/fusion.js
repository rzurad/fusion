(function () {
    "use strict";

    TestCase('NamespaceTest', {
        tearDown: function () {
            Fusion = Fusion.createNamespace();
        },

        testIsGlobalDefined: function () {
            assertObject('Fusion global object not defined.', Fusion);
        },

        testNamespaceNoArgs: function () {
            var error = 'Fusion.namespace does not return the fusion global ' +
                        'if called with no arguments';

            assertSame(error, Fusion.namespace(), Fusion);
        },

        testNamespaceArgNotString: function () {
            var error = 'Fusion.namespace did not throw TypeError when ' +
                        'argument supplied and not a string';

            assertException(error, function () {
                Fusion.namespace(123);
            }, 'TypeError');

            assertException(error, function () {
                Fusion.namespace([]);
            }, 'TypeError');

            assertException(error, function () {
                Fusion.namespace({});
            }, 'TypeError');

            assertException(error, function () {
                Fusion.namespace(/\w/);
            }, 'TypeError');

            assertException(error, function () {
                Fusion.namespace(true);
            }, 'TypeError');

            assertException(error, function () {
                Fusion.namespace(function () {});
            }, 'TypeError');

            assertException(error, function () {
                Fusion.namespace(NaN);
            }, 'TypeError');
        },

        testNamespaceIgnoreRestArgs: function () {
            var error = 'Fusion.namespace did not ignore additional arguments';

            Fusion.namespace('One', 'Two');

            assertObject(error, Fusion.One);
            assertUndefined(error, Fusion.Two);
        },

        testNamespaceSingleToken: function () {
            var error = 'Fusion.namespace did not create single token ' +
                        'namespace correctly';

            Fusion.namespace('One');
            Fusion.namespace('Two');

            assertObject(error, Fusion.One);
            assertObject(error, Fusion.Two);
        },

        testNamespaceNestedTokens: function () {
            var error = 'Fusion.namespace did not create nested namespace ' +
                        'objects correctly';

            Fusion.namespace('One.Two');

            assertObject(error, Fusion.One);
            assertObject(error, Fusion.One.Two);

            //make sure subsequent calls don't destroy the namespace
            Fusion.One.foo = true;
            Fusion.One.Two.bar = false;

            Fusion.namespace('One.Two.Three');

            assert(error, Fusion.One.foo === true);
            assert(error, Fusion.One.Two.bar === false);
            assertObject(error, Fusion.One.Two.Three);
        },

        testCreateNamespace: function () {
            var error = 'Fusion.createNamespace failed to create a new ' +
                        'object that shared the Fusion prototype',
                ns = Fusion.createNamespace();

            //make sure Fusion and ns have the same prototype, are
            //different objects, and only namespace onto themselves
            assertObject(error, ns);
            assertSame(
                error,
                Fusion.constructor.prototype,
                ns.constructor.prototype
            );

            assertNotSame(error, ns, Fusion);

            Fusion.namespace('One');
            ns.namespace('Two');

            assertObject(error, Fusion.One);
            assertObject(error, ns.Two);
            assertUndefined(error, ns.One);
            assertUndefined(error, Fusion.Two);
        },

        testIsFusionNamespace: function () {
            var error = 'Fusion.isFusionNamespace incorrectly identified ' +
                        'object as a Fusion namespace',
                ns = Fusion.createNamespace();

            assert(error, Fusion.isFusionNamespace(Fusion) === true);
            assert(error, Fusion.isFusionNamespace(ns) === true);

            assert(error, Fusion.isFusionNamespace(123) === false);
            assert(error, Fusion.isFusionNamespace({}) === false);
            assert(error, Fusion.isFusionNamespace([]) === false);
            assert(error, Fusion.isFusionNamespace(true) === false);
            assert(error, Fusion.isFusionNamespace(/\w/) === false);
            assert(error, Fusion.isFusionNamespace(function () {}) === false);
            assert(error, Fusion.isFusionNamespace(NaN) === false);
        }
    });
}).call(this);
