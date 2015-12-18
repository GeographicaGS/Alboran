from flask import Flask, jsonify

import os
tmpl_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

app = Flask(__name__, template_folder=tmpl_dir)

import config
import trans
import home
import proxy

@app.route('/', methods = ['GET'])
def alive():
    return jsonify( { "status" : "running"})
