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
    	
    	// Histories icon config
        this.icon_goodpractice = L.icon({
            iconUrl: '/img/map/ALB_marcador_historia_avista_2x.png',
            iconRetinaUrl: '/img/map/ALB_marcador_historia_avista_2x.png',
            iconSize: [40, 32],
            iconAnchor: [8, 32]
        });

        this.icon_sighting = L.icon({
            iconUrl: '/img/map/ALB_marcador_historia_buenas_2x.png',
            iconRetinaUrl: '/img/map/ALB_marcador_historia_buenas_2x.png',
            iconSize: [40, 32],
            iconAnchor: [8, 32]
        });
    },
    
    events:{
    	"click li": "layerClick",
    	"mouseover li": "layerOver",
    	"mouseleave li": "layerLeave",
    	"click .removeLayer": "removeLayerClick",
    	"click .leyend" : "leyendClick",
    	"click .opacity": "opacityClick",
    	"click .panel li:LAST-CHILD": "addLayerClick",
    	"click .icon": "infoLayerClick",
        "click #mapHistoryControl": "toggleHistories"
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
    		$(e.currentTarget).find("p").css({"maxWidth":"145px"});
    	}
    },
    
    layerLeave: function(e){
    	if($(e.currentTarget).attr("idLayer")){
    		$(e.currentTarget).css({"background-color":"white"});
    		$(e.currentTarget).find("img").hide();
    		$(e.currentTarget).find("p").css({"maxWidth":"252px"});
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
        
        var $icon1, $icon2, $icon3, $icon4;
        
        $icon1 = $(document.createElement('img'));
        $icon1.addClass('icon leyend');
        $icon1.attr('src','/img/map/ALB_icon_leyenda.svg');
        
        $icon2 = $(document.createElement('img'));
        $icon2.addClass('icon opacity');
        $icon2.attr('src','/img/map/ALB_icon_opacidad.svg');
        
        $icon3 = $(document.createElement('img'));
        $icon3.addClass('icon removeLayer');
        $icon3.attr('src','/img/map/ALB_icon_descartar_capa.svg');
        
        $icon4 = $(document.createElement('img'));
        $icon4.addClass('icon');
        $icon4.attr('src','/img/map/ALB_icon_info_capa.svg');

        $li.append($icon1).append($icon2).append($icon3).append($icon4).append("<div class='clear'></div>");
        $li.append("<div class='opacity_panel' style=''>" +
	        			"<span class='opacity_label'>Opacity 100 %</span>" +
	        			"<div class='slider'></div>" +
        			"</div>");
        
        $li.append("<div class='clear'></div>");

        // Obtener el padre de la capa en el JSON para determinar el grupo
//        var groupIndex = Map.searchLayerGroup(layer);
//        var $group = this.$('.panel').eq(groupIndex);
//
//        $li.insertBefore($group.find('li:last-child'));
        
        $li.hide();
        //$li.insertAfter($('.panel').find('li:first-child'));
        $('.panel').prepend($li);
        $li.show(300);
        

        Map.addLayer(id);
        
        $("#groupLayer").find(".slider").slider({
			max: 100,
			min: 0,
			value: 100,
			stop: function( event, ui ){
				$(ui.handle).closest(".opacity_panel").find(".opacity_label").html("Opacity "+ ui.value + " %");
				var id_layer = $(ui.handle).closest("li").attr("idlayer");
				$(ui.handle).closest(".opacity_panel").siblings("img").attr("title","Opacity " + ui.value +" %");
				var layer;
				Map.layers.forEach(function(gSLayerWMS) {
					if(gSLayerWMS.id == id_layer){
						layer = gSLayerWMS;
					}
				});
				layer.layer.setOpacity(ui.value/100);
			}
		});
    },

    removeLayer: function(id) {
        var $li = this.$('li[idLayer="'+id+'"]');
        if($li.length > 0) {
        	 $li.hide(function(){ 
        		 $li.remove();
                 Map.removeLayer(id);
        	});
        }
    },
    
    leyendClick: function(e) {
    	e.stopImmediatePropagation();
    	
    	var id_layer = $(e.currentTarget).parent().attr("idLayer");
		var $container = $("main");
		var $el = $("<div class='flotable_legend ui-widget ui-widget-content' >"
				+	"<h4>" 
				+		"<img class='ml mt mr mb fleft' src='/img/map/ALB_icon_leyenda.svg' />"
				+		"<p class='titleLegend'></p>"
				+		"<img class='closeLegend' src='/img/map/ALB_icon_descartar_capa.svg' />"
				+	"</h4>"
				+	"<div class='co_legend'>"							
				+	"</div>"			
				+	"</div>");
		
		
		$el.hide(); //Para que aparezca de forma animada
		var dibjuarLeyenda = true;
		
		var layer;
		Map.layers.forEach(function(gSLayerWMS) {
			if(gSLayerWMS.id == id_layer){
				layer = gSLayerWMS;
			}
		});
		
		$el.find("h4").find("p").text(layer.title);
		
		var legendUrl = layer.url.replace("/gwc/service", "") + "?TRANSPARENT=true&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&"
		+"EXCEPTIONS=application%2Fvnd.ogc.se_xml&FORMAT=image%2Fpng&LAYER=" + layer.name;
		
		$el.find(".co_legend").html("<img src='" + legendUrl +"'/>");
		
		//Si esta leyenda ya se esta mostrando la elimino
		var leyendas = $container.find(".flotable_legend");
		for(var i=0; i<leyendas.length; i++){
			if($(leyendas[i]).find("h4").find("p").text() == $el.find("h4").find("p").text()){
				
				$(leyendas[i]).fadeOut(function () {
					$(this).remove();
				});
				dibjuarLeyenda = false;
				break;
			}	
		}
		if(dibjuarLeyenda){
			$container.prepend($el);
			
			$el.css("left",($container.width() / 2 ) - $el.width());
			$el.css("top",($container.height() / 2 ) - ($el.height() / 2));
						
			$el.find(".closeLegend").click(function(){
				$el.fadeOut(function () {
					$(this).remove();
				});
			});
			
			$el.draggable();
			
			$el.fadeIn(); //Para que aparezca de forma animada
		}
    	
    	
    },
    
    opacityClick: function(e) {
    	e.stopImmediatePropagation();
    	
    	var $opacity_panel = $(e.currentTarget).siblings(".opacity_panel");
		
    	var $li = $(e.currentTarget).closest("li"); 
		if ($opacity_panel.is(":visible")){
//			$li.animate({"height": $li.height() - $opacity_panel.outerHeight()});
			$opacity_panel.slideUp();
//			$li.css("border-bottom","1px solid #ccc");
		}
		else{
//			$li.animate({"height": $li.height() + $opacity_panel.outerHeight()});
			$opacity_panel.slideDown();
//			$li.css("border-bottom","none");
		}
    },

    toggleHistories: function(e) {
        var $target = $(e.currentTarget);
        if(!this.historyGeoJson){
            var that = this;
            $.ajax({
                url : '/api/historygeo/',
                type: 'GET',
                success: function(data) {
                    
                    function onEachFeature(feature, layer) {
                        // bind a popup with history's basic info
                        if (feature.properties && feature.properties.h_id) {
                            layer.bindPopup(''+feature.properties.h_id);
                            layer.on('popupopen',getPopupInfo);
                        }
                    }

                    function getPopupInfo(e){
                        var h_id = parseInt(e.popup._content,10);
                        var currentWidth = e.popup._container.offsetWidth;
                        e.popup._container.childNodes[1].innerText = '<lang>Cargando...</lang>';
                        $.ajax({
                            url : '/api/history/'+h_id,
                            type: 'GET',
                            success: function(data) {
                                var html = '<a href="/<lang>lang</lang>/<lang>_link join</lang>/<lang>_link history</lang>/'+data.result.id_history +'" jslink class="info-popup">';
                                html += '<div style="background-image:url(\'/images/'+data.result.images[0].href+'\')"></div>';
                                html += '<h2>'+data.result.author+'</h2>';
                                html += '<h1>'+data.result.title+'</h1>';
                                html += '<p><img src="/img/about/ALB_icon_li_menu_sec.svg"><lang>Ver más</lang></p>';
                                html += '</a>';
                                e.popup._container.childNodes[1].innerHTML = html;
                                $(e.popup._container).css('left',-161);
                            }
                        });                        
                    }

                    that.historyGeoJson = data.result;
                    that.historiesLayer = L.geoJson(that.historyGeoJson, {
                        pointToLayer: function (feature, latlng) {
                            if(feature.properties.h_type==0){
                                var marker = L.marker(latlng, {icon: that.icon_goodpractice});
                                //marker.on('popupopen',getPopupInfo);
                                return marker;
                            }else
                                var marker = L.marker(latlng, {icon: that.icon_sighting});
                                //marker.on('popupopen',getPopupInfo);
                                return marker;
                        },
                        onEachFeature: onEachFeature
                    });
                    that.historiesLayer.addTo(Map.__map);
                    $target.next('label').addClass('active');
                }
            });
        }else{
            if($target.prop('checked')){
                $target.next('label').addClass('active');
                Map.__map.addLayer(this.historiesLayer);
            }else{
                $target.next('label').removeClass('active');
                Map.__map.removeLayer(this.historiesLayer);
            }
        }
    }
});
	