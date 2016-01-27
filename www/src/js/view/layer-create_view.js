app.view.LayerCreate = Backbone.View.extend({
    _template : _.template( $('#layer-create_template').html() ),

    initialize: function(options) {
        var options = options || '';
        var Layer = app.model.Layer.extend({urlRoot: '/api/catalog/layer/'});
        app.events.trigger('menu','catalogue');
        this.isSending = false;
        if(options){
            this.layerId = options.layerId || 0;
            this.model = new Layer({id: this.layerId});
            var that = this;
            this.model.fetch().done(function () {
                that.categoryId = app.categories.getCategoryByTopic(that.model.get('topic_id')).get('id');
                $.ajax({
                    url : "/api/config/" + that.categoryId,
                    type: "GET",
                    dataType: "json",
                    success: function(response) {
                        var tokens = response.config.split('/');
                        var configLayers = tokens[0].split('_');
                        if(configLayers.indexOf(that.layerId) !== -1){
                            that.isInConfig = true;
                        }else{
                            that.isInConfig = false;
                        }
                        that.render();
                    }
                });

            });
        }else{
            this.isInConfig = false;
            this.model = new Layer();
            this.render();
        }
    },

    events: {
        'click .info > a': 'showInfo',
        'click #enviar_btn': 'sendLayer',
        'click #borrar_btn': 'deleteLayer',
        'click .cancel_btn': 'cancelLayer',
        'blur input[required]': 'validate',
        'blur textarea[required]': 'validate',
        'change #category': 'showTopics',
        'click #createTopic': 'createTopic',
        'keyup #wmsserver': 'changeExploreStatus',
        'click .explore': 'exploreWms',
        'click .geoserver': 'openGeoserverForm',
        'click .geonetwork_link': 'showGeonetworkPopup',
        'mouseover .geonetwork_link': 'showGeonetworkPopup',
        'mouseout #meta_data_options_popup': 'hideGeonetworkPopup'
        
        
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        var model = { 'data': this.model.toJSON()};
        model['data']['categories'] = app.categories.toJSON();
        model['data']['isInConfig'] = this.isInConfig;
        if(this.layerId){
            model['data']['layerCategory'] = this.categoryId;
        }
        this.$el.html(this._template(model));

        if(!this.layerId){
            this.$('select[name=topic]').eq(0).removeClass('hide').attr('disabled', true);
            this.$('#createTopic').addClass('disabled');
        }else{
            this.$('#topic-'+this.categoryId).removeClass('hide');
        }

        // Check session
        if(!(localStorage.password && localStorage.user && localStorage.admin)){
            this.showLogin();
        }

        if(this.layerId){
            // load layer section
        }

        return this;
    },

    showGeonetworkPopup:function(e){
        e.preventDefault();
        this.$('#meta_data_options_popup').removeClass('hide');
    },

    hideGeonetworkPopup:function(e){
        $(e.target).addClass('hide');
    },

    showInfo: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        $target.parent().find('.content').fadeToggle(200);
    },

    sendLayer: function(e){
        e.preventDefault();
        if(!this.isSending){
            this.isSending = true;
            this.$('#enviar_btn span').html('<lang>Enviando...</lang>');

            // Clear validation errors
            this.$('.invalid').removeClass('invalid');

            var that = this;

            // Prepare form data
            var items = {};
            var error = false;

            items.$category = this.$('select[name=category]');
            items.$topic= this.$('select[name=topic]:not(.hide)');
            items.$title_es= this.$('#title-es');
            items.$title_en= this.$('#title-en');
            items.$title_fr= this.$('#title-fr');
            items.$desc_es= this.$('#desc-es');
            items.$desc_en= this.$('#desc-en');
            items.$desc_fr= this.$('#desc-fr');
            items.$dataSource= this.$('#datasource');
            items.$wmsServer= this.$('#wmsserver');
            items.$wmsLayName= this.$('#layername');
            items.$geoNetWk= this.$('#metadata');

            $.each(items, function(index, element){
                if(element.attr('required')){
                    error = that.validate(element, false) || error;
                }
            });

            if(!items.$category.val() || items.$category.val() == 0){
                items.$category.addClass('invalid');
                error = true;
            }else{
                items.$category.removeClass('invalid');
                this.new_categoryId = items.$category.val();

                if (!items.$topic.val() || items.$topic.val()==0){
                    items.$topic.addClass('invalid');
                    error = true;
                }else{
                    items.$topic.removeClass('invalid');
                }
            }

            if(!error){
                var topic_id= parseInt(_.escape(items.$topic.val()));
                var title_es= _.escape(items.$title_es.val());
                var title_en= _.escape(items.$title_en.val());
                var title_fr= _.escape(items.$title_fr.val());
                var desc_es= _.escape(items.$desc_es.val());
                var desc_en= _.escape(items.$desc_en.val());
                var desc_fr= _.escape(items.$desc_fr.val());
                var dataSource= _.escape(items.$dataSource.val());
                var wmsServer= _.escape(items.$wmsServer.val());
                var wmsLayName= _.escape(items.$wmsLayName.val());
                var geoNetWk= _.escape(items.$geoNetWk.val());

                if(!category) category=0;

                var formData = {
                    'topic_id': topic_id,
                    'title_es': title_es,
                    'title_en': title_en,
                    'title_fr': title_fr,
                    'desc_es': desc_es,
                    'desc_en': desc_en,
                    'desc_fr': desc_fr,
                    'dataSource': dataSource,
                    'wmsServer': wmsServer,
                    'wmsLayName': wmsLayName,
                    'geoNetWk': geoNetWk
                };

                this.saveLayer(formData);
            }else{
                this.isSending = false;
                this.$('#enviar_btn span').html('<lang>Guardar capa</lang>');
            }
        }
    },

    saveLayer: function(formData){
        this.model.set({
            'topic_id': formData.topic_id,
            'title_es': formData.title_es,
            'title_en': formData.title_en,
            'title_fr': formData.title_fr,
            'desc_es': formData.desc_es,
            'desc_en': formData.desc_en,
            'desc_fr': formData.desc_fr,
            'dataSource': formData.dataSource,
            'wmsServer': formData.wmsServer,
            'wmsLayName': formData.wmsLayName,
            'geoNetWk': formData.geoNetWk
        });

        var that = this;
        this.model.save({}, {
            success: function(model, response, options){
                // TODO: Promises?
                var inConfig = this.$('#indefaultmap').is(':checked');
                if ((that.categoryId && that.new_categoryId != that.categoryId) || (that.isInConfig && !inConfig)){
                    // Delete layer from former config
                    $.ajax({
                        url : "/api/config/" + that.categoryId,
            			type: "GET",
            			dataType: "json",
            		    success: function(response) {
                            var tokens = response.config.split('/');
                            var configLayers = tokens[0].split('_');
                            var layerIndex = configLayers.indexOf(that.model.get('id').toString());
                            if(layerIndex != 1){
                                configLayers.splice(layerIndex, 1);
                                tokens[0] = configLayers.join('_');
                                $.ajax({
           		    				url : "/api/config/" + that.categoryId,
           		    				data: {"data": tokens.join('/')},
           		    				type: "POST",
                                    error: function(){
                                        that.showMessage('#layerCreateError');
                                        that.isSending = false;
                                        that.$('#enviar_btn span').html('<lang>Guardar capa</lang>');
                                    }
                                });
                            }
                        },
                        error: function(){
                            that.showMessage('#layerCreateError');
                            that.isSending = false;
                            that.$('#enviar_btn span').html('<lang>Guardar capa</lang>');
                        }
                    });
                }
                if ((inConfig && !that.isInConfig) || (that.categoryId && that.new_categoryId != that.categoryId)) {
                    $.ajax({
                        url : "/api/config/" + that.new_categoryId,
            			type: "GET",
            			dataType: "json",
            		    success: function(response) {
            		        var tokens = response.config.split('/');
                            var configLayers = tokens[0].split('_');
                            if(configLayers.indexOf(that.model.get('id'))){
                                tokens[0] += '_' + that.model.get('id');
                                tokens[1] += '_1';
                                tokens[2] += '_100';

                                $.ajax({
           		    				url : "/api/config/" + that.new_categoryId,
           		    				data: {"data": tokens.join('/')},
           		    				type: "POST",
           		    		        success: function() {
                                        that.showMessage('#layerCreateSuccess');
                                        that.isSending = false;
                                        that.$('#enviar_btn span').html('<lang>Capa guardada</lang>');
           		    		        },
                                    error: function(){
                                        that.showMessage('#layerCreateError');
                                        that.isSending = false;
                                        that.$('#enviar_btn span').html('<lang>Guardar capa</lang>');
                                    }
           		    		    });
                            }else{
                                that.showMessage('#layerCreateSuccess');
                                that.isSending = false;
                                that.$('#enviar_btn span').html('<lang>Capa guardada</lang>');
                            }
            		    },
                        error: function(){
                            that.showMessage('#layerCreateError');
                            that.isSending = false;
                            that.$('#enviar_btn span').html('<lang>Guardar capa</lang>');
                        }
        		    });
                }else{
                    that.showMessage('#layerCreateSuccess');
                    that.isSending = false;
                    that.$('#enviar_btn span').html('<lang>Capa guardada</lang>');
                }
            },
            error: function(){
                that.showMessage('#layerCreateError');
                that.isSending = false;
                that.$('#enviar_btn span').html('<lang>Guardar capa</lang>');
            }
        });
    },

	deleteLayer: function(e) {
		e.preventDefault();
		var that = this;
		$.fancybox($('#layerDeleteConfirmation'), {
            'width':'640',
            'height': 'auto',
            'padding': '0',
            'autoDimensions':false,
            'autoSize':false,
            'closeBtn' : false,
            'scrolling'   : 'no',
            helpers : {
                 overlay: {
                   css: {'background-color': 'rgba(0,0,102,0.85)'},
                   closeClick: false
                 }
            },
            afterShow: function () {
                $('#layerDeleteConfirmation').css('display', 'block');
                $('#layerDeleteConfirmation #btn_yes').click(function(e){
                    $.ajax({
                            url : '/api/gslayer/' + that.model.get('wmsLayName'),
                            type: 'DELETE',
                            dataType: 'json',
                            data:{'server':that.model.get('wmsServer')},
                            success: function(result) {
                                $.fancybox.close();
                                that.model.destroy();
                                app.categories.fetch().done(function () {
                                    app.router.navigate('catalogue', {trigger: true});
                                    location.reload();
                                });
                            }
                        });
                });
                $('#layerDeleteConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
	},

    validate: function(element, focus){
        var error = false;
        var $el;
        if (element.target)
            $el = $(element.currentTarget);
        else
            $el = $(element);
        if($el.val() == ""){
            $el.addClass('invalid');
            error = true;
            if(focus){
                $el.focus();
            }
        }else{
            $el.removeClass('invalid');
        }
        return error;
    },

    showLogin: function() {
        $.fancybox($("#loginForms"), {
            'width':'640',
            'height': 'auto',
            'padding': '0',
            'autoDimensions':false,
            'autoSize':false,
            'closeBtn' : false,
            'scrolling'   : 'no',
            helpers : {
                overlay: {
                    css: {'background-color': 'rgba(0,0,102,0.85)'}
                }
            },
            afterShow: resetForm,
            afterClose: function(){app.router.navigate("catalogue",{trigger: true})}
        });
        return false;
    },

    showMessage: function(id, opt) {
        $.fancybox($(id), {
            'width':'640',
            'height': 'auto',
            'padding': '0',
            'autoDimensions':false,
            'autoSize':false,
            'closeBtn' : false,
            'scrolling'   : 'no',
            helpers : {
                 overlay: {
                   css: {'background-color': 'rgba(0,0,102,0.85)'} ,
                   closeClick: false
                 }
            },
            afterShow: function () {
                $(id).css('display', 'block');
                $(id + " input").click(function(e){
                    $.fancybox.close();
                    if(id.indexOf('uccess') != -1){
                        app.categories.fetch().done(function () {
                            app.router.navigate('catalogue' ,{trigger: true});
                        });
                    }
                });
            }
        });
    },

    cancelLayer: function(e) {
        e.preventDefault();
        $.fancybox($('#layerCancelConfirmation'), {
            'width':'640',
            'height': 'auto',
            'padding': '0',
            'autoDimensions':false,
            'autoSize':false,
            'closeBtn' : false,
            'scrolling'   : 'no',
            helpers : {
                 overlay: {
                   css: {'background-color': 'rgba(0,0,102,0.85)'},
                   closeClick: false
                 }
            },
            afterShow: function () {
                $('#layerCancelConfirmation').css('display', 'block');
                $('#layerCancelConfirmation #btn_yes').click(function(e){
                    $.fancybox.close();
                    app.router.navigate('catalogue',{trigger: true});
                });
                $('#layerCancelConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
    },

    changeExploreStatus: function(e){

        $(e.currentTarget).val().length > 0 ? this.$('.explore').addClass('active'):this.$('.explore').removeClass('active');
    },

    openGeoserverForm:function(e){
        var _this = this;
        $.fancybox(this.$('#geoserverPopup'), {
            'width':'640',
            'height': 'auto',
            
            'autoDimensions':false,
            'autoSize':false,
            // 'closeBtn' : true,
            // 'scrolling'   : 'yes',
            'scrolling' : 'yes',
            'overflow': scroll,

            helpers : {
                 overlay: {
                   // css: {'background-color': 'rgba(0,0,102,0.85)'},
                   // closeClick: false
                 }
            },
            afterShow: function () {
                
                $('#geoserverPopup .creating').addClass('hide');
                $('#geoserverUpload').removeClass('hide');
                $('#geoserverPopup .error').removeClass('error');   
                $('#geoserverPopup .problem').addClass('hide');   

                $('#geoserverPopup .select_geoserver_zip').unbind().bind('click', function(e) {
                    $('#geoserverZip').trigger('click')
                });
                $('#geoserverZip').unbind().bind('change', function(e) {
                    $('#geoserverPopup .select_geoserver_zip').text($(this).val().split(/(\\|\/)/g).pop());
                });
                $('#geoserverUpload').unbind().bind('click', function(e) {
                    var send = true;
                    
                    if($('#geoserverPopup input[name="layer_name"]').val() == ""){
                        $('#geoserverPopup input[name="layer_name"]').addClass('error');
                        send = false;
                    }

                    if($('#geoserverZip').val() == ""){
                        $('#geoserverPopup .select_geoserver_zip').addClass('error');
                        send = false;
                    }

                    if(send){
                        $('#geoserverUpload').addClass('hide');
                        $('#geoserverPopup .creating').removeClass('hide');
                        var zipdata = new FormData();
                        zipdata.append('zip',$('#geoserverZip')[0].files[0]);

                        var other_data = $('#geoserverPopup form').serializeArray();
                        $.each(other_data,function(key,input){
                            zipdata.append(input.name,input.value);
                        });

                        $.ajax({
                            url : '/api/gslayer/',
                            data: zipdata,
                            type: 'POST',
                            dataType: 'json',
                            processData: false, // Don't process the files
                            contentType: false,
                            success: function(result) {
                                $('#geoserverPopup .creating').addClass('hide');
                                $('#geoserverUpload').removeClass('hide');
                                if(result.status == 2){
                                    $("#wmsserver").val(result.server);
                                    $("#layername").val(result.layer);
                                    $.fancybox.close();
                                }
                                else if(result.status == -1){
                                    $($('#geoserverPopup .problem')[0]).removeClass('hide');
                                }
                                else if(result.status == -2){
                                    $($('#geoserverPopup .problem')[1]).removeClass('hide');
                                }
                                else if(result.status == -3){
                                    $($('#geoserverPopup .problem')[2]).removeClass('hide');
                                }
                                else if(result.status == -4){
                                    $($('#geoserverPopup .problem')[3]).removeClass('hide');
                                }
                                $.fancybox.update();
                            }
                        });
                    }
                });
            }
        });
    },

    exploreWms:function(e){
        if($(e.currentTarget).hasClass('active')){
            var _this = this;
            this.$('#wmsLayers .error').removeClass('hide');
            this.$('#wmsLayers .notSupport').addClass('hide');
            this.$('#wmsLayers .notFound').addClass('hide');
            

            this.$('#wmsLayers .layerList').html('');
            var server = this.$('#wmsserver').val();
            if(server.lastIndexOf("?") >= 0){
                server = server.slice(0,server.lastIndexOf("?"));
            }
            var url = ((server.lastIndexOf("/") == server.length-1)? server.slice(0,-1):server) + "?REQUEST=GetCapabilities&SERVICE=wms";

            $.fancybox(this.$('#wmsLayers'), {
                'width':'640',
                'height': 'auto',
                
                'autoDimensions':false,
                'autoSize':false,
                // 'closeBtn' : true,
                // 'scrolling'   : 'yes',
                'scrolling' : 'yes',
                'overflow': scroll,

                helpers : {
                     overlay: {
                       // css: {'background-color': 'rgba(0,0,102,0.85)'},
                       // closeClick: false
                     }
                },
                afterShow: function () {
                     $.ajax({
                        url : "/api/proxy",
                        data: { "url": url},
                        dataType: 'xml',
                        type: "POST",           
                        success: function(xml) {
                            if(xml){
                                $('#wmsLayers p').addClass('hide');
                                
                                var layerPadre = $(xml).find("Layer")[0];
                                var version = $($(xml).find("*")[0]).attr("version");

                                var html = '<ul>';
                                
                                var keyLayerName;
                                
                                keyLayerName = "Name"
                                $(xml).find("Capability > Layer").each(function(){
                                    $(this).find("Layer").each(function(){
                                        if($($(this).find("SRS")).text().indexOf("900913") > 0 || $($(this).find("SRS")).text().indexOf("3857")>0 || $(layerPadre).find("SRS").text().indexOf("900913") > 0 || $(layerPadre).find("SRS").text().indexOf("3857")){
                                            html += _this._createHtmlExternalService($(this).find("Layer > " + keyLayerName).text(),$(this).find("Layer > Title").text(),$(this).find("Layer > Abstract").text());
                                        }else{
                                            $('#wmsLayers .notSupport').removeClass('hide');
                                        }
                                    });
                                });
                                

                                
                                html += '</ul>';
                                
                                $('#wmsLayers .layerList').html(html);
                                $.fancybox.update();

                                $('#wmsLayers .layerList li').click(function(){
                                    _this.$('#layername').val($(this).find('span').text());
                                    $.fancybox.close();
                                });
                                
                            }else{
                                _this.$('#wmsLayers .notFound').addClass('hide');
                            }
                        },
                        error: function(e){
                            $('#wmsLayers p').addClass('hide');
                            $('#wmsLayers .notFound').removeClass('hide');
                        }
                    });
                }
            });
        }
    },

    _createHtmlExternalService: function(name,title,abstract){
        var html =
            '<li>' +
                '<span>' + name + '</span>' +
                '<h3>' + title + ' - </h3>' +
                '<p>' + ((abstract != "null") ? abstract : '') + '</p>' +
            '</li>';

        return html;
    },

    showTopics: function(e){
        e.preventDefault();
        var $target = $(e.target);
        $('select[name=topic]').addClass('hide').removeAttr('disabled');
        if($target.val() != 0){
            $('#topic-' + $target.val()).removeClass('hide');
            this.$('#createTopic').removeClass('disabled');
        }else{
            $('select[name=topic]').eq(0).removeClass('hide').attr('disabled', true);
            this.$('#createTopic').addClass('disabled');
        }
    },

    createTopic: function(e){
        e.preventDefault();
        var that = this;
        if(!$(e.target).hasClass('disabled') && !$(e.target).parent().hasClass('disabled')){
            $.fancybox($('#layerSectionCreation'), {
                'width':'640',
                'height': 'auto',
                'padding': '0',
                'autoDimensions':false,
                'autoSize':false,
                'closeBtn' : false,
                'scrolling'   : 'no',
                helpers : {
                     overlay: {
                       css: {'background-color': 'rgba(0,0,102,0.85)'},
                       closeClick: false
                     }
                },
                afterShow: function () {
                    $('#layerSectionCreation').css('display', 'block');
                    $('#layerSectionCreation #btn_save').click(function(e){
                        items = {
                            title_es: $('#layerSectionCreation fieldset input#sectiontitle-es'),
                            title_en: $('#layerSectionCreation fieldset input#sectiontitle-en'),
                            title_fr: $('#layerSectionCreation fieldset input#sectiontitle-fr'),
                            category: $('select[name=category]')
                        }
                        var error = false;
                        $.each(items, function(index, element){
                            if(element.attr('required') && !element.val()){
                                error = true;
                                element.addClass('invalid');
                            }else{
                                element.removeClass('invalid');
                            }
                        });
                        if(items.category.val() == 0){
                            error = true;
                            items.category.addClass('invalid');
                            alert('<lang>Debes seleccionar una categoría antes de crear una sección</lang>')
                        }else{
                            items.category.removeClass('invalid');
                        }
                        if(!error && !that.isSending){
                            // Save new section and select it on form
                            data = {
                                title_es: items.title_es.val(),
                                title_en: items.title_en.val(),
                                title_fr: items.title_fr.val(),
                                category_id: items.category.val(),
                            }
                            that.isSending = true;
                            $.ajax({
                                url : "/api/catalog/topic/",
                                data: JSON.stringify(data),
                                contentType: "application/json",
                                dataType: "json",
                                type: "POST",
                                success: function(result) {
                                    var $option = $('<option>', {value: result.id, text: data['title_' + app.lang]});
                                    $('select#topic-'+data.category_id).append($option).val(result.id);
                                    items.title_es.val('');
                                    items.title_en.val('');
                                    items.title_fr.val('');
                                    that.isSending = false;
                                    $.fancybox.close();
                                },
                                error: function(){
                                    that.isSending = false;
                                    alert('<lang>Error al crear la categoría, inténtalo de nuevo</lang>');
                                }
                            });
                        }
                    });
                    $('#layerSectionCreation #btn_cancel').click(function(e){
                        $.fancybox.close();
                    });
                }
            });
        }
    }
});
