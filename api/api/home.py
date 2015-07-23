# coding=UTF8

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request,abort
from model.usermodel import UserModel
from model.configmodel import ConfigModel
from model.historymodel import HistoryModel
from model.imagemodel import ImageModel
from authutil import auth, authAdmin, sendEmail, getConfirmationEmailBody
from imageutil import isAllowedFile, hashFromImage, resizeImages, deleteImage
import os
import ast
import json
import md5

# import logging

@app.route('/login/', methods=['POST'])
@auth
def login():
	username = request.headers['username']
	u = UserModel()
	user = u.getUserByUsername(username)
	return jsonify({'result':'true', 'admin': user['admin'] == 1})

@app.route('/user/', methods=['POST'])
def signin():
	# User creation
	user = request.form.get('user')
	email = request.form.get('email')
	password = request.form.get('password')
	name = request.form.get('name')
	institution = request.form.get('institution')
	lang = request.form.get('lang')
	if (institution == ""):
		institution = None
	whySignup = request.form.get('whySignup')
	if (whySignup == ""):
		whySignup = None
	u = UserModel()
	code = u.createUser(user,name,email,password,institution,whySignup)
	if code is not None:
		# Send confirmation email
		sendEmail([email], app.trans['EMAIL_SUBJECT'][lang], getConfirmationEmailBody(user, code, lang))
		return jsonify({'result': 'true'})
	else:
		return jsonify({'error': 'userexists'})

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
		abort(404)

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

	if config_data is None:
		abort(404)

	return(jsonify({"config" : config_data}))


@app.route('/image/', methods=['POST'])
@auth
def uploadImage():
	# If 'data', save temp; else if 'list' confirm image list
	if request.files['image'] is not None:
		# Save image in temp named like its hash
		file = request.files['image']
		if file and isAllowedFile(file.filename):
			filename = hashFromImage(file)+'.'+file.filename.rsplit('.', 1)[1]
			file.save(os.path.join(app.config['UPLOAD_TEMP_FOLDER'], filename))
			return jsonify({'filename': filename})
		else:
			abort(412)
	else:
		abort(412)

@app.route('/history/', methods=['POST'])
@auth
def uploadHistory():
	# Get user id
	u = UserModel()
	user = u.getUserByUsername(request.headers['username'])

	# Save history data
	h = HistoryModel()
	result = h.createHistory(request.form, user['id_user'])

	# Save images and link in DB
	imagelist = ast.literal_eval(request.form['images'])
	resizeImages(imagelist)
	i = ImageModel()
	i.addImages(imagelist, result['history_id'])

	# Send email to admins
	admins = u.getAdminEmails()
	for admin in admins:
		sendEmail([admin['email']], "Nueva historia", "Se ha creado una nueva historia con el ID %s. Acceda a la base de datos para revisarla.\nEste email solo es enviado a los administradores."%result['history_id'])

	if not user['admin']:
		sendEmail([user['email']], "Nueva historia", "Se ha creado una nueva historia con el ID %s."%result['history_id'])

	return jsonify({'admin':result['isAdmin'], 'history_id': result['history_id']})

@app.route('/history/', methods=['GET'])
def listHistories():
	htype = request.args.get('type')
	fromid = request.args.get('id')
	isAdmin = False
	if 'username' in request.headers:
		u = UserModel()
		isAdmin = u.getUserByUsername(request.headers['username'])['admin']
	h = HistoryModel()
	result = h.getHistoriesByType(htype,fromid,isAdmin)

	if isinstance(result, dict):
		return jsonify(result)
	else:
		return jsonify({'result': result})

@app.route('/historygeo/', methods=['GET'])
def listHistoryPoints():
	h = HistoryModel()
	points = h.getHistoryPoints()
	result = []
	for point in points:
		item = {}
		item['type'] = 'Feature'
		item['geometry'] = json.loads(point['geom'])
		h_property = {'h_id': point['id'], 'h_type': point['type']}
		item['properties'] = h_property
		result.append(item)
	return jsonify({'result': result})

@app.route('/history/<int:id>', methods=['GET'])
def getHistory(id):
	h = HistoryModel()
	result = h.getHistoryById(id)

	if result is None:
		abort(404)

	return jsonify({'result': result})

@app.route('/history/<int:id>', methods=['PUT'])
@authAdmin
def editHistory(id):
	data = json.loads(request.data)

	h = HistoryModel()
	old_history = h.getHistoryById(id)
	h.updateHistory(id, data)

	i = ImageModel()
	# Unlink deleted images
	if len(data['images']) > 0:
		old_imagelist = old_history['images']
		new_imagelist = data['images']
		if isinstance(new_imagelist[0], dict):
			new_imagelist = [el['href'] for el in new_imagelist]
		for image in old_imagelist:
			if image['href'] not in new_imagelist:
				i.deleteImageByFilename(image['href'])

	# Save new images and link in DB
	if 'newImages' in data:
		imagelist = data['newImages']
		resizeImages(imagelist)
		i.addImages(imagelist, id)

	# Send email to admins and author
	u = UserModel()
	user = u.getUserByUsername(data['username'])
	admins = u.getAdminEmails()
	for admin in admins:
		sendEmail([admin['email']], "Historia editada", "Se ha editado la historia con el ID %s. Acceda a la base de datos para revisarla.\nEste email solo es enviado a los administradores." % id)

	if not user['admin']:
		sendEmail([user['email']], "Historia editada", "Se ha editado la historia con el ID %s." % id)

	return jsonify({'result': 'true'})

@app.route('/history/<int:id>', methods=['DELETE'])
@authAdmin
def deleteHistory(id):
	h = HistoryModel()
	history = h.getHistoryById(id)
	h.deleteHistory(id)

	u = UserModel()
	user = u.getUserByUsername(history['username'])
	admins = u.getAdminEmails()
	for admin in admins:
		sendEmail([admin['email']], "Historia eliminada", "Se ha eliminado la historia con el ID %s. Acceda a la base de datos para revisarla.\nEste email solo es enviado a los administradores." % id)
	if not user['admin']:
		sendEmail([user['email']], "Historia eliminada", "Se ha aliminado la historia con el ID %s." % id)

	return jsonify({'result': 'true'})
