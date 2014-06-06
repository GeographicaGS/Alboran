app.model.User = Backbone.Model.extend({
	validation: {
		name: {
			required: true,
			minLength: 4,
			msg: "<lang>Escriba su nombre</lang>"
		},
		email: {
			required: true,
			pattern: 'email',
			msg: "<lang>La dirección de correo no es correcta</lang>"
		},
		user: {
			required: true,
			minLength: 4,
			fn: function(deffered, model, value, attr) {
                var user = model.get(attr);
	            $.ajax({
	                url : "/api/user/"+ user,
	                type: "GET",
	                async: false,    
	                success: function(data) {
                    	if(data.result){
                        	deffered.reject();
                        }else{
                        	deffered.resolve();
                        }
                    }
                });
            },
        	msg: "<lang>El nombre de usuario ya existe</lang>."
		},
		password: {
			minLength: 8,
			msg: "<lang>La contraseña debe tener al menos 8 caracteres</lang>"
		},
		repeatPassword: {
			equalTo: 'password',
			msg: '<lang>Las contraseñas no coinciden</lang>'
		}
	}
});