Map = {
	
	layers: null,	
	iniLat: 37.36455,
	iniLng: -4.57645,	
	iniZoom: 7,
	__map:null,
	
	initialize: function(){
		
		// center the map
		var startingCenter = new L.LatLng(this.iniLat, this.iniLng);		
		
		//create the left map's leaflet instance
		__map = new L.Map('map', {
			  center: startingCenter,
			  zoom: this.iniZoom,
			  fadeAnimation: false,
			//  crs: L.CRS.EPSG4326,
			  zoomControl: false,
			  attributionControl: false
		});
		
		
		
		
		// add zoom control to map left
		var zoomControl = new L.Control.Zoom({
			position : 'bottomleft'
		});		
	
		zoomControl.addTo(__map);
	
		this.__map.touchZoom.disable();
		
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
	
	addLayer: function() {
		
	},
	
	removeLayer: function() {
	
	},
	
	removeAllLayers: function() {
		
		
	},
	
	
	
	
	
	
	
	
	
	
}




