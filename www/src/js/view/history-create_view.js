app.view.HistoryCreate = Backbone.View.extend({
    _template : _.template( $('#history-create_template').html() ),
    
    initialize: function() {
        app.events.trigger('menu','join');
        this.isSending = false;
        this.render();
    },

    events: {
        'click .historyType': 'selectType',
        'click .type': 'unselectType',
        'click .info > a': 'showInfo',
        'click #addImage_btn': 'addImage',
        'change input[type="file"]': 'uploadImage',
        'click .deleteFileEntry': 'removeImage',
        'mousedown input[type=radio] ~ label': 'toggleRadio',
        'mouseup input[type=radio] ~ label': 'removeEvent',
        'click input[type=radio] ~ label': 'removeEvent',
        'change input[type=radio]': 'removeEvent',
        'click #enviar_btn': 'sendHistory',
        'click #cancel_btn': 'cancelHistory',
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

        // Check session
        if(!(localStorage.password && localStorage.user)){
            //$('#login').trigger('click');
            this.showLogin();
        }

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

        $btn.fadeOut(function(){$progress.fadeIn();});

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
                
                $btn.promise().done(function(){
                    $progress.fadeOut(function(){
                        $btn.fadeIn();
                    });
                });
                
                that.$('#imagesFieldset').removeClass('invalid');
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

    toggleRadio: function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        e.cancelBubble = true;

        $target = $(e.currentTarget).prev();
        $target.prop('checked', !$target.prop('checked'));
    },

    removeEvent: function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.returnValue = false;
        e.cancelBubble = true;
    },

    sendHistory: function(e) {
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

            items.$title= this.$('#hist-title');
            items.$place= this.$('#hist-place');
            items.$lat= this.$('#hist-lat');
            items.$lon= this.$('#hist-lon');
            items.$date= this.$('#hist-when');
            items.$text= this.$('#hist-text');
            items.$category= this.$(':radio:checked');

            var title= _.escape(items.$title.val());
            var place= _.escape(items.$place.val());
            var lat= _.escape(items.$lat.val());
            var lon= _.escape(items.$lon.val());
            var date= _.escape(items.$date.val());
            var text= _.escape(items.$text.val());
            var category= _.escape(items.$category.val());

            var type= $('#selectedType').hasClass('goodpractices') ? '0': '1';

            $.each(items, function(index, element){
                that.validate(element, false);
            });

            var images = [];
            var $images = this.$('input[type=hidden]');
            $.each($images,function(index, elem){
                images.push(elem.value);
            });

            if(images.length < 1){
                this.$('#imagesFieldset').addClass('invalid');
                error = true;
            }

            var parts = date.split("/");
            var dateData = Date.parse(parts[2]+'/'+parts[1]+'/'+parts[0]);
            if(isNaN(dateData) || dateData == undefined){
                items.$date.addClass('invalid');
                error = true;
            }

            if(!category) category=0;

            if(!error){            
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
                            that.showMessage('#historySendSuccessAdmin', data.history_id);
                        }else{
                            that.showMessage('#historySendSuccess')
                        }
                        that.$('#enviar_btn span').html('<lang>Historia enviada</lang>');
                    },
                    error: function() {
                       // Show error popup
                       that.showMessage('#historySendError');
                       that.isSending = false;
                       that.$('#enviar_btn span').html('<lang>Compartir historia</lang>');
                    }
                });
            }else{
                that.isSending = false;
                this.$('#enviar_btn span').html('<lang>Compartir historia</lang>');
            }
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
            afterClose: function(){app.router.navigate("join",{trigger: true})}
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
                    if(id.indexOf('uccess') != -1)
                        app.router.navigate('join/history/'+opt ,{trigger: true});
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
                   css: {'background-color': 'rgba(0,0,102,0.85)'},
                   closeClick: false
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