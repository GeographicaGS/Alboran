app.collection.Categories = Backbone.Collection.extend({
	model: app.model.Category,
	
	getLayersByName : function(name){
		if(name == "") return this;

		var pattern = new RegExp(name,"gi");
		var layers = new app.collection.Layers();
		var currentCatIndex = 1;

		this.each(function(category){
			_.each(category.get("topics"), function(topic){
				_.each(topic.layers, function(layer){
					if (pattern.test(layer.title_es)){
						layer.category = currentCatIndex;
						layers.add(layer);
					}
				});
			});
			currentCatIndex++;
		});

		return layers;
	}
});