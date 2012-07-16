(function () {
    "use strict";

    var global = this,
        Fusion = global.Fusion || require('fusion'),
        buster = global.buster || require('buster'),
        array = Fusion.array,
        object = Fusion.object;

    //test cases from https://github.com/kriskowal/es5-shim
    buster.testCase('array isArray tests', {
        arrays: function () {
            assert.same(array.isArray([]), true);
        },

        notArrays: function () {
            var objects = [
                    'foo',
                    true,
                    false,
                    42,
                    0,
                    {},
                    Object.create(null),
                    /foo/,
                    arguments,
                    void 0,
                    null
                ];

            //check browser live nodelist if available
            if (document) {
                objects.push(document.getElementsByTagName('div'));
            }

            array.forEach(objects, function (o) {
                assert.same(array.isArray(o), false);
            });
        }
    });

    buster.testCase('array indexOf tests', {
        setUp: function () {
            this.arr = [2, 3, void 0, true, 'foo', null, 2, false, 0];
            delete this.arr[1];
        },

        'should find element': function () {
            assert.same(array.indexOf(this.arr, 'foo'), 4);
        },

        'should not find element': function () {
            assert.same(array.indexOf(this.arr, 'bar'), -1);
        },

        'find undefined and skip unset values': function () {
            assert.same(array.indexOf(this.arr, void 0), 2);
        },

        strictTest: function () {
            assert.same(array.indexOf(this.arr, null), 5);
            assert.same(array.indexOf(this.arr, '2'), -1);
        },

        fromIndex: function () {
            assert.same(array.indexOf(this.arr, 2, 2), 6);
            assert.same(array.indexOf(this.arr, 2, 0), 0);
            assert.same(array.indexOf(this.arr, 2, 6), 6);
        },

        negativeFromIndex: function () {
            assert.same(array.indexOf(this.arr, 2, -3), 6);
            assert.same(array.indexOf(this.arr, 2, -9), 0);
        },

        'fromIndex is greater than length': function () {
            assert.same(array.indexOf(this.arr, 'foo', 20), -1);
        },

        'negative fromIndex greater than length': function () {
            assert.same(array.indexOf(this.arr, 'foo', -20), 4);
        },
    });

    buster.testCase('array-like indexOf tests', {
        setUp: function () {
            var i,
                len;

            this.al = {};
            this.array = [2, 3, void 0, true, 'foo', null, 2, false, 0];

            for (i = 0, len = this.array.length; i < len; i++) {
                this.al[i] = this.array[i];
            }

            this.al.length = this.array.length;
            delete this.al[1];
            delete this.array[1];
        },

        missingIndexOf: function () {
            var arr = [1, 2, 3];

            arr.indexOf = null;

            assert.same(array.indexOf(arr, 2), 1);
        },

        argumentsObject: function () {
            (function () {
                assert.same(array.indexOf(arguments, 'foo'), 4);
            }).apply(null, this.array);
        },

        findElement: function () {
            assert.same(array.indexOf(this.al, 'foo'), 4);
        },

        'should not find element': function () {
            assert.same(array.indexOf(this.al, 'bar'), -1);
        },

        'should find undefined and skip unset indicies': function () {
            assert.same(array.indexOf(this.al, void 0), 2);
        },

        strictTest: function () {
            assert.same(array.indexOf(this.al, null), 5);
            assert.same(array.indexOf(this.al, '2'), -1);
        },

        fromIndex: function () {
            assert.same(array.indexOf(this.al, 2, 2), 6);
            assert.same(array.indexOf(this.al, 2, 0), 0);
            assert.same(array.indexOf(this.al, 2, 6), 6);
        },

        'negative fromIndex': function () {
            assert.same(array.indexOf(this.al, 2, -3), 6);
            assert.same(array.indexOf(this.al, 2, -9), 0);
        },

        'fromIndex greater than length': function () {
            assert.same(array.indexOf(this.al, 'foo', 20), -1);
        },

        'negative fromIndex greater than length': function () {
            assert.same(array.indexOf(this.al, 'foo', -20), 4);
        }
    });

    buster.testCase('array forEach tests', {
        setUp: function () {
            this.expected = {
                0: 2,
                2: void 0,
                3: true,
                4: 'foo',
                5: null,
                6: false,
                7: 0
            };

            this.array = [2, 3, void 0, true, 'foo', null, false, 0];
            this.al = {};

            for (var i = 0, len = this.array.length; i < len; i++) {
                this.al[i] = this.array[i];
            }

            this.al.length = this.array.length;

            delete this.array[1];
            delete this.al[1];
        },

        iterateAll: function () {
            var actual = {};

            array.forEach(this.array, function (obj, i) {
                actual[i] = obj;
            });

            assert(object.isEqual(actual, this.expected));
        },

        'iterate all with context': function () {
            var obj = { a: {} };

            array.forEach(this.array, function (obj, i) {
                this.a[i] = obj;
            }, obj);

            assert(object.isEqual(obj.a, this.expected));
        },

        'iterate all array-like': function () {
            var actual = {};

            array.forEach(this.al, function (obj, i) {
                actual[i] = obj;
            });

            assert(object.isEqual(actual, this.expected));
        },

        'iterate all array-like with context': function () {
            var obj = { a: {} };

            array.forEach(this.al, function (obj, i) {
                this.a[i] = obj;
            }, obj);

            assert(object.isEqual(obj.a, this.expected));
        },

        'passes correct parameters': function () {
            var arr = ['1'],
                callback = function () {
                    assert.same(arguments[0], '1');
                    assert.same(arguments[1], 0);
                    assert.same(arguments[2], arr);
                };

            array.forEach(arr, callback);
        },

        'does not affect elements added after it has begun': function () {
            var arr = [1, 2, 3],
                i = 0;

            array.forEach(arr, function (num) {
                i++;
                arr.push(num + 3);
            });

            assert.same(arr.toString(), '1,2,3,4,5,6');
            assert.same(i, 3);
        },

        noContext: function () {
            var strict = (function () { return !this; })(),
                context;

            array.forEach([1], function () {
                context = this;
            });

            if (strict) {
                //if strict mode is supported, it will be es5 compliant
                refute.defined(context);
            } else {
                //otherwise, it will be the global object
                assert.same(context, global);
            }
        }
    });
}).call(this);
