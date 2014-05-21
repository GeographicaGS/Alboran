app.view.Layer = Backbone.View.extend({
	_template : _.template( $('#layer_template').html() ),
	className: 'layerItem',

	events: {
		'click .info_btn': 'toggle',
		'click .add_btn': 'toggleLayer'
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
		this.$addBtn = this.$('.add_btn');

        return this;
	},

	toggle: function(e) {
		e.preventDefault();
		this.$info.toggleClass('show');
	},

	toggleLayer: function(e) {
		e.preventDefault();
		if(this.$addBtn.hasClass('add')){
			var that = this;
			this.$addBtn.removeClass('add');
			setTimeout(function() {that.$addBtn.html(that.$addBtn.attr('removelabel'));},300);
			
		}else{
			this.$addBtn.addClass('add');
			this.$addBtn.html(this.$addBtn.attr('addlabel'));
		}
	}
});