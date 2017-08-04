CREATE TABLE layer_status
(
  gid serial NOT NULL,
  description text NOT NULL,
  CONSTRAINT layer_status_pkey PRIMARY KEY (gid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE layer_status
  OWNER TO medkey_geo;

INSERT INTO layer_status(description) VALUES ('publish');
INSERT INTO layer_status(description) VALUES ('pending');
INSERT INTO layer_status(description) VALUES ('rejected');
INSERT INTO layer_status(description) VALUES ('draft');


alter table public.layer add column status integer default 1;
alter table public.layer add column reject_text text;
alter table layer add column reject_date date;

alter table public.layer ADD CONSTRAINT layer_status_fkey FOREIGN KEY (status)
      REFERENCES "layer_status" (gid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION


alter table public."user" add column id_country character varying(3);

alter table public."user" ADD CONSTRAINT user_country_fkey FOREIGN KEY (id_country)
      REFERENCES "country" (id_country) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;

UPDATE "user" SET id_country='ESP' WHERE name='isabel';
UPDATE "user" SET id_country='TUN' WHERE name!='isabel';
