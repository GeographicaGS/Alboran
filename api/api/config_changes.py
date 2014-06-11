"""
Alboran frontend configuration.
"""
from api import app

app.config.update(
    DEBUG=False,
    SECRET_KEY='',
    smtpServer='',
    smtpPort=,
    smtpUser='',
    smtpPassword='',
    smtpTLS=False,
    smtpAuth=False,
    smtpFromAddr='',
    smtpFromAddrName='',
    UPLOAD_TEMP_FOLDER='../tempimages/',
    IMAGES_FOLDER='../images/',
    ALLOWED_EXTENSIONS=set(['jpg','jpeg','png']),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,
    convertBin='',
    baseURL='',
    historyFirstPagSize=,
    historyPagSize=
)