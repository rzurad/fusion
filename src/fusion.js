(function () {
    "use strict";

    function Fusion () {}

    var global = this,
        NOOP_CHAIN = function () { return this; }, 
        NOOP = function () {},
        f,
        key,
        prototype = {
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
                var scope = this,
                    i, token, error, length;

                if (!arguments.length) {
                    return this;
                } else if (typeof tokens !== 'string') {
                    error = 'namespace: expecting string as first argument';
                    throw new TypeError(error);
                }

                tokens = tokens.split('.');

                for (i = 0, length = tokens.length; i < length; i++) {
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

                return prototype === obj.constructor.prototype;
            },

            /**
             * Empty function that returns the context it was called in
             *
             * @method: NOOP
             * @return {Object}
             */
            NOOP_CHAIN: NOOP_CHAIN,

            NOOP: NOOP,

            logger: global.console || {
                log: NOOP,
                warn: NOOP,
                error: NOOP,
                info: NOOP
            }
        };

    Fusion.prototype = prototype;

    //It would be nice if Fusion wasn't a constructor function and was
    //instead just an ordinary object that the exposed object `fusion` would
    //simply prototype. All the object shims are not loaded until after this
    //file, so we can't quite do that just yet, since it requires
    //`Object.create` to be supported, which we cant assume since our shim
    //can't possibly be loaded before this
    f = new Fusion();

    if (typeof global.fusion !== 'undefined') {
        f.logger.warn(
            'Fusion is already defined in this scope and will be clobbered.'
        );
    }

    global.fusion = f;

    //static
    f.VERSION = '-∞';
    f.toString = function () {
        return 'Fusion.js: VERSION ' + f.VERSION;
    };

    //configurable settings the bootstapper will use to determine how
    //it should initialize itself
    f.CONFIG = {
        //for compatability with any library that modifies native prototypes
        USE_NATIVE: true,

        //polyfill missing native functions with shims that follow the es5
        //spec as best they can
        POLYFILL_NATIVE: true,

        //add custom functions specific to fusion onto native objects
        EXTEND_NATIVE: true
    };

    //if there is a global var named `FUSION_CONFIG`, merge those settings
    //onto our default, overwriting the defaults
    //NOTE: can't use object.merge or object.decorate because we haven't
    //loaded them yet
    for (key in global.FUSION_CONFIG) {
        if (global.FUSION_CONFIG.hasOwnProperty(key)) {
            f.CONFIG[key] = !!global.FUSION_CONFIG[key];
        }
    }
}).call(this);
