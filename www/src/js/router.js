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
        "_link writehistory" : {"en":"writehistory","es": "escribirhistoria", "fr": "escribirhistoria" },
        "_link history" : {"en":"history","es": "historia", "fr": "historia" },
        "_link legal" : {"en":"legal","es": "legal", "fr": "legal" },
        "_link privacy" : {"en":"privacy","es": "privacidad", "fr": "privacidad" },
        "_link user" : {"en":"user","es": "usuario", "fr": "usuario" },
        "_link oldbrowser": {"en":"notsupportedbrowser", "es": "navegadornosoportado", "fr": "navegadornosoportado"}
    },

    /* define the route and function maps for this router */
    routes: {
            "" : "home",
            "inicio" : "home",
            
            "map" : "map",
            "map/:capas/:activas" : "map",
            "map/:capas/:activas/:opacidad/:mostrarHistorias" : "map",
            "map/:config": "mapConf",
            "map/history/:id": "mapHistory",
            "catalogue": "catalogue",
            
            "about": "about",
            "alboran": "alboran",
            "contact": "contact",
            "howto": "howto",
            "legal": "legal",
            "privacy": "privacy",

            "join": "join",
            "join/:section": "join", 
            "join/writehistory": "writehistory",
            "join/history/:id": "showhistory",
            
            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",
            "browsernotsupported" : "oldbrowser",

            "user/:username/:code": "signinConfirmation",
            
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
        this.route(this.langRoutes["_link map"][app.lang] + "/:capas/:activas/:opacidad/:mostrarHistorias", "map");
        this.route(this.langRoutes["_link map"][app.lang] + "/:config", "mapConf");
        this.route(this.langRoutes["_link map"][app.lang] + "/" + this.langRoutes["_link history"][app.lang] + "/:id", "mapHistory");
        this.route(this.langRoutes["_link catalogue"][app.lang], "catalogue");        
        this.route(this.langRoutes["_link about"][app.lang], "about");        
        this.route(this.langRoutes["_link alboran"][app.lang], "alboran");        
        this.route(this.langRoutes["_link contact"][app.lang], "contact");        
        this.route(this.langRoutes["_link howto"][app.lang], "howto");        
        this.route(this.langRoutes["_link join"][app.lang], "join");       
        this.route(this.langRoutes["_link join"][app.lang] + "/:section", "join");       
        this.route(this.langRoutes["_link join"][app.lang] + "/" + this.langRoutes["_link writehistory"][app.lang] , "writehistory");
        this.route(this.langRoutes["_link join"][app.lang] + "/" + this.langRoutes["_link history"][app.lang] + "/:id" , "showhistory");
        this.route(this.langRoutes["_link legal"][app.lang], "legal");        
        this.route(this.langRoutes["_link privacy"][app.lang], "privacy");
        this.route(this.langRoutes["_link user"][app.lang] + "/:username/:code", "signinConfirmation");
        this.route(this.langRoutes["_link oldbrowser"][app.lang], "oldbrowser");
    },
    
    home: function(){
    	$("#content").show();
        $("#map").hide();
        app.showView(new app.view.Home());
    },
    
    map: function(capas,activas,opacidad,mostrarHistorias){
    	if(!app.isSupportedBrowser()){
            $("#content").show();
            $("#map").hide();
            app.router.navigate("browsernotsupported", {trigger: true});
        }else{
            $("#content").hide();
            $("#map").show();
            app.events.trigger('menu','map');
            
            if(mostrarHistorias != 0){
                Map.toggleHistories(true);
                if(app.groupLayer)
                    app.groupLayer.toggleHistories();
            }

            if(Map.getMap() != null){
            	Map.getMap().invalidateSize("true");
            }
            if(!capas){
            	Map.getRoute();
            }
        }
    },

    mapConf: function(config){
        if(!app.isSupportedBrowser()){
            $("#content").show();
            $("#map").hide();
            app.router.navigate("browsernotsupported", {trigger: true});
        }else{
            $("#content").hide();
            $("#map").show();
            app.events.trigger('menu','map');

            if(Map.getMap() != null){
                Map.getMap().invalidateSize("true");
            }

            var now = $.now();
            $.ajax({
                url : "/api/config/" + config,
                type: "GET",
                dataType: "json",
                   success: function(response) {
                       if(response != ""){
                           Map.removeAllLayers()
                           Map.setRoute("/" + response.config)
                       }
                   }
               });
        }
    },

    mapHistory: function(id){
        if(!app.isSupportedBrowser()){
            $("#content").show();
            $("#map").hide();
            app.router.navigate("browsernotsupported", {trigger: true});
        }else{
            $("#content").hide();
            $("#map").show();
            app.events.trigger('menu','map');
            if(Map.getMap() != null){
                Map.getMap().invalidateSize("true");
            }
            Map.toggleHistories(true, Map.openHistoryPopup, id);
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
        app.showView( new app.view.About({section: 'contact'}) );
    },
    howto: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Howto() );
    },

    join: function(section){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Join({activeSection: section}) );
    },

    writehistory: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.HistoryCreate() );
    },

    showhistory: function(id){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.HistoryDetail({historyId: id}) );
    },

    legal: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Legal() );
    },
    privacy: function(){
    	$("#content").show();
        $("#map").hide();
        app.showView( new app.view.Legal({section: 'privacy'}) );
    },

    signinConfirmation: function(username, code) {
        $("#content").show();
        $("#map").hide();
        app.showView(new app.view.Home());

        // Check code
        $.ajax({
            url : "/api/user/" + username + "/" + code,
            type: "GET",
            statusCode: {
                200: function(response) {
                    showSigninConfirmation(response['user'],response['password']);
                },
                404: function(response) {
                    showSigninError();
                },
                401: function(response) {
                    showSigninError();
                }
            }
        });

        
    },

    defaultRoute: function(){
        app.showView(new app.view.NotFound());
    },

    notfound: function(){
        app.showView(new app.view.NotFound());
    },

    error: function(){
        app.showView(new app.view.Error());
    },

    oldbrowser: function(){
        $("#content").show();
        $("#map").hide();
        app.showView(new app.view.OldBrowser());
    }
    
});