module.exports = function({transfusion, node, template}){

  // $(node).on('click', 'li', function(){
  //   const uuid = $( this ).attr('id');
  //   console.log('delegated click on uuid %s', uuid, $( this ))
  // })

  $(node).on('change', 'input', function(){
    const uuid = $( this ).closest('li').attr('id');
    const value = $( this ).val()
    console.log('delegated change if input box on uuid %s', uuid, value );

    transfusion.emit('send', {type:'patch', data:{uuid}});

  });

  return function(dataList){

    if(dataList && dataList.forEach) dataList.forEach(function(data){

      const interpolation = $(template).clone(true);
      $(interpolation).attr('id', data.uuid);

      $('*[data-variable]', interpolation).each(function(){

        const key = $(this).data('variable');
        const value = data[key];
        const dangerously = $(this).data('dangerously');

        if( $(this).is('input') ){
          $(this).val(value);
          $(this).on('change', function(){
            const text = $( this ).val()
            console.log('delegated change if input box on uuid %s', data.uuid, value, text );
            transfusion.emit('send', { type:'storage', data:Object.assign( {}, data, {text} ) } );
          });
        }else{
          // Inert Interpolation
          if(dangerously){ $(this).html(value) } else { $(this).text(value) }
        }

       }); //interpolation

       // No merge here, all nodes and events are removed first, then the interpolation is appended.
       // TODO: sorting is requred

      $('#'+data.uuid, node).remove() //  In addition to the elements themselves, all bound events and jQuery data associated with the elements are removed.
      $(node).append(interpolation);


    }); // for each data in list
  } // returned function
}
