var config = module.exports;

config['Base'] = {
    env: 'browser',
    sources: [
        'src/fusion.js',
        'src/array.js',
        'src/object.js',
        'src/observer.js'
    ]
};

// test everything in the default recommended config
config['Default'] = {
    extends: 'Base',
    tests: [
        'test/fusion.js',
        'test/array.js',
        'test/object.js',
        'test/observer.js'
    ]
};

// test everything with polyfills (USE_NATIVE = false)
config['!USE_NATIVE'] = {
    extends: 'Base',
    libs: [
        'test/use-native_config.js'
    ],
    tests: [
        'test/fusion.js',
        'test/array.js',
        'test/object.js',
        'test/observer.js'
    ]
};

/*
// test that the native objects are not modified when EXTEND_NATIVE = false
config['!EXTEND_NATIVE'] = {
    extends: 'Base',
    env: 'browser',
    libs: ['test/extend-native_config.js'],
    tests: [
        'test/extend-native.js'
    ]
};
*/

// test that the native objects are not modified when POLYFILL_NATIVE = false
config['!POLYFILL_NATIVE'] = {
    env: 'browser',
    extends: 'Base',
    libs: [
        'test/polyfill-native_config.js'
    ],
    tests: [
        'test/polyfill-native.js'
    ]
};
