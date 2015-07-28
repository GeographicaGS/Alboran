app.model.Layer = Backbone.Model.extend({
	parse: function (data) {
        if (_.isObject(data.result)) {
            return data.result;
        } else {
            return data;
        }
    }
});
