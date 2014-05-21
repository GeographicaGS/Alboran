app.view.GroupLayer = Backbone.View.extend({
	
	_template : _.template( $('#groupLayer_template').html() ),
    
    initialize: function() {
    	this.render();
    	
    	this.$el.find(".panel").sortable({
    		start: function( event, ui ) {
//				$(ui.item).css("background-color","#f2f7fb");
				
			},
    	});
    	this.$el.find(".panel").disableSelection();
    	this.$el.find(".panel").sortable({ cancel: '.disableSortable' });
    	
    	$("#map_control").on('click', function() {
    		if($("#groupLayer").is(":visible")){
    			$("#groupLayer").animate({"left":"-320"},300);
    			$("#groupLayer").hide(300);
    			
    			$("#map_control img").removeClass("fleft");
    			$("#map_control .title").hide();
    			$("#map_control span").show();
    			$("#map_control br").show()
    		}else{
    			$("#groupLayer").animate({"left":"0"},300);
    			$("#groupLayer").show();
    			
    			$("#map_control img").addClass("fleft");
    			$("#map_control .title").fadeIn(500);
    			$("#map_control span").hide()
    			$("#map_control br").hide();
    		}
       });    	
    },
    
    events:{
		
	},
    
    onClose: function(){
    	this.stopListening();
    },
    
    render: function() {
    	this.$el.html(this._template());       
        return this;
    },
    
    addLayer: function(id) {
        console.log("addLayer " + id);

        //<li idLayer="1" class="active">Nombre capa <img class="icon removeLayer" src="/img/map/ALB_icon_descartar_capa.svg"> <img class="icon" src="/img/map/ALB_icon_info_capa.svg"> </li>
        var $li = $(document.createElement('li'));
        $li.addClass('active');
        $li.attr('idLayer',id);
        var layer = Map.searchLayer(id);
        $li.html(layer.title_es);
        
        var $icon1, $icon2;
        $icon1 = $(document.createElement('img'));
        $icon1.addClass('icon removeLayer');
        $icon1.attr('src','/img/map/ALB_icon_descartar_capa.svg');
        $icon2 = $(document.createElement('img'));
        $icon2.addClass('icon');
        $icon2.attr('src','/img/map/ALB_icon_info_capa.svg');

        $li.append($icon1).append($icon2);

        // Obtener el padre de la capa en el JSON para determinar el grupo
        var groupIndex = Map.searchLayerGroup(layer);
        var $group = this.$('.panel').eq(groupIndex);

        $li.insertBefore($group.find('li:last-child'));

        Map.addLayer(id);
    },

    removeLayer: function(id) {
        console.log("removeLayer " + id);

        var $li = this.$('li[idLayer="'+id+'"]');
        if($li.length > 0) {
            $li.remove();
            Map.removeLayer(id);
        }
    }
   
    
});

	