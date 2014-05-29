# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError
import time
import md5

import logging


class HistoryModel(PostgreSQLModel):
	def getHistories(self):
		return True

	def getHistoryById(self, id):
		return True

	def createHistory(self, data, id_user):
		logging.info(data['title'])
		"""sql = "INSERT INTO \"history\" (title, place, geo_lat, geo_lon, date_history, text_history, type_history, category, id_user, starred)" \
				" VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,false)"
		result = self.queryCommit(sql,[data['title'], data['place'], data['lat'], data['lon'], data['date'], data['text'], data['type'], data['category'], id_user])"""
		insertData = {
			'title':data['title'],
			'place':data['place'],
			'geo_lat':data['lat'],
			'geo_lon':data['lon'],
			'date_history':data['date'],
			'text_history':data['text'],
			'type_history':data['type'],
			'category':data['category'],
			'id_user':id_user
		}
		history_id = self.insert("history",insertData,"id_history")
		return history_id

	def confirmHistory(self, id):
		sql = "UPDATE \"history\" set active = true where id_history = %s"
		self.queryCommit(sql,[id])
		return True
