DROP TABLE IF EXISTS "users";

DROP SEQUENCE IF EXISTS users_id_seq;

CREATE SEQUENCE users_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

CREATE TABLE "public"."users" (
  "id" bigint DEFAULT nextval('users_id_seq') NOT NULL,
  "created_at" timestamptz NOT NULL,
  "created_by" bigint NOT NULL,
  "modified_at" timestamptz,
  "modified_by" bigint,
  "deleted_at" timestamptz,
  "deleted_by" bigint,
  "name" character varying(4096),
  "login" character varying(4096),
  "password" character varying(4096),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
) WITH (oids = false);

CREATE INDEX "users_created_at" ON "public"."users" USING btree ("created_at");

CREATE INDEX "users_deleted_at" ON "public"."users" USING btree ("deleted_at");

CREATE INDEX "users_modified_at" ON "public"."users" USING btree ("modified_at");

CREATE INDEX "users_name" ON "public"."users" USING btree ("name");

COMMENT ON COLUMN "public"."users"."name" IS 'Имя';

COMMENT ON COLUMN "public"."users"."login" IS 'Логин';

COMMENT ON COLUMN "public"."users"."password" IS 'Пароль';

INSERT INTO
  "users" (
    "id",
    "created_at",
    "created_by",
    "modified_at",
    "modified_by",
    "deleted_at",
    "deleted_by",
    "name",
    "login",
    "password"
  )
VALUES
  (
    1,
    '2024-07-30 12:35:11.451131+00',
    0,
    NULL,
    NULL,
    NULL,
    NULL,
    'Ivan',
    'ivan@example.com',
    NULL
  );