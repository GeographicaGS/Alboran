"""
Alboran frontend configuration.
"""
from api import app

baseRootPath = ""
cdnPath = baseRootPath + "/www/cdn"

app.config.update(
    DEBUG=False,
    SECRET_KEY="XXXX",
    baseURL = "",
    smtpServer="localhost",
    smtpPort=25,
    smtpUser="",
    smtpPassword="",
    smtpFromAddr="",
    smtpFromAddrName="DEV alboran",
    smtpTLS = False,
    smtpAuth = False,
    convertBin = "convert",
    UPLOAD_TEMP_FOLDER= baseRootPath +"/tempimages/",
    IMAGES_FOLDER= cdnPath  +"/images/",
    ALLOWED_EXTENSIONS=set(["jpg","jpeg","png"]),
    MAX_CONTENT_LENGTH=16 * 1024 * 1024,
    historyFirstPagSize=,
    historyPagSize=,
    loginMaxTime=20
)