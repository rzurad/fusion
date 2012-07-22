(function () {
    "use strict";

    if (typeof this.fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('fusion namespace not defined. Exiting');
        }

        return;
    }

    var f = this.fusion,
        fProto = f.constructor.prototype,
        array = f.array,
        object = {},

        POLYFILL_NATIVE = f.CONFIG.POLYFILL_NATIVE,
        EXTEND_NATIVE = f.CONFIG.EXTEND_NATIVE,
        USE_NATIVE = f.CONFIG.USE_NATIVE,

        __PROTO__ = '__proto__',

        ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ',
        ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ',
        ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined ' +
                                      'on this javascript engine',

        _call = Function.prototype.call,
        _objProto = Object.prototype,

        _supportsAccessors = object.hasOwnProperty(_objProto, '__defineGetter__'),
        _defineGetter,
        _defineSetter,
        _lookupGetter,
        _lookupSetter,

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
        _hasDontEnumBug = !({
            'toString': null
        }).propertyIsEnumerable('toString'),

        _dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],

        _hasOwnProperty = _objProto.hasOwnProperty,
        _toString = _objProto.toString,
        _dontEnumsLength = _dontEnums.length;


    if (_supportsAccessors) {
        _defineGetter = call.bind(_objProto.__defineGetter__);
        _defineSetter = call.bind(_objProto.__defineSetter__);
        _lookupGetter = call.bind(_objProto.__lookupGetter__);
        _lookupSetter = call.bind(_objProto.__lookupSetter__);
    }

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



    object.decorate = function (reciever, supplier, overwrite) {
        array.forEach(object.keys(supplier), function (key) {
            if (!reciever[key] || overwrite) {
                reciever[key] = supplier[key];
            }
        });

        return reciever;
    };



    object.merge = function () {
        var result = {}, //returns new object. one argument == shallow copy
            i,
            len;

        //right-most argument will overwrite.
        for (i = 0, len = arguments.length; i < len; i++) {
            object.decorate(result, arguments[i], true); //TODO: ???
        }

        return result;
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

        if (invalid) {
            throw new TypeError('Fusion.object.keys called on non-object');
        }

        for (name in obj) {
            if (object.hasOwnProperty(obj, name) && name !== __PROTO__) {
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
    object.getPrototypeOf = (USE_NATIVE && Object.getPrototypeOf)
                            || function (obj) {
        return obj.__proto__ || (
            obj.constructor ? obj.constructor.prototype : _objProto
        );
    };



    // Modified polyfill from es5-shim
    // https://github.com/kriskowal/es5-shim/
    object.defineProperty = ( USE_NATIVE && 
                              !_buggyDefineProperty &&
                              Object.defineProperty
                            ) || function (obj, prop, desc) {

        var badObj  = ( typeof obj !== 'object' &&
                        typeof obj !== 'function'
                      ) || obj === null,
            badDesc = ( typeof desc !== 'object' &&
                        typeof desc !== 'function'
                      ) || desc === null;

        if (badObj) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + obj);
        }

        if (badDesc) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + obj);
        }

        // attempt to use the real defineProperty for IE8's DOM elements.
        if (_buggyDefineProperty) {
            try {
                return _buggyDefineProperty.call(Object, obj, prop, desc);
            } finally {}
        }

        // if it's a data property
        if (object.hasOwnProperty(desc, 'value')) {
            if (supportsAccessors && ( lookupGetter(obj, prop) || 
                                       lookupSetter(obj, prop)
                                     )) {

                // as accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while
                // defining a property to make sure that we don't hit an
                // inherited accessor
                var prototype = obj.__proto__;
                obj.__proto__ = Object.prototype;

                // deleting a property anyway since getter/setter may be
                // defined on object itself
                delete obj[prop];

                obj[prop] = desc.value;

                // setting original `__proto__` back
                obj.__proto__ = prototye;
            } else {
                obj[prop] = desc.value;
            }
        } else {
            if (!supportsAccessors) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }

            //if we get this far, then we can use getters and setters
            if (object.hasOwnProperty(desc, 'get')) {
                defineGetter(obj, prop, desc.get);
            }

            if (object.hasOwnProperty(obj, 'set')) {
                defineSetter(obj, prop, desc.set);
            }
        }

        return obj;
    };



    // Modified polyfill from es5-shim
    // https://github.com/kriskowal/es5-shim/
    object.defineProperties = (USE_NATIVE && Object.defineProperties) ||
                              function (obj, props) {
        for (var prop in props) {
            if (object.hasOwnProperty(props, prop) && prop !== __PROTO__) {
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
            obj = {};
            obj[__PROTO__] = null;
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
            obj[__PROTO__] = proto;
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

            if (a[__PROTO__] != a[__PROTO__]) {
                return false;
            }

            // Deep compare objects.
            for (key in a) {
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

    fProto.object = object;

    if (POLYFILL_NATIVE) {
        !Object.defineProperties && (
            Object.defineProperties = object.defineProperties
        );
        !Object.keys && (Object.keys = object.keys);
        !Object.create && (Object.create = object.create);
        !Object.getPrototypeOf && (Object.getPrototypeOf = object.getPrototypeOf);

        if (!Object.defineProperty && _buggyDefineProperty) {
            Object.defineProperty = object.defineProperty;
        }
    }

    if (EXTEND_NATIVE) {
        object.defineProperty(Object, 'isEqual', {
            value: object.isEqual,
            writeable: true,
            enumerable: false,
            configurable: true
        });
    }
}).call(this);
