(function () {
    "use strict";

    var Fusion = this.Fusion || require('fusion'),
        buster = this.buster || require('buster'),
        keys = Fusion.object.keys,
        indexOf = Fusion.array.indexOf,
        forEach = Fusion.array.forEach,
        isArray = Fusion.array.isArray;

    //test cases from https://github.com/kriskowal/es5-shim/blob/master/tests/spec/s-object.js
    buster.testCase('object keys tests', {
        setUp: function () {
            var obj = {
                    str: 'foo',
                    obj: {},
                    arr: [],
                    bool: true,
                    num: 42,
                    'null': null,
                    'undefined': void 0
                };

            this.obj = obj;
            this.keys = keys(obj);
        },

        length: function () {
            assert.same(this.keys.length, 7);
        },

        returnArray: function () {
            assert.same(isArray(this.keys), true);
        },

        /*
        'returns own property names': function () {
            forEach(this.keys, function (key) {
                assert(this.obj.hasOwnProperty(name));
            }, this);
        },

        'return names which are enumerable': function () {
            var looped = [],
                key;

            for (key in this.obj) {
                looped.push(key);
            }

            forEach(this.keys, function (key) {
                refute.same(indexOf(key), -1);
            });
        },
        */

        nonObject: function () {
            assert.exception(function () {
                keys(123);
            });
        }
    });
}).call(this);
