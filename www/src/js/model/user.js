app.model.User = Backbone.Model.extend({
	validation: {
		name: [{
				required: true,
				msg: "<lang>Write your name</lang>"
			},{
				minLength: 4,
				msg: "<lang>Your name must contain at least 4 characters</lang>"
		}],
		email: [{
				required: true,
				msg: "<lang>Enter your email address</lang>"
			},{
				pattern: 'email',
				msg: "<lang>The email address is incorrect</lang>"
		}],
		user: [{
				required: true,
				msg: "<lang>Enter your username</lang>"
			},{
				minLength: 4,
				msg: "<lang>Your username should contain at least 4 characters</lang>"
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
			msg: "<lang>Password must be at least 8 characters</lang>"
		},
		repeatPassword: {
			equalTo: 'password',
			msg: '<lang>Passwords do not match</lang>'
		}
	}
});
