Map = {
	
	layers: [],	
	iniLat: 37.36455,
	iniLng: -4.57645,	
	iniZoom: 8,
	__map:null,
	
	initialize: function(){
//			// center the map
			var startingCenter = new L.LatLng(this.iniLat, this.iniLng);		
//			
//			//create the left map's leaflet instance
			this.__map = new L.Map('map', {
				  center: startingCenter,
				  zoom: this.iniZoom,
				  fadeAnimation: false,
				//  crs: L.CRS.EPSG4326,
				  zoomControl: false,
				  attributionControl: false
			});
			
			
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.__map);

			// add zoom control to map left
			var zoomControl = new L.Control.Zoom({
				position : 'bottomleft'
			});		
		
			zoomControl.addTo(this.__map);
		
			this.__map.touchZoom.disable();

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
			var gSLayerWMS = new GSLayerWMS(layer.id, layer.title_es, layer.wmsServer, layer.wmsLayName, 1000);
			var z_index = 0;
			if(this.layers.length > 0){
				z_index =  this.layers[this.layers.length - 1].z_index + 1;
			}
			gSLayerWMS.setVisibility(true, z_index, Map.getMap()._zoom);
			this.layers.unshift(gSLayerWMS);
			this.getRoute();
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
	},
	
	searchLayer: function(id) {
		var result = null;
		app.categories.forEach(function(category) {
			category.topics.forEach(function(topic) {
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
			while(!found && topic_index < app.categories[cat_index].topics.length){
				if(app.categories[cat_index].topics[topic_index].layers.indexOf(layer) != -1)
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
		
		this.layers.forEach(function(layer) {
			capas += layer.id + "_"
			
			if(layer.visible){
				activas += "1_"
			}else{
				activas += "0_"
			}
			
		});
		capas = capas.replace(/_([^_]*)$/,"/"+'$1');
		activas = activas.replace(/_([^_]*)$/,""+'$1');
		
		return capas + activas
	},
	
	setRoute: function(route) {
    	var argumentos = route.split("/");
    	if(argumentos.length > 2){
    		var capas = argumentos[1].split("_");
    		var activas = argumentos[2].split("_");
    		for(var i=capas.length -1; i>=0; i--){
    			app.groupLayer.addLayer(capas[i]);
    			if(activas[i] == "0"){
    				$("li[idlayer=" + capas[i] + "]").trigger("click");
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
	
}




