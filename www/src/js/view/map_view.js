app.view.Map = Backbone.View.extend({
//    _template : _.template( $('#map_template').html()),
    
    initialize: function() {
    	Map.initialize();
    	
    	app.groupLayer = new app.view.GroupLayer({
            parent: this
        });
    	
    	this.render();
    	
    	var aux = Backbone.history.fragment.split(app.router.langRoutes["_link map"][[app.lang]]);
    	if(aux.length >1){
    		Map.setRoute(aux[1]);
    	}

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

	