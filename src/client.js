const vfs = `

# Main Objects
make Root/Users
make Root/Docs
make Root/Messages

# Add Users
make Root/Users/System
make Root/Users/Admin

# Messages to display
make Root/Users/Admin/Messages
make Root/Users/System/Messages

make Applications/Todo/Today today,todo

`;

const pookie = require('pookie')(vfs);
const bogo = require('bogo')(8081);
const reconciler = require('./reconcile.js');

bogo.on('message', function(message) {
  console.log('Server Sent: %s', message);
  const name = 'message';
  const data = 'Hello from Client';
  bogo.emit('reply', {name,data});
});

bogo.on('object', function(object) {
  pookie.pipe(object); // insert object into pookie
});


$(function() {
  $('*[data-mount]').each(function(){
     const node = this;
     const path = $(node).data('mount');
     const template = $(node).children(0).clone();
     $(node).children(0).hide();
     pookie.mount(path, reconciler({node, template}));
   });
});
