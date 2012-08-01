(function () {
    "use strict";

    var global = this,
        fusion = global.fusion,
        buster = global.buster,
        func = fusion.func,
        array = fusion.array,

        _slice = Array.prototype.slice;

    buster.testCase('func.bind tests', {
        'no context': function () {
            var context,
                fn = func.bind(function () {
                    context = this;
                });

            fn();

            assert.same(context, function () { return this; }.call());
        },

        'no context with args': function () {
            var args,
                context,
                fn = func.bind(function () {
                    args = _slice.call(arguments);
                    context = this;
                }, void 0, 1, 2, 3);

            fn();

            assert.same(args.toString(), '1,2,3');
            assert.same(context, function () { return this; }.call());

            fn(1, 2, 3);

            assert.same(args.toString(), '1,2,3,1,2,3');
        },

        context: function () {
            var context = [],
                fn = func.bind(function () {
                    array.forEach(_slice.call(arguments), function (arg) {
                        this.push(arg);
                    }, this);
                }, context);

            fn(1, 2, 3);

            assert.same(context.toString(), '1,2,3');
        },

        'context with arguments': function () {
            var args,
                context,
                fn = func.bind(function () {
                    args = _slice.call(arguments);
                    context = this;
                }, { atom: 'hydrogen' }, 1, 2, 3);

            fn();

            assert.same(args.toString(), '1,2,3');
            assert.same(context.atom, 'hydrogen');

            fn(4, 5, 6);

            assert.same(args.toString(), '1,2,3,4,5,6');
            assert.same(context.atom, 'hydrogen');
        },

        'returns property without binding a context': function () {
            var context,
                fn = func.bind(function () { return this; });

            context = fn();

            assert.same(context, function () { return this; }.call());
        },

        
        'returns properly with no context and bound arguments': function () {
            var context,
                fn = func.bind(function () {
                    context = this;
                    return _slice.call(arguments);
                }, void 0, 1, 2, 3),
                result = fn(4, 5, 6);

            assert.same(result.toString(), '1,2,3,4,5,6');
            assert.same(context, function () { return this; }.call());
        },

        'returns properly while binding a context properly': function () {
            var context = [],
                fn = func.bind(function () {
                    array.forEach(_slice.call(arguments), function (arg) {
                        this.push(arg);
                    }, this);

                    return this;
                }, context),
                result = fn(1, 2, 3);

            assert.same(context.toString(), '1,2,3');
            assert.same(context, result);
        },

        'returns properly while binding context with bound args': function () {
            var args,
                context,
                fn = func.bind(function () {
                    args = _slice.call(arguments);
                    context = this;

                    return this;
                }, { atom: 'hydrogen' }, 1, 2, 3),
                result = fn();

            assert.same(args.toString(), '1,2,3');
            assert.same(context.atom, 'hydrogen');
            assert.same(context, result);

            result = fn(4, 5, 6);

            assert.same(args.toString(), '1,2,3,4,5,6');
            assert.same(context.atom, 'hydrogen');
            assert.same(context, result);
        },

        'passes the correct arguments as a constructor': function () {
            var expected = { name: "Correct" },
                Subject = func.bind(function (arg) {
                    return arg;
                }, { name: 'Incorrect' }),
                result = new Subject(expected);

            assert.same(result, expected);
        },

        'returns return value of bound function as a constructor': function () {
            var oracle = [1, 2, 3],
                Subject = func.bind(function () {
                    return oracle;
                }, null),
                result = new Subject();

            assert.same(result, oracle);
        },

        'returns correct value if constructor returns primitive': function() {
            var oracle = [1, 2, 3],
                Subject = func.bind(function () {
                    return oracle;
                }, null),
                result = new Subject();

            assert.same(result, oracle);

            oracle = {};
            result = new Subject();
            assert.same(result, oracle);

            oracle = function () {};
            result = new Subject();
            assert.same(result, oracle);

            oracle = "asdf";
            result = new Subject();
            refute.same(result, oracle);

            oracle = null;
            result = new Subject();
            refute.same(result, oracle);

            oracle = true;
            result = new Subject();
            refute.same(result, oracle);

            oracle = 1;
            result = new Subject();
            refute.same(result, oracle);
        }
    });

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
