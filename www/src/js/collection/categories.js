app.collection.Categories = Backbone.Collection.extend({
	model: app.model.Category,
	
	search : function(letters){
		if(letters == "") return this;
 
		var pattern = new RegExp(letters,"gi");
		return _(this.filter(function(category) {
			return _.filter(category.get("topics"),function(topic){
				return _.filter(topic.get("layers"), function(layer){
					return pattern.test(layer.get("title_es"));
				});
			});
		}));
	}
});