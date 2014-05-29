# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError
import time
import md5


class ImageModel(PostgreSQLModel):
	def getImagesByHistory(self, id_hist):
		sql = "SELECT filename FROM \"image\" WHERE id_history = %s"
		queryresult = sql.query(sql,[id_hist]).result()
		results = []
		for row in queryresult:
			results.append(dict(zip(columns, row)))
		return results

	def addImages(self, imagelist, id_history):
		for file in imagelist:
			sql = "INSERT INTO \"image\" (id_history, filename)" \
				" VALUES (%s,%s)"
			self.queryCommit(sql,[id_history, file])
		return True