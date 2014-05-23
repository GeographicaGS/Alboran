app.view.Howto = Backbone.View.extend({
    _template : _.template( $('#howto_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','howto');
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