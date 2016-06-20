# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError


class ConfigModel(PostgreSQLModel):
	def getConfigByUsername(self, username):
		sql = "SELECT data FROM layer_configuration c" \
			  	"	INNER JOIN \"user\" u ON u.id_user=c.id_user" \
				"	WHERE u.name = %s "
		result = self.query(sql,[username]).row()
		if(result is not None):
			return result['data']
		else:
			return ''

	def getConfigById(self, configid):
		sql = 'SELECT data FROM "layer_configuration" c WHERE c.id_config = %s and c.id_user is NULL'%configid;
		result = self.query(sql).row()
		if(result is not None):
			return result['data']
		else:
			return ''

	def setConfigByUsername(self, username, config):
		sql = 'select id_user from "user" where name=\'%s\''%username;
		userid = self.query(sql).row()['id_user']
		if(userid is not None):
			sql = 'update "layer_configuration" set data=\'%s\' where id_user = %s;'%(config,userid)
			self.queryCommit(sql)
			sql = 'INSERT INTO "layer_configuration" (id_user, data) SELECT %s, \'%s\' WHERE NOT EXISTS (SELECT 1 FROM "layer_configuration" WHERE id_user=%s)'%(userid,config,userid)
			self.queryCommit(sql)

	def setConfigById(self, configid, configdata):
		if(configid):
			sql = 'update "layer_configuration" set data=\'%s\' where id_config = %s;'%(configdata,configid)
			self.queryCommit(sql)
