app.view.GroupLayer = Backbone.View.extend({
	
	_template : _.template( $('#groupLayer_template').html() ),
    
    initialize: function() {
    	this.render();
    	
    	this.$el.find(".panel").sortable({
    		start: function( event, ui ) {
//				$(ui.item).css("background-color","#f2f7fb");
				
			},
    	});
    	this.$el.find(".panel").disableSelection();
    	this.$el.find(".panel").sortable({ cancel: '.disableSortable' });
    	
    	$("#map_control").on('click', function() {
    		if($("#groupLayer").is(":visible")){
    			$("#groupLayer").animate({"left":"-320"},300);
    			$("#groupLayer").hide(300);
    			
    			$("#map_control img").removeClass("fleft");
    			$("#map_control .title").hide();
    			$("#map_control span").show();
    			$("#map_control br").show()
    		}else{
    			$("#groupLayer").animate({"left":"0"},300);
    			$("#groupLayer").show();
    			
    			$("#map_control img").addClass("fleft");
    			$("#map_control .title").fadeIn(500);
    			$("#map_control span").hide()
    			$("#map_control br").hide();
    		}
       });    	
    },
    
    events:{
    	"click li": "layerClick",
    	"mouseover li": "layerOver",
    	"mouseleave li": "layerLeave",
    	"click .removeLayer": "removeLayerClick",
    	"click .panel li:LAST-CHILD": "addLayerClick",
    	"click .icon": "infoLayerClick",
	},
	
	layerClick: function(e){
    	var idLayer = $(e.currentTarget).attr("idLayer");
    	if(idLayer){
    		if($(e.currentTarget).hasClass("active")){
    			Map.hideLayer(idLayer);
    			$(e.currentTarget).removeClass("active")
    		}else{
    			Map.showLayer(idLayer);
    			$(e.currentTarget).addClass("active")
    		}
    	}
    },
    
    layerOver: function(e){
    	if($(e.currentTarget).attr("idLayer")){
    		$(e.currentTarget).css({"background-color":"#f4f4f4"});
    		$(e.currentTarget).find("img").show();
    	}
    },
    
    layerLeave: function(e){
    	if($(e.currentTarget).attr("idLayer")){
    		$(e.currentTarget).css({"background-color":"white"});
    		$(e.currentTarget).find("img").hide();
    	}
    },
    
    removeLayerClick: function(e){
    	e.stopImmediatePropagation();
    	
    	var idLayer = $(e.currentTarget).parent().attr("idLayer")
    	
    	Map.removeLayer(idLayer);
    	$(e.currentTarget).parent().hide(function(){ 
    		$(this).remove();
    	});
    	
    	var addButtons = $(".add_btn");
    	for(var i=0; i<addButtons.length; i++){
    		if($(addButtons[i]).attr("layerid") == idLayer){
    			$(addButtons[i]).trigger("click");
    			break;
    		}
    	}
    },
    
    addLayerClick: function(e){
    	var categry = $(e.currentTarget).parent().attr("category");
    	app.router.navigate("catalogue",{trigger: true});
    	$($(".topTabs li")[categry]).trigger("click")
    },
    
    infoLayerClick: function(e){
    	if(!$(e.currentTarget).hasClass("removeLayer")){
    		e.stopImmediatePropagation();
    		app.router.navigate("catalogue",{trigger: true});
    		
    		var idLayer = $(e.currentTarget).parent().attr("idLayer");
        	var categry = $(e.currentTarget).parent().parent().attr("category");
    		var addButtons = $(".add_btn");
    		
    		for(var i=0; i<addButtons.length; i++){
    			if($(addButtons[i]).attr("layerid") == idLayer){
    				$($(".topTabs li")[categry]).trigger("click");
    				
    				$($(addButtons[i])).parent().parent().parent().children().find("p").find("a").trigger("click");
    				$('html, body').animate({
    			        scrollTop: $($(addButtons[i])).offset().top -90
    			    }, 1000);
    				
    				break;
    			}
    		}
    		
    	}
    },
    
    onClose: function(){
    	this.stopListening();
    },
    
    render: function() {
    	this.$el.html(this._template());       
        return this;
    },
    
    addLayer: function(id) {
        console.log("addLayer " + id);

        //<li idLayer="1" class="active">Nombre capa <img class="icon removeLayer" src="/img/map/ALB_icon_descartar_capa.svg"> <img class="icon" src="/img/map/ALB_icon_info_capa.svg"> </li>
        var $li = $(document.createElement('li'));
        $li.addClass('active');
        $li.attr('idLayer',id);
        var layer = Map.searchLayer(id);
        $li.html(layer.title_es);
        
        var $icon1, $icon2;
        $icon1 = $(document.createElement('img'));
        $icon1.addClass('icon removeLayer');
        $icon1.attr('src','/img/map/ALB_icon_descartar_capa.svg');
        $icon2 = $(document.createElement('img'));
        $icon2.addClass('icon');
        $icon2.attr('src','/img/map/ALB_icon_info_capa.svg');

        $li.append($icon1).append($icon2);

        // Obtener el padre de la capa en el JSON para determinar el grupo
        var groupIndex = Map.searchLayerGroup(layer);
        var $group = this.$('.panel').eq(groupIndex);

        $li.insertBefore($group.find('li:last-child'));

        Map.addLayer(id);
    },

    removeLayer: function(id) {
        console.log("removeLayer " + id);

        var $li = this.$('li[idLayer="'+id+'"]');
        if($li.length > 0) {
            $li.remove();
            Map.removeLayer(id);
        }
    }
   
    
});

	