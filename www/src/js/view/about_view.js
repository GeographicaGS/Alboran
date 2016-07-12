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

    events : {
      'click .header a': '_navigate',
      'click #characteristics span': '_toggleC',
    },
    
    onClose: function(){
        // Remove events on close
        
        $(window).unbind('scroll');

        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        var _this = this;

        $(window).scroll(function(e){
          var currentScroll = this.scrollY;
          
          if(currentScroll >=  _this.$('#coordination').offset().top - 108){
            _this.$('.header a').removeClass('selected');      
            _this.$('.header a[href="#coordination"]').addClass('selected')

          }else if(currentScroll >=  _this.$('#forWhat').offset().top - 108){
            _this.$('.header a').removeClass('selected');      
            _this.$('.header a[href="#forWhat"]').addClass('selected')

          }else if(currentScroll >=  _this.$('#what').offset().top - 108){
            _this.$('.header a').removeClass('selected');      
            _this.$('.header a[href="#what"]').addClass('selected')

          }else if(currentScroll >=  _this.$('#how').offset().top - 108){
            _this.$('.header a').removeClass('selected');      
            _this.$('.header a[href="#how"]').addClass('selected')

          }else if(currentScroll >=  _this.$('#characteristics').offset().top - 108){
            _this.$('.header a').removeClass('selected');      
            _this.$('.header a[href="#characteristics"]').addClass('selected')

          }else if(currentScroll >=  _this.$('#why').offset().top - 108) {
            _this.$('.header a').removeClass('selected');      
            _this.$('.header a[href="#why"]').addClass('selected')
          }

        });

        return this;
    },

    _navigate:function(e){
      e.preventDefault();
      e.stopPropagation();
      // this.$('.header a').removeClass('selected');
      // $(e.currentTarget).addClass('selected');

      $('html, body').animate({
          scrollTop: $($(e.currentTarget).attr('href')).offset().top - 108
      }, 250);

    },

    _toggleC:function(e){
      $(e.currentTarget).toggleClass('expand');
    }

});