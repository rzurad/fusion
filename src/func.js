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
        func = {};

    func.isFunction = function (obj) {
        return object.toString(obj) === '[object Function]';
    };

    fProto.func = func;
}).call(this);
