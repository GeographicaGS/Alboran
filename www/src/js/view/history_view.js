app.view.HistoryDetail = Backbone.View.extend({
	_template : _.template( $('#history_template').html() ),

    events: {
        'click #gallery_btn': 'showGallery',
        'click .videolink': 'showVideo',
        'mouseenter .videolink': 'showVideo',
		'click #btn_publish': 'publishHistory',
		'click #btn_unpublish': 'publishHistory',
		'click #btn_edit': 'editHistory',
		'click #btn_delete': 'deleteHistory',
        'click #btn_twitter': 'publishTwitter',
    },

    initialize: function(options) {
        app.events.trigger('menu','join');

		var History = app.model.History.extend({urlRoot: '/api/history/'});
        this.model = new History({id: options.historyId});
		this.listenTo(this.model, 'destroy', this.onModelDestroy);
		this.listenTo(this.model, 'change', this.render);
        var that = this;
        this.model.fetch().done(function () {
			if(that.model.get('status') !== 1 && !(localStorage.admin || false)){
				that.showLogin();
			}else{
				var images = that.model.get('images');
				var pathedImages = []
				_.each(images,function(item, index){
					pathedImages[index] = {}
					pathedImages[index].href = app.config.IMAGE_DIR+item.href;
				});
				that.model.set({'pathedImages': pathedImages});
	            that.render();
			}
        });
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
		var model = $.extend({}, {'data': this.model.toJSON()}, {'isAdmin': app.isAdmin || false});
        this.$el.html(this._template( model ));

        this.setShareLinks();
        this.showAuthorMessage();

        return this;
    },

    showGallery: function(e) {
        e.preventDefault();
        var images = this.model.get('pathedImages');
        $.fancybox.open(images, {
            'padding' : 0,
            tpl: {
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close myClose" href="javascript:;"><img src="/img/participa/ALB_cerrar_galeria.svg"></a>',
                next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span><img src="/img/participa/ALB_flecha_galeria_sig.svg"></span></a>',
                prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span><img src="/img/participa/ALB_flecha_galeria_ant.svg"></span></a>'
            },
            helpers : {
                overlay: {
                    css: {
                        'background-color': 'rgba(0,0,102,0.85)',
                        'z-index': 10003
                    }
                }
            },
        });
    },

    showVideo: function(e){
        e.preventDefault();
        var $target = $(e.currentTarget);
        $target.fancybox({
            //'width'         : '75%',
            //'height'        : '75%',
            'autoScale'     : false,
            //'transitionIn'  : 'none',
            //'transitionOut' : 'none',
            'type'          : 'iframe',
            'padding' : 0,
            tpl: {
                closeBtn: '<a title="Close" class="fancybox-item fancybox-close myClose" href="javascript:;"><img src="/img/participa/ALB_cerrar_galeria.svg"></a>'
            },
            helpers : {
                overlay: {
                    css: {
                        'background-color': 'rgba(0,0,102,0.85)',
                        'z-index': 10003
                    }
                }
            },
        });
    },

    setShareLinks: function() {
        var title = this.model.get('title');
        this.$('#share-fb').attr('href','http://www.facebook.com/sharer.php?u='+ document.URL +'&t='+ title);
        this.$('#share-twitter').attr('href','https://twitter.com/?status='+ title +' - '+ document.URL);
        this.$('#share-gplus').attr('href','https://plus.google.com/share?url='+ document.URL);
        this.$('#share-email').attr('href','mailto:?subject='+ title +'&body=Te comparto esta historia del Proyecto Alborán: '+ title +' - '+ document.URL);
    },

    showAuthorMessage: function() {
        if(this.model.get('username') == localStorage.user && !app.isAdmin){
            this.$('.historyText').parent().append($('<div class="message"><p><lang>Si quiere realizar alguna modificación sobre esta historia o desea eliminarla de nuestra base de datos, mande un email a</lang> <a href="mailto:'+app.config['HISTORY_SUPPORT_MAIL']+'" target="_blank">'+app.config['HISTORY_SUPPORT_MAIL']+'</a>.</p></div>'));
        }
    },

	publishHistory: function(e) {
		e.preventDefault();
		var that = this;
		var status = 0;
		var popupEl = '#historyUnpublishConfirmation';
		if (e.target.id === 'btn_publish'){
			status = 1;
			popupEl = '#historyPublishConfirmation';
		}else if (e.target.id === 'btn_unpublish'){
			status = 0;
			popupEl = '#historyUnpublishConfirmation';
		}
		$.fancybox($(popupEl), {
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
                $(popupEl).css('display', 'block');
                
                $(popupEl + ' #btn_yes').click(function(e){
                    $.fancybox.close();
                    that.model.set({'status': status});
                    that.model.save();

                    if(popupEl == '#historyPublishConfirmation' && !that.model.get('twitter')){
                        that.publishTwitter();
                    }

                });
                $(popupEl + ' #btn_no').click(function(e){
                    $.fancybox.close();
                });
                
            }
        });
	},

    publishTwitter:function(){
        var popupEl = '#historyTwitterConfirmation';
        var that = this;
        $.fancybox($(popupEl), {
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
                $(popupEl).css('display', 'block');
                $(popupEl + ' #btn_yes').click(function(e){
                    $.fancybox.close();
                    that.model.set({'twitter': true});
                    that.model.set({'historyUrl': '/' + app.lang + '/' + app.router. langRoutes['_link join'][app.lang] + '/' + app.router.langRoutes['_link history'][app.lang] + '/'});
                    that.model.save();
                });
                $(popupEl + ' #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
    },

	editHistory: function(e) {
		e.preventDefault();
		app.router.navigate('join/history/'+this.model.get('id')+'/edit', {trigger: true});
	},

	deleteHistory: function(e) {
		e.preventDefault();
		var that = this;
		$.fancybox($('#historyDeleteConfirmation'), {
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
                $('#historyDeleteConfirmation').css('display', 'block');
                $('#historyDeleteConfirmation #btn_yes').click(function(e){
                    $.fancybox.close();
                    that.model.destroy();
                });
                $('#historyDeleteConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
	},

	onModelDestroy: function(e) {
		app.router.navigate('join', {trigger: true});
	},

	showLogin: function() {
		var that = this;
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
            afterClose: function(){that.initialize({historyId: that.model.get('id')});}
        });
        return false;
    }
})
