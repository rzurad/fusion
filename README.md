Testing
=======

Fusion is currently using [buster.js](http://busterjs.org) for in-browser
unit testing. The current supported development env is FreeBSD 8.2

```
# install node, npm, and buster
git clone git://github.com/joyent/node.git
cd node
git checkout v0.8.3
./configure
make
sudo make install
sudo npm install -g npm@1.1.44
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
- make sure object.isEqual can handle objects created with our object.create shim
- refactor Fusion to be an Object, not a constructor function
- set up and get node tests passing
- start documenting api (dr.js)
- add func.isFunction
- add wildcard events
- add a more complex detach-while-notifying test
- f.mixin
- f.merge
- f.decorate
- f.clone

not-so-immediate todo:
- ajax
- mvc
- dom selector interface

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
- String.prototype.trim
