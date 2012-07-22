var config = module.exports;

// test everything in the default recommended config
// currently, order matters in the sources list.
config['Default'] = {
    env: 'browser',
    sources: [
        'src/fusion.js',
        'src/array.js',
        'src/object.js',
        'src/func.js',
        'src/observer.js'
    ],
    tests: [
        'test/fusion.js',
        'test/array.js',
        'test/object.js',
        'test/func.js',
        'test/observer.js'
    ]
};

// test everything with polyfills (USE_NATIVE = false)
config['!USE_NATIVE'] = {
    extends: 'Default',
    libs: ['test/use-native_config.js'],
};

// test that the native objects are modified when EXTEND_NATIVE = false
config['!EXTEND_NATIVE'] = {
    extends: 'Default',
    env: 'browser',
    libs: ['test/extend-native_config.js'],
    tests: ['test/extend-native.js']
};

// test that the native objects are not modified when POLYFILL_NATIVE = false
config['!POLYFILL_NATIVE'] = {
    env: 'browser',
    extends: 'Default',
    libs: ['test/polyfill-native_config.js'],
    tests: ['test/polyfill-native.js']
};
