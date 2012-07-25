(function () {
    "use strict";

    var fusion = this.fusion,
        buster = this.buster;

    buster.testCase('Making sure fusion behaves when EXTEND_NATIVE is false', {
        check: function () {
            refute.defined(Object.isEqual);
        }
    });
}).call(this);
