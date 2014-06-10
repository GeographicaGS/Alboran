app.view.About = Backbone.View.extend({
    _template : _.template( $('#about_template').html() ),
    
    initialize: function(options) {
        app.events.trigger('menu','about');
        this.render();
        if(options && options.section){
            var $section = this.$('#'+options.section);
            setTimeout(function(){
                app.scrollToEl($section);
            }, 500);
        }
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    }
});