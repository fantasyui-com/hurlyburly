const transfusion = require('../../transfusion/server');

const fs = require('fs');
const path = require('path');
const util = require('util');

const cuddlemuffinData =  path.join(__dirname, '..', 'cuddlemuffin-data');
const port = 8081;

transfusion({ cuddlemuffinData, port, });
