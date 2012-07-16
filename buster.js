var config = module.exports;

config['Namespace tests'] = {
    environment: 'browser',
    sources: [
        'src/fusion.js',
    ],
    tests: [
        'test/fusion.js',
    ]
};

config['Array tests'] = {
    environment: 'browser',
    sources: [
        'src/fusion.js',
        'src/array.js',
        'src/object.js'
    ],
    tests: [
        'test/array.js'
    ]
};

config['Object tests'] = {
    environment: 'browser',
    sources: [
        'src/fusion.js',
        'src/array.js',
        'src/object.js'
    ],
    tests: [
        'test/object.js'
    ]
};

config['Observer tests'] = {
    environment: 'browser',
    sources: [
        'src/fusion.js',
        'src/array.js',
        'src/object.js',
        'src/observer.js'
    ],
    tests: [
        'test/observer.js'
    ]
};
