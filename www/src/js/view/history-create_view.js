app.view.HistoryCreate = Backbone.View.extend({
    _template : _.template( $('#history-create_template').html() ),
    
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