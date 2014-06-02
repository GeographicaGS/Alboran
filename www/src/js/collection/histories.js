app.collection.Histories = Backbone.Collection.extend({
	model: app.model.History,
	url: '/api/history/'
})