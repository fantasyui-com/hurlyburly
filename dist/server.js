const util = require('util');

const chokidar = require('chokidar');
const path = require('path');
const uuid = require('uuid/v4');

// const retry = require('retry');

const WebSocket = require('ws');



// TODO: Wrap object handeling in Specialized Emitter to escape data: envelope.data madness
// TODO: Employ https://github.com/fantasyui-com/cuddlemuffin for data storage

const wss = new WebSocket.Server({ port: 8081 });

const EventEmitter = require('events');
class Transfusion extends EventEmitter {
  dispose(){
      Object.keys(this._events)
      .map( eventName=>({eventName, listener:this._events[eventName]}))
      .map(({eventName, listener})=>{

      try {
        this.removeListener(eventName, listener)
      } catch(e) {
        console.log(e);
      }

      })
      this.disposed = true;
  }
}




class Retry {

  constructor( program , options ){

    const defaults = {count:5, delay:10, session:'none'};

    const { count, delay, session } = Object.assign({},defaults,options)

    this.session = session;
    this.count = count;
    this.delay = delay;

    this.program = program;

    this.tries = 0;
  }

  start(){

    setTimeout(()=>{

      let error = null;

      try{
        this.tries++;
        this.program(this.tries);
      } catch(e){
        error=e;
        console.log('%s: FAILURE #%d: %s', this.session, this.tries, e.message);
      }

      if(error){
        if(this.tries<this.count) {
          this.start(); // start again;
        }else{
          console.log('%s: FAILURE #%d: GIVING UP', this.session, this.tries, error.message);
        }
      }else{
        console.log('%s: SENT OK, retries: %d', this.session, this.tries);
        //no error, EXIT;
      }

    }, this.delay);
  }

}








wss.on('connection', function connection(socket) {
  const transfusion = new Transfusion();


  socket.session = 'session-'+uuid();
  console.log(`\n\n${socket.session}: NEW SESSION!`);


  socket.on('close', function(code, reason){
    console.log(`${socket.session}: GOT CLOSE: %s, %s`, code, reason)
    if(!transfusion.disposed) transfusion.dispose();
  })
  socket.on('error', function(e){
    console.log(`${socket.session}: GOT ERROR`,e)
    if(!transfusion.disposed) transfusion.dispose();
  })





  transfusion.on('client.storage', (object) => {
    transfusion.emit('send', {name:'object', data: object });
  });

  transfusion.on('send.object', (object) => {
    transfusion.emit('send', {name:'object', data: object });
  })

  // transfusion.on('send', (object) => {
  //
  //   if(!socket.isAlive) return;
  //
  //   const encoded = JSON.stringify(object);
  //   const sendMessage = function(){
  //       try{
  //
  //         if(socket.readyState == 1) {
  //           socket.send(encoded);
  //           console.log( `${socket.session}: Ready state OK for object uuid: ${object.data.uuid}` );
  //          }else{
  //           throw new Error( `${socket.session}: Ready state error for object uuid: ${object.data.uuid}` );
  //           console.log( `${socket.session}: Ready state error for object uuid: ${object.data.uuid}` );
  //         }
  //       }catch(e){
  //         throw e;
  //       }
  //   }
  //   const retry = new Retry(sendMessage, {count:2, delay:10, session: socket.session});
  //   retry.start();
  //
  // });

  transfusion.on('send', (object) => {

    if(socket ) {
      if(socket.readyState <= 2) {
        const encoded = JSON.stringify(object);
        const sendMessage = function(){
            try{

              if(socket.readyState == 1) {
                socket.send(encoded);
                console.log( `${socket.session}: Ready state OK for object uuid: ${object.data.uuid}` );
               }else{
                throw new Error( `${socket.session}: Ready state error for object uuid: ${object.data.uuid}` );
                console.log( `${socket.session}: Ready state error for object uuid: ${object.data.uuid}` );
              }
            }catch(e){
              throw e;
            }
        }
        const retry = new Retry(sendMessage, {count:2, delay:10, session: socket.session});
        retry.start();
      }
    }



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



  transfusion.emit('send.object', {uuid:'aaf', version:1, tags:'todo,today,bork', text:"Buy Milk!"});
    transfusion.emit('send', {name:'object', data: {uuid:'aag', version:1, tags:'todo,today,bork', text:"Buy Socks!"} });


})

console.info('READY')
