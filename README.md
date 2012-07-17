Fusion
========

Javascript framework supporting domain driven design


Testing
=======

Fusion is currently using [buster.js](http://busterjs.org) for in-browser
unit testing.

```
# install node
git clone git://github.com/joyent/node.git
cd node
git checkout v0.8.1
./configure
make
sudo make install

# npm v1.1.35 both doesn't build in FreeBSD 8.2 and contains a serious bug
# that prevents it from installing buster. To work around, first install npm:
curl http://npmjs.org/install.sh | sudo sh
cd /usr/local/lib/node_modules/npm

# then apply this patch:
# https://github.com/mintplant/npm/commit/ce5896b36d3129815c7bbbdb1abf5a495b185eac
# you do not need to rebuild npm for the patch to take effect. Simply run:
sudo npm install -g buster
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
- refactor Fusion to be an Object, not a constructor function
- set up and get node tests passing
- start documenting api (dr.js)
- add func.isFunction
- add native extensions onto native objects in an es5 compliant way
- add wildcard events
- add a more complex detach-while-notifying test
- add env.js test file that tests shims/extensions/normalizations
- f.mix

not-so-immediate todo:
- ajax
- mvc
- dom selector interface

currently shimmed functions:
- Array.isArray
- Array.prototype.indexOf
- Array.prototype.forEach
- Object.keys

will probably need to be shimmed
- Array.prototype.map
- Array.prototype.reduce
- Array.prototype.reduceRight
- Array.prototype.filter
- Array.prototype.every
- Array.prototype.some
- Array.prototype.lastIndexOf
- Function.prototype.bind
