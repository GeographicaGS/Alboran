\i 00-config.sql
\c postgres :superuser :host :port

create role :user with login password :'pass';

create database :dbname owner :user;

\c :dbname :superuser :host :port

alter schema public owner to :user;

\c :dbname :user :host :port
