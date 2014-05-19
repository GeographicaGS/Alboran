var app = app || {};

app.router = Backbone.Router.extend({
    
    langRoutes : {
        "_link home" : {"en":"home","es": "inicio" },
    },

    /* define the route and function maps for this router */
    routes: {
            "" : "home",
           
            
            "map" : "map",
            
            
            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",
            
            /* Sample usage: http://example.com/#about */
            "*other"    : "defaultRoute"
            /* This is a default route that also uses a *splat. Consider the
            default route a wildcard for URLs that are either not matched or where
            the user has incorrectly typed in a route path manually */
        
    },
    

    initialize: function(options) {
        this.route(this.langRoutes["_link home"][app.lang], "home");
        this.route(this.langRoutes["_link home"][app.lang], "map");
    },
    
    home: function(){
        app.showView(new app.view.Home());
    },
    
    map: function(){
//    	if(this.map_view == null){
//    		this.map_view = new app.view.Map()
//    	}
//    	this.map_view.render();
        $("#map").show();
        if(Map.getMap() != null){
        	Map.getMap().invalidateSize("true");
        }
    },

    defaultRoute: function(){
        app.showView(new app.view.NotFound());
    },

    notfound: function(){
        app.showView(new app.view.NotFound());
    },

    error: function(){
        app.showView(new app.view.Error());
    }
    
});