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

            assert.same(a.toString(), '1,2,3,1,2,3');
        },

        context: function () {
            debugger;
            var context = [],
                fn = func.bind(function () {
                    array.forEach(_slice.call(arguments), function (arg) {
                        this.push(arg);
                    });
                }, context);

            fn(1, 2, 3);

            assert.same(context.toString(), '1,2,3');
        },

/*
    describe('bind', function() {
        var actual, expected,
            testSubject;
        
        testSubject = {
            push: function(o) {
                this.a.push(o);
            }
        };
        
        function func() {
            Array.prototype.forEach.call(arguments, function(a) {
                this.push(a);
            }, this);
            return this;
        };
        
        beforeEach(function() {
            actual = [];
            testSubject.a = [];
        });
        
        it('binds a context and supplies bound arguments', function() {
            testSubject.func = func.bind(actual, 1,2,3);
            testSubject.func(4,5,6);
            expect(actual).toEqual([1,2,3,4,5,6]);
            expect(testSubject.a).toEqual([]);
        });
        
        it('returns properly without binding a context', function() {
            testSubject.func = function() {
                return this;
            }.bind();
            var context = testSubject.func();
            expect(context).toBe(function() {return this}.call());
        });
        it('returns properly without binding a context, and still supplies bound arguments', function() {
            var context;
            testSubject.func = function() {
                context = this;
                return Array.prototype.slice.call(arguments);
            }.bind(undefined, 1,2,3);
            actual = testSubject.func(1,2,3);
            expect(context).toBe(function() {return this}.call());
            expect(actual).toEqual([1,2,3,1,2,3]);
        });
        it('returns properly while binding a context properly', function() {
            var ret;
            testSubject.func = func.bind(actual);
            ret = testSubject.func(1,2,3);
            expect(ret).toBe(actual);
            expect(ret).not.toBe(testSubject);
        });
        it('returns properly while binding a context and supplies bound arguments', function() {
            var ret;
            testSubject.func = func.bind(actual, 1,2,3);
            ret = testSubject.func(4,5,6);
            expect(ret).toBe(actual);
            expect(ret).not.toBe(testSubject);
        });
        it('passes the correct arguments as a constructor', function() {
            var ret, expected = { name: "Correct" };
            testSubject.func = function(arg) {
                return arg;
            }.bind({ name: "Incorrect" });
            ret = new testSubject.func(expected);
            expect(ret).toBe(expected);
        });
        it('returns the return value of the bound function when called as a constructor', function () {
            var oracle = [1, 2, 3];
            var subject = function () {
                return oracle;
            }.bind(null);
            var result = new subject;
            expect(result).toBe(oracle);
        });
        it('returns the correct value if constructor returns primitive', function() {
            var oracle = [1, 2, 3];
            var subject = function () {
                return oracle;
            }.bind(null);
            var result = new subject;
            expect(result).toBe(oracle);

            oracle = {};
            result = new subject;
            expect(result).toBe(oracle);

            oracle = function(){};
            result = new subject;
            expect(result).toBe(oracle);

            oracle = "asdf";
            result = new subject;
            expect(result).not.toBe(oracle);

            oracle = null;
            result = new subject;
            expect(result).not.toBe(oracle);

            oracle = true;
            result = new subject;
            expect(result).not.toBe(oracle);

            oracle = 1;
            result = new subject;
            expect(result).not.toBe(oracle);
        });
    });
 */
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
