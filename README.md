# hurlyburly
Todo Application based on the pookie object tree & cuddlemuffin object store.

## User Interface: Template Reconciler Stream

![](screenshot-1.png)
![](screenshot-2.png)


## Client
```JavaScript

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

```


## Server

```JavaScript

const transfusion = require('../../transfusion/server');

const fs = require('fs');
const path = require('path');
const util = require('util');

const cuddlemuffinData =  path.join(__dirname, '..', 'cuddlemuffin-data');
const port = 8081;

transfusion({ cuddlemuffinData, port, });

```
