$(".login").on('click', function() {
	$.fancybox($("#initSessionForm"), {
		'width':'640',
		"height": "auto",
	    'autoDimensions':false,
	    'autoSize':false,
	    'closeBtn' : false,
	    'scrolling'   : 'no',
	    afterShow: function () {
	    	$("input[type='text']").val('');
	    	$("input[type='password']").val('');
	    	
	    	$("input[type='button']").on('click', function(){
	    		
	    		$("input[type='text']").css({"border":"1px solid #cacbcc"});
	    		$("input[type='password']").css({"border":"1px solid #cacbcc"});
	    		
	    		var user = $("input[type='text']").val();
	    		var passw = $("input[type='password']").val()
	    		if(user == ""){
	    			$("input[type='text']").css({"border":"1px solid red"});
	    		}
	    		
	    		if(passw == ""){
	    			$("input[type='password']").css({"border":"1px solid red"});
	    		}
	    		
	    		if(user!='' && passw!=''){
	    			$.ajax({
	    				url : "application/views/proxy.php",
	    				data: { "url": url},
	    				dataType: 'xml',
	    				type: "POST",			
	    		        success: function(xml) {
	    		        	
	    		        },
	    		        error: function(){
	    		        	
	    		        }
	    		    });
	    			
	    			
	    			
	    		}
	    		
	    	});
	    }
	});
});   