app.view.Legal = Backbone.View.extend({
    _template : _.template( $('#legal_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','legal');
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