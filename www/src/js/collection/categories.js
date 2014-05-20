app.collection.Categories = Backbone.Collection.extend({
	model: app.model.Category,
	url: '/js/catalog.js',

	fetch: function(){
		console.log('here');
	}
});