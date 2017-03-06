app.view.Users = Backbone.View.extend({
    _template : _.template( $('#users_template').html() ),

    initialize: function(options) {
      app.events.trigger('menu','users');
      this.collection = new app.collection.Users();
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.fetch({reset:true});
    },

    events: {

    },

    onClose: function(){
      this.stopListening();
    },

    render: function() {
      this.$el.html(this._template({users:this.collection.toJSON()}));
      return this;
    }

});
