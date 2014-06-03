app.view.Join = Backbone.View.extend({
    _template : _.template( $('#join_template').html() ),
    _itemTemplate : _.template( $('#join-historyitem_template').html() ),
    
    events: {
        'click .topTabs .title': 'changeTab',
        'click a.loadMore': 'loadMore'
    },

    initialize: function() {
        app.events.trigger('menu','join');

        this.collection = new app.collection.Histories();
        
        this.listenTo(this.collection, 'reset', this.renderHistories);
        this.listenTo(this.collection, 'add', this.renderHistories);
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

        return this;
    },

    renderHistories: function() {
        this.$historyLists.filter('.selected').find('li').not('.loadMore').remove();
        this.collection.each(this.renderHistory, this);
    },

    renderHistory: function(item, index) {
        // Create element
        var extensionIndex = item.get('filename').indexOf('.');
        var thumb_filename = item.get('filename').substring(0,extensionIndex);
        thumb_filename = thumb_filename.concat('_thumb');
        thumb_filename = thumb_filename.concat(item.get('filename').substring(extensionIndex));
        item.set('thumb',thumb_filename);
        var element = this._itemTemplate( item.toJSON() );

        // Append in the correct list
        this.$historyLists.eq(item.get('type')).prepend(element);

        // Update lower index
        var lastId = this.$loadButtons.eq(item.get('type')).attr('index');
        if(lastId > item.get('id') || !lastId)
            this.$loadButtons.eq(item.get('type')).attr('index',item.get('id'));
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
            this.collection.url = this.collection.url + '&index='+lastId;
        
        this.collection.fetch({add: true});
    }
});