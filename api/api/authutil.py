# coding=UTF8

from api import app
from flask import request, abort, render_template
from model.usermodel import UserModel
import md5
import datetime
from functools import wraps

def auth(func):
	@wraps(func)
	def decorator(*args, **kwargs): #1
		if (request.headers['hash'] is not None and request.headers['timestamp'] is not None and request.headers['username'] is not None):
			# Control timestamp
			usertimestamp = datetime.datetime.fromtimestamp(int(request.headers['timestamp'])/1000)
			maxtime = usertimestamp + datetime.timedelta(minutes=app.config["loginMaxTime"])
			diftime = datetime.datetime.now() - maxtime
			if (diftime <= datetime.timedelta(seconds=0)):

				# Control credentials
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
		else:
			abort(401)
		return func(*args, **kwargs)
	return decorator

def authAdmin(func):
	@wraps(func)
	def decorator(*args, **kwargs): #1
		if (request.headers['hash'] is not None and request.headers['timestamp'] is not None and request.headers['username'] is not None):
			# Control timestamp
			usertimestamp = datetime.datetime.fromtimestamp(int(request.headers['timestamp'])/1000)
			maxtime = usertimestamp + datetime.timedelta(minutes=app.config["loginMaxTime"])
			diftime = datetime.datetime.now() - maxtime
			if (diftime <= datetime.timedelta(seconds=0)):

				# Control credentials
				usermodel = UserModel()
				user = usermodel.getUserByUsername(request.headers['username'])
				if user is not None and user['admin']:
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

    server = smtplib.SMTP(host=app.config["smtpServer"], port=app.config["smtpPort"], timeout=10)

    if app.config["smtpTLS"]:
    	server.starttls()

    server.ehlo()

    if app.config["smtpAuth"]:
    	server.login(app.config["smtpUser"], app.config["smtpPassword"])

    fromAddr = app.config["smtpFromAddr"]

    msg = MIMEMultipart('alternative')
    msg['From'] = '"%s"<%s>' % (app.config["smtpFromAddrName"], app.config["smtpFromAddr"])
    msg['To'] = ",".join(toAddresses)
    msg['Subject'] =  Header(subject,'utf-8')

    msg.attach(MIMEText(body.encode("utf-8"), 'html','utf-8'))

    text = msg.as_string()

    try:
        server.sendmail(fromAddr, toAddresses, text)
    finally:
        server.quit()

def getConfirmationEmailBody(user,code,lang="es"):
	link = "<a href='"+ app.config["baseURL"] +"/" + lang + "/user/" + user + "/" + code + "' target='_blank'>"+app.trans['EMAIL_MSG_LINK'][lang]+"</a>"
	m = "<h2>"+app.trans['EMAIL_TITLE'][lang]+"</h2>"
	m += "<h2>"+app.trans['EMAIL_MSG_CONFIRM'][lang]+"</h2>"
	m += "<p>" + app.trans['EMAIL_MSG_PRELINK'][lang] + link + app.trans['EMAIL_MSG_POSTLINK'][lang] +"</p>"

	return m;

def sendNewHistoryNotification(user, history):
	history['url'] = app.config["baseURL"] + "/" + user['lang'] + "/join/history/" + str(history['id_history'])
	if user['admin']:
		body = render_template('email_newhistory_admin_%s.html' % (user['lang']), history=history)
	else:
		body = render_template('email_newhistory_author_%s.html' % (user['lang']), history=history)
	sendEmail([user['email']], app.trans['EMAIL_NEWHISTORY_SUBJECT'][user['lang']], body);

def sendEditedHistoryNotification(user, history):
	history['url'] = app.config["baseURL"] + "/" + user['lang'] + "/join/history/" + str(history['id_history'])
	if user['admin']:
		body = render_template('email_editedhistory_admin_%s.html' % (user['lang']), history=history)
	else:
		body = render_template('email_editedhistory_author_%s.html' % (user['lang']), history=history)
	sendEmail([user['email']], app.trans['EMAIL_EDITEDHISTORY_SUBJECT'][user['lang']], body);

def sendPublishedHistoryNotification(user, history):
	history['url'] = app.config["baseURL"] + "/" + user['lang'] + "/join/history/" + str(history['id_history'])
	if user['admin']:
		if history['status'] == 1:
			subject = app.trans['EMAIL_PUBLISHEDHISTORY_SUBJECT'][user['lang']]
			body = render_template('email_publishedhistory_admin_%s.html' % (user['lang']), history=history)
		else:
			subject = app.trans['EMAIL_UNPUBLISHEDHISTORY_SUBJECT'][user['lang']]
			body = render_template('email_unpublishedhistory_admin_%s.html' % (user['lang']), history=history)
	else:
		if history['status'] == 1:
			subject = app.trans['EMAIL_PUBLISHEDHISTORY_SUBJECT'][user['lang']]
			body = render_template('email_publishedhistory_author_%s.html' % (user['lang']), history=history)
		else:
			subject = app.trans['EMAIL_UNPUBLISHEDHISTORY_SUBJECT'][user['lang']]
			body = render_template('email_unpublishedhistory_author_%s.html' % (user['lang']), history=history)
	sendEmail([user['email']], subject, body);

def sendDeletedHistoryNotification(user, history):
	history['url'] = app.config["baseURL"] + "/" + user['lang'] + "/join/history/" + str(history['id_history'])
	if user['admin']:
		body = render_template('email_deletedhistory_admin_%s.html' % (user['lang']), history=history)
	else:
		body = render_template('email_deletedhistory_author_%s.html' % (user['lang']), history=history)
	sendEmail([user['email']], app.trans['EMAIL_DELETEDHISTORY_SUBJECT'][user['lang']], body);
