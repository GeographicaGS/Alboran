app.view.OldBrowser = Backbone.View.extend({
    _template : _.template( $('#oldbrowser_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','oldbrowser');
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        // Set language
        $image = this.$('img');
        var file = $image.attr('src');
        file = file.replace('es',app.detectCurrentLanguage());
        $image.attr('src',file);

        return this;
    }
});