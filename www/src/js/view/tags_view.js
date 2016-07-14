app.view.Tags = Backbone.View.extend({
    _template : _.template( $('#tags_template').html() ),
    
    initialize: function(options) {
    	var _this = this;
    	this._collection = options.collection;
      this.render();
    },

    events: {
      'click span' : '_toggleExpand',
      'click ul li' : '_toggleTag'
    },
    
    onClose: function(){
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({'col':this._collection}));
        return this;
    },

    _toggleExpand:function(e){
    	this.$('.tag_box').toggleClass('expand');
    },

    _toggleTag:function(e){
    	$(e.currentTarget).toggleClass('selected');
    },

    getCurrentTags:function(){
    	return this.$('li.selected').map(function(){return parseInt($(this).attr('id_tag'));}).get();;
    }
});