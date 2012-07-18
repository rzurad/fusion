Fusion
========

Javascript framework supporting domain driven design


Testing
=======

Fusion is currently using [buster.js](http://busterjs.org) for in-browser
unit testing.

```
# install node, npm, and buster
git clone git://github.com/joyent/node.git
cd node
git checkout v0.8
./configure
make
sudo make install
sudo npm install -g npm@1.1.43
sudo npm install -g buster@0.6.2
```

Once buster is installed, cd to the root of the fusion directory and:
```
buster server
```

Open as many browsers as you want, point them to the buster server and capture.
Then:
```
buster test
````

immediate todo:
- test cases for Object polyfills
- refactor Fusion to be an Object, not a constructor function
- set up and get node tests passing
- start documenting api (dr.js)
- add func.isFunction
- add native extensions onto native objects in an es5 compliant way
- add wildcard events
- add a more complex detach-while-notifying test
- add env.js test file that tests shims/extensions/normalizations
- f.mix/f.merge/f.decorate

not-so-immediate todo:
- ajax
- mvc
- dom selector interface
- fix this test case for isEqual that randomly fails depending on the time you run the test
```
Finished in 0.066s
Chrome 20.0.1132.57, OS X 10.6 (Snow Leopard): .........F.................                                                      
Failure: Chrome 20.0.1132.57, OS X 10.6 (Snow Leopard) object isEqual tests dates
    [refute] Expected true to be falsy
        at Object.<anonymous> (http://localhost:1111/sessions/c1ef47dc-8005-43e3-9b08-acd3447c7a0f/resources/test/object.js:146:13)

        2 test cases, 27 tests, 122 assertions, 1 failure, 0 errors, 0 timeouts
        Finished in 0.053s
```

currently shimmed functions:
- Array.isArray
- Array.prototype.indexOf
- Array.prototype.forEach
- Object.keys
- Object.defineProperties
- Object.defineProperty
- Object.create

will probably need to be shimmed
- Array.prototype.map
- Array.prototype.reduce
- Array.prototype.reduceRight
- Array.prototype.filter
- Array.prototype.every
- Array.prototype.some
- Array.prototype.lastIndexOf
- Function.prototype.bind
