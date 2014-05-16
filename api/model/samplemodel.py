# coding=UTF8

"""

"""
from base.PostgreSQL.PostgreSQLModel import PostgreSQLModel
from datetime import datetime
from psycopg2 import IntegrityError


class SampleModel(PostgreSQLModel):
    def getTranslations(self):
        sql = "SELECT * FROM translations";
        return self.query(sql).result()

        

   
