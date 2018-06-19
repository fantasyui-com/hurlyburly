const uuidv4 = require('uuid/v4');



const todos = `


  Buy Trash Bags
  Buy Bleach

  Buy White Socks

  Buy Toilet Paper

  Buy Wipes
  Buy Soap

  Buy Toothpaste
  Buy Tooth Brushes

  Buy Vegetable Juice
  Buy Multi Vitamin

  Buy Protein Powder

  Buy Hair Gel
  Buy Hair Conditioner

  Update Readmes on GitHub
  Vaccum Upstairs
  Clean Floor Downstairs

  Clean Fridge
  Wipe Countertops

  Replace Upstairs Window

  Grout Floor Tiles
  Caulk Bathtub Tiles

  Repaint Doors
  Paint Stairs

`.split('\n').map(i=>i.trim()).filter(i=>i);


module.exports = function(m){

  if(m > todos.length) throw new Error('You want too many!');
  if(!m) m = todos.length; // they want all

  const response = [];
  for(let c=0;c<m;c++){
    const todo = {};
    todo.uuid = uuidv4();
    todo.version = 1;
    todo.class = "mock todo pookie";
    /* ---------- */
    todo.text = todos[c];
    todo.due = new Date(Date.now() + (1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * (Math.random()*30)))
    todo.done = false;
    response.push(todo);
  }
  return response;
}
