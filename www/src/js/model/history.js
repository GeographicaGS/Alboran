app.model.History = Backbone.Model.extend({
	defaults: {
		prev_id: null,
		next_id: null
	},

	parse: function (data) {
        if (_.isObject(data.result)) {
            return data.result;
        } else {
            return data;
        }
    }
})
