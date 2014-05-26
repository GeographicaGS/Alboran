app.view.Alboran = Backbone.View.extend({
    _template : _.template( $('#alboran_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','alboran_');
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