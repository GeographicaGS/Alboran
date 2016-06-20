\i 00-config.sql
\c :dbname :user :host :port


CREATE TABLE translation
(
  key text NOT NULL,
  en text,
  es text,
  fr text,
  CONSTRAINT translation_pkey PRIMARY KEY (key)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE translation
  OWNER TO alboran_admin;
