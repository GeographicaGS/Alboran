
-- Translations to PgSQL

SET client_encoding = 'UTF8';

BEGIN;
  
  ALTER TABLE doc_tags DROP CONSTRAINT doc_tags_id_tag_fkey;

  DELETE FROM tags;
  
  \copy tags(id_tag, tag_en, tag_es, tag_fr ) from '/tmp/translations/translation_alboran_tags.csv' (DELIMITER ',', FORMAT CSV,HEADER TRUE)
  
  ALTER TABLE doc_tags ADD CONSTRAINT doc_tags_id_tag_fkey 
    FOREIGN KEY (id_tag) REFERENCES tags(id_tag);

COMMIT;

BEGIN;
  
  ALTER TABLE doc_tags DROP CONSTRAINT doc_tags_id_doc_fkey;

  DELETE FROM documents;
  
  \copy documents(id_doc,title_en,title_es,title_fr,source,description_en,description_es, description_fr, doc_link, img_link, highlight, topic_id ) from '/tmp/translations/alboran_documents.csv' (DELIMITER ',', FORMAT CSV,HEADER TRUE)
  
  ALTER TABLE doc_tags ADD CONSTRAINT doc_tags_id_doc_fkey 
    FOREIGN KEY (id_doc) REFERENCES documents(id_doc);

COMMIT;

BEGIN;

  DELETE FROM translation;
  
  \copy translation(key,en,es,fr) from '/tmp/translations/translation_alboran_main_traducido_EN-FR.csv' (DELIMITER ',', FORMAT CSV,HEADER TRUE)
  
  INSERT INTO translation (key) VALUES('');

COMMIT;