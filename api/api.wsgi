activate_this = '/home/iucn-geoportalboran.org/Alboran/api/venv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, '/home/iucn-geoportalboran.org/Alboran/api/')

from api import app as application
