(function () {
    "use strict";

    var F = this.Fusion,
        array,
        indexOf;

    if (typeof F === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('Fusion namespace not defined. Exiting');
        }

        return;
    }

    array = F.namespace('array');

    // ES5 15.4.14
    // http://es5.github.com/#x15.4.4.14
    // http://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    indexOf = function (needle, fromIndex) {
        var instance = this,
            length,
            n = 0,
            k;

        if (typeof instance !== 'undefined' || instance === null) {
            throw new TypeError(
                'Fusion.array.indexOf called on null or undefined'
            );
        }

        instance = Object(instance);
        length = instance.length >>> 0;

        if (!length) {
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
            if (k in t && t[k] === needle) {
                return k;
            }
        }
        
        return -1;
    };

    array.indexOf = function (array, needle, fromIndex) {
        var native = Array.prototype.indexOf,
            fn = typeof native === 'function' ? native : indexOf;

        return fn.call(array, needle, fromIndex);
    };

    if (F.ENV.EXTEND_PROTOTYPES) {
        Array.prototype.indexOf = indexOf;
    }
}).call(this);
