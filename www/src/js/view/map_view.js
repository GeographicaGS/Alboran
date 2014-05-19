app.view.Map = Backbone.View.extend({
//    _template : _.template( $('#map_template').html()),
    
    initialize: function() {
    	Map.initialize();
//        this.render();
//    	app.events.trigger("menu", 1);
    },
    
    onClose: function(){
        // Remove events on close
//        this.stopListening();
//    	$("#map").hide();
    },
    
    render: function() {
//        this.$el.html(this._template());
//    	$("#map").show();
        return this;
    }
});