const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('server received: %s', message);
  });

  ws.send(JSON.stringify({name:'message', data:'Bueno Loco!'}));

  setInterval(function(){

    try{
      ws.send(JSON.stringify({name:'message', data:'something!'}));
    }catch(e){
      console.log(e)
    }

  }, 5000);

});