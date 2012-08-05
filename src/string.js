(function () {
    "use strict";

    if (typeof this.fusion === 'undefined') {
        if (console && typeof console.log === 'function') {
            console.log('fusion namespace not defined. Exiting');
        }

        return;
    }

    var f = this.fusion,
        fProto = f.constructor.prototype,
        string = {},

        USE_NATIVE = f.CONFIG.USE_NATIVE,
        POLYFILL_NATIVE = f.CONFIG.POLYFILL_NATIVE,

        ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002' +
             '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F' +
             '\u3000\u2028\u2029\uFEFF',

        trim,
        beginRegex,
        endRegex;

    if (USE_NATIVE && String.prototype.trim && !ws.trim()) {
        trim = String.prototype.trim;
    } else {
        ws = '[' + ws + ']';
        beginRegex = new RegExp('^' + ws + ws + '*');
        endRegex = new RegExp(ws + ws + '*$');

        // ES5 15.5.4.20
        // http://es5.github.com/#x15.5.4.20
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim = function () {
            if (this === void 0 || this === null) {
                throw new TypeError(
                    "fusion.string.trim: can't convert " + this + ' to object'
                );
            }

            return String(this).replace(beginRegex, '').replace(endRegex, '');
        };
    }

    string.trim = function (str) {
        return trim.call(str);
    };

    fProto.string = string;

    if (POLYFILL_NATIVE) {
        !String.prototype.trim && (String.prototype.trim = trim);
    }
}).call(this);
