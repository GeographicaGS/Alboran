app.collection.LayerProgress = Backbone.Collection.extend({
  url: '/api/lasyerprogress',

  parse:function(response){
    return response.result;
  },

  getLayersBySearch : function(name,country,status){
		// if(name == "" && !country && !status) return this.getAllLayers();

		var pattern = new RegExp(name,"gi");
		var layers = new app.collection.LayerProgress();

		_.each(this.toJSON(), function(layer){
			if (
					(pattern.test(layer['title_' + app.lang]))
						&&
						(!country || layer.country == country)
						&&
						(!status || layer.status == status) ){
				layers.add(layer);
			}
		});



		return layers;
	},

});
