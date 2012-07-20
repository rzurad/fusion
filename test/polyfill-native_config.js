(function () {
    "use strict";
    
    this.POLYFILL_NATIVE_EXPECTED = {
        'Object': {
            'create': Object.create,
            'keys': Object.keys,
            'defineProperties': Object.defineProperties,
            'defineProperty': Object.defineProperty
        },
        'Array': {
            'isArray': Array.isArray,
            'prototype': {
                'indexOf': Array.prototype.indexOf,
                'forEach': Array.prototype.forEach
            }
        }
    };

    this.FUSION_CONFIG = {
        POLYFILL_NATIVE: false
    };
}).call(this);
