(function () {
    "use strict";

    var fusion = this.fusion || require('fusion'),
        buster = this.buster || require('buster'),
        object = fusion.object,
        array = fusion.array;

    buster.testCase('stashed object.toString tests', {
        'exists and returns string': function () {
            assert.same(object.toString({}), '[object Object]');
            assert.same(object.toString([]), '[object Array]');
            assert.same(object.toString(true), '[object Boolean]');
            assert.same(object.toString(123), '[object Number]');
            assert.same(object.toString(/\s/), '[object RegExp]');
            assert.same(object.toString(null), '[object Null]');
            assert.same(object.toString(void 0), '[object Undefined]');
            assert.same(object.toString(function () {}), '[object Function]');
            assert.same(object.toString('asdf'), '[object String]');
        }
    });

    buster.testCase('object keys tests', {
        setUp: function () {
            var obj = {
                    str: 'foo',
                    obj: {},
                    arr: [],
                    bool: true,
                    num: 42,
                    'null': null,
                    'undefined': void 0
                };

            this.obj = obj;
            this.keys = object.keys(obj);
        },

        length: function () {
            assert.same(this.keys.length, 7);
        },

        returnArray: function () {
            assert.same(array.isArray(this.keys), true);
        },

        'returns own property names': function () {
            array.forEach(this.keys, function (key) {
                assert(this.obj.hasOwnProperty(key));
            }, this);
        },

        'return names which are enumerable': function () {
            var looped = [],
                key;

            for (key in this.obj) {
                looped.push(key);
            }

            array.forEach(this.keys, function (key) {
                refute.same(array.indexOf(looped, key), -1);
            });
        },

        nonObject: function () {
            assert.exception(function () { object.keys(123); });
            assert.exception(function () { object.keys(null); });
            assert.exception(function () { object.keys(void 0); });
            assert.exception(function () { object.keys('str'); });
            assert.exception(function () { object.keys(true); });
        }
    });

    /**
     * Test cases from Underscore.js 1.3.3
     */
    buster.testCase('object isEqual tests', {
        'basic equality and identity': function () {
            assert(object.isEqual(null, null));
            assert(object.isEqual());

            refute(object.isEqual(0, -0));
            refute(object.isEqual(-0, 0));
            refute(object.isEqual(null, void 0));
            refute(object.isEqual(void 0, null));
        },

        'string object and primitive comparisons': function () {
            assert(object.isEqual('Curly', 'Curly'));
            assert(object.isEqual(new String('Curly'), new String('Curly')));
            assert(object.isEqual(new String('Curly'), 'Curly'));
            assert(object.isEqual('Curly', new String('Curly')));

            refute(object.isEqual('Curly', 'Larry'));
            refute(object.isEqual(new String('Curly'), new String('Larry')));
            refute(
                object.isEqual(
                    new String('Curly'),
                    { toString: function () { return 'Curly'; } }
                )
            );
        },

        'number object and primitive comparisons': function () {
            assert(object.isEqual(75, 75));
            assert(object.isEqual(new Number(75), new Number(75)));
            assert(object.isEqual(75, new Number(75)));
            assert(object.isEqual(new Number(75), 75));

            refute(object.isEqual(new Number(0), -0));
            refute(object.isEqual(0, new Number(-0)));
            refute(object.isEqual(new Number(75), new Number(63)));
            refute(
                object.isEqual(
                    new Number(63),
                    { valueOf: function () { return 63; } }
                )
            );
        },

        'NaN': function () {
            assert(object.isEqual(NaN, NaN));

            refute(object.isEqual(61, NaN));
            refute(object.isEqual(new Number(79), NaN));
            refute(object.isEqual(Infinity, NaN));
        },

        'boolean object and primitive': function () {
            assert(object.isEqual(true, true));
            assert(object.isEqual(new Boolean, new Boolean));
            assert(object.isEqual(true, new Boolean(true)));
            assert(object.isEqual(new Boolean(true), true));

            refute(object.isEqual(new Boolean(true), new Boolean));
        },

        coercion: function () {
            refute(object.isEqual(true, new Boolean(false)));
            refute(object.isEqual("75", 75));
            refute(object.isEqual(new Number(63), new String(63)));
            refute(object.isEqual(75, "75"));
            refute(object.isEqual(0, ""));
            refute(object.isEqual(1, true));
            refute(object.isEqual(new Boolean(false), new Number(0)));
            refute(object.isEqual(false, new String("")));
            refute(object.isEqual(12564504e5, new Date(2009, 9, 25)));
        },

        dates: function () {
            assert(object.isEqual(new Date(2009, 9, 25), new Date(2009, 9, 25)));
            refute(object.isEqual(new Date(2009, 9, 25), new Date(2009, 11, 13)));
            refute(object.isEqual(new Date(2009, 11, 13), {
                getTime: function () {
                    return 12606876e5;
                }
            }));
            refute(object.isEqual(new Date("Curly"), new Date("Curly")));
        },

        functions: function () {
            function First() {
                this.value = 1;
            }

            function Second() {
                this.value = 1;
            }

            First.prototype.value = 1;
            Second.prototype.value = 2;

            refute(object.isEqual(First, Second));
        },

        regex: function () {
            assert(object.isEqual(/(?:)/gim, /(?:)/gim));

            refute(object.isEqual(/(?:)/g, /(?:)/gi));
            refute(object.isEqual(/Moe/gim, /Curly/gim));
            refute(object.isEqual(/(?:)/gi, /(?:)/g));
            refute(object.isEqual(/Curly/g, {
                source: "Larry",
                global: true,
                ignoreCase: false,
                multiline: false
            }))
        },

        'empty arrays, array-like objects, and object literals': function () {
            assert(object.isEqual({}, {}));
            assert(object.isEqual([], []));
            assert(object.isEqual([{}], [{}]));

            refute(object.isEqual({length: 0}, []));
            refute(object.isEqual([], {length: 0}));
            refute(object.isEqual({}, []));
            refute(object.isEqual([], {}));

        },

        'Arrays with primitive and object values': function () {
            assert(object.isEqual([1, "Larry", true], [1, "Larry", true]));
            assert(object.isEqual(
                [(/Moe/g), new Date(2009, 9, 25)],
                [(/Moe/g), new Date(2009, 9, 25)]
            ));
        },

        'Multi-dimensional arrays & elements & properties': function () {
            var a = [
                new Number(47),
                false,
                "Larry",
                /Moe/,
                new Date(2009, 11, 13),
                ['running', 'biking', new String('programming')],
                { a: 47 }
            ];

            var b = [
                new Number(47),
                false,
                "Larry",
                /Moe/,
                new Date(2009, 11, 13),
                ['running', 'biking', new String('programming')],
                { a: 47 }
            ];

            assert(object.isEqual(a, b));

            // Overwrite the methods defined in ES 5.1 section 15.4.4.
            a.forEach = a.map = a.filter = a.every = a.indexOf = null;
            a.lastIndexOf = a.some = a.reduce = a.reduceRight = null;
            b.join = b.pop = b.reverse = b.shift = b.slice = b.splice = null;
            b.concat = b.sort = b.unshift = null;

            // Array elements and properties.
            assert(object.isEqual(a, b));

            a.push("White Rocks");

            refute(object.isEqual(a, b));

            a.push("East Boulder");
            b.push("Gunbarrel Ranch", "Teller Farm");

            refute(object.isEqual(a, b));
        },

        'sparse arrays': function () {
            assert(object.isEqual(Array(3), Array(3)));
            refute(object.isEqual(Array(3), Array(6)));

            // According to the Microsoft deviations spec, section 2.1.26,
            // JScript 5.x treats `undefined` elements in arrays as elisions.
            // Thus, sparse arrays and dense arrays containing `undefined`
            // values are equivalent.
            if (0 in [undefined]) {
                refute(
                    object.isEqual(Array(3), [undefined, undefined, undefined])
                );
                refute(
                    object.isEqual([undefined, undefined, undefined], Array(3))
                );
            }
        },

        'simple objects': function () {
            assert(
                object.isEqual(
                    { a: "Curly", b: 1, c: true },
                    { a: "Curly", b: 1, c: true }
                )
            );
            assert(
                object.isEqual(
                    { a: /Curly/g, b: new Date(2009, 11, 13) },
                    { a: /Curly/g, b: new Date(2009, 11, 13) }
                )
            );

            refute(object.isEqual({ a: 63, b: 75 }, { a: 61, b: 55 }));
            refute(object.isEqual({ a: 63, b: 75 }, { a: 61, c: 55 }));
            refute(object.isEqual({ a: 1, b: 2 }, { a: 1 }));
            refute(object.isEqual({ a: 1 }, { a: 1, b: 2 }));
            refute(object.isEqual({ x: 1, y: undefined }, { x: 1, z: 2 }));
        },

        'objects through fusion.object.create': function () {
            var configSimple1 = {
                    so: {
                        value: { say: 'we all' },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                },
                configSimple2 = {
                    so: {
                        value: { say: 'lords of kobol' },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                },
                configSimple1NoEnum = {
                    blackbird: {
                        value: true,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    },
                    so: {
                        value: { say: 'we all' },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                },
                configSimple2NoEnum = {
                    blackbird: {
                        value: true,
                        writable: true,
                        enumerable: false,
                        configurable: true
                    },
                    so: {
                        value: { say: 'lords of kobol' },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                },
                proto, obj1, obj2, obj3;

            proto = null;
            obj1 = object.create(proto, configSimple1);
            obj2 = object.create(proto, configSimple1);
            obj3 = object.create(proto, configSimple2);

            assert(object.isEqual(obj1, obj2));
            refute(object.isEqual(obj1, obj3));
            refute(obj1 === obj2); //TODO: this belongs in an object.create test

            proto = Object.prototype;
            obj1 = object.create(proto, configSimple1);
            obj2 = object.create(proto, configSimple1);
            obj3 = object.create(proto, configSimple2);

            assert(object.isEqual(obj1, obj2));
            refute(object.isEqual(obj1, obj3));

            obj1 = object.create({ so: 'what' }, configSimple1);
            obj2 = object.create({ so: 'buttons' }, configSimple1);
            obj3 = object.create({ so: 'what' }, configSimple2);

            assert(object.isEqual(obj1, obj2));
            refute(object.isEqual(obj1, obj3));

            proto = { happenedBefore: true };
            obj1 = object.create(proto, configSimple1);
            obj2 = object.create(proto, configSimple1NoEnum);
            obj3 = object.create(proto, configSimple2NoEnum);

            assert(object.isEqual(obj1, obj2));
            refute(object.isEqual(obj1, obj3));
        },

        'nested objects': function () {
            // `A` contains nested objects and arrays.
            var a = {
                name: new String("Moe Howard"),
                age: new Number(77),
                stooge: true,
                hobbies: ["acting"],
                film: {
                    name: "Sing a Song of Six Pants",
                    release: new Date(1947, 9, 30),
                    stars: [new String("Larry Fine"), "Shemp Howard"],
                    minutes: new Number(16),
                    seconds: 54
                }
            };

            // `B` contains equivalent nested objects and arrays.
            var b = {
                name: new String("Moe Howard"),
                age: new Number(77),
                stooge: true,
                hobbies: ["acting"],
                film: {
                    name: "Sing a Song of Six Pants",
                    release: new Date(1947, 9, 30),
                    stars: [new String("Larry Fine"), "Shemp Howard"],
                    minutes: new Number(16),
                    seconds: 54
                }
            };

            assert(object.isEqual(a, b));
        },

        instances: function () {
            function First() {
                this.value = 1;
            }

            function Second() {
                this.value = 1;
            }

            First.prototype.value = 1;
            Second.prototype.value = 2;

            assert(object.isEqual(new First, new First));

            refute(object.isEqual(new First, new Second));
            refute(object.isEqual({value: 1}, new First));
            refute(object.isEqual({value: 2}, new Second));
        },

        'circular arrays': function () {
            var a, b;

            (a = []).push(a);
            (b = []).push(b);

            assert(object.isEqual(a, b));

            a.push(new String("Larry"));
            b.push(new String("Larry"));

            assert(object.isEqual(a, b));

            a.push("Shemp");
            b.push("Curly");

            refute(object.isEqual(a, b));
        },

        'circular objects': function () {
            var a = { abc: null },
                b = { abc: null };

            a.abc = a;
            b.abc = b;

            assert(object.isEqual(a, b));

            a.def = 75;
            b.def = 75;

            assert(object.isEqual(a, b));

            a.def = new Number(75);
            b.def = new Number(63);

            refute(object.isEqual(a, b));
        },

        'cyclic structures': function () {
            var a = [{ abc: null }],
                b = [{ abc: null }];

            (a[0].abc = a).push(a);
            (b[0].abc = b).push(b);

            assert(object.isEqual(a, b));

            a[0].def = "Larry";
            b[0].def = "Larry";

            assert(object.isEqual(a, b));

            a[0].def = new String("Larry");
            b[0].def = new String("Curly");

            refute(object.isEqual(a, b));
        },

        'complex circular references': function () {
            var a = { foo: { b: { foo: { c: { foo: null } } } } },
                b = { foo: { b: { foo: { c: { foo: null } } } } };

            a.foo.b.foo.c.foo = a;
            b.foo.b.foo.c.foo = b;

            assert(object.isEqual(a, b));
        },

        'custom isEqual methods': function () {
            var isEqualObj = {
                    isEqual: function (o) { return o.isEqual == this.isEqual; },
                    unique: {}
                },
                isEqualObjClone = {
                    isEqual: isEqualObj.isEqual,
                    unique: {}
                },
                LocalizedString;

            assert(object.isEqual(isEqualObj, isEqualObjClone));
            assert(object.isEqual(isEqualObjClone, isEqualObj));

            refute(object.isEqual(isEqualObj, {}));
            refute(object.isEqual({}, isEqualObj));

            // Custom `isEqual` methods - comparing different types
            LocalizedString = (function () {
                function LocalizedString(id) {
                    this.id = id;
                    this.string = (this.id === 10) ? 'Bonjour': '';
                }

                LocalizedString.prototype.isEqual = function (that) {
                    if (typeof that === 'string') {
                        return this.string == that;
                    } else if (that instanceof LocalizedString) {
                        return this.id == that.id;
                    }
                    return false;
                };

                return LocalizedString;
            })();

            var localized_string1 = new LocalizedString(10),
                localized_string2 = new LocalizedString(10),
                localized_string3 = new LocalizedString(11);

            assert(object.isEqual(localized_string1, localized_string2));

            refute(object.isEqual(localized_string1, localized_string3));

            assert(object.isEqual(localized_string1, 'Bonjour'));
            assert(object.isEqual('Bonjour', localized_string1));

            refute(object.isEqual('Bonjour', localized_string3));
            refute(object.isEqual(localized_string1, 'Au revoir'));
            refute(object.isEqual('Au revoir', localized_string1));
        },

        'is isEqual with serialized data': function () {
            Date.prototype.toJSON = function () {
                return {
                    _type:'Date',
                    year:this.getUTCFullYear(),
                    month:this.getUTCMonth(),
                    day:this.getUTCDate(),
                    hours:this.getUTCHours(),
                    minutes:this.getUTCMinutes(),
                    seconds:this.getUTCSeconds()
                };
            };

            Date.prototype.isEqual = function (that) {
                var this_date_components = this.toJSON(),
                    that_date_components = (that instanceof Date) ? that.toJSON() : that;

                delete this_date_components['_type'];
                delete that_date_components['_type'];

                return object.isEqual(
                    this_date_components,
                    that_date_components
                );
            };

            var date = new Date(),
                date_json = {
                    _type:'Date',
                    year:date.getUTCFullYear(),
                    month:date.getUTCMonth(),
                    day:date.getUTCDate(),
                    hours:date.getUTCHours(),
                    minutes:date.getUTCMinutes(),
                    seconds:date.getUTCSeconds()
                };

            assert(object.isEqual(date_json, date));
            assert(object.isEqual(date, date_json));

            delete Date.prototype.isEqual;
            delete Date.prototype.toJSON;
        }
    });
}).call(this);
