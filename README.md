jibo-nlu-js
===========

js wrapper for jibo-nlu functions

Building
===========

OSX:
```
git clone git@github.jibo.com:ramon/jibo-nlu-js.git
cd jibo-nlu-js
node-gyp configure
node-gyp build
export DYLD_LIBRARY_PATH=$PWD/deps/darwin/lib
node lib/example.js $PWD/build/Release/ $PWD/deps/data
```

Ubuntu:

```
git clone git@github.jibo.com:ramon/jibo-nlu-js.git
cd jibo-nlu-js
node-gyp configure
node-gyp build
export LD_LIBRARY_PATH=$PWD/deps/linux/lib
node lib/example.js $PWD/build/Release/ $PWD/deps/data
```

Windows (in cmd, assuming git and node has been installed):

```
git clone git@github.jibo.com:ramon/jibo-nlu-js.git
cd jibo-nlu-js
node-gyp configure
node-gyp build
# copy the dlls from deps/windows/lib to the appropriate directory
# i did not get time to try this, but should work: node lib/example.js <$PWD_equivalent>/build/Release/ <$PWD_equivalent>/deps/data
# I did have time to try node-gyp configure and node-gyp build and they both worked correctly
```