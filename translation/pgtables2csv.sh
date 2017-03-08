
# Get tables for translations

PG_USER=myuser
PG_DB=mydb

# Documents table
psql -h localhost -U ${PG_USER} -d ${PG_DB} -c "copy (select * from documents) to stdout (DELIMITER ';', FORMAT CSV,HEADER TRUE);" > translation_alboran_documents.csv

# Tags table
psql -h localhost -U ${PG_USER} -d ${PG_DB} -c "copy (select * from tags) to stdout (DELIMITER ';', FORMAT CSV,HEADER TRUE);" > translation_alboran_tags.csv

# Main table
psql -h localhost -U ${PG_USER} -d ${PG_DB} -c "copy (select * from translation) to stdout (DELIMITER ';', FORMAT CSV,HEADER TRUE);" > translation_alboran_main.csv