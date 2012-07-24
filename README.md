Fusion is currently using [buster.js](http://busterjs.org) for in-browser
unit testing. The current supported development env is FreeBSD 8.2

```
# install node, npm, and buster
git clone git://github.com/rsb/fusion.git
git clone git://github.com/joyent/node.git
cd node
git checkout v0.8.3
sudo gmake install
sudo npm install -g npm@1.1.44
sudo npm install -g buster@0.6.2
cd ../fusion
buster server &
buster test
```

TODO
====

immediate todo:
- figure out what's to be done with merge and decorate
- set up and get node tests passing
- Function.prototype.bind shim
- start documenting api (dr.js)
- add wildcard events

not-so-immediate todo:
- add index-shifting to observers
- add some kind of wrapper event to observer module
- ajax
- mvc
- dom selector interface
- test shims in IE8

currently shimmed functions:
- Array.isArray
- Array.prototype.indexOf
- Array.prototype.forEach
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
