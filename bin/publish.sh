#!/bin/sh

git add .;

git commit -m "Synchronize Local Development Branch";

npm version minor;

git push;

npm publish;
