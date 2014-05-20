app.view.Catalogue = Backbone.View.extend({
	_template : _.template( $('#catalogue_template').html() ),

    events : {
        'click .topTabs li': 'changeTab'
    },

	initialize: function() {
        this.collection = new app.collection.Categories(app.categories, {view: this});
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());

        this.$layergroups = this.$('.layergroup');
        this.$topTabs = this.$('.topTabs .title');

        this.collection.each(this.renderTab, this);
        
        return this;
    },

    renderTab: function(elem, index){
        // Seleccionamos una página y generamos sus grupos
        var topics = elem.get('topics');
        for (var i = 0; i < topics.length; i++){
            // Generamos un grupo y lo agregamos a la lista
            var group = new app.view.LayerGroup({model:topics[i]});
            
            // Insertamos el grupo en el DOM
            this.$layergroups.eq(index).append(group.render().$el);
        }
    },

    changeTab: function(e){
        e.preventDefault();
        var $target = $(e.currentTarget);
        
        this.$topTabs.removeClass('selected');
        $target.addClass('selected');

        this.$layergroups.removeClass('selected');
        this.$layergroups.eq($target.index()).addClass('selected');
    }
});