# coding=UTF8

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request,abort
from model.usermodel import UserModel
from model.configmodel import ConfigModel
from authutil import auth, sendEmail, getConfirmationEmailBody

@app.route('/login/', methods=['POST'])
@auth
def login():
	return jsonify({'result':'true'})

@app.route('/user/', methods=['POST'])
def signin():
	# User creation
	user = request.form.get('user')
	email = request.form.get('email')
	password = request.form.get('password')
	name = request.form.get('name')
	u = UserModel()
	code = u.createUser(user,name,email,password)

	# Send confirmation email
	sendEmail(email, "Email de confirmación de Alborán", getConfirmationEmailBody(user, code))
	return jsonify({'result': 'true'})

@app.route('/user/<user>', methods=['GET'])
def checkUsername(user):
	u = UserModel()
	result = None
	if u.checkUsername(user):
		result = jsonify({'result':True})
	else:
		result = jsonify({'result': False})
	return result

@app.route('/user/<user>/<code>', methods=['GET'])
def confirmUser(user,code):
	u = UserModel()
	user = u.confirmUser(user,code)
	if user is not None:
		return jsonify({'user': user['user'], 'password': user['password']})
	else:
		abort(401)

@app.route('/config/', methods=['GET','POST'])
@auth
def configByUser():
	m = ConfigModel()
	if request.method == 'GET':
		""" Rescatamos la configuración del usuario usando sus credenciales """
		config_data = m.getConfigByUsername(request.headers['username'])
		return(jsonify({"config" : config_data}))
	else:
		""" Guardamos la configuración del usuario usando sus credenciales """
		m.setConfigByUsername(request.headers['username'],request.form.get('data'))
		return jsonify({'result':'true'})

 
@app.route('/config/<int:config_id>', methods=['GET'])
def configById(config_id):
	""" Rescatamos la configuración por id """
	m = ConfigModel()
	config_data = m.getConfigById(config_id)
	return(jsonify({"config" : config_data}))