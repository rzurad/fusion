(function () {
    "use strict";

    var global = this,
        fusion = global.fusion || require('fusion'),
        buster = global.buster || require('buster'),

        _expected = global.POLYFILL_NATIVE_EXPECTED;


    buster.testCase('does fusion behave when POLYFILL_NATIVE is false?', {
        test: function () {
            var k, pk;

            if (!_expected) {
                assert(false, 'CONFIG not loaded');
            }

            forEach(object.keys(_expected), function (key) {
                if (_expected[k] === 'prototype') {
                    for (pk in object.keys(_expected.prototype])) {
                        assert.same(_expected[k][pk], global[k][pk]);
                    }
                } else {
                    assert.same(_expected[k], global[k]);
                }
            }
        }
    });
}).call(this);
