(function () {
    "use strict";

    if (typeof this.fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('fusion namespace not defined. Exiting');
        }

        return;
    }

    var f = this.fusion,
        object = f.namespace('object'),

        _hasDontEnumBug = true,
        _dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        _toString = Object.prototype.toString,
        _dontEnumsLength = _dontEnums.length;

    object.keys = Object.keys || function (obj) {
        var invalid = (typeof obj !== 'object' && typeof obj !== 'function') ||
                      obj === null,
            keys,
            name,
            i,
            dontEnum;

        if (invaid) {
            throw new TypeError('Fusion.object.keys called on non-object');
        }

        keys = [];

        for (name in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(name);
            }
        }

        if (_hasDontEnumBug) {
            for (i = 0; i < _dontEnumsLength; i++) {
                dontEnum = _dontEnums[i];

                if (obj.hasOwnProperty(dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };

    /**
     * isEqual function from Underscore.js 1.3.3
     * commit: d76acef3efae543f2fa01565a87cc37e1a2be6bd
     * Underscore.js is freely distributable under the MIT License
     * (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
     */
    // Internal recursive comparison function for `isEqual`.
    function eq(a, b, stack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the Harmony `egal` proposal:
        // http://wiki.ecmascript.org/doku.php?id=harmony:egal.
        if (a === b) return a !== 0 || 1 / a == 1 / b;

        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) return a === b;

        // Invoke a custom `isEqual` method if one is provided.
        if (a.isEqual && typeof a.isEqual === 'function') return a.isEqual(b);
        if (b.isEqual && typeof b.isEqual === 'function') return b.isEqual(a);

        // Compare `[[Class]]` names.
        var className = _toString.call(a);
        if (className != _toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, dates, and booleans are compared by value.
            case '[object String]':
                // Primitives and their corresponding object wrappers are
                // equivalent; thus, `"5"` is equivalent to `new String("5")`.
                return a == String(b);
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // An `egal` comparison is performed for other numeric values.
                return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values.
                // Dates are compared by their millisecond representations.
                // Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a == +b;
            case '[object RegExp]':
                // RegExps are compared by their source patterns and flags.
                return a.source == b.source &&
                       a.global == b.global &&
                       a.multiline == b.multiline &&
                       a.ignoreCase == b.ignoreCase;
        }

        if (typeof a != 'object' || typeof b != 'object') return false;
    
        // Assume equality for cyclic structures. The algorithm for detecting
        // cyclic structures is adapted from ES 5.1 section 15.12.3, abstract
        // operation `JO`.
        var length = stack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the
            // number of unique nested structures.
            if (stack[length] == a) return true;
        }

        // Add the first object to the stack of traversed objects.
        stack.push(a);
        var size = 0, result = true;

        // Recursively compare objects and arrays.
        if (className == '[object Array]') {
            // Compare array lengths to determine if a deep comparison is
            // necessary.
            size = a.length;
            result = size == b.length;

            if (result) {
                // Deep compare the contents, ignoring non-numeric properties.
                while (size--) {
                    // Ensure commutative equality for sparse arrays.
                    if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
                }
            }
        } else {
            // Objects with different constructors are not equivalent.
            if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;

            // Deep compare objects.
            for (var key in a) {
                if (a.hasOwnProperty(key)) {
                    // Count the expected number of properties.
                    size++;

                    // Deep compare each member.
                    if (!(result = b.hasOwnProperty(key) && eq(a[key], b[key], stack))) break;
                }
            }

            // Ensure that both objects contain the same number of properties.
            if (result) {
                for (key in b) {
                    if (b.hasOwnProperty(key) && !(size--)) break;
                }
                result = !size;
            }
        }

        // Remove the first object from the stack of traversed objects.
        stack.pop();
        return result;
    }

    object.isEqual = function (a, b) {
        return eq(a, b, []);
    };

    if (f.ENV.SHIM_NATIVE) {
        if (!Object.keys) {
            Object.keys = object.keys;
        }
    }
}).call(this);
