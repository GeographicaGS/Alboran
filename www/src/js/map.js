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
			this.layers.push(gSLayerWMS);
		}
	},
	
	removeLayer: function(id) {
		this.layers.forEach(function(gSLayerWMS) {
			if(gSLayerWMS.id == id){
				position = $.inArray(gSLayerWMS, self.layers );
				gSLayerWMS.setVisibility(false, null, null);
				return false;
			}
		});
	},
	
	removeAllLayers: function() {
		
		
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
	
	
	
	
	
	
	
	
	
}




