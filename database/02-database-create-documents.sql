--- TABLES FOR DOCUMENT SECTION

CREATE TABLE documents (
    id_doc bigserial NOT NULL,
    title_en text,
    title_es text,
    title_fr text,
    source text,
    description_en text,
    description_es text,
    description_fr text,
    doc_link text,
    img_link text,
    highlight boolean,
    topic_id bigint NOT NULL,
    CONSTRAINT documents_pkey PRIMARY KEY (id_doc),
    CONSTRAINT documents_fk_topic FOREIGN KEY (topic_id)
        REFERENCES topic (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE NO ACTION
)WITH(
    OIDS=FALSE
);
ALTER TABLE documents
    OWNER TO alboran_admin;

CREATE TABLE tags (
    id_tag bigserial NOT NULL,
    tag_en character varying(255),
    tag_es character varying(255),
    tag_fr character varying(255),
    CONSTRAINT tags_pkey PRIMARY KEY (id_tag)
)WITH(
    OIDS=FALSE
);
ALTER TABLE tags
    OWNER TO alboran_admin;

CREATE TABLE doc_tags (
    id_tag bigserial NOT NULL REFERENCES tags,
    id_doc bigserial NOT NULL REFERENCES documents,
    PRIMARY KEY (id_tag,id_doc)
)WITH(
    OIDS=FALSE
);
ALTER TABLE doc_tags
    OWNER TO alboran_admin;
