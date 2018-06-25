const chokidar = require('chokidar');
const path = require('path');

const WebSocket = require('ws');

// TODO: Wrap object handeling in Specialized Emitter to escape data: envelope.data madness
// TODO: Employ https://github.com/fantasyui-com/cuddlemuffin for data storage

const wss = new WebSocket.Server({ port: 8081 });



wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(data) {

    const envelope = JSON.parse(data);

    if(envelope.type === 'storage'){
      console.log('server received envelope of type: %s', envelope.type);
      console.log('%s holds data', envelope.type, envelope.data);

      ws.send( JSON.stringify ( { name:'object', data: envelope.data } ) );

    }else{
      console.log('server received', envelope);

    }

  });

  const target = path.resolve('./dist/index.html');
  console.log("watching: %s", target);

  const watcher = chokidar.watch(target, { persistent: true });

  watcher.on('change', function(path) {
    console.log('path changed: %s', path);
    if(ws.readyState == 1) {
      ws.send(JSON.stringify({ name:'control', data:{command:'reload'} }));
    }
  });
  watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
  });

  if(ws.readyState == 1) ws.send(JSON.stringify({name:'message', data:'Bueno Loco!'}));

  setInterval(function(){

    try{
      if(ws.readyState == 1) ws.send(JSON.stringify({name:'message', data:'something!'}));
    }catch(e){
      //console.log(e)
    }

  }, 5000);

  if(ws.readyState == 1) ws.send(JSON.stringify({name:'object', data: {uuid:'aaf', version:1, tags:'todo,today,bork', text:"Buy Milk!"} }));
  setInterval(function(){

    try{
      if(ws.readyState == 1) ws.send(JSON.stringify({name:'object', data: {uuid:'aag', version:1, tags:'todo,today,bork', text:"Buy Socks!"} }));
    }catch(e){
      //console.log(e)
    }

  }, 2000);

});
