app.view.HistoryDetail = Backbone.View.extend({
	_template : _.template( $('#history_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','join');

		var History = Backbone.Model.extend({urlRoot: '/api/history'});
        this.model = new History({id: '22'});
        this.model.fetch();

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
})