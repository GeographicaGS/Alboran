# -*- coding: utf-8 -*-
"""
Python command line utility to fix a file with encoding problems
using ftfy Library

Ftfy library:
    
    $ pip install ftfy
    
    https://github.com/LuminosoInsight/python-ftfy

Author: Cayetano Benavent, 2014

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
MA 02110-1301, USA.

"""

from __future__ import unicode_literals
from ftfy import fix_text
import codecs
import sys
import os



def fixFileEncoding(in_file, out_file):
    """
    in_file: path to input_file
    out_file: path to output_file
    """
    
    file_to_fix = codecs.open(in_file, encoding='utf-8')
    file_fixed = codecs.open(out_file, 'w', encoding='utf-8')
    
    for line in file_to_fix:
        line_fixed = fix_text(line)
        file_fixed.write(line_fixed)
        
    file_to_fix.close()
    file_fixed.close()


if __name__ == "__main__":
    
    if len(sys.argv) < 3:
        print '\n --Must provide two arguments: "input file" and "output file"\n'
        exit()
    elif len(sys.argv) > 3:
        print '\n --Too many arguments\n'
        exit()

    in_file = sys.argv[1]
    out_file = sys.argv[2]

    if not os.path.exists(in_file):
        print '\n --Argument error: invalid or missing path.\n'
        exit()
    
    try:
        fixFileEncoding(in_file, out_file)
        print "File succesfully fixed..."
    
    except:
        print "Uhmmm... something happened. File was not fixed\n"
    
