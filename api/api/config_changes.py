"""
Alboran frontend configuration.
"""
from api import app

baseRootPath = ""
cdnPath = baseRootPath + "/www/cdn"

app.config.update(
    baseURL='http://xxxxxxxxxxx',
    DEBUG=True,
    SECRET_KEY='xxxxxxxxxx',
    smtpServer='xxxxxxxxxxx',
    smtpPort=587,
    smtpUser='xxxxxxxxxxxxx',
    smtpPassword='xxxxxxxxxxxxxxxxxxxx',
    smtpTLS=True,
    smtpAuth=True,
    smtpFromAddr='xxxxxxxxxxxxxxxxxxxxxxxxxx',
    smtpFromAddrName='Geoportal Alboran',
    UPLOAD_TEMP_FOLDER= cdnPath + '/tmp/',
    IMAGES_FOLDER= cdnPath + "/images/",
    ALLOWED_EXTENSIONS=set(['jpg','jpeg','png']),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,
    convertBin='convert',
    historyFirstPagSize=16,
    historyPagSize=16,
    loginMaxTime=20,

    consumer_key= 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    consumer_secret= 'xxxxxxxxxxxxxxxxxxxx',
    access_token= 'xxxxxxxxx',
    access_token_secret= 'xxxxxxxxxxxxxxxxx',
    hashtag = '#prueba',

    geoserver_apirest='http://xxxxxxxxxxxxx/geoserver/rest',
    geoserver_user='xxxxxxxxxxxx',
    geoserver_psswd='xxxxxxxxxxxxxxxxxxx',
    geoserver_ws='xxxx'
)
