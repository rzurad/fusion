(function () {
    "use strict";

    var fs = require('fs'),
        parser = require('uglify-js').parser,
        uglify = require('uglify-js').uglify,

        // use buster source list for concat order of files
        files = require('./buster.js').Default.sources,

        data = [],
        ast;

    files.forEach(function (file) {
        data.push(fs.readFileSync(file, 'ascii'));
    });

    ast = parser.parse(data.join(''));
    ast = uglify.ast_mangle(ast);
    ast = uglify.ast_squeeze(ast);

    fs.writeFile('./fusion-min.js', uglify.gen_code(ast), function (err) {
        if (err) {
            console.log('Error writing to fusion-min.js');
            process.exit(1);
        }

        console.log('Done.');
    });
}());
