from api import app
from flask import request,abort
from model.usermodel import UserModel
import md5
from functools import wraps

def auth(func):
	@wraps(func)
	def decorator(*args, **kwargs): #1
		if (request.headers['hash'] is not None and request.headers['timestamp'] is not None and request.headers['username'] is not None):
			usermodel = UserModel()
			password = usermodel.getPasswordByUsername(request.headers['username'])

			if(password != ''):
				suma = request.headers['username'] + password + request.headers['timestamp']
				m = md5.new()
				m.update(suma)
				hashsum = m.hexdigest()
				
				if(hashsum != request.headers['hash']):
					abort(401)
			else:
				abort(401)
		else:
			abort(401)
		return func(*args, **kwargs)
	return decorator

def sendEmail(toAddresses,subject,body):
    # Import smtplib for the actual sending function
    import smtplib
   
    from email.MIMEMultipart import MIMEMultipart
    from email.MIMEText import MIMEText
    from email.header import Header
    
    server = smtplib.SMTP(app.config["smtpServer"], app.config["smtpPort"])
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(app.config["smtpUser"], app.config["smtpPassword"])
    fromAddr = app.config["smtpFromAddr"]
    
    msg = MIMEMultipart('alternative')
    msg['From'] = app.config["smtpFromAddrName"]
    msg['To'] = ", ".join(toAddresses)
    msg['Subject'] =  Header(subject,'utf-8')
    
    msg.attach(MIMEText(body.encode("utf-8"), 'html','utf-8'))
    
    text = msg.as_string()
    try:
        server.sendmail(fromAddr, toAddresses, text)
    finally:
        server.quit()

def getConfirmationEmailBody(user,code):
	link = "<a href='http://dev.alboran.es/es/user/" + user + "/" + code + "' target='_blank'>aqu&iacute;</a>"
	m = "<h1>Albor&aacute;n</h1>"
	m += "<h2>Confirme su cuenta</h2>"
	m += "<p>Haga clic " + link + " para confirmar su cuenta."

	return m;