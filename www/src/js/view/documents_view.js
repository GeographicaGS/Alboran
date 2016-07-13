app.view.Documents = Backbone.View.extend({
    _template : _.template( $('#documents_template').html() ),
    
    initialize: function() {
      
      app.events.trigger('menu','documents');

	    this._collection = new app.collection.Categories();
			this.listenTo(this._collection, 'reset', this.render);
	    this._collection.fetch({'reset':true});

        // this.render();
    },

    events: {
      'click .block_header h2': 'changeBlock'
    },
    
    onClose: function(){
        // Remove events on close
        if(this.subBlocksView)
        	this.subBlocksView.close();

        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());

        this.subBlocksView = new app.view.SubBlock({'collection':this._collection});

        this.$('.filters').prepend(this.subBlocksView.$el)


        return this;
    },

    changeBlock:function(e){
    	$('.block_header h2').removeClass('selected')
    	$(e.currentTarget).addClass('selected');
    	this.subBlocksView.model.set('currentBlock', $(e.currentTarget).attr('block'))
    }
});