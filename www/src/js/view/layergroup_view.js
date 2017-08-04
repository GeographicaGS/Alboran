app.view.LayerGroup = Backbone.View.extend({
	_template : _.template( $('#layergroup_template').html() ),
	className: 'layerItemGroup',

	events: {
		'click .toggle_btn': 'toggle',
		'click h3': 'toggle'
	},

	initialize: function() {
		//this.render();
	},

	onClose: function() {
		// Remove events on close
		this.stopListening();
	},

	render: function() {
		this.model["title"] = this.model["title_" + app.lang]
		this.model['isAdmin'] = app.isAdmin || false;
		this.$el.html(this._template( this.model ));
		// this.$el.html(this._template( {"title":this.model["title_" + app.lang] , "layers" :this.model.layers} ));

		this.$content = this.$('.content');
		var that = this;
		// if(app.isAdmin){
		// 	this.$content.sortable({
		// 		update: function(event, ui){
		// 			that.updateOrder();
		// 		}
		// 	});
		// }

		if(!this.model["title"]){
			this.$el.addClass('first');
		}

		this.renderGroup();

        return this;
	},

	renderGroup: function(){
		for (var i = 0; i < this.model.layers.length; i++ ){
			if(this.model.layers[i].status == 1){
				var layer = new app.view.Layer({model: this.model.layers[i]});
				this.$content.append(layer.render().$el);
			}
		}
	},

	toggle: function(e) {
		e.preventDefault();
		var $target = $(e.currentTarget);
		if($target.hasClass('contracted')){
			$target.removeClass('contracted');
			this.$content.slideDown();
		}else{
			$target.addClass('contracted');
			this.$content.slideUp();
		}
	},

	updateOrder: function() {
		var Layer = app.model.Layer.extend({urlRoot: '/api/catalog/layer/'});
		this.$content.children().each(function(index, element){
			var $element = $(element);
			var layerId = $element.find('.add_btn').attr('layerid');
			if(layerId){
				var layer = new Layer({id: layerId});
				layer.fetch().done(function(){
					layer.set({'order': $element.index()});
					layer.save();
				});
			}
		});
	}
});
