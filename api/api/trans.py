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
	}
}