app.view.DocumentCreate = app.view.LayerCreate.extend({
    _template : _.template( $('#document-create_template').html() ),

    initialize: function(options) {
    	_.bindAll(this,'render');
        var options = options || '';
        var Document = app.model.Layer.extend({urlRoot: '/api/documents/document'});
        app.events.trigger('menu','documents');
        this.isSending = false;

        this.tags = new (app.model.Layer.extend({urlRoot: '/api/documents/alltags'}))();

        if(options){
            this.documentId = options.documentId || 0;
            this.model = new Document({id: this.documentId});
            var that = this;
            this.model.fetch().done(function () {
            	that.model.set('tags',that.model.get('tags').split(','))
              that.categoryId = app.categories.getCategoryByTopic(that.model.get('topic_id')).get('id');
              that.tags.fetch({success:that.render})
            });
        }else{
            this.isInConfig = false;
            this.model = new Document();
            // this.render();
            this.tags.fetch({success:this.render})
        }
    },

     events: function(){
    	return _.extend({},app.view.LayerCreate.prototype.events,{
         'click #createTag': 'createTag',
         'click .tag_box li': 'selectTag',
         'click #borrar_btn': 'deleteDocument',
         'keyup #documentUrl': 'keyupUrl',
         'change #documentfile': 'changeFile'
      });
    },

    render: function() {
        var model = { 'data': this.model.toJSON()};
        model['data']['categories'] = app.categories.toJSON();
        model['data']['alltags'] = this.tags.toJSON();
        model['data']['isInConfig'] = this.isInConfig;
        if(this.documentId){
            model['data']['docCategory'] = this.categoryId;
        }

        this.$el.html(this._template(model));

        if(!this.documentId){
            this.$('select[name=topic]').eq(0).removeClass('hide').attr('disabled', true);
            this.$('#createTopic').addClass('disabled');
        }else{
            this.$('#topic-'+this.categoryId).removeClass('hide');
        }

        // Check session
        if(!(localStorage.password && localStorage.user && localStorage.admin)){
            this.showLogin();
        }

        return this;
    },

    sendLayer: function(e){
        e.preventDefault();
        if(!this.isSending){
            this.isSending = true;
            this.$('#enviar_btn span').html('<lang>Enviando...</lang>');

            // Clear validation errors
            this.$('.invalid').removeClass('invalid');

            var that = this;

            var tags = [];

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
            items.$doc_link= this.$('#documentUrl');

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

            if(this.$('.tag_box li.selected').length == 0){
            	error = true;
            	this.$('.tag_box').addClass('invalid');
            }else{
            	this.$('.tag_box').removeClass('invalid');
            	_.each(this.$('.tag_box li.selected'),function(t) {
            		tags.push($(t).attr('id_tag'))
            	});
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
                var doc_link= _.escape(items.$doc_link.val());

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
                    'tags': tags,
                    'highlight':this.$('#highlight').is(':checked'),
                    'doc_link': doc_link
                };

                this.saveLayer(formData);
            }else{
                this.isSending = false;
                this.$('#enviar_btn span').html('<lang>Guardar documento</lang>');
            }
        }
    },

    saveLayer: function(formData){
    	
        this.model.set({
          'topic_id': formData.topic_id,
          'title_es': formData.title_es,
          'title_en': formData.title_en,
          'title_fr': formData.title_fr,
          'description_es': formData.desc_es,
          'description_en': formData.desc_en,
          'description_fr': formData.desc_fr,
          'source': formData.dataSource,
          'tags': formData.tags,
          'highlight':formData.highlight,
          'doc_link':formData.doc_link
        });

        var that = this;
        this.model.save({}, {
          success: function(model, response, options){
          	var id_doc = response.id_doc;
        		if(that.$('#cover')[0].files[0]){
        			that._sendCover(id_doc)
        		}else if(that.$('#documentfile')[0].files[0]){
        			that._sendFile(id_doc)
        		}else{
        			app.router.navigate(app.router.langRoutes["_link documents"][app.lang] + "/" + id_doc,{trigger: true});
        		}
          },
          error: function(){
            that.showMessage('#documentCreateError');
            that.isSending = false;
            that.$('#enviar_btn span').html('<lang>Guardar documento</lang>');
          }
        });
    },

    _sendCover:function(id_doc){
    	var that = this;
    	var imgCover = new FormData();
  		imgCover.append('image',that.$('#cover')[0].files[0]);
  		imgCover.append('id_doc',id_doc);
    	$.ajax({
        url : '/api/documents/cover',
        data: imgCover,
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data) {
        	if(that.$('#documentfile')[0].files[0]){
        		that._sendFile(id_doc);
        	}else{
        		app.router.navigate(app.router.langRoutes["_link documents"][app.lang] + "/" + id_doc,{trigger: true});
        	}
        }
      });
    },

    _sendFile:function(id_doc){
			var docFile = new FormData();
			docFile.append('document',this.$('#documentfile')[0].files[0]);
			docFile.append('id_doc',id_doc);
    	$.ajax({
        url : '/api/documents/file',
        data: docFile,
        type: 'POST',
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function(data) {
        	app.router.navigate(app.router.langRoutes["_link documents"][app.lang] + "/" + id_doc,{trigger: true});
        }
      });
    },

	deleteDocument: function(e) {
		e.preventDefault();
		var that = this;
		$.fancybox($('#documentDeleteConfirmation'), {
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
                $('#documentDeleteConfirmation').css('display', 'block');
                $('#documentDeleteConfirmation #btn_yes').off('click').click(function(e){
                  that.model.destroy({success:function(){
                  	$.fancybox.close();
                  	app.router.navigate(app.router.langRoutes["_link documents"][app.lang],{trigger: true});
                  }});
                });
                $('#documentDeleteConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
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
                            app.router.navigate('documents',{trigger: true});
                        });
                    }
                });
            }
        });
    },

    cancelLayer: function(e) {
        e.preventDefault();
        $.fancybox($('#documentCancelConfirmation'), {
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
                $('#documentCancelConfirmation').css('display', 'block');
                $('#documentCancelConfirmation #btn_yes').click(function(e){
                    $.fancybox.close();
                    app.router.navigate('documents',{trigger: true});
                });
                $('#documentCancelConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
    },

    createTag:function(){
    	var that = this;
    	$.fancybox($('#layerTagCreation'), {
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
              $('#layerTagCreation').css('display', 'block');
              $('#layerTagCreation #btn_save').click(function(e){
                  items = {
                      tag_es: $('#layerTagCreation fieldset input#tag-es'),
                      tag_en: $('#layerTagCreation fieldset input#tag-en'),
                      tag_fr: $('#layerTagCreation fieldset input#tag-fr')
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
                  if(!error && !that.isSending){
                      // Save new section and select it on form
                      data = {
                          tag_es: items.tag_es.val(),
                          tag_en: items.tag_en.val(),
                          tag_fr: items.tag_fr.val()
                      }
                      that.isSending = true;
                      $.ajax({
                          url : "/api/documents/tag/",
                          data: JSON.stringify(data),
                          contentType: "application/json",
                          dataType: "json",
                          type: "POST",
                          success: function(result) {
                            $('.tag_box ul').append('<li class="selected" id_tag="' + result.id_tag + '">' + data['tag_' + app.lang] + '</li>');
                            items.tag_es.val('');
                            items.tag_en.val('');
                            items.tag_fr.val('');
                            that.isSending = false;
                            $.fancybox.close();
                          },
                          error: function(){
                              that.isSending = false;
                              alert('<lang>Error al crear el Tag, inténtalo de nuevo</lang>');
                          }
                      });
                  }
              });
              $('#layerTagCreation #btn_cancel').click(function(e){
                  $.fancybox.close();
              });
          }
      });
    },

    selectTag:function(e){
    	$(e.currentTarget).toggleClass('selected');
    },

    keyupUrl:function(){
    	this.$('#documentfile').val('');
    },

    changeFile:function(){
    	this.$('#documentUrl').val(null);
    }
});
