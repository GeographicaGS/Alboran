app.model.Category = Backbone.Model.extend({
	
	totalLayerCount: function() {
		var count = 0;
		_.each(topics,function(el){
			count += el.layers.length;
		});
		return count;
	}
});