const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');

const vfs = fs.readFileSync( path.join(__dirname, '..', 'vfs.txt') ).toString();
const pookie = require('pookie')(vfs);

const bogo = require('bogo')(8081);
const dataCommand = require('data-command')();

const commandLog = [];
const reconcilers = {
  'plain': require('./reconcile.js')
}


bogo
    .on('message', function(message) {
      const name = 'message';
      const data = 'Hello from Client';
      bogo.emit('reply', {name,data});
    })
    .on('control', function(object) {
      if(object.command === 'reload') window.location.reload(true);
    })
    .on('object', function(object) {
      pookie.pipe(object); // insert object into pookie
    });


$(function() {



  const command = {};

  command.clog = function({node, options}){
    console.dir(commandLog);
  };

  command.create = function({node, options}){

    const task = {
      uuid: options.uuid || uuid(),
      version:1,
      tags:'todo,today,bork',
      text: options.text || "Untitled Task"
    };

    console.log('Create Action Called...:', options, task);
    // pookie.pipe(task); // insert object into pookie

    bogo.emit('reply', {type:'storage',data:task});

  };

  command.stream = function({node, options}){
   const path = options.source;
   const template = $(`#${options.template}`).children(0).clone();
   const reconciler = reconcilers[options.reconciler]({node, template});
   pookie.mount(path, reconciler);
  }


  // DATA-COMMAND BOOTSTRAP
  // general purpose command execution
  dataCommand.commands().forEach(function({node, commands}){
   commands.forEach(function(options){
     if(options.on === 'click'){
       $(node).on('click', function(){
         console.info('COMMAND EXECUTION (via click):', options);
         command[options.command]({node, options})
         commandLog.push(options);
       });
     }else{
       // Instant execution
       console.info('COMMAND:', options);
       command[options.command]({node, options})
       commandLog.push(options);
     }
   })
  }); // forEach
  // DATA-COMMAND


});
