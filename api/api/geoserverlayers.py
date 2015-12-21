# -*- coding: utf-8 -*-

import os
from geoserver.catalog import Catalog



class GeoserverLayers(object):

    def __init__(self, gs_apirest, username, password):
        try:
            self.__catalog = Catalog(gs_apirest, username=username, password=password)

        except Exception as err:
            print("Geoserver API Rest Error: {0}".format(err))

    def __createSldStyle(self, sldpath, stylename, ovwrt=False):
        try:
            styles_list = [st.name for st in self.__catalog.get_styles()]
            if ovwrt or not stylename in styles_list:
                with open(sldpath) as f:
                    self.__catalog.create_style(stylename, f.read(), overwrite=ovwrt)
            else:
                print("This style already exists...")

        except Exception as err:
            print("Geoserver API Rest Error creating new style: {0}".format(err))

    def __rmvResources(self, rsrc):
        """
        Removing resources
        """
        self.__catalog.delete(rsrc)
        self.__catalog.reload()

    def rmvStyle(self, stylename):
        """
        Remove style
        """
        try:

            style = self.__catalog.get_style(stylename)
            self.__rmvResources(style)

        except Exception as err:
            print("Geoserver API Rest Error removing style: {0}".format(err))

    def rmvDataStore(self, ds_store):
        """
        Remove DataStore (with his layer)
        """
        try:

            lay_rm = self.__catalog.get_layer(ds_store)
            self.__rmvResources(lay_rm)

            str_rm = self.__catalog.get_store(ds_store)
            self.__rmvResources(str_rm)

        except Exception as err:
            print("Geoserver API Rest Error removing data store: {0}".format(err))

    def createGeoserverWMSLayer(self, data, ws_name, ds_name, stylename, sldpath, debug=False):
        """
        Create Geoserver WMS layer

        Status codes:
             2 : "Geoserver layer successfully created"
            -1 : "Workspace does not exist"
            -2 : "Datastore already exists"
            -3 : "Error creating Geoserver layer"
        """
        try:

            if not self.__catalog.get_workspace(ws_name):
                print("Workspace does not exist")
                return -1

            ds_list = [i.name for i in self.__catalog.get_stores()]
            if ds_name in ds_list:
                print("Datastore already exists")
                return -2

            ds = self.__catalog.create_datastore(ds_name, ws_name)
            ft = self.__catalog.create_featurestore(ds_name, workspace=ws_name,data=data)

            print("Geoserver layer successfully created...")

            self.__createSldStyle(sldpath, stylename)
            lyr = self.__catalog.get_layer(ds_name)
            lyr.enabled = True
            lyr.default_style = stylename
            self.__catalog.save(lyr)

            if debug:
                rsrc = self.__catalog.get_resource(ds_name, workspace=ws_name)
                print("Data Store XML: {}".format(rsrc.href))

            return 2

        except Exception as err:
            print("Geoserver API Rest Error creating new layer: {0}".format(err))
            return -3
