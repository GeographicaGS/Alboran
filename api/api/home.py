# coding=UTF8

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request,abort
from model.usermodel import UserModel
from model.configmodel import ConfigModel
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

@app.route('/login/', methods=['POST'])
@auth
def login():
	return 'true'

@app.route('/config/', methods=['GET','POST'])
@auth
def configByUser():
	if request.method == 'GET':
		""" Rescatamos la configuración del usuario """
		m = ConfigModel()
		config_data = m.getConfigByUsername(request.headers['username'])
		return(jsonify({"config" : config_data}))

@app.route('/config/<int:config_id>', methods=['GET'])
@auth
def configById(config_id):
	""" Rescatamos la configuración por id """
	m = ConfigModel()
	config_data = m.getConfigById(config_id)
	return(jsonify({"config" : config_data}))