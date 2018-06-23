const vfs = `

# Main Objects

make Applications *
make Applications/Todo todo
make Applications/Todo/Today today

`;

const pookie = require('../../pookie')(vfs);
const bogo = require('bogo')(8081);

const reconcilers = {
  'plain': require('./reconcile.js')
}

const dataCommand = require('data-command')();

bogo.on('message', function(message) {
  //console.log('Server Sent: %s', message);
  const name = 'message';
  const data = 'Hello from Client';
  bogo.emit('reply', {name,data});
});

bogo.on('control', function(object) {
  //console.log('bogo got a control packet....', object)
  if(object.command === 'reload') window.location.reload(true);

});

bogo.on('object', function(object) {
  //console.log('bogo pipe', object)
  pookie.pipe(object); // insert object into pookie
});


$(function() {


   const api = {};
   api.stream = function(node, options){
     const path = options.source;
     const template = $(`#${options.template}`).children(0).clone();
     const reconciler = reconcilers[options.reconciler]({node, template});
     pookie.mount(path, reconciler);

   }


   // general purpose command execution
   dataCommand.commands().forEach(function({node, commands}){
     commands.forEach(function(execute){
       //console.log(`Calling ${execute.command}`)
       api[execute.command](node, execute)
     })
   }); // forEach


});
