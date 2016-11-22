Map = {

	layers: [],
	markers: {},
	iniLat: 38.272862,
	iniLng: 15.599916,
	iniZoom: 5,
	__map:null,
	historiesVisible: false,

	initialize: function(){
		$("#map").outerHeight($("#map").outerHeight()-$("footer").outerHeight() - $('header').outerHeight());
		$("#map").css({top:$('header').outerHeight()})
//			// center the map
			var startingCenter = new L.LatLng(this.iniLat, this.iniLng);

//			//create the left map's leaflet instance
			this.__map = new L.Map('map', {
				  center: startingCenter,
				  zoom: this.iniZoom,
				  fadeAnimation: false,
				//  crs: L.CRS.EPSG4326,
				  zoomControl: false,
				  attributionControl: true
			});

//			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//			}).addTo(this.__map);

//			L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
//			    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
//			}).addTo(this.__map);
			// baseMap1.addTo(this.__map);

			var esri = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
					name:'esri',
    			attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
					})
					bingSatellite =  new L.BingLayer("Ah02iHhuuQ1AQK_EQt_vc513bIwSVYgCQiZnSdlyux_G7o5LDPGHhLK30tZRvFn5", {name:'bingSatellite', type: "AerialWithLabels", maxZoom:20}),
					bingRoad =  new L.BingLayer("Ah02iHhuuQ1AQK_EQt_vc513bIwSVYgCQiZnSdlyux_G7o5LDPGHhLK30tZRvFn5", {name:'bingRoad', type: "Road", maxZoom:20},
					openStreetMap =  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {name:'openStreetMap', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'})),

					esri2 = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
						name:'esri',
    			attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
					}),
					bingSatellite2 =  new L.BingLayer("Ah02iHhuuQ1AQK_EQt_vc513bIwSVYgCQiZnSdlyux_G7o5LDPGHhLK30tZRvFn5", {name:'bingSatellite', type: "AerialWithLabels", maxZoom:20}),
					bingRoad2 =  new L.BingLayer("Ah02iHhuuQ1AQK_EQt_vc513bIwSVYgCQiZnSdlyux_G7o5LDPGHhLK30tZRvFn5", {name:'bingRoad', type: "Road", maxZoom:20},
					openStreetMap2 =  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {name:'openStreetMap', attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}))
			;

			var position = 'topleft';

			L.control.layers(
			 {
			 	 'ESRI': esri,
				 'Bing satélite' : bingSatellite,
				 'Bing callejero' : bingRoad,
				 'OpenStreetMap' : openStreetMap
			 },null,{position: position}).addTo(this.__map);

			this.__map.addLayer(esri);

			esri.setZIndex(-1);
			bingSatellite.setZIndex(-1);
			bingRoad.setZIndex(-1);
			openStreetMap.setZIndex(-1);

			Map.overview = L.control.overview([esri2,bingSatellite2,bingRoad2,openStreetMap2]).addTo(this.__map);



			// add zoom control to map left
			var zoomControl = new L.Control.Zoom({
				position : 'topright'
			});

			zoomControl.addTo(this.__map);

			this.__map.touchZoom.disable();

			// History markers
			// Histories icon config
	        this.icon_goodpractice = L.icon({
	            iconUrl: '/img/map/ALB_marcador_historia_buenas_2x.png',
	            iconRetinaUrl: '/img/map/ALB_marcador_historia_avista_2x.png',
	            iconSize: [40, 32],
	            iconAnchor: [8, 32]
	        });

	        this.icon_sighting = L.icon({
	            iconUrl: '/img/map/ALB_marcador_historia_avista_2x.png',
	            iconRetinaUrl: '/img/map/ALB_marcador_historia_buenas_2x.png',
	            iconSize: [40, 32],
	            iconAnchor: [8, 32]
	        });

	},

	getMap: function() {
		return this.__map;
	},


	isLayerLoaded: function(id) {
		if(this.layers != null){
			for(var i=0; i<this.layers.length; i++){
				if(this.layers[i].id == id){
					return true;
				}
			}
		}

		return false;
	},


	addLayer: function(id) {
		var layer = this.searchLayer(id);
		if(layer != null){
			var gSLayerWMS = new GSLayerWMS(layer.id, layer["title_" + app.lang], layer.wmsServer, layer.wmsLayName, 1000);
			var z_index = 0;
			if(this.layers.length > 0){
				z_index =  this.layers[this.layers.length - 1].z_index + 1;
			}
			gSLayerWMS.setVisibility(true, z_index, Map.getMap()._zoom);
			this.layers.unshift(gSLayerWMS);
			this.getRoute();
			this.actualizarContadores();
		}
	},

	showLayer: function(id) {
		this.layers.forEach(function(gSLayerWMS) {
			if(gSLayerWMS.id == id){
				gSLayerWMS.setVisibility(true, gSLayerWMS.z_index, Map.getMap()._zoom);
			}
		});

		this.getRoute();
	},


	removeLayer: function(id) {
		this.layers.splice(this.hideLayer(id),1);
		this.getRoute();
		this.actualizarContadores();
	},

	hideLayer: function(id) {
		var self = this;
		var position = null;
		this.layers.forEach(function(gSLayerWMS) {
			if(gSLayerWMS.id == id){
				position = $.inArray(gSLayerWMS, self.layers);
				gSLayerWMS.setVisibility(false, null, null);
			}
		});
		this.getRoute();

		return position;
	},

	removeAllLayers: function() {
		this.layers.forEach(function(gSLayerWMS) {
			gSLayerWMS.setVisibility(false, null, null);
		});
		this.layers = [];
		$("li[idlayer]").remove();

		this.getRoute();
		this.actualizarContadores();
	},

	searchLayer: function(id) {
		var result = null;
		app.categories.each(function(category) {
			category.get('topics').forEach(function(topic) {
				topic.layers.forEach(function(layer) {
				    if (layer.id == id){
				    	return result = layer;
				    }
				});
			});
		});
		return result;
	},

	searchLayerGroup: function(layer) {
		var cat_index = 0, found = false;

		while(!found && cat_index < app.categories.length){
			var topic_index = 0;
			while(!found && topic_index < app.categories.at(cat_index).get('topics').length){
				if(app.categories.at(cat_index).get('topics')[topic_index].layers.indexOf(layer) != -1)
					found = true;
				topic_index++;
			}
			if(!found)
				cat_index++;
		}

		return cat_index;
	},

	getRoute: function() {
		if(Backbone.history.fragment.indexOf(app.router.langRoutes["_link map"][[app.lang]]) == 0){

			var result = this.buildRoute();

			if(result != ""){
				app.router.navigate(app.router.langRoutes["_link map"][[app.lang]] + "/" + result,{trigger: false});
			}else{
				app.router.navigate(app.router.langRoutes["_link map"][[app.lang]],{trigger: false});
			}
		}
	},

	buildRoute: function() {
		var capas = "";
		var activas = "";
		var opacidad = "";
		var historias = "";

		this.layers.forEach(function(layer) {
			capas += layer.id + "_"

			if(layer.visible){
				activas += "1_"
			}else{
				activas += "0_"
			}

			opacidad += (layer.layer.options.opacity * 100) + "_";

		});
		capas = capas.replace(/_([^_]*)$/,"/"+'$1');
		activas = activas.replace(/_([^_]*)$/,"/"+'$1');
		opacidad = opacidad.replace(/_([^_]*)$/,"/"+'$1');
		if(this.layers.length > 0)
			var historias = this.historiesVisible ? '1' : '0';

		return capas + activas + opacidad + historias;
	},

	setRoute: function(route) {
    	var argumentos = route.split("/");
    	if(argumentos.length > 3){
    		if(argumentos[1].indexOf(app.router.langRoutes["_link history"][[app.lang]]) == -1){
    			var capas = argumentos[1].split("_");
    			var activas = argumentos[2].split("_");
    			var opacidades = argumentos[3].split("_");
    			for(var i=capas.length -1; i>=0; i--){
    				app.groupLayer.addLayer(capas[i]);
    				if(activas[i] == "0"){
    					$("li[idlayer=" + capas[i] + "]").trigger("click");
    				}
    				app.groupLayer.setLayerOpacity(capas[i],opacidades[i]);
    				$("#slider_"+capas[i]).slider('value',opacidades[i]);
    			}
           	}
    	}
	},

	getNumLayersByCategory: function(cate) {
		var result = [0,0,0];
		for(var i=0; i<app.categories.length; i++){
			app.categories[i].topics.forEach(function(topic) {
				topic.layers.forEach(function(layer) {
					result[i] ++;
				});
			});
		}
		return result;
	},

	actualizarContadores: function() {

			$(".value.green").text($("#groupLayer .panel").find(".green").length);
	    $(".value.red").text($("#groupLayer .panel").find(".red").length);
	    $(".value.blue").text($("#groupLayer .panel").find(".blue").length);
	},

	featureInfo : function(e,id){

		$("#container_feature_info").html("<div class='loading'>Loading</div>").show();
		if(!id){
			id = 0;
		}

		var map = this.getMap();
		var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

		var BBOX = map.getBounds().toBBoxString();
		var WIDTH = map.getSize().x;
		var HEIGHT = map.getSize().y;
		// var X = map.layerPointToContainerPoint(e.layerPoint).x;
		// var Y = map.layerPointToContainerPoint(e.layerPoint).y;

		////////////////////////////////////////////////////////////////////////////////////////////////////////
	 	var bds = map.getBounds();
    var sz = map.getSize();
    var w = bds.getNorthEast().lng - bds.getSouthWest().lng;
    var h = bds.getNorthEast().lat - bds.getSouthWest().lat;
    var X = (((e.latlng.lng - bds.getSouthWest().lng) / w) * sz.x).toFixed(0);
    var Y = (((bds.getNorthEast().lat - e.latlng.lat) / h) * sz.y).toFixed(0);
		////////////////////////////////////////////////////////////////////////////////////////////////////////

		var layers = null;
		var server = null;
		var requestIdx = null;

		for (var i=id;i<this.layers.length;i++){
			var l = this.layers[i];
			if (l.visible && l.layer.options.opacity>0){
				server = l.url;
				layers = l.name;
				requestIdx = i;
				break;
			}
		}

		if (layers==null || server==null || requestIdx==null)
		{
			$("#container_feature_info").html("<lang>No hay información sobre este punto</lang>");

			return;
		}

		if(server.lastIndexOf("?") >= 0){
            server = server.slice(0,server.lastIndexOf("?"));
        }
        
		var request = server + '?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&LAYERS=' +layers+'&QUERY_LAYERS='+layers+'&STYLES=&BBOX='+BBOX+'&FEATURE_COUNT=5&HEIGHT='+HEIGHT+'&WIDTH='+WIDTH+'&FORMAT=image%2Fpng&INFO_FORMAT=text%2Fhtml&SRS=EPSG%3A4326&X='+X+'&Y='+Y;
		request = request.replace("wmts","wms");

		var obj = this;
	    $.ajax({
			url : "/api/proxy",
			data: { "url": request},
			type: "POST",
	        success: function(data) {
	        	try {
		        	if (!data || data.indexOf("LayerNotQueryable")!=-1){
		        		obj.featureInfo(e,requestIdx+1);
		        	}
		        	else{
		        		if($.trim($($.parseXML(data)).find("body").html()).length != 0){
		        			$("#container_feature_info").html(data);
		        		}else{
		        			if((i+1) < Map.layers.length){
		        				obj.featureInfo(e, i+1);
		        			}else{
		        				$("#container_feature_info").html("<lang>No hay información sobre este punto</lang>");
		        			}
		        		}
		        	}
	        	}catch (ex){
	        		if((i+1) < Map.layers.length){
        				obj.featureInfo(e, i+1);
        			}else{
        				$("#container_feature_info").html("<lang>No hay información sobre este punto</lang>");
        			}
	        	}
	        	$.fancybox.update();
	        },
	        error: function(){
	        	obj.featureInfo(e,requestIdx+1);
	        }
	    });

	},

	toggleHistories: function(forceShow, callback, params) {
		if(forceShow)
			this.historiesVisible = true;

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
                        e.popup._container.childNodes[1].innerHTML = '<lang>Cargando...</lang>';
                        $.ajax({
                            url : '/api/history/'+h_id,
                            type: 'GET',
                            success: function(data) {
                                var html = '<a href="/es/join/history/'+data.result.id_history +'" jslink class="info-popup">';
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
                            var marker;

                            if(feature.properties.h_type==0)
                                marker = L.marker(latlng, {icon: that.icon_goodpractice});
                            else
                                marker = L.marker(latlng, {icon: that.icon_sighting});

                            that.markers[feature.properties.h_id] = marker;
                            return marker;
                        },
                        onEachFeature: onEachFeature
                    });
                    that.historiesLayer.addTo(Map.__map);
                    that.historiesVisible = true;
                    that.getRoute();
                    if(callback)
                    	callback(params);
                }
            });
        }else{
        	if(forceShow){
        		if(!this.__map.hasLayer(this.historiesLayer)){
                	this.__map.addLayer(this.historiesLayer);
                	this.historiesVisible = true;
                }
        	}else{
            	if(!this.__map.hasLayer(this.historiesLayer)){
                	this.__map.addLayer(this.historiesLayer);
                	this.historiesVisible = true;
            	}else{
                	this.__map.removeLayer(this.historiesLayer);
                	this.historiesVisible = false;
            	}
            }
            this.getRoute();
            if(callback)
            	callback(params);
        }
    },
    openHistoryPopup: function(id){
    	if(Object.keys(Map.markers).length > 0){
        	Map.__map.panTo(Map.markers[id].getLatLng());
        	Map.markers[id].openPopup();
        }
    }

}
