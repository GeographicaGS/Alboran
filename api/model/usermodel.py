# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError
import time
import md5


class UserModel(PostgreSQLModel):
	def getPasswordByUsername(self, username):
		sql = 'SELECT password FROM "user" WHERE name = \'%s\''%username
		result = self.query(sql).row()
		if(result is not None):
			return result['password']
		else:
			return ''

	def getIdByUsername(self, username):
		sql = 'SELECT id_user FROM "user" WHERE name = \'%s\''%username
		result = self.query(sql).row()
		if(result is not None):
			return result['id_user']
		else:
			return ''

	def getAdminEmails(self):
		sql = "SELECT email FROM \"user\" WHERE admin = true"
		result = self.query(sql).result()
		return result

	def checkUsername(self, username):
		sql = "SELECT name FROM \"user\" WHERE name = %s"
		result = self.query(sql,[username]).row()
		if result is not None:
			return True
		else:
			return False

	def createUser(self, username, realname, email, password):
		# Get confirmation code
		code = "%s%s"%(username,time.time())
		m = md5.new()
		m.update(code)
		code = m.hexdigest()
		sql = "INSERT INTO \"user\" (name, real_name, password, email, active, confirmation_code)" \
				" VALUES (%s,%s,%s,%s, false, %s)"
		try:
			result = self.queryCommit(sql,[username, realname, password, email, code])
		except IntegrityError:
			code = None

		return code

	def confirmUser(self, user, code):
		# Search code
		sql = "SELECT name,password FROM \"user\" WHERE name = %s AND confirmation_code = %s"
		result = self.query(sql,[user, code]).row()
		if(result is not None):
			sql = "UPDATE \"user\" set active = true where name = %s"
			self.queryCommit(sql,[result['name']])
			user = {'user': result['name'], 'password': result['password']}
			return user
		else:
			return None
