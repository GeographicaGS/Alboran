app.view.GroupLayer = Backbone.View.extend({
	
	_template : _.template( $('#groupLayer_template').html() ),
    
    initialize: function() {
    	this.render();
    	
    	this.$el.find(".panel").sortable({
    		start: function( event, ui ) {
//				$(ui.item).css("background-color","#f2f7fb");
				
			},
    	});
    	this.$el.find(".panel").disableSelection();
    	this.$el.find(".panel").sortable({ cancel: '.disableSortable' });
    	
    	$("#map_control").on('click', function() {
    		if($("#groupLayer").is(":visible")){
    			$("#groupLayer").animate({"left":"-320"},300);
    			$("#groupLayer").hide(300);
    			
    			$("#map_control img").removeClass("fleft");
    			$("#map_control .title").hide();
    			$("#map_control span").show();
    			$("#map_control br").show()
    		}else{
    			$("#groupLayer").animate({"left":"0"},300);
    			$("#groupLayer").show();
    			
    			$("#map_control img").addClass("fleft");
    			$("#map_control .title").fadeIn(500);
    			$("#map_control span").hide()
    			$("#map_control br").hide();
    		}
       });
    	
    },
    
    events:{
		
		
	},
    
    onClose: function(){
    	this.stopListening();
    },
    
    render: function() {
    	this.$el.html(this._template());       
        return this;
    },
    
    
   
    
});

	