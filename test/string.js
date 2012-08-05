(function () {
    "use strict";

    var fusion = this.fusion,
        buster = this.buster,
        string = fusion.string;

    buster.testCase('string.trim tests', {
        'does it work?': function () {
            var test = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001' +
                       '\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009' +
                       '\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF' +
                       'Hello, World!' +
                       '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001' +
                       '\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009' +
                       '\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

            assert.same(string.trim(test), 'Hello, World!');
            assert.same(string.trim(test).length, 13);
        }
    });
}).call(this);
