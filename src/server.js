const chokidar = require('chokidar');
const path = require('path');

const retry = require('retry');

const WebSocket = require('ws');

// TODO: Wrap object handeling in Specialized Emitter to escape data: envelope.data madness
// TODO: Employ https://github.com/fantasyui-com/cuddlemuffin for data storage

const wss = new WebSocket.Server({ port: 8081 });

const EventEmitter = require('events');
class Transfusion extends EventEmitter {}
const transfusion = new Transfusion();


wss.on('connection', function connection(socket) {

  transfusion.on('client.storage', (object) => {
    transfusion.emit('send', {name:'object', data: object });
  });

  transfusion.on('send.object', (object) => {
    transfusion.emit('send', {name:'object', data: object });
  })

  transfusion.on('send', (object) => {
    // const encoded = JSON.stringify(object);
    // var operation = retry.operation();
    // operation.attempt(function(currentAttempt) {
    //   if(currentAttempt>1)console.error(`Sending object resulted in an error, rety #${currentAttempt}: ${operation.mainError()}`)
    //
    //   try{
    //     if(socket.readyState == 1) {
    //       socket.send(encoded);
    //      }else{
    //       throw new Error(`readyState error`+ JSON.stringify(object))
    //     }
    //   }catch(e){
    //     //console.log(e)
    //     operation.retry(e);
    //   }
    //
    // });
  });

  transfusion.emit('client.connection', {socket});

  socket.on('message', function incoming(data) {
    //console.log('Got message', data);
    transfusion.emit('client.message', data);
  });

  socket.on('message', function incoming(data) {
    try{
      const envelope = JSON.parse(data);
      transfusion.emit('client.envelope', envelope);

      if(envelope.type) {
        // console.log('Got envelope of type [%s]', envelope.type);
        transfusion.emit(`client.${envelope.type}`, envelope.data);
      }

    }catch(e){
      console.error(e)
    }
  });

})

transfusion.on('client.connection', ({socket}) => {

  transfusion.emit('send.object', {uuid:'aaf', version:1, tags:'todo,today,bork', text:"Buy Milk!"});

  setInterval(function(){
    transfusion.emit('send', {name:'object', data: {uuid:'aag', version:1, tags:'todo,today,bork', text:"Buy Socks!"} });
  }, 1000);

})
