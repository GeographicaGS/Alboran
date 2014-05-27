from flask import Flask, jsonify

app = Flask(__name__)
app.config.update(
    DEBUG=True,
    SECRET_KEY='oN;2R@a-Y&opIY',
    smtpServer='smtp.gmail.com',
    smtpPort=587,
    smtpUser='raul.yeguas@geographica.gs',
    smtpPassword='rN30k0r3 on geographica',
    smtpFromAddr='raul.yeguas@geographica.gs',
    smtpFromAddrName='Proyecto Alboran'
)

import home

@app.route('/', methods = ['GET'])                                            
def alive():
    return jsonify( { "status" : "running"})
