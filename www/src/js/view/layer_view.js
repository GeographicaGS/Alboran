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
		this.model.category = this.model.category || '';
		switch(this.model.category){
			case 1: this.model.category = 'green';
					break;
			case 2: this.model.category = 'red';
					break;
			case 3: this.model.category = 'blue';
					break;
		}

		this.model["title"] = this.model["title_" + app.lang]
		this.model["desc"] = this.model["desc_" + app.lang]
		this.model['isAdmin'] = app.isAdmin || false;
		this.$el.html(this._template( this.model ));

		this.$info = this.$('.info');
		this.$addBtn = this.$('.add_btn');

		this.setAddBtnStatus();

        return this;
	},

	toggle: function(e) {
		e.preventDefault();
		this.$info.toggleClass('show');
	},

	toggleLayer: function(e) {
		e.preventDefault();
		var id = this.$addBtn.attr('layerid');

		if(this.$addBtn.hasClass('add')){
			app.groupLayer.addLayer(id);

			this.$addBtn.removeClass('add');
			var that = this;
			setTimeout(function() {that.$addBtn.html(that.$addBtn.attr('removelabel'));},300);

		}else{
			app.groupLayer.removeLayer(id);

			this.$addBtn.addClass('add');
			this.$addBtn.html(this.$addBtn.attr('addlabel'));
		}
	},

	setAddBtnStatus: function() {
		if(Map.isLayerLoaded(this.model.id)){
			this.$addBtn.removeClass('add');
			this.$addBtn.html(this.$addBtn.attr('removelabel'));
		}
	}
});
