app.view.Map = Backbone.View.extend({
    //_template : _.template( $('#home_template').html() ),
    
    initialize: function() {
        //this.render();
//    	app.events.trigger("menu", 1);
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());       
        return this;
    }
});