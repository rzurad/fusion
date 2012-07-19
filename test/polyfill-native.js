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

            //TODO: needs more recursion
            forEach(keys(_expected), function (k) {
                if (_expected[k] === 'prototype') {
                    forEach(keys(_expected.prototype), function (pk) {
                        assert.same(_expected[k][pk], global[k][pk]);
                    });
                } else {
                    assert.same(_expected[k], global[k]);
                }
            });
        }
    });
}).call(this);
