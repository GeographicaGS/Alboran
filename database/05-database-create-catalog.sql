\i 00-config.sql
\c postgres :superuser :host :port

CREATE TABLE category (
    id: bigserial NOT NULL,
    title_en: text,
    title_es: text,
    title_fr: text,
    CONSTRAINT category_pkey PRIMARY KEY (id)
)WITH(
    OIDS=FALSE
);
ALTER TABLE category
    OWNER TO alboran_admin;

CREATE TABLE topic (
    id: bigserial NOT NULL,
    title_en: text,
    title_es: text,
    title_fr: text,
    category_id: bigserial NOT NULL,
    CONSTRAINT topic_pkey PRIMARY KEY (id),
    CONSTRAINT topic_category_id_fkey PRIMARY KEY (category_id)
        REFERENCES "category" (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
)WITH(
    OIDS=FALSE
);
ALTER TABLE topic
    OWNER TO alboran_admin;


CREATE TABLE layer (
    id: bigserial NOT NULL,
    title_en: text,
    title_es: text,
    title_fr: text,
    wmsServer: text,
    wmsLayName: text,
    geoNetWk: text,
    desc_en: text,
    desc_es: text,
    desc_fr: text,
    dataSource: text,
    topic_id: bigserial NOT NULL,
    CONSTRAINT topic_pkey PRIMARY KEY (id),
    CONSTRAINT topic_topic_id_fkey PRIMARY KEY (topic_id)
        REFERENCES "topic" (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION,
)WITH(
    OIDS=FALSE
);
ALTER TABLE layer
    OWNER TO alboran_admin;
