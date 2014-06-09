from flask import Flask, jsonify

app = Flask(__name__)

import config
import home
import proxy

@app.route('/', methods = ['GET'])                                            
def alive():
    return jsonify( { "status" : "running"})
