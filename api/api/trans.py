# coding=UTF8

"""
Alboran API Translations
"""

from api import app

app.trans = {
	'EMAIL_SUBJECT': {
		'es': 'Geoportal Alborán - Confirmación de cuenta',
		'fr': 'Géoportail Alboran - Confirmation d\'inscription',
		'en': 'Geoportal Alboran - Account confirmation'
	},
	'EMAIL_TITLE': {
		'es': 'Bienvenido al geoportal del mar de Albor&aacute;n',
		'fr': 'Bienvenue sur le g&eacute;oportail de la mer d\'Alboran',
		'en': 'Welcome to the Alboran sea geoportal',
	},
	'EMAIL_MSG_CONFIRM': {
		'es': 'Confirme su cuenta',
		'fr': 'Veuillez confirmer votre compte',
		'en': 'Confirm your account'
	},
	'EMAIL_MSG_PRELINK': {
		'es': 'Haga clic ',
		'fr': 'Cliquez ',
		'en': 'Click '
	},
	'EMAIL_MSG_LINK': {
		'es': 'aqu&iacute;',
		'fr': 'ici',
		'en': 'here'
	},
	'EMAIL_MSG_POSTLINK': {
		'es': ' para confirmar su cuenta.',
		'fr': ' pour confirmer votre compte.',
		'en': ' to confirm your account.'
	},
	'EMAIL_NEWHISTORY_SUBJECT': {
		'es': 'Geoportal Alborán - Nueva historia',
		'fr': 'Geoportal Alborán - Nueva historia [FR]',
		'en': 'Geoportal Alborán - Nueva historia [EN]'
	},
	'EMAIL_EDITEDHISTORY_SUBJECT': {
		'es': 'Geoportal Alborán - Historia editada',
		'fr': 'Geoportal Alborán - Historia editada [FR]',
		'en': 'Geoportal Alborán - Historia editada [EN]'
	},
	'EMAIL_PUBLISHEDHISTORY_SUBJECT': {
		'es': 'Geoportal Alborán - Historia publicada',
		'fr': 'Geoportal Alborán - Historia publicada [FR]',
		'en': 'Geoportal Alborán - Historia publicada [EN]'
	},
	'EMAIL_UNPUBLISHEDHISTORY_SUBJECT': {
		'es': 'Geoportal Alborán - Historia despublicada',
		'fr': 'Geoportal Alborán - Historia despublicada [FR]',
		'en': 'Geoportal Alborán - Historia despublicada [EN]'
	},
	'EMAIL_DELETEDHISTORY_SUBJECT': {
		'es': 'Geoportal Alborán - Historia eliminada',
		'fr': 'Geoportal Alborán - Historia eliminada [FR]',
		'en': 'Geoportal Alborán - Historia eliminada [EN]'
	},
	'EMAIL_ACCOUNTCONFIRMATION_SUBJECT': {
		'es': 'Geoportal Alborán - Confirmación de cuenta',
		'fr': 'Geoportal Alborán - Confirmación de cuenta [FR]',
		'en': 'Geoportal Alborán - Confirmación de cuenta [EN]'
	}
}
