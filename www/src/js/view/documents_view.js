app.view.Documents = Backbone.View.extend({
    _template : _.template( $('#documents_template').html() ),
    _template_list : _.template( $('#documents_template_list').html() ),
    
    initialize: function() {
      
      app.events.trigger('menu','documents');

	    this._collection = new Backbone.Collection();
	    this._collection.url = '/api/documents'
	    this._collection.parse = function(response){
	    	return response.result;
	    }
			this.listenTo(this._collection, 'reset', this.render);
	    this._collection.fetch({'reset':true});

	    this._collectionTag = new Backbone.Collection();
	    this._collectionTag.url = '/api/documents/tags'
	    this._collectionTag.parse = this._collection.parse;
			this.listenTo(this._collectionTag, 'reset', this.renderTags);

        // this.render();
    },

    events: {
      'click .block_header h2': 'changeBlock',
      'click .block_box, .source_box ul li, .tag_box ul li': '_renderDocuments',
    },
    
    onClose: function(){
        // Remove events on close
        if(this.subBlocksView)
        	this.subBlocksView.close();

        if(this.sourceView)
        	this.sourceView.close();

        if(this.tagsView)
        	this.tagsView.close();

        this.stopListening();
    },
    
    render: function() {
    	var col = _.groupBy(this._collection.toJSON(), function(c){ return c.cat_id ;})
    	var colSubBlocks = new Backbone.Collection();
    	_.each(col,function(c,key){
    		var cat = {};
    		cat[key] = [];
    		var topics = _.groupBy(c, function(el){ return el.topic_id ;});
    		_.each(topics,function(t){
    			cat[key].push({
    				'topic_id':t[0].topic_id,
    				'title_en':t[0].topic_en,
    				'title_es':t[0].topic_es,
    				'title_fr':t[0].topic_fr,
    				'count':t.length
    			});
  			});
    		colSubBlocks.push(cat)
    	});
      this.$el.html(this._template({'col':col}));

      this.subBlocksView = new app.view.SubBlock({'collection':colSubBlocks});
      this.$('.filters').append(this.subBlocksView.$el)

      this.sourceView = new app.view.Sources({'collection':_.uniq(_.map(this._collection.toJSON(), function(c){ return c.source;}))});
      this.$('.filters').append(this.sourceView.$el)

      this._collectionTag.fetch({'reset':true});

      return this;
    },

    renderTags:function(){
    	this.tagsView = new app.view.Tags({'collection':_.uniq(this._collectionTag.toJSON(), function(c) {return c.id_tag;})});
      this.$('.filters').append(this.tagsView.$el);
      this._renderDocuments();
    },

    changeBlock:function(e){
    	$('.block_header h2').removeClass('selected')
    	$(e.currentTarget).addClass('selected');
    	this.subBlocksView.model.set('currentBlock', $(e.currentTarget).attr('block'))
        this._renderDocuments();
    },

    _renderDocuments:function(){
    	var topic_id = this.subBlocksView.getCurrentTopic();
    	var sources = this.sourceView.getCurrentSources();
    	var tags = this.tagsView.getCurrentTags();
    	var id_documents = this._getIdDocumentsByTags(tags);

    	var col = _.filter(this._collection.toJSON(), function(c){ 
						    		return (c.topic_id == topic_id) && ($.inArray(c.source,sources) >= 0) && ($.inArray(c.id_doc,id_documents) >= 0)
    	});

    	this.$('.doc_list').html(this._template_list({'col':col}));

        if(this._msnry)
            this.$('.doc_list').masonry("destroy");
        this._msnry = this.$('.doc_list').masonry({'gutter':20, fitWidth: true});

    },

    _getIdDocumentsByTags:function(tags){
    	 var result = _.filter(this._collectionTag.toJSON(), function(t){ 
						    		return $.inArray( t.id_tag,tags) >= 0; 
	    	});

    	 return _.uniq(_.map(result, function(r){return r.id_doc;}));

    }
});


app.view.DocumentItem = Backbone.View.extend({
    _template : _.template( $('#document_item_template').html() ),
    
    initialize: function() {
      app.events.trigger('menu','documents');
      this.render();
    },

    events: {
      
    },
    
    onClose: function(){
        
        this.stopListening();
    },
    
    render: function() {
      this.$el.html(this._template());
      return this;
    }
});