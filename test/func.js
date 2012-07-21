(function () {
    "use strict";

    var global = this,
        fusion = global.fusion,
        buster = global.buster,
        func = fusion.func;

    buster.testCase('func.isFunction tests', {
        pass: function () {
            refute(func.isFunction([1, 2, 3]));
            refute(func.isFunction('asdf'));

            assert(func.isFunction(func.isFunction));
        },

        'function from an iframe': function () {
            if (typeof global.document === 'undefined') {
                console.log('No DOM detected. skipping tests.');
                assert(true);
                return;
            }

            var iframe = document.createElement('iframe'),
                idoc;

            document.body.appendChild(iframe);
            idoc = iframe.contentDocument || iframe.contentWindow.document;
            idoc.write('<script>parent.iFunction = (function () {});</script>');
            idoc.close();

            assert(func.isFunction(global.iFunction));

            delete global.iFunction;
            document.body.removeChild(iframe);
        },

        ie: function () {
            //TODO: not sure if this works, but we want to see how
            //IE will react to our isFunction. if this test case fails
            //in IE, then remove it. This only needs to be here until IE's
            //behavior is observed
            var input = document.createElement('input');

            document.body.appendChild(input);

            assert(func.isFunction(input.focus));

            document.body.removeChild(input);
        }
    });
}).call(this);
