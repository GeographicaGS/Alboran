app.view.Map = Backbone.View.extend({
//    _template : _.template( $('#map_template').html()),
    
    initialize: function() {
    	Map.initialize();
    	
    	app.groupLayer = new app.view.GroupLayer({
            parent: this
        });
    	
    	this.render();
    	
    	var aux = Backbone.history.fragment.split(app.router.langRoutes["_link map"][[app.lang]]);
    	if(aux.length >1){
    		Map.setRoute(aux[1]);
    	}
    	
    	Map.getMap().on("click",function(e){
    		
    		$.fancybox($("#container_feature_info"), {
    			'width':"auto",
    			"height": "auto",
    		    'autoDimensions':true,
    		    'autoSize':true,
    		    'closeBtn' : true,
    		    'scrolling'   : 'no',
                tpl: {
                    closeBtn: '<a title="Close" class="fancybox-item fancybox-close myCloseRound" href="javascript:;"><img src="/img/catalogue/ALB_icon_buscar_cerrar.svg"></a>'
                }
//    		    helpers : { 
//    		    	   overlay: { 
//    		    		   css: {'background-color': 'rgba(0,0,102,0.85)'} 
//    		    	   } 
//    		    },
//    		    
//    		    afterShow: function () {
//    		    	
//    		    }
    		});
    		
    		Map.featureInfo(e);
    		
		});

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
    	
        return this;
    },
    
    
   
    
});

	