app.view.HistoryCreate = Backbone.View.extend({
    _template : _.template( $('#history-create_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','join');
        this.render();
    },

    events: {
        'click .historyType': 'selectType',
        'click .type': 'unselectType',
        'click .info > a': 'showInfo',
        'click #addImage_btn': 'addImage',
        'change input[type="file"]': 'uploadImage',
        'click .deleteFileEntry': 'removeImage'
    },
    
    onClose: function(){
        // Remove events on close
        this.stopListening();
    },
    
    render: function() {
        this.$el.html(this._template());

        this.$selectType = this.$('.selectType');
        this.$historyForm = this.$('.historyForm');
        this.$fileInputList = this.$('#fileinputlist');
        this.$fileEntryList = this.$('#filelist');

        return this;
    },

    selectType: function(e) {
        e.preventDefault();
        $('#selectedType').removeClass().addClass($(e.currentTarget).attr('type')).html($(e.currentTarget).attr('text'));
        this.$selectType.css('display', 'none');
        this.$historyForm.css('display', 'block');
    },

    unselectType: function(e) {
        e.preventDefault();
        this.$selectType.css('display', 'block');
        this.$historyForm.css('display', 'none'); 
    },

    showInfo: function(e) {
        e.preventDefault();
        var $target = $(e.currentTarget);
        $target.parent().find('.content').fadeToggle(200);
    },

    addImage: function(e) {
        e.preventDefault();
        var $fileinput = $('<input/>', {
            type: 'file',
            accept: 'image/*'
        });
        this.$fileInputList.append($fileinput);
        $fileinput.trigger('click');
    },

    uploadImage: function(e) {
        var $fileentry = $('<li/>', {
            text: $(e.currentTarget).val()
        });

        var $button = $('<img/>', {
            class: 'deleteFileEntry',
            src: '/img/participa/ALB_icon_eliminar_img.svg'
        });

        $fileentry.append($button);
        this.$fileEntryList.append($fileentry);
    },

    removeImage: function(e) {
        $(e.currentTarget).parent().remove();
    }
});