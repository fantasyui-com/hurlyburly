const transfusion = require('../../transfusion/client');

const fs = require('fs');
const path = require('path');
const util = require('util');

const port = 8081;
const vfs = fs.readFileSync( path.join(__dirname, '..', 'vfs.txt') ).toString();

const reconcilers = {
  'plain': require('./reconcile.js')
}

transfusion({ vfs, reconcilers, port, })

.on('command.bork', () => {
  console.log('BORK, BORK, BORK!!!');
});
