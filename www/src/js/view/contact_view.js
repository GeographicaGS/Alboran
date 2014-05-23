app.view.Contact = Backbone.View.extend({
    _template : _.template( $('#contact_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','contact');
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