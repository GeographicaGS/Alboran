app.view.Join = Backbone.View.extend({
    _template : _.template( $('#join_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','join');
        this.render();
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