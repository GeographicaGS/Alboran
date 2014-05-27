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

CREATE TABLE user(
  id_user serial NOT NULL,
  name text NOT NULL,
  password text NOT NULL,
  email text,
  active boolean,
  confirmation_code text,
  real_name text,
  CONSTRAINT user_pkey PRIMARY KEY (id_user)
);

CREATE TABLE layer_configuration
(
  id_config SERIAL,
  id_user integer,
  data text,
  CONSTRAINT layer_configuration_pkey PRIMARY KEY (id_config),
  CONSTRAINT layer_configuration_id_user_fkey FOREIGN KEY (id_user)
      REFERENCES "user" (id_user) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT layer_configuration_id_user_key UNIQUE (id_user)
);



