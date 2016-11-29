import os
import ast
import json
import sys
sys.setdefaultencoding('utf-8')

from api import app
from flask import jsonify,request,abort
from model.configmodel import ConfigModel
from model.documentmodel import DocumentModel
from authutil import (auth, authAdmin, sendAccountConfirmationEmail,
	sendNewHistoryNotification, sendEditedHistoryNotification,
	sendPublishedHistoryNotification, sendDeletedHistoryNotification)



@app.route('/documents', methods=['GET'])
def getDocuments():
	return jsonify({'result': DocumentModel().getDocumentList()})

@app.route('/documents/tags', methods=['GET'])
def getDocumentsTags():
	return jsonify({'result': DocumentModel().getDocumentTags()})

@app.route('/documents/<id>', methods=['GET'])
def getDocumentById(id):
	return jsonify(DocumentModel().getDocumentById(id))


@app.route('/documents/alltags', methods=['GET'])
def getAllDocumentTags():
	return jsonify({'result': DocumentModel().getAllDocumentTags()})

@app.route('/documents/tag/', methods=['POST'])
@authAdmin
def createTag():
	data = json.loads(request.data)
	# Save topic data
	c = DocumentModel()
	result = c.createTag(data)
	return jsonify({'id_tag': result['id_tag']})


@app.route('/documents/document/<id>', methods=['GET'])
@authAdmin
def getDocumentAdmin(id):
	return jsonify(DocumentModel().getDocumentToEdit(id))

@app.route('/documents/document', methods=['POST'])
@authAdmin
def createDocument():
	data = json.loads(request.data)
	c = DocumentModel()
	result = c.createDocument(data)
	
	if data['doc_link'] and data['doc_link'].strip():
		c.updateDocumentFile(result['id_doc'], data['doc_link'])

	return jsonify({'id_doc': result['id_doc']})

@app.route('/documents/document/<int:id>', methods=['PUT'])
@authAdmin
def upateDocument(id):
	data = json.loads(request.data)
	c = DocumentModel()
	result = c.updateDocument(id,data)

	if data['doc_link'] and data['doc_link'].strip():
		c.updateDocumentFile(id, data['doc_link'])

		for file in os.listdir(app.config['DOCUMENT_FILE_FOLDER']):
			if str(id) == file.split('.')[0]:
				try:
					os.remove(app.config['DOCUMENT_FILE_FOLDER'] + file)
				except OSError:
					pass
				break;


	return jsonify({'id_doc': id})

@app.route('/documents/cover', methods=['POST'])
@authAdmin
def createCover():
	file = request.files['image']
	id_doc = request.form['id_doc']
	filename = 'doc' + id_doc + '.' + file.filename.rsplit('.', 1)[1]
	
	# try:
	# 	os.remove(app.config['DOCUMENT_COVER_FOLDER'] + filename)
	# except OSError:
	# 	pass

	for fileAux in os.listdir(app.config['DOCUMENT_COVER_FOLDER']):
		if ('doc' + id_doc) == fileAux.split('.')[0]:
			try:
				os.remove(app.config['DOCUMENT_COVER_FOLDER'] + fileAux)
			except OSError:
				pass

	file.save(os.path.join(app.config['DOCUMENT_COVER_FOLDER'], filename))
	
	c = DocumentModel()
	c.updateDocumentCover(id_doc,filename)
	return jsonify({'result': True})

@app.route('/documents/file', methods=['POST'])
@authAdmin
def createFile():
	file = request.files['document']
	id_doc = request.form['id_doc']
	filename = id_doc + '.' + file.filename.rsplit('.', 1)[1]
	
	# try:
	# 	os.remove(app.config['DOCUMENT_FILE_FOLDER'] + filename)
	# except OSError:
	# 	pass

	for fileAux in os.listdir(app.config['DOCUMENT_FILE_FOLDER']):
		if id_doc == fileAux.split('.')[0]:
			try:
				os.remove(app.config['DOCUMENT_FILE_FOLDER'] + fileAux)
			except OSError:
				pass

	file.save(os.path.join(app.config['DOCUMENT_FILE_FOLDER'], filename))
	c = DocumentModel()
	c.updateDocumentFile(id_doc, '/documents/' + filename)
	return jsonify({'result': True})

@app.route('/documents/document/<int:id>', methods=['DELETE'])
@authAdmin
def deleteDocument(id):
	c = DocumentModel()
	document = DocumentModel().getDocumentToEdit(id)
	if document['doc_link'] and 'http' not in document['doc_link']:
		try:
			os.remove(app.config['DOCUMENT_FILE_FOLDER'] + document['doc_link'].split('/documents/')[1])
		except OSError:
			pass

	for file in os.listdir(app.config['DOCUMENT_COVER_FOLDER']):
		if ('doc' + str(document['id_doc'])) == file.split('.')[0]:
			try:
				os.remove(app.config['DOCUMENT_COVER_FOLDER'] + file)
			except OSError:
				pass

	document = c.deleteDocument(id)

	return jsonify({'result': True})	