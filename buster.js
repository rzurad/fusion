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

config['Enviornment tests'] = {
    environment: 'browser',
    sources: [
        'src/fusion.js',
        'src/env.js'
    ],
    tests: [
        'test/env.js'
    ]
};

config['Observer tests'] = {
    environment: 'browser',
    sources: [
        'src/fusion.js',
        'src/env.js',
        'src/observer.js'
    ],
    tests: [
        'test/observer.js'
    ]
};
