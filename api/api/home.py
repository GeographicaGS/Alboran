# coding=UTF8

import os
import ast
import json
import md5
import tweepy
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request,abort
from model.usermodel import UserModel
from model.configmodel import ConfigModel
from model.historymodel import HistoryModel
from model.imagemodel import ImageModel
from model.catalogmodel import CatalogModel
from authutil import (auth, authAdmin, sendAccountConfirmationEmail,
	sendNewHistoryNotification, sendEditedHistoryNotification,
	sendPublishedHistoryNotification, sendDeletedHistoryNotification)
from imageutil import isAllowedFile, hashFromImage, resizeImages, deleteImage
from geoserverlayers import GeoserverLayers

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
		sendAccountConfirmationEmail(user, name, code, email, lang)
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
def getConfigById(config_id):
	m = ConfigModel()
	""" Rescatamos la configuración por id """
	m = ConfigModel()
	config_data = m.getConfigById(config_id)
	if config_data is None:
		abort(404)
	return(jsonify({"config" : config_data}))

@app.route('/config/<int:config_id>', methods=['POST'])
@authAdmin
def saveConfigById(config_id):
	m = ConfigModel()
	""" Guardamos la configuración del usuario usando sus credenciales """
	m.setConfigById(config_id,request.form.get('data'))
	return jsonify({'result':'true'})

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

	# Send email to admins and author
	admins = u.getAllAdmins()
	data = {}
	data['title'] = request.form['title']
	data['author'] = user['real_name']
	data['id_history'] = result['history_id']
	for admin in admins:
		sendNewHistoryNotification(admin, data)
	if not user['admin']:
		sendNewHistoryNotification(user, data)

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

	#Publish twitter
	if old_history['twitter'] != data['twitter'] and data['twitter']:
		auth = tweepy.OAuthHandler(app.config['consumer_key'], app.config['consumer_secret'])
		auth.set_access_token(app.config['access_token'], app.config['access_token_secret'])
		apiTwitter = tweepy.API(auth)
		maxLength = 117
		if len(old_history["images"]) > 0:
			maxLength = 93

		maxLength -= (len(app.config['hashtag']) + 1)

		tweet = data["text_history"]
		if(len(tweet) > maxLength):
			maxLength -= 3
			tweet = tweet[0:maxLength]
			tweet += "..."

		tweet += app.config['baseURL'] + data["historyUrl"] + str(data["id_history"]) + " " + app.config['hashtag']

		if len(old_history["images"]) > 0:
			imageTwitter = app.config['IMAGES_FOLDER'] + old_history["images"][0]["href"]
			apiTwitter.update_with_media(imageTwitter,status=tweet)
		else:
			status = apiTwitter.update_status(status=tweet)

	# Send email to admins and author
	u = UserModel()
	user = u.getUserByUsername(data['username'])
	admins = u.getAllAdmins()
	if old_history['status'] == data['status']:
		for admin in admins:
			sendEditedHistoryNotification(admin, data)
		if not user['admin']:
			sendEditedHistoryNotification(user, data)
	else:
		for admin in admins:
			sendPublishedHistoryNotification(admin, data)
		if not user['admin']:
			sendPublishedHistoryNotification(user, data)

	return jsonify({'result': 'true'})

@app.route('/history/<int:id>', methods=['DELETE'])
@authAdmin
def deleteHistory(id):
	h = HistoryModel()
	history = h.getHistoryById(id)
	h.deleteHistory(id)

	# Send email to admins and author
	u = UserModel()
	user = u.getUserByUsername(history['username'])
	admins = u.getAllAdmins()
	for admin in admins:
		sendDeletedHistoryNotification(admin, history)
	if not user['admin']:
		sendDeletedHistoryNotification(user, history)

	return jsonify({'result': 'true'})

@app.route('/catalog/', methods=['GET'])
def getFullCatalog():
	catalog = []
	c = CatalogModel()
	categories = c.getCategories()
	for category in categories:
		category['topics'] = []
		topics = c.getTopicsByCategory(category['id'])
		for topic in topics:
			layers = c.getLayersByTopic(topic['id'])
			topic['layers'] = layers
			category['topics'].append(topic)
		catalog.append(category)

	result = {'result': catalog}

	return jsonify(result)

@app.route('/catalog/layer/<int:id>', methods=['GET'])
def getLayer(id):
	c = CatalogModel()
	result = c.getLayerById(id)
	if result is None:
		abort(404)

	return jsonify({'result': result})

@app.route('/catalog/layer/', methods=['POST'])
@authAdmin
def createLayer():
	data = json.loads(request.data)
	# Save layer data
	c = CatalogModel()
	result = c.createLayer(data)

	return jsonify({'id': result['layer_id']})

@app.route('/catalog/layer/<int:id>', methods=['PUT'])
@authAdmin
def editLayer(id):
	data = json.loads(request.data)
	# Save layer data
	c = CatalogModel()
	c.updateLayer(id, data)

	return jsonify({'result': True})

@app.route('/catalog/layer/<int:id>', methods=['DELETE'])
@authAdmin
def deleteLayer(id):
	c = CatalogModel()
	c.deleteLayer(id)

	return jsonify({'result': 'true'})

@app.route('/catalog/topic/<int:id>', methods=['GET'])
def getSection(id):
	c = CatalogModel()
	result = {}
	topic = c.getTopicById(id)
	result = topic
	children = c.getTopicChildren(id)
	result['children'] = children['children']
	if result is None:
		abort(404)

	return jsonify({'result': result})

@app.route('/catalog/topic/', methods=['POST'])
@authAdmin
def createTopic():
	data = json.loads(request.data)
	# Save topic data
	c = CatalogModel()
	result = c.createTopic(data)

	return jsonify({'id': result['topic_id']})

@app.route('/catalog/topic/<int:id>', methods=['PUT'])
@authAdmin
def editTopic(id):
	data = json.loads(request.data)
	# Save layer data
	c = CatalogModel()
	c.updateTopic(id, data)

	return jsonify({'result': True})

@app.route('/catalog/topic/<int:id>', methods=['DELETE'])
@authAdmin
def deleteTopic(id):
	c = CatalogModel()
	c.deleteTopic(id)

	return jsonify({'result': 'true'})

@app.route('/gslayer/', methods=['POST'])
# @auth
def uploadGSLayer():
	data = json.loads(request.data)
	flpath = data["flpath"]
	flname = data["flname"]
	ws_name = data["ws_name"]
	ds_name = data["ds_name"]
	stylename = data["stylename"]

	shp_data = {
	             "shp": os.path.join(flpath, flname + ".shp"),
	             "dbf": os.path.join(flpath, flname + ".dbf"),
	             "shx": os.path.join(flpath, flname + ".shx"),
	             "prj": os.path.join(flpath, flname + ".prj")
	         }

	sldpath = "./sld/alboran_poly.sld"

	url_geoserverrest = app.config['geoserver_apirest']
	username = app.config['geoserver_user']
	password = app.config['geoserver_psswd']
	gsl = GeoserverLayers(url_geoserverrest, username, password)
	gsl.createGeoserverWMSLayer(shp_data, ws_name, ds_name, stylename, sldpath, debug=False)

	return jsonify({'result': 'true'})

@app.route('/gslayer/<gslayername>', methods=['DELETE'])
# @auth
def deleteGSLayerWMS(gslayername):
	url_geoserverrest = app.config['geoserver_apirest']
	username = app.config['geoserver_user']
	password = app.config['geoserver_psswd']
	gsl = GeoserverLayers(url_geoserverrest, username, password)
	gsl.rmvDataStore(gslayername)

	return jsonify({'result': 'true'})

@app.route('/gslayer/style/<gsstylename>', methods=['DELETE'])
# @auth
def deleteGSLayerStyleWMS(gsstylename):
	url_geoserverrest = app.config['geoserver_apirest']
	username = app.config['geoserver_user']
	password = app.config['geoserver_psswd']
	gsl = GeoserverLayers(url_geoserverrest, username, password)
	gsl.rmvStyle(gsstylename)

	return jsonify({'result': 'true'})
