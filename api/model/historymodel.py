# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError
import time
import md5
from api import app

# import logging


class HistoryModel(PostgreSQLModel):
	def getHistoriesByType(self, htype, fromId, isAdmin=False):
		if htype is not None:
			if(fromId is not None):
				sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", status, category, real_name as \"author\", institution, filename " \
					"FROM \"history\" h " \
					"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
					"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
					"WHERE type_history = %s AND h.id_history < %s AND h.active = true "
				if not isAdmin:
					sql += "AND h.status = 1 "
				sql += "ORDER BY h.id_history DESC, i.id_image ASC " \
					"LIMIT %s"
				result = self.query(sql,[htype, fromId, app.config["historyPagSize"]]).result()
			else:
				sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", status, category, real_name as \"author\", institution, filename " \
					"FROM \"history\" h " \
					"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
					"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
					"WHERE type_history = %s AND h.active = true "
				if not isAdmin:
					sql += "AND h.status = 1 "
				sql += "ORDER BY h.id_history DESC, i.id_image ASC " \
					"LIMIT %s"
				result = self.query(sql,[htype, app.config["historyPagSize"]]).result()
		else:
			# Send 16 histories for each type and the number of total histories
			sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", status, category, real_name as \"author\", institution, filename " \
				"FROM \"history\" h " \
				"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
				"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
				"WHERE h.active = true AND type_history = 0"
			if not isAdmin:
				sql += "AND h.status = 1 "
			sql += "ORDER BY h.id_history DESC, i.id_image ASC " \
				"LIMIT %s"
			result1 = self.query(sql,[app.config["historyFirstPagSize"]]).result()

			sql = "SELECT DISTINCT ON (h.id_history) h.id_history as \"id\", title, type_history as \"type\", status, category, real_name as \"author\", institution, filename " \
				"FROM \"history\" h " \
				"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
				"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
				"WHERE h.active = true AND type_history = 1"
			if not isAdmin:
				sql += "AND h.status = 1 "
			sql += "ORDER BY h.id_history DESC, i.id_image ASC " \
				"LIMIT %s"
			result2 = self.query(sql,[app.config["historyFirstPagSize"]]).result();

			sql = "SELECT COUNT(DISTINCT h.id_history) as \"total\" FROM \"history\" h " \
				"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
				"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
				"WHERE type_history = 0 AND h.active = true"
			if not isAdmin:
				sql += " AND h.status = 1"
			count1 = self.query(sql).row()['total']

			sql = "SELECT COUNT(DISTINCT h.id_history) as \"total\" FROM \"history\" h " \
				"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
				"INNER JOIN \"image\" i ON h.id_history = i.id_history " \
				"WHERE type_history = 1 AND h.active = true"
			if not isAdmin:
				sql += " AND h.status = 1"
			count2 = self.query(sql).row()['total']

			result = {}
			result.update({'histories': result1 + result2})
			result['goodpractices_total'] = count1
			result['sightings_total'] = count2

		return result

	def getHistoryById(self, id):
		sql = "SELECT h.id_history, title, date_history as \"date\", status, place, ST_x(geom) as \"lon\", ST_y(geom) as \"lat\", text_history, type_history as \"type\", category, real_name as \"author\", institution, u.id_user, u.name as \"username\" " \
			"FROM \"history\" h " \
			"INNER JOIN \"user\" u ON h.id_user = u.id_user " \
			"WHERE h.id_history = %s AND h.active = true"
		result = self.query(sql, [id]).row()

		if result is not None:
			# Date to string
			result['date'] = result['date'].strftime("%d/%m/%Y")

			sql = "SELECT filename as \"href\" "\
				"FROM \"image\" i "\
				"INNER JOIN \"history\" h ON i.id_history = h.id_history "\
				"WHERE i.id_history = %s "\
				"ORDER BY i.id_image ASC"
			images = self.query(sql,[id]).result()
			result['images'] = images

			# Get previous...
			sql = "SELECT id_history as \"id\",title "\
				"FROM \"history\" h "\
				"WHERE id_history < %s AND type_history = %s "\
				"ORDER BY id_history DESC "\
				"LIMIT 1"
			prev = self.query(sql,[id, result['type']]).row()
			if prev is not None:
				result['prev_id'] = prev['id'];

			# ...and next history
			sql = "SELECT id_history as \"id\",title "\
				"FROM \"history\" h "\
				"WHERE id_history > %s AND type_history = %s "\
				"ORDER BY id_history ASC "\
				"LIMIT 1"
			next = self.query(sql,[id, result['type']]).row()
			if next is not None:
				result['next_id'] = next['id'];

		return result

	def getHistoryPoints(self):
		sql = "SELECT h.id_history as \"id\", h.type_history as \"type\", ST_AsGeoJSON(geom) as \"geom\" " \
			"FROM \"history\" h " \
			"WHERE h.active = true " \
			"ORDER BY h.id_history DESC"
		result = self.query(sql).result()
		return result

	def createHistory(self, data, id_user):
		# Check if User is Admin
		sql = "SELECT admin FROM \"user\" WHERE id_user = %s";
		isAdmin = self.query(sql,[id_user]).row()['admin'];
		sql = "SELECT ST_SetSRID(ST_MakePoint(%s,%s),4326) as geom"
		geom = self.query(sql,[data['lon'],data['lat']]).row()['geom']
		insertData = {
			'title':data['title'],
			'place':data['place'],
			'date_history':data['date'],
			'text_history':data['text'],
			'type_history':data['type'],
			'category':data['category'],
			'id_user':id_user,
			'geom': geom
		}
		if(isAdmin):
			insertData['active'] = True

		history_id = self.insert("history",insertData,"id_history")
		result = {'history_id': history_id, 'isAdmin': isAdmin}
		return result

	def updateHistory(self, id, data):
		# Check if User is Admin
		sql = "SELECT ST_SetSRID(ST_MakePoint(%s,%s),4326) as geom"
		geom = self.query(sql,[data['lon'],data['lat']]).row()['geom']
		sql = "UPDATE \"history\" set title = %s, place = %s, date_history = %s, " \
		 		"text_history = %s, category = %s, id_user = %s, starred = %s, " \
				"geom = %s, status = %s where id_history = %s"
		self.queryCommit(sql,[data['title'], data['place'], data['date'],
						data['text_history'], data['category'], data['id_user'],
						False, geom, data['status'], data['id_history']])
		return True

	def confirmHistory(self, id):
		sql = "UPDATE \"history\" set active = true where id_history = %s"
		self.queryCommit(sql,[id])
		return True

	def deleteHistory(self, id):
		sql = "UPDATE \"history\" set active = false where id_history = %s"
		self.queryCommit(sql,[id])
		return True
