/// standard boilerplate with ecosystem components
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

const vfs = fs.readFileSync( path.join(__dirname, '..', 'vfs.txt') ).toString();
const pookie = require('pookie')(vfs);
const ensign = require('ensign')({});

const bogo = require('../../bogo')(8081);
const dataCommand = require('data-command')();

const reconcilers = {
  'plain': require('./reconcile.js')
}


/// Prepare node's standard emitter
/// and create the transfusion system

const EventEmitter = require('events');
class Transfusion extends EventEmitter {}
const transfusion = new Transfusion();

transfusion.on('send', (object) => {
  bogo.emit('reply', object);
});

transfusion.on('server.control', (object) => {
  if(object.command === 'reload') window.location.reload(true);
});

transfusion.on('server.object', (object) => {
  console.log('server.object', object)
  pookie.pipe(object); // insert object into pookie
});

/// Register Commands

transfusion.on('command.clog', ({node, options}) => {
  console.dir(ensign.log());
});

transfusion.on('command.create', ({node, options}) => {
  const task = {
    uuid: options.uuid || uuid(),
    version:1,
    tags:'todo,today,bork',
    text: options.text || "Untitled Task"
  };
  console.log('Create Action Called...:', options, task);
  transfusion.emit('send', {type:'storage', data:task});
});

transfusion.on('command.stream', ({node, options}) => {
  const path = options.source;
  const template = $(`#${options.template}`).children(0).clone();
  const reconciler = reconcilers[options.reconciler]({node, template});
  pookie.mount(path, reconciler);
});

/// Flow Preparations

transfusion.on('install.commands', (object) => {

  dataCommand.commands().forEach(function({node, commands}){
   commands.forEach(function(setup){
     if(setup.on === 'click'){
       $(node).on('click', function(){
         console.info('COMMAND EXECUTION (via click):', setup);
         transfusion.emit(`command.${setup.command}`, {node, options:setup});
         ensign.log(setup)
       });
     }else{
       // Instant execution
       console.info('COMMAND:', setup);
       transfusion.emit(`command.${setup.command}`, {node, options:setup});
       ensign.log(setup)
     }
   })
  }); // forEach

  /// bogo to transfusion proxy (for uniformity)
  bogo.on('control', function(object) { transfusion.emit('server.control', object); })
  bogo.on('object', function(object) { transfusion.emit('server.object', object); });
  bogo.on('error', function(object) { transfusion.emit('socket.error', object); });
  bogo.on('close', function(object) { transfusion.emit('socket.close', object); });

});

transfusion.on('dom.ready', (object) => {
  transfusion.emit('install.commands');
});
transfusion.on('socket.error', (object) => {
  console.error(object)
});
transfusion.on('socket.close', (object) => {

  console.log(object.code.code, object.code, object.code)

   if(object.code.code == 1006){
     // Server Down
     console.info('socket.close: Server Restart/Down');
     setTimeout(()=>location.reload(true), 6000);
   }else if(object.code.code == 1001){
     // user reload
     console.info('socket.close: User Reload');
   }else{
     console.info('socket.close:', object);
   }
});

/// Boot Transfusion

$(function() {
  transfusion.emit('dom.ready');
});
