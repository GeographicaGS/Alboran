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
    	"click li": "layerClick",
    	"mouseover li": "layerOver",
    	"mouseleave li": "layerLeave",
    	"click .removeLayer": "removeLayerClick",
		
	},
	
	layerClick: function(e){
    	var idLayer = $(e.currentTarget).attr("idLayer");
    	if(idLayer){
    		if($(e.currentTarget).hasClass("active")){
    			Map.hideLayer(idLayer);
    			$(e.currentTarget).removeClass("active")
    		}else{
    			Map.showLayer(idLayer);
    			$(e.currentTarget).addClass("active")
    		}
    	}
    },
    
    layerOver: function(e){
    	if($(e.currentTarget).attr("idLayer")){
    		$(e.currentTarget).css({"background-color":"#f4f4f4"});
    		$(e.currentTarget).find("img").show();
    	}
    },
    
    layerLeave: function(e){
    	if($(e.currentTarget).attr("idLayer")){
    		$(e.currentTarget).css({"background-color":"white"});
    		$(e.currentTarget).find("img").hide();
    	}
    },
    
    removeLayerClick: function(e){
    	Map.removeLayer($(e.currentTarget).parent().attr("idLayer"));
    	$(e.currentTarget).parent().hide(function(){ 
    		$(this).remove();
    	});
    },
    
    onClose: function(){
    	this.stopListening();
    },
    
    render: function() {
    	this.$el.html(this._template());       
        return this;
    },
    
    
   
    
});

	