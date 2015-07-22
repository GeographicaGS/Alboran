app.view.HistoryCreate = Backbone.View.extend({
    _template : _.template( $('#history-create_template').html() ),

    initialize: function(options) {
        var options = options || '';
        var History = app.model.History.extend({urlRoot: '/api/history/'});
        app.events.trigger('menu','join');
        this.isSending = false;
        if(options){
            this.historyId = options.historyId || 0;
            this.model = new History({id: this.historyId});
            var that = this;
            this.model.fetch().done(function () {
                that.render();
            });
        }else{
            this.model = new History();
            this.render();
        }
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
        'click .cancel_btn': 'cancelHistory',
        'blur input': 'validate',
        'change #hist-lat': 'validate',
        'change #hist-lon': 'validate',
        'change #hist-when': 'validate',
        'click .position_btn': 'showMap',
        'click .imagePreview': 'showPreview'
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    render: function() {
        var model = { 'data': this.model.toJSON()};
        this.$el.html(this._template(model));

        this.$selectType = this.$('.selectType');
        this.$historyForm = this.$('.historyForm');
        this.$fileInputList = this.$('#fileinputlist');
        this.$fileEntryList = this.$('#filelist');

        $.datepicker.setDefaults( $.datepicker.regional[ "es" ] ); //<lang>lang</lang>
        this.$('.datepicker').datepicker(
            {
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd/mm/yy'
            });

        // Check session
        if(!(localStorage.password && localStorage.user)){
            //$('#login').trigger('click');
            this.showLogin();
        }

        if(this.historyId){
            this.selectType();
            var imageList = this.model.get('images');
            for(var i in imageList){
                this.addImageItem('image'+(parseInt(i)+1), imageList[i].href, false);
            }
        }

        return this;
    },

    selectType: function(e) {
        if(e){
            e.preventDefault();
            $('#selectedType').removeClass().addClass($(e.currentTarget).attr('type')).html($(e.currentTarget).attr('text'));
        }
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
            accept: 'image/jpg, image/jpeg',
            name: 'image'
        });
        this.$fileInputList.append($fileinput);
        $fileinput.trigger('click');
    },

    uploadImage: function(e) {
        if(e.target.files[0].size <= app.config['MAX_FILE_SIZE']){
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
                    that.addImageItem(e.target.files[0].name, data.filename, true);

                    $btn.promise().done(function(){
                        $progress.fadeOut(function(){
                            $btn.fadeIn();
                        });
                    });

                    that.$('#imagesFieldset').removeClass('invalid');
                },
                status: {
                    413: function(response){
                        that.showMessage('#historyImgTooLarge');
                    }
                }
              });
        }else{
            this.showMessage('#historyImgTooLarge');
        }
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

    sendHistory: function(e){
        e.preventDefault();
        if(!this.isSending){
            this.isSending = true;
            this.$('#enviar_btn span').html('Enviando...');

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
            var lat= parseFloat(_.escape(items.$lat.val()));
            var lon= parseFloat(_.escape(items.$lon.val()));
            var date= _.escape(items.$date.val());
            var text= _.escape(items.$text.val());
            var category= _.escape(items.$category.val());

            var type= $('#selectedType').hasClass('goodpractices') ? '0': '1';

            $.each(items, function(index, element){
                that.validate(element, false);
            });

            if(isNaN(lat) || lat < -90 || lat > 90){
                items.$lat.addClass('invalid');
                error = true;
            }

            if(isNaN(lon) || lon < -180 || lon > 180){
                items.$lon.addClass('invalid');
                error = true;
            }

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
                    'images': images
                };

                if(!this.historyId){
                    this.createHistory(formData);
                }else{
                    this.updateHistory(formData);
                }
            }else{
                this.isSending = false;
                this.$('#enviar_btn span').html('Enviar historia');
            }
        }
    },

    createHistory: function(formData) {
        formData.images = JSON.stringify(formData.images);
        var that = this;
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
                that.$('#enviar_btn span').html('Historia enviada');
            },
            error: function() {
               // Show error popup
               that.showMessage('#historySendError');
               that.isSending = false;
               that.$('#enviar_btn span').html('Enviar historia');
            }
        });
    },

    updateHistory: function(formData){
        this.model.set({
            'title': formData.title,
            'place': formData.place,
            'lat': formData.lat,
            'lon': formData.lon,
            'text_history': formData.text,
            'date': formData.date,
            'category': formData.category,
            'type': formData.type,
            'images': formData.images
        });

        this.model.save();
        if(app.isAdmin){
            this.showMessage('#historySendSuccessAdmin', this.historyId);
        }else{
            this.showMessage('#historySendSuccess')
        }
        this.$('#enviar_btn span').html('Historia enviada');
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
                        if(opt)
                            app.router.navigate('join/history/'+opt ,{trigger: true});
                        else
                            app.router.navigate('join' ,{trigger: true});
                });
            }
        });
    },

    showMap: function() {
        this.pointSelector = new app.view.MapPointSelector();
        this.pointSelector.on('pointSelected', this.getPoint, this);
    },

    getPoint: function(point) {
        this.$('#hist-lat').val(point.lat.toFixed(5)).change();
        this.$('#hist-lon').val(point.lng.toFixed(5)).change();

        this.pointSelector.off('pointSelected');
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
    },

    addImageItem: function(userFilename, serverFilename, isTemp){
        var imagedir = isTemp ? app.config.IMAGE_TEMPDIR : app.config.IMAGE_DIR;
        var $hiddenFileEntry = $('<input />', {
            type: 'hidden',
            name: 'images',
            value: serverFilename
        });

        var $linkImage = $('<a/>', {
            href: imagedir + serverFilename,
            target: '_blank',
            class: 'imagePreview',
            text: userFilename
        });

        var $fileEntry = $('<li/>', {});

        var $button = $('<img/>', {
            class: 'deleteFileEntry',
            src: '/img/participa/ALB_icon_eliminar_img.svg'
        });

        $fileEntry.append($linkImage);
        $fileEntry.append($button);
        $fileEntry.append($hiddenFileEntry);
        this.$fileEntryList.append($fileEntry);
    },

    showPreview: function(e){
        e.preventDefault();
        var images = [e.target.href];
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
    }
});
