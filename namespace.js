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

    var Fusion = {}; //objec for now. Might benefit later to be a function

    /**
     * Adds a namespace object on the Fusion global.
     *
     * @method  namespace
     * @param   {String}    namespace: key to add to the namespace. Use
     *                          periods to signify nested objects.
     *
     * TODO: What about namespacing using other globals as the root?
     *       Consider Sproutcore App-esque solution?
     *       Only namespace to global rather than to global.Fusion?
     */
    Fusion.namespace = function (tokens) {
        if (typeof tokens !== 'string') {
            //TODO: custom error objects?
            throw new TypeError(
                'Fusion.namespace: Expecting string as first argument'
            );
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
    };

    //add to global object
    this.Fusion = Fusion;
}).call(this);
