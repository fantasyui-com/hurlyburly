const EventEmitter = require('events');
const Retry = require('retry-again');
const WebSocketStates = {
  'CONNECTING': 0, //	The connection is not yet open.
  'OPEN': 1, //	The connection is open and ready to communicate.
  'CLOSING': 2, //	The connection is in the process of closing.
  'CLOSED': 3, //	The connection is closed.
};
module.exports = function({port=8081, debug=false}){

  // Browser Code
  const host = window.document.location.host.replace(/:.*/, '');
  const socket = new WebSocket('ws://' + host + ':'+port);

  // Node Require
  class Bogo extends EventEmitter {}
  const bogo = new Bogo();

  bogo.emit('socket', socket);

  // Bogo Core
  // Bogo Core
  // given object {name: xxx, data: yyy}
  // bogo is captured by bogo.on('xxx', function(yyy){})
  socket.onmessage = function (raw) {
    const {name, data} = JSON.parse(raw.data);
    if(debug) console.log( 'bogo.emit("%s", %s)', name, JSON.stringify({name, data}) );
    bogo.emit(name, data);
  };

  // Bogo Core
  socket.onerror = function (e) {
    bogo.emit('error', e);
  };

  socket.onclose = function (code,error) {
    bogo.emit('close', {code,error});
  };

  // bogo.on('reply', (data) => {
  //   if(data){
  //     const str = JSON.stringify(data);
  //     console.log('Sending', str, socket)
  //     socket.send(str);
  //   }
  // });


  bogo.on('reply', (object) => {

    console.log('Bogo reply!')

    const encoded = JSON.stringify(object);
    const sendMessage = function(){
      console.log('Bogo sendMessage!')

        try{
          if(socket.readyState == WebSocketStates.OPEN) {
            socket.send(encoded);
            console.log( `Ready state OK` );
           }else{
             console.log( `socket.readyState is ${socket.readyState}` );
            throw new Error( `socket.readyState is ${socket.readyState}` );
          }
        } catch(e){
          throw e;
        }
    }

    try{
      if(socket.readyState == WebSocketStates.OPEN) {
      sendMessage();
      }else{
        console.log( `socket.readyState is ${socket.readyState}` );
       throw new Error( `socket.readyState is ${socket.readyState}` );
      }
    }catch(e){
      // network problems are many but mostly we await transition between WebSocketStates.CONNECTING to WebSocketStates.OPEN
      // this retry system is in place for solving other network problems such as strange disconnects from keep-alive and proxies
      console.log('Begin retry procedure....')
      new Retry(sendMessage, {count:10, delay:250, debug: true}); // a total of 3 tries.
    }

  });

  return bogo;
}
