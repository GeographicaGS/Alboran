app.view.Catalogue = Backbone.View.extend({
	_template : _.template( $('#catalogue_template').html() ),

    events : {
        'click .topTabs li': 'changeTab',
        'click #searchbar button': 'toggleSearch',
        'keyup #searchInput': 'search',
        'keyup #searchbar .year': 'search',
        'click .block_box, .source_box ul li': '_filter',
        'click #searchbar .country' :'toggleCountryList',
        'click #searchbar .msdf' :'toggleCountryMsdf',
        'click #searchbar .country_list li' :'selectCounty',
        'click #searchbar .msdf_list li' :'selectMsdf'
    },

	initialize: function(options) {
        this.activeCategory = options.activeCategory;
        this.activeSection = options.activeSection;
        this.collection = app.categories;
        // this.collection = new app.collection.Categories(app.categories, {view: this});
        app.events.trigger('menu','catalogue');
        // Map.removeAllLayers();
        this.render();
    },

    onClose: function(){
        // Remove events on close

        if(this.subBlocksView)
          this.subBlocksView.close();

        if(this.sourceView)
          this.sourceView.close();

        this.stopListening();
    },

    render: function() {
	   	var model = {categories: this.collection.toJSON()}
		      model['isAdmin'] = app.isAdmin;
          this.$el.html(this._template(model)),
          _this = this;

        this.$layergroups = this.$('.layergroup');
        this.$topTabs = this.$('.topTabs .title');
        this.$tabsContainer = this.$('.tabsContainer');
        this.$searchbar = this.$('#searchbar');
        this.$searchbarText = this.$('#searchInput');

        this.renderAll();


        var subBlockModel = new Backbone.Model({
          'currentBlock':1,
        });
        this.subBlocksView = new app.view.SubBlock({'model':subBlockModel, 'collection':this._getSubBlockCol(this.collection.toJSON())});
        this.$('.filters').append(this.subBlocksView.$el)

        this.sourceView = new app.view.Sources({'collection':this._getSources()});
        this.$('.filters').append(this.sourceView.$el)


        if(this.activeCategory){
            var index = this.$topTabs.filter('#'+this.activeCategory).index();
            this.changeTab(null,index);

            if(this.activeSection){
                this.goToSection(this.activeSection-1);
            }
        }


        this._filter();


        var countries = new Backbone.Collection();
        countries.url = '/api/counties/';
        countries.fetch({reset:true,success:function(data){
          _.each(data.toJSON()[0].result, function(c) {
            _this.$('#searchbar .country_list').append('<li id="' + c.id_country + '">' + c['name_' + app.lang] + '</li>')
          });
        }});


        var msdf = new Backbone.Collection();
        msdf.url = '/api/msdf/';
        msdf.fetch({reset:true,success:function(data){
          _.each(data.toJSON()[0].result, function(c) {
            _this.$('#searchbar .msdf_list').append('<li id="' + c.gid + '">' + c['name_' + app.lang] + '</li>')
          });
        }});

        return this;
    },

    _getSubBlockCol:function(col){
      var sources;
      if(this.sourceView)
        sources = this.sourceView.getCurrentSources();

      var colSubBlocks = new Backbone.Collection();
      _.each(col,function(c){
        var cat = {};
        cat[c.id] = [];
        _.each(c.topics,function(t){
          cat[c.id].push({
            'topic_id':t.id,
            'title_en':t.title_en,
            'title_es':t.title_es,
            'title_fr':t.title_fr,
            'count': sources ? _.filter(t.layers, function(l){ return $.inArray(l.dataSource,sources) >= 0; }).length : t.layers.length
          });
        });
        colSubBlocks.push(cat)
      });

      return colSubBlocks;
    },

    _getSources:function(){
      var sources = [];
      _.each(this.collection.toJSON(),function(c){
        _.each(c.topics,function(t){
          _.each(t.layers,function(l){
            sources.push(l.dataSource);
          })
        })
      });

      return _.unique(sources);
    },

    renderAll: function() {
        this.$layergroups.empty();
        this.collection.each(this.renderTab, this);
    },

    renderTab: function(elem, index){

  		var that = this;
      var topics = elem.get('topics');
      for (var i = 0; i < topics.length; i++){
          // Generamos un grupo y lo agregamos a la lista
          var group = new app.view.LayerGroup({model:topics[i]});

          // Insertamos el grupo en el DOM
          this.$layergroups.eq(index).append(group.render().$el);
      }
  		// this.$layergroups.eq(index).sortable({
  		// 	items: ".layerItemGroup:not(.first)",
  		// 	update: function(event, ui){
  		// 		that.updateOrder();
  		// 	}
  		// });

    },

    renderList: function(list){
        var $itemGroup = $(document.createElement('div'));
        $itemGroup.addClass('layerItemGroup');
        var $ul = $(document.createElement('ul'));
        $ul.addClass('content');
        $itemGroup.append($ul);

        list.each(function(elem){
            var layer = new app.view.Layer({model: elem.toJSON() });
            $ul.append(layer.render().$el);
        }, this);

        this.$layergroups.eq(3).append($itemGroup);
    },

    changeTab: function(e,index){
        var $target;
        if(e){
            e.preventDefault();
            $target = $(e.currentTarget);
            index = $target.index();
        }else{
            $target = this.$topTabs.eq(index);
        }

        this.$topTabs.removeClass('selected');
        $target.addClass('selected');

        this.$layergroups.removeClass('selected');
        this.$layergroups.eq(index).addClass('selected');

        this.subBlocksView.model.set('currentBlock', index+1);

        this._filter();
    },

    goToSection: function(index){
        var $currentCategory = this.$layergroups.filter('.selected');
        var $selectedSection = $currentCategory.children().eq(index);
        if($selectedSection.length > 0){
            setTimeout(function(){
                app.scrollToEl($selectedSection);
            }, 500);
        }
    },

    toggleSearch: function(e){
        e.preventDefault();
        if(this.$searchbar.hasClass('enabled')){
          this.$('#searchbar .advanced').css({'display':'none'});
            this.$searchbar.removeClass('enabled');
            this.$searchbarText.attr('readonly','readonly');
            // this.$searchbarText.val('Catálogo');

            // this.$tabsContainer.find('ul').show();
            this.$('.filters').show();
            this.$('.layersContainerWrapper').removeClass('fullWidth')
            this.changeTab(null,0);

            // this.renderAll();
        }else{
            this.$('#searchbar .advanced').css({'display':'flex'});
            this.$searchbar.addClass('enabled');
            this.$searchbarText.removeAttr('readonly');
            this.$searchbarText.val('');
            this.$searchbarText.focus();

            // this.$tabsContainer.find('ul').hide();
            this.$layergroups.removeClass('selected');
            this.$layergroups.eq(3).addClass('selected');
            this.$('.filters').hide();
            this.$('.layersContainerWrapper').addClass('fullWidth');

            var result = this.collection.getLayersBySearch('');
            this.$layergroups.eq(3).empty();
            this.renderList(result);
        }
    },

    search: function(e){
      var country = null,
          msdf = null,
          year = null;

      if($('#searchbar .country').val() != ''){
        country = this.$('#searchbar .country_list li:contains("' + $('#searchbar .country').val() +'")').attr('id');
        if(country == -1)
          country = null;
      }

      if($('#searchbar .msdf').val() != ''){
        msdf = this.$('#searchbar .msdf_list li:contains("' + $('#searchbar .msdf').val() +'")').attr('id');
        if(msdf == -1)
          msdf = null;
      }

      if($('#searchbar .year').val() != '')
        year = $('#searchbar .year').val();
      
      var result = this.collection.getLayersBySearch(this.$searchbarText.val(),country,msdf,year);
      this.$layergroups.eq(3).empty();
      this.renderList(result);
    },

	updateOrder: function() {
		var Topic = app.model.Topic.extend({urlRoot: '/api/catalog/topic/'});
		this.$layergroups.filter('.selected').children().each(function(index, element){
			var $element = $(element);
			var topicId = $element.find('ul.content').attr('topicid');
			if(topicId){
				var topic = new Topic({id: topicId});
				topic.fetch().done(function(){
					topic.set({'order': $element.index()});
					topic.save();
				});
			}
		});
	},

  _filter:function(){
    var _this = this;
    var topic_id = this.subBlocksView.getCurrentTopic();
    var sources = this.sourceView.getCurrentSources();
    this.$('ul .content[topicid]').addClass('hide');
    this.$('ul .content[topicid=' + topic_id + ']').removeClass('hide');

    _.each(this.$('.layerItem'), function(li) {
      var s = $(li).find('.source_text').text();
      if($.inArray(s,sources) < 0){
        $(li).addClass('hide');
      }else{
        $(li).removeClass('hide');
      }
    });

    this.$tabsContainer.find('#rasgosnaturales span').text(this.$layergroups.eq(0).find('.layerItem:not(.hide)').length);
    this.$tabsContainer.find('#presioneseimpactos span').text(this.$layergroups.eq(1).find('.layerItem:not(.hide)').length);
    this.$tabsContainer.find('#proteccionyconservacion span').text(this.$layergroups.eq(2).find('.layerItem:not(.hide)').length);

    this.subBlocksView.updateCounter(this._getSubBlockCol(this.collection.toJSON()));

  },

  toggleCountryList:function(){
    this.$('#searchbar .country_list').toggleClass('active');
    this.$('#searchbar .msdf_list').removeClass('active');
  },

  toggleCountryMsdf:function(){
    this.$('#searchbar .msdf_list').toggleClass('active');
    this.$('#searchbar .country_list').removeClass('active');
  },

  selectCounty:function(e){
    this.$('#searchbar .country').val($(e.currentTarget).text());
    this.$('#searchbar .country_list').removeClass('active');
    this.search();
  },

  selectMsdf:function(e){
    this.$('#searchbar .msdf').val($(e.currentTarget).text());
    this.$('#searchbar .msdf_list').removeClass('active');
    this.search();
  }

});
