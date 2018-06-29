const EventEmitter = require('events');

module.exports = function({port=8081, debug=false}){

  // Browser Code
  const host = window.document.location.host.replace(/:.*/, '');
  const ws = new WebSocket('ws://' + host + ':'+port);

  // Node Require
  class Bogo extends EventEmitter {}
  const bogo = new Bogo();

  bogo.emit('socket', ws);

  // Bogo Core
  // Bogo Core
  // given object {name: xxx, data: yyy}
  // bogo is captured by bogo.on('xxx', function(yyy){})
  ws.onmessage = function (raw) {
    const {name, data} = JSON.parse(raw.data);
    if(debug) console.log( 'bogo.emit("%s", %s)', name, JSON.stringify({name, data}) );
    bogo.emit(name, data);
  };

  // Bogo Core
  ws.onerror = function (e) {
    bogo.emit('error', e);
  };

  ws.onclose = function (code,error) {
    bogo.emit('close', {code,error});
  };

  bogo.on('reply', (event) => {
    ws.send(JSON.stringify(event));
  });

  return bogo;
}
