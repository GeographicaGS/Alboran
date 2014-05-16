# coding=UTF8

"""
Frontend home services.
"""
from api import app
from flask import jsonify,request
from model.samplemodel import SampleModel

@app.route('/home/', methods=['GET'])
def home():
    return(jsonify({"home" : "aa"}))

@app.route('/translations', methods=['GET'])
def getTranslations():
    m = SampleModel()
    return jsonify({"results": m.getTranslations()})



