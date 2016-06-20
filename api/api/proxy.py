from api import app
from flask import jsonify,request,abort
import urllib2
import cgi

@app.route('/proxy', methods=['POST'])
def proxy():
    proxy_support = urllib2.ProxyHandler()
    opener = urllib2.build_opener(proxy_support)
    urllib2.install_opener(opener)
    
    # html = urllib2.urlopen(request.form.get('url')).read()
    html = urllib2.urlopen(request.form.get('url'))

    _, params = cgi.parse_header(html.headers.get('Content-Type', ''))
    encoding = params.get('charset', 'utf-8')
    html = html.read().decode(encoding)
    
    return html