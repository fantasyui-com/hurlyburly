const vfs = `

# Main Objects

make Applications *
make Applications/Todo todo
make Applications/Todo/Today today

`;

const commandLog = [];

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



  const command = {};

  command.clog = function(node, options){
    console.dir(commandLog);
  };

  command.create = function(node, options){
    console.log('Create Action:', options)
  };

  command.stream = function(node, options){
   const path = options.source;
   const template = $(`#${options.template}`).children(0).clone();
   const reconciler = reconcilers[options.reconciler]({node, template});
   pookie.mount(path, reconciler);
  }

  // general purpose command execution
  dataCommand.commands().forEach(function({node, commands}){
   commands.forEach(function(options){
     if(options.on === 'click'){
       $(node).on('click', function(){
         console.info('COMMAND:', options);
         command[options.command](node, options)
         commandLog.push(options);

       });
     }else{
       // Instant execution
       console.info('COMMAND:', options);
       command[options.command](node, options)
       commandLog.push(options);

     }
   })
  }); // forEach


});
