(function () {
    "use strict";

    var global = this,
        fusion = global.fusion || require('fusion'),
        buster = global.buster || require('buster');

    buster.testCase('Making sure fusion behaves when EXTEND_NATIVE is false', {
        check: function () {
            refute.defined(Object.isEqual);
            refute.defined(Array.isArray
        }
    });
}).call(this);
