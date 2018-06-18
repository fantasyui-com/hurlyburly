 const mockTodo = require('./mock.todo.js');
 const {Tree, Root, Branch} = require('./index.js');
 const fakeRecords = mockTodo();

window.pookie = function(){ }

window.pookie.reconcile = function(options, reconciler){

  // when changes are deted the tree will
  reconciler( fakeRecords );

  setInterval(function(){
    reconciler( fakeRecords );
  },3000);

}
