(function () {
    "use strict";

    var Fusion = this.Fusion || require('fusion'),
        buster = this.buster || require('buster'),
        indexOf = Fusion.array.indexOf;

    //test cases from https://github.com/kriskowal/es5-shim
    buster.testCase('array indexOf tests', {
        setUp: function () {
            this.arr = [2, 3, void 0, true, 'foo', null, 2, false, 0];
            delete this.arr[1];
        },

        'should find element': function () {
            assert.same(indexOf(this.arr, 'foo'), 4);
        },

        'should not find element': function () {
            assert.same(indexOf(this.arr, 'bar'), -1);
        },

        'find undefined and skip unset values': function () {
            assert.same(indexOf(this.arr, void 0), 2);
        },

        strictTest: function () {
            assert.same(indexOf(this.arr, null), 5);
            assert.same(indexOf(this.arr, '2'), -1);
        },

        fromIndex: function () {
            assert.same(indexOf(this.arr, 2, 2), 6);
            assert.same(indexOf(this.arr, 2, 0), 0);
            assert.same(indexOf(this.arr, 2, 6), 6);
        },

        negativeFromIndex: function () {
            assert.same(indexOf(this.arr, 2, -3), 6);
            assert.same(indexOf(this.arr, 2, -9), 0);
        },

        'fromIndex is greater than length': function () {
            assert.same(indexOf(this.arr, 'foo', 20), -1);
        },

        'negative fromIndex greater than length': function () {
            assert.same(indexOf(this.arr, 'foo', -20), 4);
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

        findElement: function () {
            assert.same(indexOf(this.al, 'foo'), 4);
        },

        'should not find element': function () {
            assert.same(indexOf(this.al, 'bar'), -1);
        },

        'should find undefined and skip unset indicies': function () {
            assert.same(indexOf(this.al, void 0), 2);
        },

        strictTest: function () {
            assert.same(indexOf(this.al, null), 5);
            assert.same(indexOf(this.al, '2'), -1);
        },

        fromIndex: function () {
            assert.same(indexOf(this.al, 2, 2), 6);
            assert.same(indexOf(this.al, 2, 0), 0);
            assert.same(indexOf(this.al, 2, 6), 6);
        },

        'negative fromIndex': function () {
            assert.same(indexOf(this.al, 2, -3), 6);
            assert.same(indexOf(this.al, 2, -9), 0);
        },

        'fromIndex greater than length': function () {
            assert.same(indexOf(this.al, 'foo', 20), -1);
        },

        'negative fromIndex greater than length': function () {
            assert.same(indexOf(this.al, 'foo', -20), 4);
        }
    });
}).call(this);
