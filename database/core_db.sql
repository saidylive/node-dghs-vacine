DROP TABLE IF EXISTS `district_doses`;
CREATE TABLE `district_doses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `district_id` int(11) NOT NULL,
  `district_name` varchar(191) DEFAULT NULL,
  `male` int(11) NOT NULL,
  `female` int(11) NOT NULL,
  `total` int(11) DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date_district_id` (`date`,`district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `district_aefi`;
CREATE TABLE `district_aefi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `district_id` int(11) NOT NULL,
  `district_name` varchar(191) DEFAULT NULL,
  `aefi` int(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT current_timestamp(),
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date_district_id` (`date`,`district_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
