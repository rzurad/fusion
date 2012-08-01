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
        object = f.object,
        func = {},

        USE_NATIVE = f.CONFIG.USE_NATIVE,
        POLYFILL_NATIVE = f.CONFIG.POLYFILL_NATIVE,

        _nativeBind = Function.prototype.bind,
        _slice = Array.prototype.slice,

        bind = (USE_NATIVE && _nativeBind) || function (context) {
            if (typeof this !== 'function') {
                throw new TypeError(
                    'fusion.func.bind must be called on a function'
                );
            }

            var target = this,
                args = _slice.call(arguments, 1),

                bound = function () {
                    if (this instanceof bound) {
                        var F = function () {},
                            self,
                            result;

                        F.prototype = target.prototype;
                        self = new F();
                        result = target.apply(
                            self,
                            args.concat(_slice.call(arguments))
                        );

                        if (Object(result) === result) {
                            return result;
                        }

                        return self;
                    } else {
                        return target.apply(
                            context,
                            args.concat(_slice.call(arguments))
                        );
                    }
                };

            return bound;
        };

    func.isFunction = function (obj) {
        return object.toString(obj) === '[object Function]';
    };

    func.bind = function (fn, context) {
        return bind.apply(fn, _slice.call(arguments, 1));
    };

    fProto.func = func;

    if (POLYFILL_NATIVE) {
        !Function.prototype.bind && (Function.prototype.bind = bind);
    }
}).call(this);
