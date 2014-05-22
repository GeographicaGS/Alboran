class login(object):

	def __init__(self, f):
		self.f = f

	def __call__(self):
		if(request.headers['hash'] is not None and request.headers['timestamp'] is not None and request.headers['username'] is not None):
			usermodel = UserModel()
			password = usermodel.getPasswordByUsername(request.headers['username'])

			if(password != ''):
				suma = request.headers['username'] + password + request.headers['timestamp']
				m = md5.new()
				m.update(suma)
				hashsum = m.hexdigest()
				
				if(hashsum != request.headers['hash']):
					abort(401)
			else:
				abort(401)
		else:
			abort(401)
