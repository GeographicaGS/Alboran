app.view.Legal = Backbone.View.extend({
    _template : _.template( $('#legal_template').html() ),
    
    initialize: function(options) {
        app.events.trigger('menu','legal');
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