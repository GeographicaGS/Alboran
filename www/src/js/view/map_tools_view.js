app.view.MapTools = Backbone.View.extend({
 	_template : _.template( $('#map_tools_template').html() ),
    
  initialize: function() {

    this.editableLayers = new L.FeatureGroup();
    Map.getMap().addLayer(this.editableLayers);

  	var meauseOptions = {
  		draw: {
				polyline: {
					metric: true,
					shapeOptions: {
						color: '#f7931e',
						weight:3
					},
				},
				polygon: {
					allowIntersection: false,
					showArea:true,
					metric: true,
					shapeOptions: {
						color: '#f7931e',
						weight:3
					},
				},
			}
		};

		L.drawLocal = {
	    draw: {
        handlers: {
          polygon: {
            tooltip: {
              start: '<lang>Click to start measuring area.</lang>',
              cont: '<lang>Click to continue measuring area.</lang>',
              end: ''
            }
          },
          polyline: {
            error: '',
            tooltip: {
              start: '<lang>Click to start drawing line.</lang>',
              cont: '<lang>Click to continue drawing line.</lang>',
              end: '<lang>Click last point to finish line.</lang>'
            }
          }
        }
	    }
		};

		this._drawPolygon = new L.Draw.Polygon(Map.getMap(), meauseOptions.draw.polygon);
		this._drawPolyline = new L.Draw.Polyline(Map.getMap(), meauseOptions.draw.polyline);
    
    // this._tooltip = new L.Draw.Tooltip(Map.getMap());
    // this._tooltip.updateContent({ text: 'Prueba' });

    var _this = this;
    
    Map.getMap().on(L.Draw.Event.DRAWVERTEX, function (e) {
      if(_this.editableLayers.getLayers().length > 0)
        _this.editableLayers.removeLayer(_this.editableLayers.getLayers()[0]);
    });

    Map.getMap().on(L.Draw.Event.CREATED, function (e) {
      var type = e.layerType,
          layer = e.layer;

      _this.editableLayers.addLayer(layer);

      if (type === 'polygon'){
        layer.bindPopup(_this._drawPolygon._getMeasurementString(),{className:'coords_popup'}).openPopup();
        _.defer(function(){ 
          _this._drawPolygon.enable();
        }); 

      }else if(type == 'polyline'){
        layer.bindPopup(_this._drawPolyline._getMeasurementString(),{className:'coords_popup'}).openPopup();
        _.defer(function(){ 
          _this._drawPolyline.enable();
        });
      }
      

    });

    L.control.scale({position:"bottomright", "imperial":true}).addTo(Map.getMap());

  },
    
    events:{
      'click .map_tool': '_clickTool',
      'click .feature_info': '_featureInfo',
      'click .coords': '_getCoords',
      'click .mini_map': '_toggleMiniMap',
      'click .measure_area': '_measureArea',
      'click .measure_dist': '_measureDist',
      'click .zoom_out': '_zoomOut',
      'click .scaleNumeric ul li': '_changeScale'
	},
    
	onClose: function() {
		this.stopListening();
	},
    
  render: function() {
    this.$el.html(this._template());
    _.defer(function(){ 
      Map.getMap().addControl(new L.Control.ZoomDisplay());
    });
    return this;
  },

  _clickTool:function(e){
  	this.$('div').not(e.currentTarget).not('.mini_map').removeClass('active');
    $(e.currentTarget).toggleClass('active');
    // if(!$(e.currentTarget).hasClass('active'))
    	this._offClicks();
  },

  _featureInfo:function(e){
  	e.stopPropagation();
  	if($(e.currentTarget).hasClass('active')){
  		Map.getMap().on("click",function(e){
       		$.fancybox($("#container_feature_info"), {
    			'width':"auto",
    			"height": "auto",
    		    'autoSize':true,
    		    'closeBtn' : true,
    		    'scrolling'   : 'yes',
                tpl: {
                    closeBtn: '<a title="Close" class="fancybox-item fancybox-close myCloseRound" href="javascript:;"><img src="/img/catalogue/ALB_icon_buscar_cerrar.svg"></a>'
                },
      		    afterShow: function () {
                    if ($('#groupLayer').is(":visible")) {
                        $('.fancybox-wrap').addClass('stretch');
                    }
    		    }
    		});
    		Map.featureInfo(e);
			});
			$('#map').addClass('pointer'); 
  	}
  },

  _getCoords:function(e){
  	var _this = this;
  	e.stopPropagation();
  	if($(e.currentTarget).hasClass('active')){
  		$('#map').addClass('pointer');
  		Map.getMap().on("click",function(e){
  			if(_this._marker)
  				_this._marker.setLatLng(e.latlng);
  			else
  				_this._marker = L.marker(e.latlng,
  					{icon:
  						L.icon({
							    iconUrl: '/img/icon-coordenadas-azul.svg',
							    iconSize:     [20, 20],
							    iconAnchor:   [10, 19],
							    popupAnchor:  [0, -30]
							})
  					})
  					.addTo(Map.getMap());
				    

				_this._marker.bindPopup(formatcoords(e.latlng.lat,e.latlng.lng).format(),{className:'coords_popup'})
				    				.openPopup();

			});
  	}
  },

  _toggleMiniMap:function(e){
  	if($(e.currentTarget).hasClass('active'))
  		$(Map.overview._container).removeClass('hidden');
  	else
  		$(Map.overview._container).addClass('hidden');
  },

  _measureArea:function(e){
    if($(e.currentTarget).hasClass('active'))
  	 this._drawPolygon.enable();
    else
      this._drawPolygon.disable();
  },

  _measureDist:function(e){
    if($(e.currentTarget).hasClass('active'))
     this._drawPolyline.enable();
    else
      this._drawPolyline.disable();
  },

  _zoomOut:function(e){
    Map.getMap().setView(new L.LatLng(Map.iniLat, Map.iniLng),Map.iniZoom);
  },

  _changeScale:function(e){
    this.$('.scaleNumeric span').text($(e.currentTarget).text());
    Map.getMap().setZoom(parseInt($(e.currentTarget).attr('zoom')))
  },

  _offClicks:function(){
  	$('#map').removeClass('pointer');
  	Map.getMap().off('click');
  	if(this._marker){
			Map.getMap().removeLayer(this._marker);
			this._marker = null;
		}
    if(this.editableLayers.getLayers().length > 0)
      this.editableLayers.removeLayer(this.editableLayers.getLayers()[0]);

    this._drawPolygon.disable();
    this._drawPolyline.disable();
  }

});

	