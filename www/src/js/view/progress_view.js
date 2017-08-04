app.view.Progress = Backbone.View.extend({
    _template : _.template( $('#progress_template').html() ),
    _templateList : _.template( $('#progress_list_template').html() ),

    initialize: function() {
        app.events.trigger('menu','progress');
        this.collection = new app.collection.LayerProgress();
        this.listenTo(this.collection, 'reset', this.render);


        this.countries = new Backbone.Collection();
        this.countries.url = '/api/counties/'
        this.listenTo(this.countries, 'reset', function(){
          this.collection.fetch({reset:true});
        });
        this.countries.fetch({reset:true});
    },

    events: {
  		'click .add_btn': 'toggleLayer',
      'click .rejectInfo': 'showRejectInfo',
      'click #searchbar .country' :'toggleCountryList',
      'click #searchbar .status' :'toggleStatusList',
      'click #searchbar .country_list li' :'selectCounty',
      'click #searchbar .status_list li' :'selectStatus',
      'keyup #searchInput': 'search'
  	},

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    toggleLayer: function(e){
      e.preventDefault();
      var $button = $(e.currentTarget);
  		var id = $button.attr('layerid');

  		if($button.hasClass('add')){
  			app.groupLayer.addLayer(id);
  			$button.removeClass('add');
  			setTimeout(function() {$button.html($button.attr('removelabel'));},300);

  		}else{
  			app.groupLayer.removeLayer(id);
  			$button.addClass('add');
  			$button.html(this.$('.add_btn').attr('addlabel'));
  		}
    },

    render: function() {
      this.$el.html(this._template({countries:this.countries.toJSON()[0].result}));
      this._renderList(this.collection);
      return this;
    },

    _renderList: function(layers){
      var that = this;
      this.$('#progress').html(this._templateList({layers:layers.toJSON()}));
      var addButtons = this.$('.add_btn')
      _.each(addButtons,function(a){
        if(Map.isLayerLoaded($(a).attr('layerid'))){
          $(a).removeClass('add');
    			that.$(a).html($(a).attr('removelabel'))
        }
      })
    },

    showRejectInfo: function(e){
      var id = $(e.currentTarget).attr('layerid');
      this.$('#rejectPopup textarea').val(this.collection.get(id).get('reject_text'));
      $.fancybox($('#rejectPopup'), {
          'width':'640',
          'height': 'auto',
          'padding': '0',
          'autoDimensions':false,
          'autoSize':false,
          'closeBtn' : false,
          'scrolling'   : 'no',
          helpers : {
               overlay: {
                 css: {'background-color': 'rgba(0,0,102,0.85)'} ,
                 closeClick: false
               }
          },
          afterShow: function () {
            $("#btn_cancel").off('click');
            $("#btn_edit").off('click');
            $("#btn_cancel").click(function(e){
              $.fancybox.close();
            });
            $("#btn_edit").click(function(e){
              app.router.navigate(app.router.langRoutes["_link catalogue"][app.lang] + "/" + app.router.langRoutes["_link layer"][app.lang] + '/' + id,{trigger: true});
              $.fancybox.close();
            });
          }
      });
    },

    toggleCountryList:function(){
      this.$('#searchbar .country_list').toggleClass('active');
      this.$('#searchbar .status_list').removeClass('active');
    },

    toggleStatusList: function(){
      this.$('#searchbar .status_list').toggleClass('active');
      this.$('#searchbar .country_list').removeClass('active');
    },

    selectCounty: function(e) {
      this.$('#searchbar .country').val($(e.currentTarget).text());
      this.$('#searchbar .country_list').removeClass('active');
      this.search();
    },

    selectStatus: function(e) {
      this.$('#searchbar .status').val($(e.currentTarget).text());
      this.$('#searchbar .status_list').removeClass('active');
      this.search();
    },

    search: function(e){
      var country = null,
          status = null;

      if($('#searchbar .country').val() != ''){
        country = this.$('#searchbar .country_list li:contains("' + $('#searchbar .country').val() +'")').attr('id');
        if(country == -1)
          country = null;
      }

      if($('#searchbar .status').val() != ''){
				status = this.$('#searchbar .status_list li').filter(function() { return $(this).text() === $('#searchbar .status').val();});
				status = parseInt(status.attr('id'));

        if(status == -1)
          status = null;
      }

      this._renderList(this.collection.getLayersBySearch(this.$('#searchInput').val(),country,status));


    }

});
