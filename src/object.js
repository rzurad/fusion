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

        POLYFILL_NATIVE = f.CONFIG.POLYFILL_NATIVE,
        EXTEND_NATIVE = f.CONFIG.EXTEND_NATIVE,
        USE_NATIVE = f.CONFIG.USE_NATIVE,

        ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ',
        ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ',
        ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined ' +
                                      'on this javascript engine',

        // will tell us if the current runtime's Object.defineProperty
        // is buggy and we should shim it anyway (Webkit/IE8 standards mode)
        // Designed by hax <https://hax.github.com>
        // IE 8 Reference:
        //  http://msdn.microsoft.com/en-us/library/dd282900.aspx
        //  http://msdn.microsoft.com/en-us/library/dd229916.aspx
        // Webkit Bugs:
        //  https://bugs.webkit.org/show_bug.cgi?id=36423
        _buggyDefineProperty = (function () {
            var doesNativeWork = function (obj) {
                    try {
                        Object.defineProperty(obj, 'sentinel', {});
                        return 'sentinel' in object;
                    } finally {
                        return false;
                    }
                },
                objectWorks = doesNativeWork({}),
                domWorks = typeof document === 'undefined' ||
                           doesNativeWork(document.createElement('div'));
                
            if (!objectWorks || !domWorks) {
                return Object.defineProperty;
            }
        }()),

        // will tell us if we need to do more work in Object.keys shim because
        // of an IE bug
        _hasDontEnumBug = (function () {
            // test if properties that shadow DontEnum are enumerated (IE bug)
            for (var key in { 'toString': null }) {
                return false;
            }

            return true;
        }()),
        _dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],

        _hasOwnProperty = Object.prototype.hasOwnProperty,
        _toString = Object.prototype.toString,
        _dontEnumsLength = _dontEnums.length;


    // in the world of fusion, we say it's ok if you want to modify
    // the toString of an object and have it do something different.
    // You never know when it might come in handy. So heres a little
    // something to protect yourself against people doing it incorrectly
    // behind your back
    object.toString = function (obj) {
        return _toString.call(obj);
    };



    // same deal as with object.toString. this can be a world where we let
    // people blissfully shoot themselves in the foot. This just prevents
    // us from getting blood on our nice new sneakers (unless of course you've
    // modified Object.prototype.hasOwnProperty before you loaded fusion! In
    // that case, you've got us cornered! it's a fair cop! never have we been
    // bested by an individual as cunning and brutal as yourself!)
    object.hasOwnProperty = function (obj, key) {
        return _hasOwnProperty.call(obj, key);
    };



    // Modified polyfill from es5-shim
    // https://github.com/kriskowal/es5-shim/
    object.keys = (USE_NATIVE && Object.keys) || function (obj) {
        var invalid = (typeof obj !== 'object' && typeof obj !== 'function') ||
                      obj === null,
            keys = [],
            name,
            i,
            dontEnum;

        if (invaid) {
            throw new TypeError('Fusion.object.keys called on non-object');
        }

        for (name in obj) {
            if (object.hasOwnProperty(obj, name)) {
                keys.push(name);
            }
        }

        if (_hasDontEnumBug) {
            // walk through all the DontEnum properties that are buggy in IE
            // and check if any are directly on the object
            for (i = 0; i < _dontEnumsLength; i++) {
                dontEnum = _dontEnums[i];

                if (object.hasOwnProperty(obj, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }

        return keys;
    };



    // Modified polyfill from es5-shim
    // https://github.com/kriskowal/es5-shim/
    object.defineProperty = ( USE_NATIVE && 
                              !_buggyDefineProperty &&
                              Object.defineProperty
                            ) || function (obj, prop, desc) {
        //TODO: this!
        return Object.defineProperty(obj, prop, desc);
    };



    // Modified polyfill from es5-shim
    // https://github.com/kriskowal/es5-shim/
    object.defineProperties = (USE_NATIVE && Object.defineProperties) ||
                              function (obj, props) {
        for (var prop in props) {
            if (object.hasOwnProperty(props, prop) && prop !== '__proto__') {
                object.defineProperty(obj, prop, props[prop]);
            }
        }

        return obj;
    };



    // Modified polyfill from es5-shim
    // https://github.com/kriskowal/es5-shim/
    object.create = (USE_NATIVE && Object.create) ||
                    function (proto, props) {
        var obj,
            Type;

        if (proto === null) {
            obj = { __proto__: null };
        } else {
            // only null, objects, and functions can be prototypes
            if (typeof proto !== 'object' && typeof proto !== 'function') {
                throw new TypeError(
                    'Object prototype may only be an Object or null'
                );
            }

            Type = function () {};
            Type.prototype = proto;
            obj = new Type();

            // IE has no built-in implementation of `Object.getPrototypeOf` or
            // the `__proto__` property, so we will be setting one manually
            // so that our shim of `Object.getPrototypeOf` will work as
            // expected with other objects creating using this shim
            obj.__proto__ = proto;
        }

        if (props !== void 0) {
            object.defineProperties(obj, props);
        }

        return obj;
    };



    // Modified isEqual from underscore.js 1.3.3
    // https://github.com/documentcloud/underscore/
    //
    // Internal recursive comparison function for `isEqual`.
    function eq(a, b, stack) {
        var className,
            length,
            size,
            result,
            key;

        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the Harmony `egal` proposal:
        // http://wiki.ecmascript.org/doku.php?id=harmony:egal.
        if (a === b) {
            return a !== 0 || 1 / a == 1 / b;
        }

        // A strict comparison is necessary because `null == undefined`.
        if (a == null || b == null) {
            return a === b;
        }

        // Invoke a custom `isEqual` method if one is provided.
        if (a.isEqual && typeof a.isEqual === 'function') {
            return a.isEqual(b);
        }

        if (b.isEqual && typeof b.isEqual === 'function'){
            return b.isEqual(a);
        }

        // Compare `[[Class]]` names.
        className = object.toString(a);
        if (className != object.toString(b)) {
            return false;
        }

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

        if (typeof a != 'object' || typeof b != 'object') {
            return false;
        }
    
        // Assume equality for cyclic structures. The algorithm for detecting
        // cyclic structures is adapted from ES 5.1 section 15.12.3, abstract
        // operation `JO`.
        length = stack.length;

        while (length--) {
            // Linear search. Performance is inversely proportional to the
            // number of unique nested structures.
            if (stack[length] == a) {
                return true;
            }
        }

        // Add the first object to the stack of traversed objects.
        stack.push(a);

        size = 0;
        result = true;

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
                    result = size in a == size in b &&
                             eq(a[size], b[size], stack);

                    if (!result) {
                        break;
                    }
                }
            }
        } else {
            // Objects with different constructors are not equivalent.
            if ('constructor' in a != 'constructor' in b) {
                return false;
            }

            if (a.constructor != b.constructor) {
                return false;
            }

            // Deep compare objects.
            for (var key in a) {
                if (object.hasOwnProperty(a, key)) {
                    // Count the expected number of properties.
                    size++;

                    // Deep compare each memeber.
                    result = object.hasOwnProperty(b, key) &&
                             eq(a[key], b[key], stack);

                    if (!result) {
                        break;
                    }
                }
            }

            // Ensure that both objects contain the same number of properties.
            if (result) {
                for (key in b) {
                    if (object.hasOwnProperty(b, key) && !(size--)) {
                        break;
                    }
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



    if (POLYFILL_NATIVE) {
        !Object.defineProperties && (
            Object.defineProperties = object.defineProperties
        );
        !Object.keys && (Object.keys = object.keys);
        !Object.create (Object.create = object.create);

        if (!Object.defineProperty && _buggyDefineProperty) {
            Object.defineProperty = object.defineProperty;
        }
    }

    if (EXTEND_NATIVE) {
        Object.isEqual = object.isEqual;
    }
}).call(this);
