app.view.Join = Backbone.View.extend({
    _template : _.template( $('#join_template').html() ),
    
    events: {
        'click .topTabs .title': 'changeTab',
        'click a.loadMore': 'loadMore'
    },

    initialize: function() {
        app.events.trigger('menu','join');
        
        this.collection = new app.collection.Histories();
        
        this.listenTo(this.collection, 'reset', this.renderHistories);
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
        this.collection.each(function(item, index){
            _.each(item.get('result'), this.renderHistory, this);
        }, this);
    },

    renderHistory: function(item, index) {
        // Create element
        var element = $('<li/>');
        var link = $('<a/>');
        link.attr('href','/<lang>lang</lang>/<lang>_link history</lang>/' + item.id);
        var img = $('<img/>');
        var extensionIndex = item.filename.indexOf('.');
        var thumb_filename = item.filename.substring(0,extensionIndex);
        thumb_filename = thumb_filename.concat('_thumb');
        thumb_filename = thumb_filename.concat(item.filename.substring(extensionIndex));
        img.attr('src', '/images/' + thumb_filename);
        var author = $('<h4/>');
        author.html(item.author);
        var title = $('<h3/>');
        title.html(item.title);

        link.append(img).append(author).append(title);
        element.append(link);

        // Append in the correct list
        this.$historyLists.eq(item.type).prepend(element);

        // Update lower index
        var lastId = this.$loadButtons.eq(item.type).attr('index');
        if(lastId > item.id || !lastId)
            this.$loadButtons.eq(item.type).attr('index',item.id)
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
        
        this.collection.fetch({add: true, reset:true});
    }
});