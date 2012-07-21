(function () {
    "use strict";

    var f = this.fusion,
        fProto = f.constructor.prototype,
        object = f.object,
        func = {};

    func.isFunction = function (obj) {
        return object.toString(obj) === '[object Function]';
    };

    fProto.func = func;
}).call(this);
