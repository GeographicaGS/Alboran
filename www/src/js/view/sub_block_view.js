app.view.SubBlock = Backbone.View.extend({
    _template : _.template( $('#sub_block_template').html() ),
    
    initialize: function(options) {
    	var _this = this;
    	this._collection = options.collection;

      this.model = options.model;

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
        this.$el.html(this._template({'col':this._collection.toJSON()}));
        this.$('div[block=' + this.model.get('currentBlock') + ']').removeClass('hide');
        if(this.model.get('currentSubBlock')){
          this.$('div[block=' + this.model.get('currentBlock') + ']').removeClass('selected');
          this.$('div[topic_id=' + this.model.get('currentSubBlock') + ']').addClass('selected');
        }          

        return this;
    },

    toggleSubBlock:function(e){
    	$('div[block=' + this.model.get('currentBlock') + ']').removeClass('selected');
    	$(e.currentTarget).toggleClass('selected');
    },

    getCurrentTopic:function(){
    	return parseInt($('div[block=' + this.model.get('currentBlock') + '].selected').attr('topic_id'));
    }
});