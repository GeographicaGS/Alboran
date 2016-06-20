app.view.Join = Backbone.View.extend({
    _template : _.template( $('#join_template').html() ),
    _itemTemplate : _.template( $('#join-historyitem_template').html() ),

    events: {
        'click .topTabs .title': 'changeTab',
        'click a.loadMore': 'loadMore'
    },

    initialize: function(options) {
        app.events.trigger('menu','join');

        this.activeSection = options.activeSection;
        this.goodprLength = 0;
        this.sightLength = 0;

        this.collection = new app.collection.Histories();

        this.listenTo(this.collection, 'reset', this.renderHistories);
        this.listenTo(this.collection, 'add', this.renderHistory);
        this.listenTo(this.collection, 'sync', this.checkLastFetch);
        this.collection.fetch({reset: true});

        this.render();
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        this.$el.html(this._template());

        this.$topTabs = this.$('.topTabs li');
        this.$historyLists = this.$('.listContainer .list');
        this.$loadButtons = this.$('.listContainer a.loadMore');

        if(this.activeSection){
            var index = this.$topTabs.filter('.'+this.activeSection).index();
            this.changeTab(null,index);
        }

        return this;
    },

    renderHistories: function() {
        this.$historyLists.filter('.selected').find('li').not('.loadMore').remove();
        this.collection.each(this.renderHistory, this);

        this.$topTabs.filter('.goodpractices').find('span').html(this.collection.goodpractices_total);
        this.$topTabs.filter('.sightings').find('span').html(this.collection.sightings_total);
    },

    renderHistory: function(item, index) {
        if(item.get('status')===1 || app.isAdmin){
            // Create element
            var extensionIndex = item.get('filename').indexOf('.');
            var thumb_filename = item.get('filename').substring(0,extensionIndex);
            thumb_filename = thumb_filename.concat('_thumb');
            thumb_filename = thumb_filename.concat(item.get('filename').substring(extensionIndex));
            item.set('thumb',thumb_filename);
            var model = $.extend({}, item.toJSON(), {'isAdmin': app.isAdmin || false});
            var element = this._itemTemplate( model );

            // Append in the correct list
            $(element).insertBefore(this.$loadButtons.eq(item.get('type')).parent());

            // Update lower index
            var lastId = this.$loadButtons.eq(item.get('type')).attr('index');
            if(lastId > item.get('id') || !lastId)
                this.$loadButtons.eq(item.get('type')).attr('index',item.get('id'));
        }
    },

    changeTab: function(e, index) {
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

        this.$historyLists.removeClass('selected');
        this.$historyLists.eq(index).addClass('selected');
    },

    loadMore: function(e) {
        e.preventDefault();
        $target = $(e.currentTarget);
        var index = this.$loadButtons.index($target);
        this.collection.url = '/api/history/?type='+index;

        var lastId = $target.attr('index');
        if(lastId)
            this.collection.url = this.collection.url + '&id='+lastId;

        this.collection.fetch({remove: false});
    },

    checkLastFetch: function(collection, resp, options){
        if(this.collection.getHistoriesCountByType(0) >= this.collection.goodpractices_total)
            this.$historyLists.eq(0).find('li.loadMore').remove();
        if(this.collection.getHistoriesCountByType(1) >= this.collection.sightings_total)
            this.$historyLists.eq(1).find('li.loadMore').remove();
    }
});
