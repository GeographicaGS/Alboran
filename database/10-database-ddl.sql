\i 00-config.sql
\c :dbname :user :host :port

create table translation(
  key text,
  en text,
  es text
);

alter table translation
add constraint translation_pkey
primary key(key);

