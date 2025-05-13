CREATE TABLE IF NOT EXISTS `board` (
    `board_x` smallint(5) unsigned NOT NULL,
    `board_y` smallint(5) unsigned NOT NULL,
    `board_player` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`board_x`, `board_y`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;