app.view.GroupLayer = Backbone.View.extend({
	
	_template : _.template( $('#groupLayer_template').html() ),
    
    initialize: function() {
    	this.render();
    	
    	this.$el.find(".panel").sortable({
    		start: function( event, ui ) {
//				$(ui.item).css("background-color","#f2f7fb");
				
			},
			stop: function( event, ui ) {
				var id_layer = $(ui.item).attr("idlayer");
				
				var l;
				Map.layers.forEach(function(gSLayerWMS) {
					if(gSLayerWMS.id == id_layer){
						l = gSLayerWMS;
						Map.layers.splice(Map.layers.indexOf(l),1);
					}
				});
				
				
//				var l = Map.layers[id_layer];
//				
//				Map.layers.splice(id_layer,1);
				
				var new_idx = $(ui.item).index()-1;
				Map.layers.splice(new_idx,0,l);
				
				//change priority of all layer with bigger priority
				for(var i=0;i<Map.layers.length;i++){
					Map.layers[i].layer.setZIndex(Map.layers.length-i);
					Map.layers[i].z_index = Map.layers.length-i;
					
				}
			}
    	});
    	this.$el.find(".panel").disableSelection();
    	this.$el.find(".panel").sortable({ cancel: '.disableSortable' });
    	
    	$($("#map_control").find("img")[0]).on('click', function() {
    		if($("#groupLayer").is(":visible")){
    			
    			$(".groupLauyerConfig").css({"background-color":""});
    			$(".groupLauyerConfig").attr("src","/img/map/ALB_icon_config_toc.svg");
    			$("#configPanelMap").fadeOut();
    			
    			$("#groupLayer").animate({"left":"-320"},300);
    			$("#groupLayer").hide(300);
    			
    			$("#map_control img").removeClass("fleft");
    			$("#map_control .title").hide();
    			$("#map_control .title").removeClass("fleft");
    			$(".groupLauyerConfig").hide();
    			$("#map_control span").show();
    			$("#map_control br").show()
    		}else{
    			
    			$("#groupLayer").animate({"left":"0"},300);
    			$("#groupLayer").show();
    			
    			$("#map_control img").addClass("fleft");
    			$("#map_control .title").show(300,function(){
        			$(".groupLauyerConfig").show();
        			$("#map_control .title").addClass("fleft");
    			});
    			$("#map_control span").hide()
    			$("#map_control br").hide();
    		}
       }); 
    	
    	$($("#map_control").find("div")[0]).on('click', function() {
    		$($("#map_control").find("img")[0]).trigger("click");
    	});
    	
    	$(".groupLauyerConfig").on('click', function(e) {
    		if($("#configPanelMap").is(":visible")){
    			$(".groupLauyerConfig").css({"background-color":""});
        		$(".groupLauyerConfig").attr("src","/img/map/ALB_icon_config_toc.svg");
        		$("#configPanelMap").fadeOut();
        	}else{
        		$(".groupLauyerConfig").css({"background-color":"#e9eaea"});
        		$(".groupLauyerConfig").attr("src","/img/map/ALB_icon_config_toc_abierto.svg"); 
        		$("#configPanelMap").fadeIn();
        	}
    	});
    	
    	$("#saveConfiguration").on('click', function() {
    		
    		if(localStorage.getItem('user') && localStorage.getItem('password')){
    			
    			$(".groupLauyerConfig").css({"background-color":""});
    			$(".groupLauyerConfig").attr("src","/img/map/ALB_icon_config_toc.svg");
    			$("#configPanelMap").fadeOut();
        		
        		$.fancybox($("#confirmSaveConfig"), {
        			'width':'640',
        			"height": "auto",
        		    'autoDimensions':false,
        		    'autoSize':false,
        		    'closeBtn' : false,
        		    'scrolling'   : 'no',
        		    helpers : { 
        		    	   overlay: { 
        		    		   css: {'background-color': 'rgba(0,0,102,0.85)'} 
        		    	   } 
        		    },
        		    
        		    afterShow: function () {
        		    	$($("#confirmSaveConfig").find("input[type='button']")[0]).on('click', function() {
        		    		var now = $.now();
       		    			$.ajax({
       		    				url : "/api/config/",
       		    				data: {"data":Map.buildRoute()},
       		    				type: "POST",			
       		    		        success: function() {
       		    		        	$.fancybox.close();
       		    		        }
       		    		    });   		    		
        		    	});
        		    	$($("#confirmSaveConfig").find("input[type='button']")[1]).on('click', function() {
        		    		$.fancybox.close();
        		    	});
        		    }
        		});
        		
    		}else{
    			$(".login").trigger("click");
    		}
        });
    	
    	$("#loadConfiguration").on('click', function() {
    		if(localStorage.getItem('user') && localStorage.getItem('password')){
    			var now = $.now();
        		$.ajax({
        			url : "/api/config/",
        			type: "GET",
        			dataType: "json",
        		       success: function(response) {
        		    	   if(response != ""){
        		    		   Map.removeAllLayers()
        		    		   Map.setRoute("/" + response.config)
        		    	   }
        		    	   $(".groupLauyerConfig").trigger("click");
        		       }
        		   });
        		
    		}else{
    			$(".login").trigger("click");
    		}
        });
    	
    	$("img[idConfig]").on('click', function() {
    		var now = $.now();
    		$.ajax({
    			url : "/api/config/" + $(this).attr("idConfig"),
    			type: "GET",
    			dataType: "json",
    		       success: function(response) {
    		    	   if(response != ""){
    		    		   Map.removeAllLayers()
    		    		   Map.setRoute("/" + response.config)
    		    	   }
    		    	   $(".groupLauyerConfig").trigger("click");
    		       }
    		   });
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
//    	var categry = $(e.currentTarget).parent().attr("category");
    	app.router.navigate("catalogue",{trigger: true});
//    	$($(".topTabs li")[categry]).trigger("click")
    },
    
    infoLayerClick: function(e){
    	if(!$(e.currentTarget).hasClass("removeLayer")){
    		e.stopImmediatePropagation();
    		app.router.navigate("catalogue",{trigger: true});
    		
    		var idLayer = $(e.currentTarget).parent().attr("idLayer");
        	var categry = Map.searchLayerGroup(Map.searchLayer(idLayer))
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
        //<li idLayer="1" class="active">Nombre capa <img class="icon removeLayer" src="/img/map/ALB_icon_descartar_capa.svg"> <img class="icon" src="/img/map/ALB_icon_info_capa.svg"> </li>
        var $li = $(document.createElement('li'));
        $li.addClass('active');
//        $li.addClass('ellipsis');
        $li.attr('idLayer',id);
        var layer = Map.searchLayer(id);
        
        switch(Map.searchLayerGroup(layer)) {
        case 0:
        	$li.addClass('green');
            break;
        case 1:
        	$li.addClass('red');
            break;
        default:
        	$li.addClass('blue');
            break;
        }
        
        $li.html("<p class='ellipsis fleft'>" + layer.title_es + "</p>");
        
        var $icon1, $icon2;
        $icon1 = $(document.createElement('img'));
        $icon1.addClass('icon removeLayer');
        $icon1.attr('src','/img/map/ALB_icon_descartar_capa.svg');
        $icon2 = $(document.createElement('img'));
        $icon2.addClass('icon');
        $icon2.attr('src','/img/map/ALB_icon_info_capa.svg');

        $li.append($icon1).append($icon2).append("<div class='clear'></div>");

        // Obtener el padre de la capa en el JSON para determinar el grupo
//        var groupIndex = Map.searchLayerGroup(layer);
//        var $group = this.$('.panel').eq(groupIndex);
//
//        $li.insertBefore($group.find('li:last-child'));
        
        $li.hide();
        $li.insertAfter($('.panel').find('li:first-child'));
        $li.show(300);
        

        Map.addLayer(id);
    },

    removeLayer: function(id) {
        var $li = this.$('li[idLayer="'+id+'"]');
        if($li.length > 0) {
        	 $li.hide(function(){ 
        		 $li.remove();
                 Map.removeLayer(id);
        	});
        }
    }
   
    
});

	