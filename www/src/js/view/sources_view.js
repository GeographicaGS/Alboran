app.view.Sources = Backbone.View.extend({
    _template : _.template( $('#source_template').html() ),
    
    initialize: function(options) {
    	var _this = this;
    	this._collection = _.sortBy(options.collection, function (c) {return c});
      this.render();
    },

    events: {
      'click span' : '_toggleExpand',
      'click ul li' : '_toggleSource'
    },
    
    onClose: function(){
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template({'col':this._collection}));
        return this;
    },

    _toggleExpand:function(e){
    	this.$('.source_box').toggleClass('expand');
    },

    _toggleSource:function(e){
    	// e.stopPropagation();
    	$(e.currentTarget).toggleClass('selected');
    },

    getCurrentSources:function(){
    	return this.$('li.selected').map(function(){return $.trim($(this).text());}).get();;
    }
});