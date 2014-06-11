app.view.HistoryDetail = Backbone.View.extend({
	_template : _.template( $('#history_template').html() ),

    events: {
        'click #gallery_btn': 'showGallery'
    },

    initialize: function(options) {
        app.events.trigger('menu','join');

		var History = Backbone.Model.extend({urlRoot: '/api/history/'});
        this.model = new History({id: options.historyId});
        var that = this;
        this.model.fetch().done(function () {
            that.render();
        });
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template( this.model.toJSON() ));

        var images = this.model.get('result').images;

        _.each(images,function(item, index){
            item.href = '/images/'+item.href;
        });

        this.setShareLinks();
        this.showAuthorMessage();

        return this;
    },

    showGallery: function(e) {
        e.preventDefault();
        var images = this.model.get('result').images;
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

    setShareLinks: function() {
        var title = this.model.get('result').title;
        this.$('#share-fb').attr('href','http://www.facebook.com/sharer.php?u='+ document.URL +'&t='+ title);
        this.$('#share-twitter').attr('href','https://twitter.com/?status='+ title +' - '+ document.URL);
        this.$('#share-gplus').attr('href','https://plus.google.com/share?url='+ document.URL);
        this.$('#share-email').attr('href','mailto:?subject='+ title +'&body=Te comparto esta historia del Proyecto Alborán: '+ title +' - '+ document.URL);
    },

    showAuthorMessage: function() {
        if(this.model.get('result').username == localStorage.user){
            this.$('.historyText').parent().append($('<div class="message"><p><lang>Si quiere realizar alguna modificación sobre esta historia o desea eliminarla de nuestra base de datos, mande un email a</lang> <a href="mailto:'+app.config['HISTORY_SUPPORT_MAIL']+'" target="_blank">'+app.config['HISTORY_SUPPORT_MAIL']+'</a>.</p></div>'));
        }
    }
})