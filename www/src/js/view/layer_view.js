app.view.Layer = Backbone.View.extend({
	_template : _.template( $('#layer_template').html() ),

	initialize: function() {
		this.render();
	},

	onClose: function() {
		// Remove events on close
		this.stopListening();
	},

	render: function() {
		this.$el.html(this._template( this.model.toJSON() ));
        return this;
	}
});