# coding=UTF8

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request,abort
from model.usermodel import UserModel
import md5
from functools import wraps

def auth(func):
	@wraps(func)
	def decorator(*args, **kwargs): #1
		if (request.headers['hash'] is not None and request.headers['timestamp'] is not None and request.headers['username'] is not None):
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
		return func(*args, **kwargs)
	return decorator

@app.route('/home/', methods=['GET'])
@auth
def home():
	return(jsonify({"home" : "aa"}))

@app.route('/login', methods=['POST'])
@auth
def login():
	return 'true'