app.model.User = Backbone.Model.extend({
	validation: {
		name: [{
				required: true,
				msg: "<lang>Escriba su nombre</lang>"
			},{
				minLength: 4,
				msg: "<lang>Su nombre debe contener al menos 4 caracteres</lang>"
		}],
		email: [{
				required: true,
				msg: "<lang>Escriba su dirección de email</lang>"
			},{
				pattern: 'email',
				msg: "<lang>La dirección de correo no es correcta</lang>"
		}],
		user: [{
				required: true,
				msg: "<lang>Escriba su nombre de usuario</lang>"
			},{
				minLength: 4,
				msg: "<lang>Su nombre de usuario debe contener al menos 4 caracteres"
			},{
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
		}],
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