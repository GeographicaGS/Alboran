app.view.User = app.view.LayerCreate.extend({
    _template : _.template( $('#user_template').html() ),

    initialize: function(options) {
      app.events.trigger('menu','users');

      var that = this;
      var User = app.model.Layer.extend({urlRoot: '/api/users'});
      this.isSending = false;

      this.countries = new Backbone.Collection();
      this.countries.url = '/api/counties/'
      this.listenTo(this.countries, 'reset', function(){
          that.render();
      });

      if(options){
          this.model = new User({id: options.id_user});
          this.model.fetch().done(function() {
            // that.render();
            that.countries.fetch({reset:true})
          });
        }else{
          this.isInConfig = false;
          this.model = new User();
          this.countries.fetch({reset:true})
          // this.render();
        }

    },

    events: function(){
    	return _.extend({
      },app.view.LayerCreate.prototype.events,{
        'click #borrar_btn': 'deleteUser'
      });
    },

    onClose: function(){
      this.stopListening();
    },

    render: function() {
      this.$el.html(this._template({m:this.model.toJSON(), countries:this.countries.toJSON()[0].result}));
      return this;
    },

    cancelLayer: function(e) {
        e.preventDefault();
        app.router.navigate(app.router.langRoutes["_link users"][app.lang],{trigger: true});
    },

    sendLayer: function(e){
      e.preventDefault();
      var that = this;
      if(!this.isSending){
        this.isSending = true;

        // Clear validation errors
        this.$('.invalid').removeClass('invalid');

        // Prepare form data
        var items = {};
        var error = false;

        items.$real_name= this.$('#real_name');
        items.$name= this.$('#name');
        items.$email= this.$('#email');
        if(!this.model.get('id') || (this.model.get('id') && $('#password').val() != ''))
          items.$password= this.$('#password');

        $.each(items, function(index, element){
          if(element.attr('required')){
            error = that.validate(element, false) || error;
          }
        });

        var regexEmail = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!regexEmail.test(items.$email.val())){
          that.$('#email').addClass('invalid')
          error = true;
        }

        if(!error){

          this.model.set({
            'real_name': _.escape(items.$real_name.val()),
            'name': _.escape(items.$name.val()),
            'email': _.escape(items.$email.val()),
            'id_country': this.$('#country').val(),
            'admin': this.$('#admin').is(':checked')
          });

          if(items.$password)
            this.model.set({'password': md5(_.escape(items.$password.val()))});

          this.model.save({},{success:function(){
            app.router.navigate(app.router.langRoutes["_link users"][app.lang],{trigger: true});
          }})

        }else{
          this.isSending = false;
        }

      }
    },

    deleteUser:function(e){
      e.preventDefault();
  		var that = this;
  		$.fancybox($('#userDeleteConfirmation'), {
          'width':'640',
          'height': 'auto',
          'padding': '0',
          'autoDimensions':false,
          'autoSize':false,
          'closeBtn' : false,
          'scrolling'   : 'no',
          helpers : {
               overlay: {
                 css: {'background-color': 'rgba(0,0,102,0.85)'},
                 closeClick: false
               }
          },
          afterShow: function () {
              $('#userDeleteConfirmation').css('display', 'block');
              $('#userDeleteConfirmation #btn_yes').click(function(e){
                that.model.destroy({success:function(){
                  app.router.navigate(app.router.langRoutes["_link users"][app.lang],{trigger: true});
                  $.fancybox.close();
                }});
              });
              $('#userDeleteConfirmation #btn_no').click(function(e){
                  $.fancybox.close();
              });
          }
      });
    }

});
