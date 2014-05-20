app.collection.Categories = Backbone.Collection.extend({
	model: app.model.Category,
	url: '/js/catalog.js',
	parse: function (data) {
        if (_.isObject(data.results)) {
            return data.results;
        } else {
            return data;
        }
    }
});