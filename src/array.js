(function () {
    "use strict";

    if (typeof this.Fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('Fusion namespace not defined. Exiting');
        }

        return;
    }

    var F = this.Fusion,
        array = F.namespace('array'),
        _toString = Object.prototype.toString,

        isArray = Array.isArray || function (obj) {
            return _toString(obj) === '[object Array]';
        },

        // ES5 15.4.4.14
        // http://es5.github.com/#x15.4.4.14
        // http://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
        indexOf = Array.prototype.indexOf || function (needle, fromIndex) {
            var instance = this,
                len,
                n = 0,
                k;

            if (typeof instance !== 'object' || instance === null) {
                throw new TypeError(
                    'Fusion.array.indexOf called on null or undefined'
                );
            }

            instance = Object(instance);
            len = instance.length >>> 0;

            if (!len) {
                return -1;
            }

            if (arguments.length > 0) {
                n = Number(arguments[1]);

                if (n != n) {
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            if (n >= len) {
                return -1;
            }

            k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

            for (; k < len; k++) {
                if (k in instance && instance[k] === needle) {
                    return k;
                }
            }
            
            return -1;
        },

        // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
        forEach = Array.prototype.forEach || function (fn, context) {
            if (typeof this !== 'object' || this === null) {
                throw new TypeError(
                    'Fusion.array.forEach called on null or undefined'
                );
            }

            if (_toString.call(callback) !== '[object Function]') {
                throw new TypeError(
                    'Fusion.array.forEach callback is not a function'
                );
            }

            var obj = Object(this),
                len = obj.length >>> 0, //ensure length is a UInt32
                i = 0,
                val;

            while (i < len) {
                if (i in obj) {
                    val = obj[i];
                    callback.call(context, val, i, obj);
                }

                i++;
            }
        };

    array.indexOf = function (array, needle, fromIndex) {
        return indexOf.call(array, needle, fromIndex);
    };

    array.forEach = function (array, fn, context) {
        return forEach.call(array, fn, context);
    };

    array.isArray = isArray;

    if (F.ENV.SHIM_NATIVE) {
        if (!Array.isArray) {
            Array.isArray = isArray;
        }

        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = indexOf;
        }

        if (!Array.prototype.forEach) {
            Array.prototype.forEach = forEach;
        }
    }
}).call(this);
