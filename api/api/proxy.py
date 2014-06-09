from api import app
from flask import jsonify,request,abort
import urllib2

@app.route('/proxy', methods=['POST'])
def proxy():
    proxy_support = urllib2.ProxyHandler()
    opener = urllib2.build_opener(proxy_support)
    urllib2.install_opener(opener)
    
    html = urllib2.urlopen(request.form.get('url')).read()
    
    return html