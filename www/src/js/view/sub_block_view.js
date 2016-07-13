app.view.SubBlock = Backbone.View.extend({
    _template : _.template( $('#sub_block_template').html() ),
    
    initialize: function(options) {
    	var _this = this;
    	this._collection = options.collection;

      this.model = new Backbone.Model({
      	'currentBlock':0
      });

      this.listenTo(this.model, 'change:currentBlock', function(){
      	_this.$('div[block]').addClass('hide');
      	_this.$('div[block=' + _this.model.get('currentBlock') + ']').removeClass('hide');
      });

      this.render();

    },

    events: {
      'click .block_box': 'toggleSubBlock'
    },
    
    onClose: function(){
        this.stopListening();
    },
    
    render: function() {
    		var col = _.map(this._collection.toJSON(), function(c){ return c.topics; });
        this.$el.html(this._template({'col':col}));
        this.$('div[block=' + this.model.get('currentBlock') + ']').removeClass('hide');
        return this;
    },

    toggleSubBlock:function(e){
    	$('div[block=' + this.model.get('currentBlock') + ']').removeClass('selected');
    	$(e.currentTarget).toggleClass('selected');
    }
});