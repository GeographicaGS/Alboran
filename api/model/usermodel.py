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

	def getUserByUsername(self, username):
		sql = "SELECT * FROM \"user\" WHERE name = %s";
		result = self.query(sql,[username]).row()
		return result

	def getUserForEdit(self, id):
		sql = "SELECT id_user as id,name,email,real_name, admin, id_country FROM \"user\" WHERE id_user = %s order by name";
		result = self.query(sql,[id]).row()
		return result

	def getAllAdmins(self):
		sql = "SELECT * FROM \"user\" WHERE admin = true AND active"
		result = self.query(sql).result()
		return result

	def getUserList(self):
		sql = "SELECT id_user,name,email,real_name,admin, c.name_en as country_en, c.name_fr as country_fr FROM \"user\" u INNER JOIN country c on c.id_country = u.id_country"
		result = self.query(sql).result()
		return result

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

	# def createUser(self, username, realname, email, password, institution, whySignup):
	# 	# Get confirmation code
	# 	code = "%s%s"%(username,time.time())
	# 	m = md5.new()
	# 	m.update(code)
	# 	code = m.hexdigest()
	# 	sql = "INSERT INTO \"user\" (name, real_name, password, email, active, confirmation_code, institution, whysignup)" \
	# 			" VALUES (%s,%s,%s,%s, false, %s, %s, %s)"
	# 	try:
	# 		result = self.queryCommit(sql,[username, realname, password, email, code, institution, whySignup])
	# 	except IntegrityError:
	# 		code = None
	#
	# 	return code

	def createUser(self, data):
		sql = "INSERT INTO \"user\" (name, real_name, password, email, id_country, admin, active) VALUES (%s,%s,%s,%s,%s,%s, true)"

		self.queryCommit(sql,[data['name'], data['real_name'], data['password'], data['email'], data['id_country'], data['admin']])

		return True

	def updateUser(self, id, data):
		sql = "UPDATE \"user\" set name = %s, email = %s, real_name = %s, id_country = %s, admin = %s where id_user = %s"

		self.queryCommit(sql,[ data['name'], data['email'], data['real_name'], data['id_country'], data['admin'], data['id']])

		if('password' in data):
			sql = "UPDATE \"user\" set password = %s where id_user = %s"
			self.queryCommit(sql,[data['password'], data['id']])

		return True

	def deleteUser(self, id):
		sql = "DELETE FROM \"user\" where id_user = %s"
		self.queryCommit(sql,[id])

		return True

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
