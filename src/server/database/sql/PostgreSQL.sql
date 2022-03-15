-- ----------------------------
-- Table structure for d_admin
-- ----------------------------
DROP TABLE IF EXISTS "d_admin";
CREATE TABLE "d_admin" (
  "id" varchar(24) NOT NULL DEFAULT substr(md5(gen_random_uuid()::text),1,24),
  "username" varchar NOT NULL DEFAULT '',
  "password" varchar NOT NULL DEFAULT '',
  "mail" varchar NOT NULL DEFAULT '',
  "domain" varchar NOT NULL DEFAULT '',
  "requestHeaders" text NOT NULL DEFAULT '',
  "commentCount" int2 NOT NULL DEFAULT 6,
  "wordNumber" varchar NOT NULL DEFAULT '0',
  "limit" int2 NOT NULL DEFAULT 0,
  "limitAll" int2 NOT NULL DEFAULT 0,
  "akismet" varchar NOT NULL DEFAULT '',
  "avatarCdn" varchar NOT NULL DEFAULT 'https://cn.gravatar.com/avatar/',
  "siteUrl" varchar NOT NULL DEFAULT '',
  "serverURLs" varchar NOT NULL DEFAULT '',
  "mailHost" varchar NOT NULL DEFAULT '',
  "mailPort" varchar NOT NULL DEFAULT '',
  "mailFrom" varchar NOT NULL DEFAULT '',
  "mailAccept" varchar NOT NULL DEFAULT '',
  "masterSubject" varchar NOT NULL DEFAULT '',
  "masterTemplate" text NOT NULL DEFAULT '',
  "replySubject" varchar NOT NULL DEFAULT '',
  "replyTemplate" text NOT NULL DEFAULT '',
  PRIMARY KEY (id)
)
;


-- ----------------------------
-- Table structure for d_comment
-- ----------------------------
DROP TABLE IF EXISTS "d_comment";
CREATE TABLE "d_comment" (
  "id" varchar(24) NOT NULL DEFAULT substr(md5(gen_random_uuid()::text),1,24),
  "nick" varchar(255) NOT NULL,
  "mail" varchar(255) NOT NULL,
  "site" varchar(255) NOT NULL DEFAULT '',
  "content" text NOT NULL,
  "ip" varchar(255) NOT NULL,
  "pid" varchar(255) NOT NULL DEFAULT '',
  "rid" varchar(255) NOT NULL DEFAULT '',
  "stick" boolean NOT NULL DEFAULT false,
  "status" varchar(10) NOT NULL DEFAULT 'accept',
  "path" varchar(255) NOT NULL,
  "avatar" varchar(255) NOT NULL DEFAULT '',
  "created" int8 NOT NULL,
  "updated" int8 NOT NULL,
  "ua" text NOT NULL,
  PRIMARY KEY (id)
)
;

-- ----------------------------
-- Table structure for d_counter
-- ----------------------------
DROP TABLE IF EXISTS "d_counter";
CREATE TABLE "d_counter" (
  "id" varchar(24) NOT NULL DEFAULT substr(md5(gen_random_uuid()::text),1,24),
  "time" int8 NOT NULL,
  "path" varchar NOT NULL,
  "created" int8 NOT NULL,
  "updated" int8 NOT NULL,
  PRIMARY KEY (id)
)
;
