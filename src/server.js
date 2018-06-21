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

  setInterval(function(){

    try{
      ws.send(JSON.stringify({name:'object', data: {uuid:'aaf', version:1, tags:['todo', 'today', 'bork'], text:"Buy Milk!"} }));
    }catch(e){
      console.log(e)
    }

  }, 2000);

});
