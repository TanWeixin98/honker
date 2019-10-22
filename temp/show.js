$(document).ready(function (){
        $('#search').click(function(){
          var limit = $('#limit').val();
          var ts = $('#ts').val;
          $.ajax({
            type: 'POST',
            url: '/search',
            contentType: 'application/json',
            data: {"limit": limit, ts:"ts"},
          }).done(function(res){
            $.each(res.items, function(i, item){
              $('#list').append('<li>'+"username:"+item.username+"  content:"+item.content+'</li>');
            
            })
          
          });
        
        
        });
});
