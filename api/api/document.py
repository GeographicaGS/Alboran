import os
import ast
import json
import sys
sys.setdefaultencoding('utf-8')

from api import app
from flask import jsonify,request,abort
from model.configmodel import ConfigModel
from model.documentmodel import DocumentModel



@app.route('/documents', methods=['GET'])
def getDocuments():
	return jsonify({'result': DocumentModel().getDocumentList()})

@app.route('/documents/tags', methods=['GET'])
def getDocumentsTags():
	return jsonify({'result': DocumentModel().getDocumentTags()})

@app.route('/documents/<id>', methods=['GET'])
def getDocumentById(id):
	return jsonify(DocumentModel().getDocumentById(id))