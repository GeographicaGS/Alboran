var app = app || {};

app.router = Backbone.Router.extend({
    
    langRoutes : {
        "_link home" : {"en":"home","es": "inicio", "fr": "accueil" },
        "_link map" : {"en":"map","es": "mapa", "fr": "carte" },
        "_link catalogue" : {"en":"catalogue","es": "catalogo", "fr": "catalogue" }
    },

    /* define the route and function maps for this router */
    routes: {
            "" : "home",
            "inicio" : "home",
            
            "map" : "map",
            "map/:capas/:activas" : "map",
            "catalogue": "catalogue",
            
            
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
        this.route(this.langRoutes["_link map"][app.lang], "map");
        this.route(this.langRoutes["_link map"][app.lang] + "/:capas/:activas", "map");
        this.route(this.langRoutes["_link catalogue"][app.lang], "catalogue");        
    },
    
    home: function(){
    	$("#content").show();
        $("#map").hide();
        app.showView(new app.view.Home());
    },
    
    map: function(capas,activas){
    	$("#content").hide();
        $("#map").show();
        if(Map.getMap() != null){
        	Map.getMap().invalidateSize("true");
        }
        if(!capas){
        	Map.getRoute();
        }
    },

    catalogue: function(){
    	$("#content").show();
        $("#map").hide();
        app.showView( new app.view.Catalogue() );
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