-- ----------------------------
-- Table structure for d_admin
-- ----------------------------
DROP TABLE IF EXISTS `d_admin`;
CREATE TABLE `d_admin`  (
  `id` varchar(24) NOT NULL,
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `mail` varchar(255) NOT NULL DEFAULT '',
  `domain` varchar(255) NOT NULL DEFAULT '',
  `requestHeaders` varchar(255) NOT NULL DEFAULT '',
  `commentCount` int NOT NULL DEFAULT 6,
  `wordNumber` varchar(255) NOT NULL DEFAULT '0',
  `limit` int NOT NULL DEFAULT 0,
  `limitAll` int NOT NULL DEFAULT 0,
  `akismet` varchar(255) NOT NULL DEFAULT '',
  `avatarCdn` varchar(255) NOT NULL DEFAULT 'https://cravatar.cn/avatar/',
  `siteUrl` varchar(255) NOT NULL DEFAULT '',
  `serverURLs` varchar(255) NOT NULL DEFAULT '',
  `mailHost` varchar(255) NOT NULL DEFAULT '',
  `mailPort` varchar(255) NOT NULL DEFAULT '',
  `mailFrom` varchar(255) NOT NULL DEFAULT '',
  `mailAccept` varchar(255) NOT NULL DEFAULT '',
  `masterSubject` varchar(255) NOT NULL DEFAULT '',
  `masterTemplate` text NOT NULL,
  `replySubject` varchar(255) NOT NULL DEFAULT '',
  `replyTemplate` text NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for d_comment
-- ----------------------------
DROP TABLE IF EXISTS  `d_comment`;
CREATE TABLE `d_comment`  (
  `id` varchar(24) NOT NULL,
  `nick` varchar(255) NOT NULL DEFAULT '',
  `mail` varchar(255) NOT NULL DEFAULT '',
  `site` varchar(255) NOT NULL DEFAULT '',
  `content` text NOT NULL,
  `ip` varchar(255) NOT NULL DEFAULT '',
  `pid` varchar(255) NOT NULL DEFAULT '',
  `rid` varchar(255) NOT NULL DEFAULT '',
  `stick` tinyint(1) NOT NULL DEFAULT 0,
  `status` varchar(10) NOT NULL DEFAULT 'accept',
  `path` varchar(255) NOT NULL DEFAULT '',
  `avatar` varchar(255) NOT NULL DEFAULT '',
  `created` bigint NOT NULL,
  `updated` bigint NOT NULL,
  `ua` text NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for d_counter
-- ----------------------------
DROP TABLE IF EXISTS `d_counter`;
CREATE TABLE `d_counter`  (
  `id` varchar(24) NOT NULL,
  `time` bigint NOT NULL DEFAULT 0,
  `path` varchar(255) NOT NULL DEFAULT '',
  `created` bigint NOT NULL,
  `updated` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

