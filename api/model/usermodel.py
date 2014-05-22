# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError


class UserModel(PostgreSQLModel):
    def getPasswordByUsername(self, username):
        sql = 'SELECT password FROM "user" WHERE name = \'%s\''%username;
        result = self.query(sql).row()
        if(result is not None):
        	return result['password']
        else:
        	return ''