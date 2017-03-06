# coding=UTF8

import os
import ast
import json
import md5
import tweepy
import sys
import zipfile
import tempfile
import shutil
reload(sys)
sys.setdefaultencoding('utf-8')

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request,abort
from model.usermodel import UserModel
from model.configmodel import ConfigModel
from model.catalogmodel import CatalogModel
from authutil import (auth, authAdmin, sendAccountConfirmationEmail)
from geoserverlayers import GeoserverLayers

# import logging

@app.route('/login/', methods=['POST'])
@auth
def login():
	username = request.headers['username']
	u = UserModel()
	user = u.getUserByUsername(username)
	return jsonify({'result':'true', 'admin': user['admin'] == 1})

# @app.route('/user/', methods=['POST'])
# def signin():
# 	# User creation
# 	user = request.form.get('user')
# 	email = request.form.get('email')
# 	password = request.form.get('password')
# 	name = request.form.get('name')
# 	institution = request.form.get('institution')
# 	lang = request.form.get('lang')
# 	if (institution == ""):
# 		institution = None
# 	whySignup = request.form.get('whySignup')
# 	if (whySignup == ""):
# 		whySignup = None
# 	u = UserModel()
# 	code = u.createUser(user,name,email,password,institution,whySignup)
# 	if code is not None:
# 		# Send confirmation email
# 		sendAccountConfirmationEmail(user, name, code, email, lang)
# 		return jsonify({'result': 'true'})
# 	else:
# 		return jsonify({'error': 'userexists'})

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

@app.route('/allconfig/', methods=['GET'])
def Allconfig():
	m = ConfigModel()
	config_data = m.getAllConfigs()
	return(jsonify({"result" : config_data}))

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
@auth
def uploadGSLayer():

	layer_name = request.form['layer_name'].replace(" ","_")
	sld_type = request.form['sld_type']
	sldpath = None
	temp = None

	try:
		temp = tempfile.mkdtemp(suffix='', prefix='tmp', dir=app.config['UPLOAD_TEMP_FOLDER'])
		file = request.files['zip']
		filename = hashFromImage(file)+'.'+file.filename.rsplit('.', 1)[1]
		file.save(os.path.join(temp, filename))
		zfile = zipfile.ZipFile(os.path.join(temp, filename))
		zfile.extractall(temp)

		files = os.listdir(temp)
		shp_data = {
			"shp": None,
			"dbf": None,
			"shx": None,
			"prj": None
		}

		for f in files:
			if f.endswith(".dbf"):
				shp_data["dbf"] = os.path.join(temp, f)
			if f.endswith(".prj"):
				shp_data["prj"] = os.path.join(temp, f)
			if f.endswith(".shp"):
				shp_data["shp"] = os.path.join(temp, f)
			if f.endswith(".shx"):
				shp_data["shx"] = os.path.join(temp, f)
			if f.endswith(".sld"):
				sldpath = os.path.join(temp, f)
				sld_type = layer_name + ".sld"

		if shp_data["dbf"] and shp_data["prj"] and shp_data["shp"] and shp_data["shx"]:

			if not sldpath:
				sldpath = "./sld/" + sld_type + ".sld"

			ws_name = app.config['geoserver_ws']
			ds_name = layer_name
			stylename = sld_type

			url_geoserverrest = app.config['geoserver_apirest']
			username = app.config['geoserver_user']
			password = app.config['geoserver_psswd']
			gsl = GeoserverLayers(url_geoserverrest, username, password)
			status = gsl.createGeoserverWMSLayer(shp_data, ws_name, ds_name, stylename, sldpath, debug=False)

		else:
			return jsonify({'result': '-4'})
	finally:
		shutil.rmtree(temp)

	return jsonify({'status': status, 'layer':ds_name, 'server':app.config['geoserver_apirest'].replace("rest",app.config['geoserver_ws']) + "/wms?"})






	# data = json.loads(request.data)
	# flpath = data["flpath"]
	# flname = data["flname"]
	# ws_name = data["ws_name"]
	# ds_name = data["ds_name"]
	# stylename = data["stylename"]

	# shp_data = {
	#          "shp": os.path.join(flpath, flname + ".shp"),
	#          "dbf": os.path.join(flpath, flname + ".dbf"),
	#          "shx": os.path.join(flpath, flname + ".shx"),
	#          "prj": os.path.join(flpath, flname + ".prj")
	#      }

	# sldpath = "./sld/alboran_poly.sld"

	# url_geoserverrest = app.config['geoserver_apirest']
	# username = app.config['geoserver_user']
	# password = app.config['geoserver_psswd']
	# gsl = GeoserverLayers(url_geoserverrest, username, password)
	# gsl.createGeoserverWMSLayer(shp_data, ws_name, ds_name, stylename, sldpath, debug=False)



@app.route('/gslayer/<gslayername>', methods=['DELETE'])
# @auth
def deleteGSLayerWMS(gslayername):
	if app.config['geoserver_apirest'].replace("rest",app.config['geoserver_ws']) in request.form['server']:
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


@app.route('/counties/', methods=['GET'])
def getCountries():
	catalog = []
	c = CatalogModel()
	countries = c.getCountries()
	return jsonify({'result': countries})

@app.route('/msdf/', methods=['GET'])
def getMsdf():
	msdf = []
	c = CatalogModel()
	msdf = c.getMsdfList()
	return jsonify({'result': msdf})

@app.route('/catalog/msdf/', methods=['POST'])
@authAdmin
def createMsdf():
	data = json.loads(request.data)
	c = CatalogModel()
	result = c.createMsdf(data)

	return jsonify({'id': result['gid']})
