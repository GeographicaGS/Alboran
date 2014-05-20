app.view.GroupLayer = Backbone.View.extend({
	
	_template : _.template( $('#groupLayer_template').html() ),
    
    initialize: function() {
    	this.render();
    	
    	this.$el.find(".panel").sortable({
    		start: function( event, ui ) {
				$(ui.item).css("background-color","#f2f7fb");
				
			},
    	});
//    	$("#groupLayer").find("div").disableSelection();
//    	$("#groupLayer").find("div").sortable({ cancel: '.disableSortable' });
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

	