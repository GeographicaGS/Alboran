# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError

class CatalogModel(PostgreSQLModel):
    def getCategories(self):
        sql = "SELECT c.id, c.title_en, c.title_es, c.title_fr " \
            "FROM \"category\" c " \
            "WHERE c.deleted = false " \
            "ORDER BY c.id"

        result = self.query(sql).result()

        return result

    def getTopicsByCategory(self, category_id):
        if category_id is not None:
            sql = "SELECT t.id, t.title_en, t.title_es, t.title_fr, t.order " \
                "FROM \"topic\" t " \
                "WHERE t.category_id = %s AND t.deleted = false " \
                "ORDER BY t.order"

            result = self.query(sql,[category_id]).result()
        else:
            sql = "SELECT t.id, t.title_en, t.title_es, t.title_fr, " \
                "t.category_id, t.order " \
                "FROM \"topic\" t " \
                "WHERE t.deleted = false " \
                "ORDER BY t.order"

            result = self.query(sql).result()

        return result

    def getLayersByTopic(self, topic_id):
        if topic_id is not None:
            sql = "SELECT l.id, l.title_en, l.title_es, l.title_fr, " \
                "l.wms_server as \"wmsServer\", l.wms_layer_name as \"wmsLayName\", " \
                "l.geonetwork as \"geoNetWk\", l.desc_en, l.desc_es, l.desc_fr, " \
                "l.datasource as \"dataSource\", l.order " \
                "FROM \"layer\" l " \
                "WHERE l.topic_id = %s AND l.deleted = false " \
                "ORDER BY l.order"

            result = self.query(sql,[topic_id]).result()
        else:
            sql = "SELECT l.id, l.title_en, l.title_es, l.title_fr, " \
                "l.wms_server as \"wmsServer\", l.wms_layer_name as \"wmsLayName\", " \
                "l.geonetwork as \"geoNetWk\", l.desc_en, l.desc_es, l.desc_fr, " \
                "l.datasource as \"dataSource\", l.topic_id, l.order " \
                "FROM \"layer\" l " \
                "l.deleted = false " \
                "ORDER BY l.order"

            result = self.query(sql).result()

        return result

    def getTopicById(self, topic_id):
        sql = "SELECT t.id, t.title_en, t.title_es, t.title_fr, t.category_id, t.order " \
            "FROM \"topic\" t " \
            "WHERE t.id = %s AND t.deleted = false "
        result = self.query(sql,[topic_id]).row()
        return result

    def getTopicChildren(self, topic_id):
        sql = "SELECT count(l.*) as \"children\" " \
            "FROM \"layer\" l " \
            "WHERE l.topic_id = %s AND l.deleted = false"
        result = self.query(sql, [topic_id]).row()
        return result

    def getLayerById(self, layer_id):
        sql = "SELECT l.id, l.title_en, l.title_es, l.title_fr, " \
            "l.wms_server as \"wmsServer\", l.wms_layer_name as \"wmsLayName\", " \
            "l.geonetwork as \"geoNetWk\", l.desc_en, l.desc_es, l.desc_fr, " \
            "l.datasource as \"dataSource\", l.topic_id, l.order " \
            "FROM \"layer\" l WHERE id = %s";
        result = self.query(sql,[layer_id]).row()
        return result

    def createTopic(self, data):
        insertData = {
            'title_es': data['title_es'],
            'title_en': data['title_en'],
            'title_fr': data['title_fr'],
            'category_id': data['category_id']
        }

        topic_id = self.insert("topic",insertData,"id")
        result = {'topic_id': topic_id}
        return result

    def createLayer(self, data):
        insertData = {
            'title_es': data['title_es'],
            'title_en': data['title_en'],
            'title_fr': data['title_fr'],
            'desc_es': data['desc_es'],
            'desc_en': data['desc_en'],
            'desc_fr': data['desc_fr'],
            'datasource': data['dataSource'],
            'wms_server': data['wmsServer'],
            'wms_layer_name': data['wmsLayName'],
            'geonetwork': data['geoNetWk'],
            'topic_id': data['topic_id']
        }

        layer_id = self.insert("layer",insertData,"id")
        result = {'layer_id': layer_id}
        return result

    def updateTopic(self, id, data):
        sql = "UPDATE \"topic\" set title_es = %s, title_en = %s, title_fr = %s, " \
            "category_id = %s, \"order\" = %s where id = %s"
        self.queryCommit(sql,[data['title_es'], data['title_en'], data['title_fr'],
            data['category_id'], data['order'], data['id']])
        return True

    def updateLayer(self, id, data):
        sql = "UPDATE \"layer\" set title_es = %s, title_en = %s, title_fr = %s, " \
            "desc_es = %s, desc_en = %s, desc_fr = %s, datasource = %s, " \
            "wms_server = %s, wms_layer_name = %s, geonetwork = %s, " \
            "topic_id = %s, \"order\" = %s where id = %s"
        self.queryCommit(sql,[data['title_es'], data['title_en'], data['title_fr'],
            data['desc_es'], data['desc_en'], data['desc_fr'],
            data['dataSource'], data['wmsServer'], data['wmsLayName'],
            data['geoNetWk'], data['topic_id'], data['order'], data['id']])
        return True

    def deleteTopic(self, id):
		sql = "UPDATE \"topic\" set deleted = true where id = %s"
		self.queryCommit(sql,[id])
		return True

    def deleteLayer(self, id):
		sql = "UPDATE \"layer\" set deleted = true where id = %s"
		self.queryCommit(sql,[id])
		return True
