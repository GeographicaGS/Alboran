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
            sql = "SELECT t.id, t.title_en, t.title_es, t.title_fr " \
                "FROM \"topic\" t " \
                "WHERE t.category_id = %s AND t.deleted = false " \
                "ORDER BY t.id"

            result = self.query(sql,[category_id]).result()
        else:
            sql = "SELECT t.id, t.title_en, t.title_es, t.title_fr, " \
                "t.category_id " \
                "FROM \"topic\" t " \
                "WHERE t.deleted = false " \
                "ORDER BY t.id"

            result = self.query(sql).result()

        return result

    def getLayersByTopic(self, topic_id):
        if topic_id is not None:
            sql = "SELECT l.id, l.title_en, l.title_es, l.title_fr, " \
                "l.wms_server as \"wmsServer\", l.wms_layer_name as \"wmsLayName\", " \
                "l.geonetwork as \"geoNetWk\", l.desc_en, l.desc_es, l.desc_fr, " \
                "l.datasource as \"dataSource\" " \
                "FROM \"layer\" l " \
                "WHERE l.topic_id = %s AND l.deleted = false " \
                "ORDER BY l.id"

            result = self.query(sql,[topic_id]).result()
        else:
            sql = "SELECT l.id, l.title_en, l.title_es, l.title_fr, " \
                "l.wms_server as \"wmsServer\", l.wms_layer_name as \"wmsLayName\", " \
                "l.geonetwork as \"geoNetWk\", l.desc_en, l.desc_es, l.desc_fr, " \
                "l.datasource as \"dataSource\", l.topic_id " \
                "FROM \"layer\" l " \
                "l.deleted = false " \
                "ORDER BY l.id"

            result = self.query(sql).result()

        return result
