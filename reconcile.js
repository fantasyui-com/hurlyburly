module.exports = function({node, template}){
  return function(dataList){

    if(dataList && dataList.forEach) dataList.forEach(function(data){
      const interpolation = $(template).clone(true);
      $(interpolation).attr('id', data.uuid);

      $('*[data-variable]', interpolation).each(function(){
        const key = $(this).data('variable');
        const value = data[key];
        if($(this).data('dangerously')){
          $(this).html(value);
        }else{
          $(this).text(value);
        }
      }); //interpolation

      const selection = $('#'+data.uuid, node);
      if( selection.length ){
        selection.replaceWith(interpolation)
      }else{
        $(node).append(interpolation);
      }

    }); // for each data in list

  } // returned function
}
