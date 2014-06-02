# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError
import time
import md5

# import logging


class HistoryModel(PostgreSQLModel):
	def getHistoriesByType(self, htype, fromId):
		result= []

		if htype is not None:
			if(fromId is not None):
				sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", category, real_name as \"author\", filename " \
					"FROM \"history\" h " \
					"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
					"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
					"WHERE type_history = %s AND h.id_history < %s AND h.active = true " \
					"ORDER BY h.id_history DESC " \
					"LIMIT 5"
				result = self.query(sql,[htype, fromId]).result()
			else:
				sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", category, real_name as \"author\", filename " \
					"FROM \"history\" h " \
					"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
					"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
					"WHERE type_history = %s AND h.active = true " \
					"ORDER BY h.id_history DESC " \
					"LIMIT 5"
				result = self.query(sql,[htype]).result()
		else:
			sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", category, real_name as \"author\", filename " \
				"FROM \"history\" h " \
				"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
				"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
				"WHERE h.active = true " \
				"ORDER BY h.id_history DESC " \
				"LIMIT 10"
			result = self.query(sql,[htype]).result()

		return result

	def getHistoryById(self, id):
		return True

	def createHistory(self, data, id_user):
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
