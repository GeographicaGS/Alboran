app.view.LegendView = Backbone.View.extend({
    
  initialize: function() {
  	this.render();
  },

  events:{
  	'click': 'toggleLegend'
	},
    
	onClose: function() {
		this.stopListening();
	},
    
  render: function(){
    this.$el.html('<div id="legend">' + getTextLang('legendText') + '<ul></ul></div>');
  	
  	_.defer(function(){ 
			var div = L.DomUtil.get('legend');
			if (!L.Browser.touch){
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
			}else{
				L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);	
			}
			
  	});
  	
    return this;
  },

  toggleLegend:function(e){
  	e.stopImmediatePropagation()
  	e.stopPropagation();
  	e.preventDefault();
    this.$('ul').toggleClass('active');
  }

});

	