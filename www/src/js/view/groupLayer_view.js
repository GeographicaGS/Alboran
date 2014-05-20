app.view.GroupLayer = Backbone.View.extend({
	
	_template : _.template( $('#groupLayer_template').html() ),
    
    initialize: function() {
    	this.render();
    },
    
    events:{
		
		
	},
    
    onClose: function(){
    	this.stopListening();
    },
    
    render: function() {
    	this.$el.html(this._template());       
        return this;
    },
    
    
   
    
});

	