app.view.Catalogue = Backbone.View.extend({
	_template : _.template( $('#catalogue_template').html() ),

    events : {
        'click .topTabs li': 'changeTab',
        'click #searchbar button': 'toggleSearch',
        'keyup #searchInput': 'search'
    },

	initialize: function(options) {
        this.activeCategory = options.activeCategory;
        this.activeSection = options.activeSection;
        this.collection = app.categories;
        // this.collection = new app.collection.Categories(app.categories, {view: this});
        app.events.trigger('menu','catalogue');
        this.render();
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
		var model = {categories: this.collection.toJSON()}
		model['isAdmin'] = app.isAdmin;
        this.$el.html(this._template(model));

        this.$layergroups = this.$('.layergroup');
        this.$topTabs = this.$('.topTabs .title');
        this.$tabsContainer = this.$('.tabsContainer');
        this.$searchbar = this.$('#searchbar');
        this.$searchbarText = this.$('#searchInput');

        this.renderAll();

        if(this.activeCategory){
            var index = this.$topTabs.filter('#'+this.activeCategory).index();
            this.changeTab(null,index);

            if(this.activeSection){
                this.goToSection(this.activeSection-1);
            }
        }

        return this;
    },

    renderAll: function() {
        this.$layergroups.empty();
        this.collection.each(this.renderTab, this);
    },

    renderTab: function(elem, index){
        // Seleccionamos una página y generamos sus grupos
		var that = this;
        var topics = elem.get('topics');
        for (var i = 0; i < topics.length; i++){
            // Generamos un grupo y lo agregamos a la lista
            var group = new app.view.LayerGroup({model:topics[i]});

            // Insertamos el grupo en el DOM
            this.$layergroups.eq(index).append(group.render().$el);
        }
		this.$layergroups.eq(index).sortable({
			update: function(event, ui){
				that.updateOrder();
			}
		});
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
            this.$searchbar.removeClass('enabled');
            this.$searchbarText.attr('readonly','readonly');
            this.$searchbarText.val('Catálogo');

            this.$tabsContainer.show();
            this.changeTab(null,0);

            this.renderAll();
        }else{
            this.$searchbar.addClass('enabled');
            this.$searchbarText.removeAttr('readonly');
            this.$searchbarText.val('');
            this.$searchbarText.focus();

            this.$tabsContainer.hide();
            this.$layergroups.removeClass('selected');
            this.$layergroups.eq(3).addClass('selected');
        }
    },

    search: function(e){
        var result = this.collection.getLayersByName(this.$searchbarText.val());
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
	}
});
