# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from psycopg2 import IntegrityError
from api import app

# import logging


class DocumentModel(PostgreSQLModel):
	def getDocumentList(self):
		sql = "SELECT d.id_doc,d.title_en,d.title_es,d.title_fr,d.source,d.description_en,d.description_es,d.description_fr,d.doc_link,d.img_link,d.highlight, t.id as topic_id ,t.title_en as topic_en,t.title_es as topic_es,t.title_fr as topic_fr, c.id as cat_id, c.title_en as cat_en,c.title_es as cat_es,c.title_fr as cat_fr FROM documents d left join topic t on t.id = d.topic_id left join category c on c.id=t.category_id order by c.id, t.id, source";
		result = self.query(sql).result()
		return result


	def getDocumentTags(self):
		sql = "select t.id_tag, t.tag_es, t.tag_en, t.tag_fr, d.id_doc from tags t inner join doc_tags dc on dc.id_tag = t.id_tag inner join documents d on d.id_doc = dc.id_doc";
		result = self.query(sql).result()
		return result
	
