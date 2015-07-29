app.view.SectionCreate = Backbone.View.extend({
    _template : _.template( $('#section-create_template').html() ),

    initialize: function(options) {
        var options = options || '';
        var Topic = app.model.Topic.extend({urlRoot: '/api/catalog/topic/'});
        app.events.trigger('menu','catalogue');
        this.isSending = false;
        if(options){
            this.sectionId = options.sectionId || 0;
            this.model = new Topic({id: this.sectionId});
            var that = this;
            this.model.fetch().done(function () {
                that.render();
            });
        }else{
            this.isInConfig = false;
            this.model = new Topic();
            this.render();
        }
    },

    events: {
        'click .info > a': 'showInfo',
        'click #enviar_btn': 'sendSection',
        'click #borrar_btn': 'deleteSection',
        'click .cancel_btn': 'cancelSection',
        'blur input[required]': 'validate',
        'blur textarea[required]': 'validate',
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        var model = { 'data': this.model.toJSON()};
        model['data']['categories'] = app.categories.toJSON();
        this.$el.html(this._template(model));

        // Check session
        if(!(localStorage.password && localStorage.user && localStorage.admin)){
            this.showLogin();
        }

        return this;
    },

    showInfo: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        $target.parent().find('.content').fadeToggle(200);
    },

    sendSection: function(e){
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
            items.$title_es= this.$('#title-es');
            items.$title_en= this.$('#title-en');
            items.$title_fr= this.$('#title-fr');

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
            }

            if(!error){
                var category_id= parseInt(_.escape(items.$category.val()));
                var title_es= _.escape(items.$title_es.val());
                var title_en= _.escape(items.$title_en.val());
                var title_fr= _.escape(items.$title_fr.val());

                var formData = {
                    'category_id': category_id,
                    'title_es': title_es,
                    'title_en': title_en,
                    'title_fr': title_fr,
                };

                this.saveSection(formData);
            }else{
                this.isSending = false;
                this.$('#enviar_btn span').html('<lang>Guardar sección</lang>');
            }
        }
    },

    saveSection: function(formData){
        this.model.set({
            'category_id': formData.category_id,
            'title_es': formData.title_es,
            'title_en': formData.title_en,
            'title_fr': formData.title_fr,
        });

        var that = this;
        this.model.save({}, {
            success: function(model, response, options){
                that.showMessage('#sectionCreateSuccess');
                that.isSending = false;
                that.$('#enviar_btn span').html('<lang>Sección guardada</lang>');
            },
            error: function(){
                that.showMessage('#sectionCreateError');
                that.isSending = false;
                that.$('#enviar_btn span').html('<lang>Guardar sección</lang>');
            }
        });
    },

    deleteSection: function(e) {
        e.preventDefault();
        if(this.model.get('children') == 0){
            var that = this;
            $.fancybox($('#sectionDeleteConfirmation'), {
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
                    $('#sectionDeleteConfirmation').css('display', 'block');
                    $('#sectionDeleteConfirmation #btn_yes').click(function(e){
                        $.fancybox.close();
                        that.model.destroy();
                        app.categories.fetch().done(function () {
                            app.router.navigate('catalogue', {trigger: true});
                        });
                    });
                    $('#sectionDeleteConfirmation #btn_no').click(function(e){
                        $.fancybox.close();
                    });
                }
            });
        }else{
            this.showMessage('#sectionCannotDelete');
        }
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

    cancelSection: function(e) {
        e.preventDefault();
        $.fancybox($('#sectionCancelConfirmation'), {
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
                $('#sectionCancelConfirmation').css('display', 'block');
                $('#sectionCancelConfirmation #btn_yes').click(function(e){
                    $.fancybox.close();
                    app.router.navigate('catalogue',{trigger: true});
                });
                $('#sectionCancelConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
    }
});
