import os
import ast
import json
import sys
sys.setdefaultencoding('utf-8')

from api import app
from flask import jsonify,request,abort

from authutil import (auth, authAdmin)



from model.configmodel import ConfigModel
from model.usermodel import UserModel



@app.route('/users', methods=['GET'])
@authAdmin
def getUsers():
	return jsonify({'result': UserModel().getUserList()})

@app.route('/users/<id>', methods=['GET'])
@authAdmin
def getUserById(id):
	return jsonify(UserModel().getUserForEdit(id))

@app.route('/users', methods=['POST'])
@authAdmin
def createUser():
	data = json.loads(request.data)
	UserModel().createUser(data)
	return jsonify({'result':'true'})

@app.route('/users/<id>', methods=['PUT'])
@authAdmin
def editUser(id):
	data = json.loads(request.data)
	UserModel().updateUser(id, data)
	return jsonify({'result': True})

@app.route('/users/<id>', methods=['DELETE'])
@authAdmin
def deleteUser(id):
	UserModel().deleteUser(id)
	return jsonify({'result': True})
