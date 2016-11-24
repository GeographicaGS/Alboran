L.Control.ZoomDisplay = L.Control.extend({
    
    // options: {
    //     position: 'bottomleft'
    // },

    onAdd: function (map) {
        this._map = map;
        this._container = L.DomUtil.create('div', "leaflet-control-zoom-display"),
        this.updateMapZoom(map.getZoom());
        map.on('zoomend', this.onMapZoomEnd, this);
        for(var i=3; i<18;i++){
          $(".scaleNumeric ul").append('<li zoom="' + i + '">' + "1:" + this.zoom2scale(i) + '</li>')
        }
        return this._container;
    },

    onRemove: function (map) {
        map.off('zoomend', this.onMapZoomEnd, this);
    },

    onMapZoomEnd: function (e) {
        this.updateMapZoom(this._map.getZoom());
    },

    updateMapZoom: function (zoom) {
        if(typeof(zoom) === "undefined"){zoom = ""}
        this._container.innerHTML = zoom;
        $(".scaleNumeric span").text("1:" + this.zoom2scale(zoom));
    },

    zoom2scale:function(zoom){
        if(zoom<0){
            return None
        }
        return this.numberWithDots(Math.round(559082264.028/(Math.pow(2,zoom))));
        // return Math.round(559082264.028/(Math.pow(2,zoom)));
    },

    numberWithDots:function(number){
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
});

L.Map.mergeOptions({
    zoomDisplayControl: true
});

L.control.zoomDisplay = function (options) {
    return new L.Control.ZoomDisplay(options);
};