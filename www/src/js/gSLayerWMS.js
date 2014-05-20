function GSLayerWMS(id,title, url, name, maxZoom){
	this.id = id;
	this.title = title;
	this.url = url;
	this.name = name;
	this.visible = true;
	this.layer = null;
	this.maxZoom = maxZoom;
	this.z_index = null;
	
	this.setVisibility = function(visibility, z_index, zoomLevel){
		
		if(this.layer == null){
			this.layer =  L.tileLayer.wms(this.url, {
								layers: this.name,
								format: 'image/png',
								transparent: true,
							});	
		}
		
		if((visibility) && (zoomLevel <= this.maxZoom)){
			this.layer.addTo(Map.getMap());
			this.z_index = z_index;
			this.layer.setZIndex(z_index);
			this.visible = true;
		}else{
			Map.getMap().removeLayer(this.layer);
			this.visible = false;
		}
	};
}