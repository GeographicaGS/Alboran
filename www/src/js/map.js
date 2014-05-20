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
		var layer = new GSLayerWMS(1,"prueba", "http://www.sandbox.geographica.gs/cgi-bin/movitra", "mdt40fin4", 1000);
		layer.setVisibility(true, 1, Map.getMap()._zoom);
		this.layers.push(layer);
	},
	
	removeLayer: function(id) {
		 this.__map.removeLayer(this.layers[0]); 
	},
	
	removeAllLayers: function() {
		
		
	},
	
	searchLayer: function(id) {
		var result = null;
		categories.forEach(function(category) {
			category.topics.forEach(function(topic) {
				topic.layers.forEach(function(layer) {
				    if (layer.id == id){
				    	result = layer;
				    	return layer;
				    }
				});
			});
		});
		return result;
	},
	
	
	
	
	
	
	
	
	
}




