app.view.Home = Backbone.View.extend({
    _template : _.template( $('#home_template').html() ),

    events: {
        'click .credits a': 'showImageCredits'
    },
    
    initialize: function() {
        app.events.trigger('menu','home');
        this.render();
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());
        return this;
    },

    showImageCredits: function() {
        $.fancybox.open($('#imageCredits'), {
            'padding' : 0,
            'width': '1024',
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
    }
});