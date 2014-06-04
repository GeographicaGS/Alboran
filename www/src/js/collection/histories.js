app.collection.Histories = Backbone.Collection.extend({
	model: app.model.History,
	url: '/api/history/',
	parse: function(data) {
		if(data.histories){
        	this.goodpractices_total = data.goodpractices_total;
        	this.sightings_total = data.sightings_total;
        	return data.histories;
        }else{
        	return data.result;
        }
    },
    getHistoriesCountByType: function(type){
    	var total = 0;
    	this.each(function(history){
    		if(history.get('type') == type)
    			total++;
    	});

    	return total;
    }
})