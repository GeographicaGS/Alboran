app.view.MapPointSelector = Backbone.View.extend({
	_template: _.template( $('#map-pointselector_template').html() ),

    initialize: function(options) {
    	var self = this;

    	this.iniLat= 36.14231;
		this.iniLng= -3.74084;
		this.iniZoom= 8;
		this.selectedPoint={};

    	var opts = {};
        opts["afterLoad"] = function () {
            self.render();
            setTimeout(function(){
            	self.map.invalidateSize();
            }, 1000);
        }

        opts["afterClose"] = function() {
        	self.remove();
        }

        opts["tpl"] = {
            closeBtn: '<a title="Close" class="fancybox-item fancybox-close myClose inside" href="javascript:;"><img src="/img/catalogue/ALB_icon_buscar_cerrar.svg"></a>'
        }

        $.fancybox(this.$el, opts);

        $(window).on('resize', function(){
            self.render();
        });
    },

    onClose: function(){
        // Remove events on close
        this.map.off('click');
        this.stopListening();
    },

    render: function() {
        this.$el.html( this._template() );
        var mapEl = this.$('#mapPointSelector');
        this.map = L.map(mapEl[0], { zoomControl: false }).setView([this.iniLat, this.iniLng], this.iniZoom);
        // L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
		// 	    attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
		// 	}).addTo(this.map);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(this.map);
        new L.Control.Zoom({ position: 'bottomright' }).addTo(this.map);

        var that = this;
        this.map.on('click',function(e){
        	that.selectedPoint['lat'] = e.latlng.lat;
        	that.selectedPoint['lng'] = e.latlng.lng;
        	that.trigger('pointSelected',that.selectedPoint);
        	$.fancybox.close(that.$el);
        });

        return this;
    }
});
