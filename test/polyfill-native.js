(function () {
    "use strict";

    var global = this,
        fusion = global.fusion || require('fusion'),
        buster = global.buster || require('buster'),
        forEach = fusion.array.forEach,
        keys = fusion.object.keys,

        _expected = global.POLYFILL_NATIVE_EXPECTED;


    buster.testCase('does fusion behave when POLYFILL_NATIVE is false?', {
        test: function () {
            if (!_expected) {
                assert(false, 'CONFIG not loaded');
            }

            // this is where i make JavaScript cosplay as Lisp
            forEach(keys(_expected), function (native) {
                forEach(keys(_expected[native]), function (k) {
                    if (k === 'prototype') {
                        forEach(keys(_expected[native][k]), function (pk) {
                            assert.same(
                                _expected[native][k][pk],
                                global[native][k][pk]
                            );
                        });
                    } else {
                        assert.same(
                            _expected[native][k],
                            global[native][k]
                        );
                    }
                });
            });
        }
    });
}).call(this);
