app.view.Map = Backbone.View.extend({
   _template_tools : _.template( $('#map_tools_template').html() ),
    
    initialize: function() {
    	Map.initialize();
    	
      this.lengedView = new app.view.LegendView();
    	
      app.groupLayer = new app.view.GroupLayer({
        parent: this,
        legend: this.lengedView
      });
    	
    	this.render();
    	
    	var aux = Backbone.history.fragment.split(app.router.langRoutes["_link map"][[app.lang]]);
    	if(aux.length >1){
    		Map.setRoute(aux[1]);
    	}

      var collection = new Backbone.Collection();
      collection.url = '/api/allconfig/';
      collection.fetch({reset:true, success:function(data){
        $('.preconfigured_maps ul').html('');
        _.each(data.toJSON()[0].result,function(r) {
          $('.preconfigured_maps ul').append('<li id="' + r.id_config +'"><a jslink href="/' + app.lang + '/' + app.router.langRoutes['_link map'][app.lang] + '/' + r.id_config + '">' + r['title_' + app.lang] + '</a></li>')
        });
      }});

    	
  //   	Map.getMap().on("click",function(e){
  //      		$.fancybox($("#container_feature_info"), {
  //   			'width':"auto",
  //   			"height": "auto",
  //   		    'autoSize':true,
  //   		    'closeBtn' : true,
  //   		    'scrolling'   : 'yes',
  //               tpl: {
  //                   closeBtn: '<a title="Close" class="fancybox-item fancybox-close myCloseRound" href="javascript:;"><img src="/img/catalogue/ALB_icon_buscar_cerrar.svg"></a>'
  //               },
  //     		    afterShow: function () {
  //                   if ($('#groupLayer').is(":visible")) {
  //                       $('.fancybox-wrap').addClass('stretch');
  //                   }
  //   		    }
  //   		});
    		
  //   		Map.featureInfo(e);
    		
		// });
    	
    	// Map.getMap().on('zoomend', function() {
     //        if(currentMap == 1 && Map.getMap().getZoom() >= 11){
     //        	currentMap = 2;
     //        	Map.getMap().removeLayer(baseMap1);
     //        	baseMap2.addTo(Map.getMap());
     //        }else if(currentMap == 2 && Map.getMap().getZoom() < 11){
     //        	currentMap = 1;
     //        	Map.getMap().removeLayer(baseMap2);
     //        	baseMap1.addTo(Map.getMap());
     //        }
     //    });

    },
    
    events:{
      
	},
    
    onClose: function(){
        // Remove events on close
//        this.stopListening();
//    	$("#map").hide();
    },
    
    render: function() {
//        this.$el.html(this._template());
//    	$("#map").show();
    	
    	$("#groupLayer").html(app.groupLayer.el);

      $("#map").append(new app.view.MapTools().render().$el);
      $('#map').append(this.lengedView.$el);
    	
        return this;
    },
    
    
   
    
});

	