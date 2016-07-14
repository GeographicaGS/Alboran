app.view.Documents = Backbone.View.extend({
    _template : _.template( $('#documents_template').html() ),
    _template_list : _.template( $('#documents_template_list').html() ),
    
    initialize: function(options) {
      
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

      this._block = options.block;
      this._subBlock = options.subBlock;

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
      this.$el.html(this._template({'block':this._block,'col':col}));

      var subBlockModel = new Backbone.Model({
        'currentBlock':this._block ? this._block:1,
        'currentSubBlock':this._subBlock ? this._subBlock:null 
      });

      this.subBlocksView = new app.view.SubBlock({'model':subBlockModel, 'collection':colSubBlocks});
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
      var id_block = this.$('.block_header h2.selected').attr('block');
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


      app.router.navigate("documents/" + id_block + '/' + topic_id,{trigger: true});

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
    
    initialize: function(options) {
      
      _.bindAll(this,'render');

      app.events.trigger('menu','documents');

      this._model = new Backbone.Model();
      this._model.url = '/api/documents/' + options.id_doc;

      this._model.fetch({
        success: this.render
      });
    },

    events: {
      
    },
    
    onClose: function(){
        
        this.stopListening();
    },
    
    render: function() {
      this.$el.html(this._template({'m':this._model.toJSON()}));
      this.setShareLinks();
      return this;
    },

    setShareLinks: function() {
      var title = this._model.get('title_' +  app.lang);
      this.$('#share-fb').attr('href','http://www.facebook.com/sharer.php?u='+ document.URL +'&t='+ title);
      this.$('#share-twitter').attr('href','https://twitter.com/?status='+ title +' - '+ document.URL);
      this.$('#share-gplus').attr('href','https://plus.google.com/share?url='+ document.URL);
      this.$('#share-email').attr('href','mailto:?subject='+ title +'&body=Te comparto esta historia del Proyecto Alborán: '+ title +' - '+ document.URL);
      this.$('#share-whatsapp').attr('href','whatsapp://send?text='+ document.URL);
    }

});