app.view.Layer = Backbone.View.extend({
	_template : _.template( $('#layer_template').html() ),
	className: 'layerItem',

	events: {
		'click .info_btn': 'toggle'
	},

	initialize: function() {
		//this.render();
	},

	onClose: function() {
		// Remove events on close
		this.stopListening();
	},

	render: function() {
		this.$el.html(this._template( this.model ));

		this.$info = this.$('.info');


        return this;
	},

	toggle: function(e){
		e.preventDefault();
		this.$info.toggleClass('show');
	}
});