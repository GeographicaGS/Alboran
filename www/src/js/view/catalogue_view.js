app.view.Catalogue = Backbone.View.extend({
	_template : _.template( $('#catalogue_template').html() ),

	initialize: function() {
        this.collection = new app.collection.Categories(categories, {view: this});
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        //this.collection.each(renderCategory);
        return this;
    }
});