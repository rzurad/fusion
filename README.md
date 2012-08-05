Fusion is currently using [buster.js](http://busterjs.org) for in-browser
unit testing. It is compressed using uglify-js. The current supported development env is FreeBSD 8.2

```
# install/build deps
git clone git://github.com/rsb/fusion.git
git clone git://github.com/joyent/node.git
cd node
git checkout v0.8.3
sudo gmake install
sudo npm install -g npm@1.1.44
sudo npm install -g buster@0.6.2
npm install uglify-js@1.3.3
cd ../fusion

#run tests
buster server &
buster test

#build min file
./build
```

TODO
====

immediate todo:
- figure out what's to be done with merge and decorate
- start documenting api (dr.js)
- add wildcard events

not-so-immediate todo:
- ajax
- mvc
- dom selector interface
- test in as many legacy browsers as possible

currently shimmed functions:
- Array.isArray
- Array.prototype.indexOf
- Array.prototype.forEach
- Function.prototype.bind
- Object.keys
- Object.defineProperties
- Object.defineProperty
- Object.create
- Object.getPrototypeOf

extended functions:
- Object.isEqual

will probably need to be shimmed
- Array.prototype.map
- Array.prototype.reduce
- Array.prototype.reduceRight
- Array.prototype.filter
- Array.prototype.every
- Array.prototype.some
- Array.prototype.lastIndexOf
- String.prototype.trim
