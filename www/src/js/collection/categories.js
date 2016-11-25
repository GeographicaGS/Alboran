app.collection.Categories = Backbone.Collection.extend({
	model: app.model.Category,
	url: '/api/catalog/',

	parse: function(data) {
        return data.result;
    },

	getLayersByName : function(name){
		if(name == "") return this.getAllLayers();

		var pattern = new RegExp(name,"gi");
		var layers = new app.collection.Layers();
		var currentCatIndex = 1;

		this.each(function(category){
			_.each(category.get("topics"), function(topic){
				_.each(topic.layers, function(layer){
					if (pattern.test(layer['title_' + app.lang])){
						layer.category = currentCatIndex;
						layers.add(layer);
					}
				});
			});
			currentCatIndex++;
		});

		return layers;
	},

	getLayersBySearch : function(name,country,msdf,year){
		if(name == "" && !country && !msdf && !year) return this.getAllLayers();

		var pattern = new RegExp(name,"gi");
		var layers = new app.collection.Layers();
		var currentCatIndex = 1;

		this.each(function(category){
			_.each(category.get("topics"), function(topic){
				_.each(topic.layers, function(layer){
					// if (pattern.test(layer['title_' + app.lang]) || pattern.test(layer.dataSource) || pattern.test(layer['desc_' + app.lang])){
					if (pattern.test(layer['title_' + app.lang]) && (!country || layer.country == country) &&  (!msdf || layer.msdf == msdf) && (!year || layer.year == year) ){
						layer.category = currentCatIndex;
						layers.add(layer);
					}
				});
			});
			currentCatIndex++;
		});

		return layers;
	},

	getAllLayers : function(){
		var layers = new app.collection.Layers();
		var currentCatIndex = 1;
		this.each(function(category){
			_.each(category.get("topics"), function(topic){
				_.each(topic.layers, function(layer){					
					layer.category = currentCatIndex;
					layers.add(layer);
				});
			});
			currentCatIndex++;
		});

		return layers;
	},

	getCategoryByTopic: function(topic_id){
		if (!topic_id) return this;

		var cat_index = 0, found = false;

		while(!found && cat_index < this.length){
			var topic_index = 0;
			while(!found && topic_index < this.at(cat_index).get('topics').length){
				if(app.categories.at(cat_index).get('topics')[topic_index].id === topic_id)
					found = true;
				topic_index++;
			}
			if(!found)
				cat_index++;
		}

		return this.at(cat_index);
	}
});
