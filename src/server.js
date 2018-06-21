const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(message) {
    console.log('server received: %s', message);
  });

  if(ws.readyState == 1) ws.send(JSON.stringify({name:'message', data:'Bueno Loco!'}));

  setInterval(function(){

    try{
      if(ws.readyState == 1) ws.send(JSON.stringify({name:'message', data:'something!'}));
    }catch(e){
      //console.log(e)
    }

  }, 5000);

  if(ws.readyState == 1) ws.send(JSON.stringify({name:'object', data: {uuid:'aaf', version:1, tags:['todo', 'today', 'bork'], text:"Buy Milk!"} }));
  setInterval(function(){

    try{
      if(ws.readyState == 1) ws.send(JSON.stringify({name:'object', data: {uuid:'aag', version:1, tags:['todo', 'today', 'bork'], text:"Buy Socks!"} }));
    }catch(e){
      //console.log(e)
    }

  }, 2000);

});
