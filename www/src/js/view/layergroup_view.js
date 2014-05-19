app.view.LayerGroup = Backbone.View.extend({
	_template : _.template( $('layergroup_template').html() ),

	events: {
		'click .vis_btn': toggle
	},

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
	},

	toggle: function() {

	}
});