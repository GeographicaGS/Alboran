app.collection.Histories = Backbone.Collection.extend({
	model: app.model.History,
	url: '/api/history/',
	parse: function(data) {
        this.page=data.page;
        return data.result;
    }
})