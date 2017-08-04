var app = app || {};

app.router = Backbone.Router.extend({

    langRoutes : {
        "_link home" : {"en":"home","es": "inicio", "fr": "accueil" },
        "_link map" : {"en":"map","es": "mapa", "fr": "carte" },
        "_link catalogue" : {"en":"catalogue","es": "catalogo", "fr": "catalogue" },
        "_link layer": {"en":"layer", "es":"capa", "fr":"couche"},
        "_link section": {"en":"section", "es":"seccion", "fr":"seccion"},
        "_link howto" : {"en":"howto","es": "comousarlo", "fr": "CommentLUtiliser" },

        "_link progress" : {"en":"progress","es": "progreso", "fr": "cours" },

        "_link user" : {"en":"user","es": "usuario", "fr": "usuario" },
        "_link users" : {"en":"users","es": "usuarios", "fr": "utilisateurs" },
        "_link new" : {"en":"new","es": "nuevo", "fr": "nouveau" }
    },

    /* define the route and function maps for this router */
    routes: {
            "" : "home",
            "inicio" : "home",

            "map" : "map",
            "map/:capas/:activas" : "map",
            "map/:capas/:activas/:opacidad/:mostrarHistorias" : "map",
            "map/:config": "mapConf",

            "catalogue": "catalogue",
            "catalogue/:cat": "catalogue",
            "catalogue/:cat/:sec": "catalogue",
            "catalogue/layer": "layer",
            "catalogue/layer/:id": "layer",
            "catalogue/section/:id": "section",

            "progress": "progress",

            "howto": "howto",

            "notfound" : "notfound",
            "faq" : "faq",
            "error" : "error",

            "user/:username/:code": "signinConfirmation",
            "users": "users",
            "users/:id": "user",

            "*other"    : "defaultRoute"
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
        this.route(this.langRoutes["_link catalogue"][app.lang], "catalogue");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/:cat", "catalogue");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/:cat/:sec", "catalogue");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/" + this.langRoutes["_link layer"][app.lang], "createlayer");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/" + this.langRoutes["_link layer"][app.lang] + "/:id", "editlayer");
        this.route(this.langRoutes["_link catalogue"][app.lang] + "/" + this.langRoutes["_link section"][app.lang] + "/:id", "editsection");
        this.route(this.langRoutes["_link howto"][app.lang], "howto");

        this.route(this.langRoutes["_link progress"][app.lang], "progress");

        this.route(this.langRoutes["_link user"][app.lang] + "/:username/:code", "signinConfirmation");
        this.route(this.langRoutes["_link users"][app.lang], "users");
        this.route(this.langRoutes["_link users"][app.lang] + "/:id", "user");
        this.route(this.langRoutes["_link users"][app.lang] + "/" + this.langRoutes["_link new"][app.lang], "createuser");
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
            // app.cookieWarning();
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
                Map.overview._overview.invalidateSize();
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
                Map.overview._overview.invalidateSize();
            }

            var now = $.now();
            $('.preconfigured_maps ul li').removeClass('active');
            $('.preconfigured_maps ul li[id="'+ config + '"]').addClass('active');
            $.ajax({
                url : "/api/config/" + config,
                type: "GET",
                dataType: "json",
                   success: function(response) {
                       if(response != ""){
                           Map.removeAllLayers()
                           Map.setRoute("/" + response.config)
                           $('.preconfigured_maps ul li[id="+ config + "]');
                       }
                   }
               });
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

    howto: function(){
        $("#content").show();
        $("#map").hide();
        app.showView( new app.view.Howto() );
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

    progress:function(){
      $("#content").show();
      $("#map").hide();
      app.showView(new app.view.Progress());
    },

    users:function(){
      $("#content").show();
      $("#map").hide();
      app.showView(new app.view.Users());
    },

    user:function(id){
      $("#content").show();
      $("#map").hide();
      app.showView(new app.view.User({'id_user':id}));
    },

    createuser:function(){
      $("#content").show();
      $("#map").hide();
      app.showView(new app.view.User());
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
        //ga('send', 'pageview', url);
    },

    forceSpanish: function(){
        if (Backbone.history.root.indexOf('es') == -1){
            window.location.href="/es/";
        }
    }

});
