
const bogo = require('bogo')(8081);

bogo.on('message', function(message) {

  console.log('Server Sent: %s', message);
  
  const name = 'message';
  const data = 'Hello from Client';
  bogo.emit('reply', {name,data});

});







 // $(function() {
 //
 //   // Example of a jQuery Reconciler
 //   const reconciler = function({node, template}){
 //     return function(dataList){
 //
 //       dataList.forEach(function(data){
 //         const interpolation = $(template).clone(true);
 //         $(interpolation).attr('id', data.uuid);
 //
 //         $('*[data-variable]', interpolation).each(function(){
 //           const key = $(this).data('variable');
 //           const value = data[key];
 //           if($(this).data('dangerously')){
 //             $(this).html(value);
 //           }else{
 //             $(this).text(value);
 //           }
 //         }); //interpolation
 //
 //         const selection = $('#'+data.uuid, node);
 //         if( selection.length ){
 //           selection.replaceWith(interpolation)
 //         }else{
 //           $(node).append(interpolation);
 //         }
 //
 //       }); // for each data in list
 //
 //     } // returned function
 //   }
 //
 //
 //
 //
 //   $('*[data-mount]').each(function(){
 //     const node = this;
 //     const path = $(node).data('mount');
 //     const template = $(node).children(0).clone();
 //     $(node).children(0).hide();
 //     pookie.reconcile({path}, reconciler({node, template}))
 //   })
 //
 // });
