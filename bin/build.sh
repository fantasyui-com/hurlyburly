#!/bin/sh

npm update

cp src/server.js dist/server.js;
cp src/index.html dist;

browserify -e src/client.js -t babelify -t brfs -o dist/client.js;
