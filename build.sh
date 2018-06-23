#!/bin/sh

cp node_modules/bogo/index.js dist/bogo.js;
cp src/server.js dist/server.js;
cp src/index.html dist;
browserify -e src/client.js -t babelify -o dist/client.js;
