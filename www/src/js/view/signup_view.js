app.view.SignUp = Backbone.View.extend({
    events: {
        'click #signup_btn': function (e) {
            e.preventDefault();
            this.signUp();
        }
    },

    initialize: function () {
        // Activate validation
        Backbone.Validation.bind(this);
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    signUp: function () {
        this.$('span').remove();
        var data = this.$el.serializeObject();
        this.model.set(data);
        
        // Check if the model is valid before saving
        if(this.model.isValid(true)){
            var now = $.now();
            var that = this;
            $.ajax({
                url : "/api/user/",
                data: {"user": this.model.get('user'), "name": this.model.get('name'), "email": this.model.get('email'), "password": md5(this.model.get('password'))},
                type: "POST",     
                    success: function(data) {
                        if(data.result){
                            that.$el.slideUp();
                            $('#signinSuccess').slideDown();
                        }else if(data.error){
                            var $error = $('<span/>');
                            if(data.error == 'userexists'){
                                $error.html('<lang>La dirección de email especificada ya ha sido utilizada anteriormente.<br>Por favor, inténtelo de nuevo con otra distinta</lang>.');
                                $error.insertAfter(that.$('input[name="email"]'));
                            }else{
                                $error.html('<lang>Ha ocurrido un error inesperado al crear su usuario. Inténtelo de nuevo más tarde</lang>');
                                $error.insertAfter(that.$('input[type="button"]'));
                            }
                        }
                    },
                    error: function(data){
                        var $error = $('<span/>');
                        $error.html('<lang>Ha ocurrido un error inesperado al crear su usuario. Inténtelo de nuevo más tarde</lang>');
                        $error.insertAfter(that.$('input[type="button"]'));
                    }
            });
        }else{
            // Show error messages
            this.$('input').each(function(index, item){
                var $message = $('<span/>');
                $message.html($(item).attr('data-error'));
                $message.insertAfter($(item));
            });
        }

        $(window).trigger('resize');
    },
    
    remove: function() {
        Backbone.Validation.unbind(this);
        return Backbone.View.prototype.remove.apply(this, arguments);
    }
});