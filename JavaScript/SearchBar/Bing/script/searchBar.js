$('#search-input').bind('keyup', function(){

	var searchText = $(this).val();
	$.ajax({
            type : "get",
            async:true,
            url : "https://api.bing.com/qsonhs.aspx?type=cb&q="+searchText,
            dataType : "jsonp",
            jsonp: "cb",
            jsonpCallback:"callback",    
        	success: function(d){
				var d = d.AS.Results[0].Suggests;
				var html = '';
				for (var i = 0; i < d.length; i++) {
					html += '<li>'+d[i].Txt+'</li>';
			}
			$('#search-result').html(html);
			$('#search-suggest').show();
		},
    });
	
});

$(document).bind('click',function(){
	$('#search-suggest').hide();
});


$(document).delegate('li','click',function(){
	var keyword = $(this).text();
	location.href = 'http://cn.bing.com/search?q=' + keyword;
});
