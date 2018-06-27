console.info(`[RE]STARTING: ${__filename}`)
require('fs').watch( __filename, () => process.exit(0) );

const fs = require('fs');
const util = require('util');

const chokidar = require('chokidar');
const path = require('path');
const uuid = require('uuid/v4');

const cuddlemuffin = require('cuddlemuffin')();

// const retry = require('retry');

const Retry = require('retry-again');
const WebSocket = require('ws');

const WebSocketStates = {
  'CONNECTING': 0, //	The connection is not yet open.
  'OPEN': 1, //	The connection is open and ready to communicate.
  'CLOSING': 2, //	The connection is in the process of closing.
  'CLOSED': 3, //	The connection is closed.
};

// TODO: Wrap object handeling in Specialized Emitter to escape data: envelope.data madness
// TODO: Employ https://github.com/fantasyui-com/cuddlemuffin for data storage

const wss = new WebSocket.Server({ port: 8081 });

const EventEmitter = require('events');
class Transfusion extends EventEmitter {
  constructor({socket}){
    super();
    this.socket = socket;

    this.interval = setInterval(()=>{
      if(this.socket.isAlive === false){
        this.dispose();
      }
    }, 30000);

  }
  dispose(){
    clearInterval(this.interval);
    Object.keys(this._events)
    .map( eventName=>({eventName, listener:this._events[eventName]}))
    .map(({eventName, listener})=>{ try { this.removeListener(eventName, listener) } catch(e) { console.log(e); } })
  }
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) {
      ws.terminate();
      return
    }
    ws.isAlive = false;
    ws.ping(function(){});
  });
}, 30000);

wss.on('connection', function connection(socket) {

  // must be set before transfusion is initialized
  socket.session = 'session-'+uuid();
  socket.isAlive = true;
  socket.on('pong', function(){this.isAlive = true;});
  console.log(`\n\n${socket.session}: NEW SESSION!`);

  const transfusion = new Transfusion({socket});

  socket.on('close', function(code, reason){
    console.log(`${socket.session}: GOT CLOSE: %s, %s`, code, reason)
    if(!transfusion.disposed) transfusion.dispose();
  })

  socket.on('error', function(e){
    console.log(`${socket.session}: GOT ERROR`,e)
    if(!transfusion.disposed) transfusion.dispose();
  })

  transfusion.on('client.storage', async (object) => {
    await cuddlemuffin.set(object);
    const stored = await cuddlemuffin.get(object.uuid);
    transfusion.emit('send.object', stored);
  });

  transfusion.on('send.object', (object) => {
    transfusion.emit('send', {name:'object', data: object });
  })

  transfusion.on('send', (object) => {

      if ( (socket.readyState == WebSocketStates.CONNECTING) || (socket.readyState == WebSocketStates.OPEN) ) {

        const encoded = JSON.stringify(object);
        const sendMessage = function(){
            try{
              if(socket.readyState == WebSocketStates.OPEN) {
                socket.send(encoded);
                console.log( `${socket.session}: Ready state OK for object uuid: ${object.data.uuid}` );
               }else{
                throw new Error( `${socket.session}: Ready state error for object uuid: ${object.data.uuid}` );
                console.log( `${socket.session}: Ready state error for object uuid: ${object.data.uuid}` );
              }
            } catch(e){
              throw e;
            }
        }

        try{
          sendMessage();
        }catch(e){
          // network problems are many but mostly we await transition between WebSocketStates.CONNECTING to WebSocketStates.OPEN
          // this retry system is in place for solving other network problems such as strange disconnects from keep-alive and proxies
          new Retry(sendMessage, {count:2, delay:100}); // a total of 3 tries.
        }

      }

  });

  transfusion.emit('client.connection', {socket});

  socket.on('message', function incoming(data) {
    transfusion.emit('client.message', data);
  });

  socket.on('message', function incoming(data) {
    try{
      const envelope = JSON.parse(data);
      transfusion.emit('client.envelope', envelope);

      if(envelope.type) {
        transfusion.emit(`client.${envelope.type}`, envelope.data);
      }
    }catch(e){
      console.error(e)
    }
  });

  transfusion.emit('send.object', {uuid:'aaf', version:1, tags:'todo,today,bork', text:"Buy Milk!"});

  transfusion.emit('send', {name:'object', data: {uuid:'aag', version:1, tags:'todo,today,bork', text:"Buy Socks!"} });

})
