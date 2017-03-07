from api import app
import md5
import os

def isAllowedFile(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def hashFromImage(file):
    m = md5.new()
    buffer = file.read()
    file.seek(0,0)
    m.update(buffer)
    return m.hexdigest()

def resizeImages(images):
    for img in images:
        filename, fileExtension = os.path.splitext(img)
        fsrc = os.path.join(app.config["UPLOAD_TEMP_FOLDER"], img)

        # generate thumb
        fdest = os.path.join(app.config["IMAGES_FOLDER"], filename + "_thumb" + fileExtension )
        cmd = "%s %s -auto-orient -thumbnail  %dx%d^ -gravity center -extent %dx%d %s" % (app.config["convertBin"],fsrc,220,230,220,230,fdest)
        os.system(cmd)

        # target image on jpg
        fdest = os.path.join(app.config["IMAGES_FOLDER"], img)
        cmd = "%s %s -quality 60 -resize %dx%d\> %s" % (app.config["convertBin"],fsrc,3840,2160,fdest)
        os.system(cmd)

        os.remove(fsrc)

        app.logger.info(cmd)

def deleteImage(img):
    filename, fileExtension = os.path.splitext(img)
    filepath = os.path.join(app.config["IMAGES_FOLDER"], img)
    thumbpath = os.path.join(app.config["IMAGES_FOLDER"], filename + "_thumb" + fileExtension )
    os.remove(filepath)
    os.remove(thumbpath)
