$(document).ready(function (){
        $('#item').click(function(){
          var id = $('#item_id').val();
          $.ajax({
            type:'GET',
            url: '/item/'+id,
          }).done(function(res){
            $('#list').empty();
            $('#list').append('<li>'+"username:"+res.item.username+"  content:    "+res.item.content+'</li>');
          })
        
        });
        $('#search').click(function(){
          var limit = $('#limit').val();
          var ts = $('#ts').val;
          $.ajax({
            type: 'POST',
            url: '/search',
            contentType: 'application/json',
            data: {"limit": limit, ts:"ts"},
          }).done(function(res){
            $('#list').empty();
            $.each(res.items, function(i, item){
              $('#list').append('<li>'+"username:"+item.username+"  content:"+item.content+'</li>');
            
            })
          
          });
        
        
        });
});
