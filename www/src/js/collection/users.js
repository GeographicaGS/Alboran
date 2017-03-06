app.collection.Users = Backbone.Collection.extend({
  url: '/api/users',

  parse:function(response){
    return response.result;
  }

});
