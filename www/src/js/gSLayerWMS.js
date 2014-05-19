function GSLayerWMS(id,title, url, name, maxZoom){
	this.id = id;
	this.title = title;
	this.url = url;
	this.name = name;
	this.visible = true;
	this.layer = null;
	this.maxZoom = maxZoom;
	
	this.setVisibility = function(visibility, map, z_index, zoomLevel){
		
		if(this.layer == null){
			this.layer =  L.tileLayer.wms(this.url, {
								layers: this.name,
								format: 'image/png',
								transparent: true,
							});	
		}
		
		if((this.visible) && (this.maxZomm >=zoomLevel)){
			this.layer.addTo(map);
			if(z_index){
				this.layer.setZIndex(z_index);
			}
			this.visible = true;
		}else{
			map.removeLayer(this.layer);
			this.visible = false;
		}
	};
}