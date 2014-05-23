var app = app || {};

app.router = Backbone.Router.extend({
    
    langRoutes : {
        "_link home" : {"en":"home","es": "inicio", "fr": "accueil" },
        "_link map" : {"en":"map","es": "mapa", "fr": "carte" },
        "_link catalogue" : {"en":"catalogue","es": "catalogo", "fr": "catalogue" },
        "_link about" : {"en":"proyecto","es": "proyecto", "fr": "proyecto" },
        "_link alboran" : {"en":"alboran","es": "alboran", "fr": "alboran" },
        "_link contact" : {"en":"contact","es": "contacto", "fr": "contacto" },
        "_link howto" : {"en":"howto","es": "comousarlo", "fr": "comousarlo" },
        "_link join" : {"en":"participate","es": "participe", "fr": "participe" },
        "_link legal" : {"en":"legal","es": "legal", "fr": "legal" },
        "_link privacy" : {"en":"privacy","es": "privacidad", "fr": "privacidad" },
    },

    /* define the route and function maps for this router */
    routes: {
            "" : "home",
            "inicio" : "home",
            
            "map" : "map",
            "map/:capas/:activas" : "map",
            "catalogue": "catalogue",
            
            "about": "about",
            "alboran": "alboran",
            "contact": "contact",
            "howto": "howto",
            "join": "join",
            "legal": "legal",
            "privacy": "privacy",
            
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
        this.route(this.langRoutes["_link about"][app.lang], "about");        
        this.route(this.langRoutes["_link alboran"][app.lang], "alboran");        
        this.route(this.langRoutes["_link contact"][app.lang], "contact");        
        this.route(this.langRoutes["_link howto"][app.lang], "howto");        
        this.route(this.langRoutes["_link join"][app.lang], "join");        
        this.route(this.langRoutes["_link legal"][app.lang], "legal");        
        this.route(this.langRoutes["_link privacy"][app.lang], "privacy");       
    },
    
    home: function(){
    	$("#content").show();
        $("#map").hide();
        app.showView(new app.view.Home());
    },
    
    map: function(capas,activas){
    	$("#content").hide();
        $("#map").show();
        app.events.trigger('menu','map');
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

    about: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.About() );
    },
    alboran: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Alboran() );
    },
    contact: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Contact() );
    },
    howto: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Howto() );
    },
    join: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Join() );
    },
    legal: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Legal() );
    },
    privacy: function(){
    	$("#content").show();
        $("#map").hide();
        app.showView( new app.view.Privacy() );
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