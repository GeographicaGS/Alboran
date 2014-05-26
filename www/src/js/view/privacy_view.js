app.view.Privacy = Backbone.View.extend({
    _template : _.template( $('#privacy_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','privacy');
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