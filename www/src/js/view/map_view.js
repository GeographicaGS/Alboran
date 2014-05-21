app.view.Map = Backbone.View.extend({
//    _template : _.template( $('#map_template').html()),
    
    initialize: function() {
    	Map.initialize();
    	
    	app.groupLayer = new app.view.GroupLayer({
            parent: this
        });
    	
    	this.render();

    },
    
    events:{
		
		
	},
    
    onClose: function(){
        // Remove events on close
//        this.stopListening();
//    	$("#map").hide();
    },
    
    render: function() {
//        this.$el.html(this._template());
//    	$("#map").show();
    	
    	$("#groupLayer").html(app.groupLayer.el);
    	
        return this;
    },
    
    
   
    
});

	