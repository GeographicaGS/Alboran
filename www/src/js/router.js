var app = app || {};

app.router = Backbone.Router.extend({

    langRoutes : {
        "_link home" : {"en":"home","es": "inicio", "fr": "accueil" },
        "_link map" : {"en":"map","es": "mapa", "fr": "carte" },
        "_link catalogue" : {"en":"catalogue","es": "catalogo", "fr": "catalogue" },
        "_link layer": {"en":"layer", "es":"capa", "fr":"capa"},
        "_link section": {"en":"section", "es":"seccion", "fr":"seccion"},
        "_link about" : {"en":"proyecto","es": "proyecto", "fr": "projet" },
        "_link alboran" : {"en":"alboran","es": "alboran", "fr": "alboran" },
        "_link contact" : {"en":"contact","es": "contacto", "fr": "contacto" },
        "_link howto" : {"en":"howto","es": "comousarlo", "fr": "CommentLUtiliser" },
        "_link join" : {"en":"participate","es": "participe", "fr": "participer" },
        "_link writehistory" : {"en":"writehistory","es": "escribirhistoria", "fr": "ecrirehistoire" },
        "_link history" : {"en":"history","es": "historia", "fr": "histoire" },
        "_link edithistory" : {"en":"edit","es": "editar", "fr": "editer" },
        "_link legal" : {"en":"legal","es": "legal", "fr": "juridique" },
        "_link privacy" : {"en":"privacy","es": "privacidad", "fr": "confidentialité" },
        "_link user" : {"en":"user","es": "usuario", "fr": "usuario" },
        "_link documents" : {"en":"documents","es": "documentos", "fr": "documents" },
        "_link document": {"en":"document", "es":"documento", "fr":"document"},
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
            "catalogue/:cat": "catalogue",
            "catalogue/:cat/:sec": "catalogue",
            "catalogue/layer": "layer",
            "catalogue/layer/:id": "layer",
            "catalogue/section/:id": "section",

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
            "join/history/:id/edit": "edithistory",

            // "documents/document": "createDocument",
            // "documents/document/:id": "createDocument",
            "documents(/:block/:subBlock)": "documents",
            "documents/:id": "document",

            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",

            "user/:username/:code": "signinConfirmation",

            /* Sample usage: http://example.com/#about */
            "*other"    : "defaultRoute"
            /* This is a default route that also uses a *splat. Consider the
            default route a wildcard for URLs that are either not matched or where
            the user has incorrectly typed in a route path manually */

    },


    initialize: function(options) {
        // Bind 'route' event to send Google Analytics info
        Backbone.history.on("route", this.sendPageview);

        // Force spanish address
        // Backbone.history.on("route", this.forceSpanish);

        this.route(this.langRoutes["_link home"][app.lang], "home");
        this.route(this.langRoutes["_link map"][app.lang], "map");
        this.route(this.langRoutes["_link map"][app.lang] + "/:capas/:activas", "map");
        this.route(this.langRoutes["_link map"][app.lang] + "/:capas/:activas/:opacidad/:mostrarHistorias", "map");
        this.route(this.langRoutes["_link map"][app.lang] + "/:config", "mapConf");
        this.route(this.langRoutes["_link map"][app.lang] + "/" + this.langRoutes["_link history"][app.lang] + "/:id", "mapHistory");
        this.route(this.langRoutes["_link catalogue"][app.lang], "catalogue");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/:cat", "catalogue");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/:cat/:sec", "catalogue");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/" + this.langRoutes["_link layer"][app.lang], "createlayer");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/" + this.langRoutes["_link layer"][app.lang] + "/:id", "editlayer");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/" + this.langRoutes["_link section"][app.lang] + "/:id", "editsection");
        this.route(this.langRoutes["_link about"][app.lang], "about");
        this.route(this.langRoutes["_link alboran"][app.lang], "alboran");
        this.route(this.langRoutes["_link contact"][app.lang], "contact");
        this.route(this.langRoutes["_link howto"][app.lang], "howto");
        this.route(this.langRoutes["_link join"][app.lang], "join");
        this.route(this.langRoutes["_link join"][app.lang] + "/:section", "join");
        this.route(this.langRoutes["_link join"][app.lang] + "/" + this.langRoutes["_link writehistory"][app.lang] , "writehistory");
        this.route(this.langRoutes["_link join"][app.lang] + "/" + this.langRoutes["_link history"][app.lang] + "/:id" , "showhistory");
        this.route(this.langRoutes["_link join"][app.lang] + "/" + this.langRoutes["_link history"][app.lang] + "/:id/" + this.langRoutes["_link edithistory"] , "edithistory");
        this.route(this.langRoutes["_link legal"][app.lang], "legal");
        this.route(this.langRoutes["_link privacy"][app.lang], "privacy");
        this.route(this.langRoutes["_link user"][app.lang] + "/:username/:code", "signinConfirmation");
        this.route(this.langRoutes["_link documents"][app.lang] + "(/:block/:subBlock)", "documents");
        this.route(this.langRoutes["_link documents"][app.lang] + "/:id", "document");
        this.route(this.langRoutes["_link documents"][app.lang] + "/" + this.langRoutes["_link document"][app.lang], "createDocument");
        this.route(this.langRoutes["_link documents"][app.lang] + "/" + this.langRoutes["_link document"][app.lang] + "/:id", "editDocument");
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
            window.location.href="/" + app.lang + "/browser_error.html";
        }else{
            app.cookieWarning();
            $("#content").hide();
            $("#map").show();
            app.events.trigger('menu','map');

            if(mostrarHistorias == 1){
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
            window.location.href="/" + app.lang + "/browser_error.html";
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
            window.location.href="/" + app.lang + "/browser_error.html";
        }else{
            $("#content").hide();
            $("#map").show();
            app.events.trigger('menu','map');
            if(Map.getMap() != null){
                Map.getMap().invalidateSize("true");
            }
            Map.toggleHistories(true, Map.openHistoryPopup, id);
            if(app.groupLayer)
                    app.groupLayer.toggleHistories(null,true);
        }
    },

    catalogue: function(category, section){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Catalogue({activeCategory: category, activeSection: section}) );
    },

    createlayer: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.LayerCreate() );
    },

    editlayer: function(id){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.LayerCreate({layerId: id}) );
    },

    editsection: function(id){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.SectionCreate({sectionId: id}) );
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

    edithistory: function(id){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.HistoryCreate({historyId: id}) );
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

    documents:function(block,subBlock){
      $("#content").show();
      $("#map").hide();
      app.showView(new app.view.Documents({'block':block, 'subBlock':subBlock}));
    },

    document:function(id){
      $("#content").show();
      $("#map").hide();
      app.showView(new app.view.DocumentItem({'id_doc':id}));  
    },

    createDocument:function(){
        $("#content").show();
        $("#map").hide();
        app.showView(new app.view.DocumentCreate());
    },

    editDocument:function(id){
      $("#content").show();
      $("#map").hide();
      app.showView( new app.view.DocumentCreate({documentId: id}) );
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

    sendPageview: function(){
        var url;
        url = Backbone.history.root + Backbone.history.getFragment()
        ga('send', 'pageview', url);
    },

    forceSpanish: function(){
        if (Backbone.history.root.indexOf('es') == -1){
            window.location.href="/es/";
        }
    }

});
