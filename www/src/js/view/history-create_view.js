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
        'click .deleteFileEntry': 'removeImage',
        'click #enviar_btn': 'sendHistory',
        'click .cancel_btn': 'cancelHistory',
        'blur input': 'validate'
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
            accept: 'image/*',
            name: 'image'
        });
        this.$fileInputList.append($fileinput);
        $fileinput.trigger('click');
    },

    uploadImage: function(e) {
        var imgdata = new FormData();
        imgdata.append('image',e.target.files[0]);

        var that = this;
        var $progress = this.$('progress');
        var $btn = this.$('#addImage_btn');

        $progress.fadeIn();
        $btn.fadeOut();

        $.ajax({
            url : '/api/image/',
            data: imgdata,
            type: 'POST',
            dataType: 'json',
            processData: false, // Don't process the files
            contentType: false,
            xhr: function() { // custom xhr
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){ // check if upload property exists
                    myXhr.upload.addEventListener('progress',function(e){
                        if(e.lengthComputable){
                            $progress.attr({value:e.loaded,max:e.total});
                        }
                    }, false); // for handling the progress of the upload
                }
                return myXhr;
            },
            success: function(data) {
                var $hiddenFileEntry = $('<input />', {
                    type: 'hidden',
                    name: 'images',
                    value: data.filename
                });

                var $fileEntry = $('<li/>', {
                    text: e.target.files[0].name
                });

                var $button = $('<img/>', {
                    class: 'deleteFileEntry',
                    src: '/img/participa/ALB_icon_eliminar_img.svg'
                });

                $fileEntry.append($button);
                $fileEntry.append($hiddenFileEntry);
                that.$fileEntryList.append($fileEntry);

                $btn.fadeIn();
                $progress.fadeOut();
            },
            error: function(){
                console.log('TODO: Error');
            }
          });
    },

    removeImage: function(e) {
        e.preventDefault();
        $(e.currentTarget).parent().remove();
    },

    sendHistory: function(e) {
        e.preventDefault();

        // Clear validation errors
        this.$('.invalid').removeClass('invalid');

        var that = this;

        // Prepare form data
        var items = {};
        var error = false;

        items.$title= this.$('#hist-title');
        items.$place= this.$('#hist-place');
        items.$lat= this.$('#hist-lat');
        items.$lon= this.$('#hist-lon');
        items.$date= this.$('#hist-when');
        items.$text= this.$('#hist-text');
        items.$category= this.$(':radio:checked');

        var title= items.$title.val();
        var place= items.$place.val();
        var lat= items.$lat.val();
        var lon= items.$lon.val();
        var date= items.$date.val();
        var text= items.$text.val();
        var category= items.$category.val();

        var type= $('#selectedType').hasClass('goodpractices') ? '0': '1';

        $.each(items, function(index, element){
            that.validate(element, false);
        });

        if(items.$category.length == 0){
            this.$('.categories_container').addClass('invalid');
            error = true;
        }

        if(!error){
        
            var images = [];
            var $images = this.$('input[type=hidden]');
            $.each($images,function(index, elem){
                images.push(elem.value);
            });
            
            var formData = {
                'title': title,
                'place': place,
                'lat': lat,
                'lon': lon,
                'date': date,
                'text': text,
                'category': category,
                'type': type,
                'images': JSON.stringify(images)
            };
            
            $.ajax({
                url : '/api/history/',
                data: formData,
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    // Show success popup
                    if(data.admin){
                        that.showMessage('#historySendSuccessAdmin');
                    }else{
                        that.showMessage('#historySendSuccess')
                    }
                },
                error: function() {
                   // Show error popup
                   that.showMessage('#historySendError');
                }
            });
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

    showMessage: function(id) {
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
                   css: {'background-color': 'rgba(0,0,102,0.85)'} 
                 } 
            },
            afterShow: function () {
                $(id).css('display', 'block');
                $(id + " input").click(function(e){
                    $.fancybox.close();
                    if(id.indexOf('uccess') != -1)
                        app.router.navigate('join',{trigger: true});
                });
            }
        });
    },

    cancelHistory: function(e) {
        $.fancybox($('#historyCancelConfirmation'), {
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
            afterShow: function () {
                $('#historyCancelConfirmation').css('display', 'block');
                $('#historyCancelConfirmation #btn_yes').click(function(e){
                    $.fancybox.close();
                    app.router.navigate('join',{trigger: true});
                });
                $('#historyCancelConfirmation #btn_no').click(function(e){
                    $.fancybox.close();
                });
            }
        });
    }
});