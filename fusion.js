(function () {
    "use strict";

    //check for namespace availability. Give up for now if it's already taken.
    if (typeof this.Fusion !== 'undefined') {
        //TODO: A good framework should probably have some kind of logging
        //module to make patching for IE easier since it doesn't support
        //the console object
        console.error('Fusion namespace seems to already be taken. I quit.');
        return;
    }

    function Fusion () {}

    var prototype = {
            //Follow in the footsteps of all native ECMA5 Objects
            constructor: Fusion,

            /**
             * Adds a namespace object or nested objects on
             * the calling object (`this` context)
             *
             * @method  namespace
             * @param   {String}    namespace: key to add to the namespace. Use
             *                          periods to signify nested objects.
             * @returns {Object}
             */
            namespace: function (tokens) {
                if (typeof tokens !== 'string') {
                    return this;
                }

                var tokens = tokens.split('.'),
                    length = tokens.length,
                    scope = this,
                    i, token;

                for (i = 0; i < length; i++) {
                    token = tokens[i];

                    if (scope[token]) {
                        //current token is already defined. continue iterating
                        scope = scope[token];
                    } else {
                        //current token is not defined. create object
                        scope[token] = {};
                        scope = scope[token];
                    }
                }

                return scope;
            },

            /**
             * Returns an object that shares the same prototype as the global
             * Fusion object, essentially creating a completely seperate
             * namespace object that is identical to the Fusion global that
             * will not clobber the Fusion namespace while still having a
             * low memory footprint (the only additional properties that are
             * created are specific to the instances themselves).
             *
             * @method  createNamespace
             * @return  {Object}
             */
            createNamespace: function () {
                return new Fusion();
            },

            /**
             * Returns true if the argument object shares the same prototype
             * as the Fusion global
             *
             * @method isFusionNamespace
             * @param   {Object}
             * @return  {Boolean}
             */
            isFusionNamespace: function (obj) {
                if (typeof obj !== 'object' || !obj.constructor) {
                    return false;
                }

                return this.constructor.prototype === obj.constructor.prototype;
            },
        };

    Fusion.prototype = prototype;

    //add to global scope
    this.Fusion = new Fusion();
}).call(this);

//I'll turn these into proper unit tests next (and make them much more readable)
//These describe the behavior established so far by the Fusion global
console.log(typeof Fusion === 'object');
console.log(Fusion.namespace() === Fusion);
console.log(Fusion.namespace('One') && !!Fusion.One);
console.log(Fusion.namespace('SevenThree\n') && !!Fusion['SevenThree\n']);
console.log(Fusion.namespace(123) && !Fusion[123]);
console.log(Fusion.namespace('One.Two.Three') && !!Fusion.One.Two.Three);
console.log(typeof Fusion.createNamespace() === 'object');
console.log(!Fusion.createNamespace().One);

//because the Fusion global is created via the `new` keyword, make sure
//it has a constructor property to mimc all native ECMA5 Object prototypes.
console.log(typeof Fusion.constructor === 'function');

console.log(Fusion.isFusionNamespace(Fusion.createNamespace()));
console.log(Fusion.isFusionNamespace({}) === false);
console.log(Fusion.isFusionNamespace(Object.create(Fusion.constructor.prototype)));
console.log(Fusion.constructor.prototype.isPrototypeOf(Fusion.createNamespace()));