(function () {
    "use strict";

    var f = this.fusion,
        object = f.object,
        func = f.namespace('func');

    func.isFunction = function (obj) {
        return object.toString(obj) === '[object Function]';
    };
}).call(this);
