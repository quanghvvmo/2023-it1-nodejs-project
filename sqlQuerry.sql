-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for vmo_project
CREATE DATABASE IF NOT EXISTS `vmo_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vmo_project`;

-- Dumping structure for table vmo_project.form
CREATE TABLE IF NOT EXISTS `form` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `dueDate` datetime NOT NULL,
  `description` varchar(500) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'OPEN',
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `formCategoryId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `formCategoryId` (`formCategoryId`),
  CONSTRAINT `form_ibfk_1` FOREIGN KEY (`formCategoryId`) REFERENCES `formcategory` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.form: ~0 rows (approximately)
INSERT INTO `form` (`id`, `name`, `dueDate`, `description`, `status`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `formCategoryId`) VALUES
	('88883af0-f5f7-11ed-8787-2bf408461181', 'new form 202223', '2023-11-12 10:00:00', 'okokok', 'open', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', NULL);

-- Dumping structure for table vmo_project.formcategory
CREATE TABLE IF NOT EXISTS `formcategory` (
  `id` varchar(36) NOT NULL,
  `name` varchar(36) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.formcategory: ~2 rows (approximately)
INSERT INTO `formcategory` (`id`, `name`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'PROBATIONARY', 'HOANG', '2023-05-10 01:17:13', NULL, NULL),
	('2', 'ANNUAL', 'HOANG', '2023-05-10 01:17:43', NULL, NULL),
	('3', 'asd', 'asd', '2023-05-10 01:46:01', NULL, NULL);

-- Dumping structure for table vmo_project.formdetail
CREATE TABLE IF NOT EXISTS `formdetail` (
  `id` varchar(36) NOT NULL,
  `task` varchar(500) DEFAULT NULL,
  `rate` varchar(10) NOT NULL,
  `result` varchar(50) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userformId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userformId` (`userformId`),
  CONSTRAINT `formdetail_ibfk_1` FOREIGN KEY (`userformId`) REFERENCES `userform` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.formdetail: ~3 rows (approximately)
INSERT INTO `formdetail` (`id`, `task`, `rate`, `result`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `userformId`) VALUES
	('6ba53af0-f5c0-11ed-9b98-176ddca79ba4', 'oksss', '10/10', 'EXELENT', 'admin', '2023-05-18 21:10:30', NULL, '2023-05-18 21:10:30', '716a8f50-f56e-11ed-8659-2f75b1fd807c'),
	('7e3cba20-f283-11ed-81ba-4718697bb517', 'oksss', '10/10', 'EXELENT', 'admin', '2023-05-14 18:16:49', NULL, '2023-05-14 18:16:49', '5d201c60-f27e-11ed-95c9-fb395223d59a'),
	('b384a640-f5c9-11ed-89ab-3580aeb4c42f', 'oksss', '10/10', 'EXELENT', 'admin', '2023-05-18 22:16:56', NULL, '2023-05-18 22:16:56', '6a1c25c0-f5c7-11ed-ae58-7d5b6e72ef46');

-- Dumping structure for table vmo_project.permission
CREATE TABLE IF NOT EXISTS `permission` (
  `id` varchar(36) NOT NULL,
  `api` varchar(255) NOT NULL,
  `read` tinyint(1) DEFAULT '0',
  `write` tinyint(1) DEFAULT '0',
  `delete` tinyint(1) DEFAULT '0',
  `updatee` tinyint(1) DEFAULT '0',
  `approve` tinyint(1) DEFAULT '0',
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `RoleId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `permission_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.permission: ~45 rows (approximately)
INSERT INTO `permission` (`id`, `api`, `read`, `write`, `delete`, `updatee`, `approve`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `RoleId`) VALUES
	('1', '/users', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:46:50', NULL, NULL, '1'),
	('10', '/user-details', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:21', NULL, NULL, '1'),
	('11', '/forms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:58', NULL, NULL, '1'),
	('12', '/forms/status', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:15', NULL, NULL, '1'),
	('13', '/userforms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:40', NULL, NULL, '1'),
	('14', '/userforms/completed', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:57', NULL, NULL, '1'),
	('15', '/userforms/status', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:49:14', NULL, NULL, '1'),
	('16', '/userforms/details', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:49:30', NULL, NULL, '1'),
	('17', '/userforms/approve', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:56:39', NULL, NULL, '1'),
	('18', '/userforms/approve', 0, 0, 0, 0, 0, 'a', '2023-05-19 07:56:39', NULL, NULL, '2'),
	('19', '/users', 1, 0, 0, 1, 0, 'a', '2023-05-19 07:46:50', NULL, NULL, '3'),
	('2', '/user-details', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:21', NULL, NULL, '2'),
	('20', '/userforms/status', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:49:14', NULL, NULL, '3'),
	('21', '/userforms/details', 1, 1, 1, 1, 0, 'a', '2023-05-19 07:49:30', NULL, NULL, '3'),
	('22', '/userforms/completed', 0, 0, 0, 0, 0, 'a', '2023-05-19 07:48:57', NULL, NULL, '3'),
	('23', '/userforms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:40', NULL, NULL, '3'),
	('24', '/userforms/approve', 0, 0, 0, 0, 1, 'a', '2023-05-19 07:56:39', NULL, NULL, '3'),
	('25', '/user-details', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:21', NULL, NULL, '3'),
	('26', '/forms/status', 1, 0, 0, 0, 0, 'a', '2023-05-19 07:48:15', NULL, NULL, '3'),
	('27', '/forms', 1, 0, 0, 0, 0, 'a', '2023-05-19 07:47:58', NULL, NULL, '3'),
	('28', '/users', 1, 0, 1, 1, 1, 'a', '2023-05-19 07:46:50', NULL, NULL, '4'),
	('29', '/userforms/status', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:49:14', NULL, NULL, '4'),
	('3', '/forms', 1, 0, 0, 0, 0, 'a', '2023-05-19 07:47:58', NULL, NULL, '2'),
	('30', '/userforms/details', 1, 1, 1, 1, 0, 'a', '2023-05-19 07:49:30', NULL, NULL, '4'),
	('31', '/userforms/completed', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:57', NULL, NULL, '4'),
	('32', '/userforms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:40', NULL, NULL, '4'),
	('33', '/userforms/approve', 0, 0, 0, 0, 1, 'a', '2023-05-19 07:56:39', NULL, NULL, '4'),
	('34', '/user-details', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:21', NULL, NULL, '4'),
	('35', '/forms/status', 1, 0, 0, 0, 0, 'a', '2023-05-19 07:48:15', NULL, NULL, '4'),
	('36', '/forms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:58', NULL, NULL, '4'),
	('37', '/users', 1, 0, 0, 1, 1, 'a', '2023-05-19 07:46:50', NULL, NULL, '5'),
	('38', '/userforms/status', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:49:14', NULL, NULL, '5'),
	('39', '/userforms/details', 1, 1, 1, 1, 0, 'a', '2023-05-19 07:49:30', NULL, NULL, '5'),
	('4', '/forms/status', 1, 0, 0, 0, 0, 'a', '2023-05-19 07:48:15', NULL, NULL, '2'),
	('40', '/userforms/completed', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:57', NULL, NULL, '5'),
	('41', '/userforms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:48:40', NULL, NULL, '5'),
	('42', '/userforms/approve', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:56:39', NULL, NULL, '5'),
	('43', '/user-details', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:21', NULL, NULL, '5'),
	('44', '/forms/status', 1, 0, 0, 0, 0, 'a', '2023-05-19 07:48:15', NULL, NULL, '5'),
	('45', '/forms', 1, 1, 1, 1, 1, 'a', '2023-05-19 07:47:58', NULL, NULL, '5'),
	('5', '/userforms', 1, 0, 0, 1, 0, 'a', '2023-05-19 07:48:40', NULL, NULL, '2'),
	('6', '/userforms/completed', 0, 0, 0, 0, 0, 'a', '2023-05-19 07:48:57', NULL, NULL, '2'),
	('7', '/userforms/status', 0, 0, 0, 0, 0, 'a', '2023-05-19 07:49:14', NULL, NULL, '2'),
	('8', '/userforms/details', 1, 1, 1, 1, 0, 'a', '2023-05-19 07:49:30', NULL, NULL, '2'),
	('9', '/users', 1, 0, 0, 1, 0, 'a', '2023-05-19 07:46:50', NULL, NULL, '2');

-- Dumping structure for table vmo_project.role
CREATE TABLE IF NOT EXISTS `role` (
  `id` varchar(36) NOT NULL,
  `name` varchar(36) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.role: ~5 rows (approximately)
INSERT INTO `role` (`id`, `name`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('1', 'ADMIN', 'HOANG', '2023-05-10 01:14:24', NULL, NULL),
	('2', 'EMPLOYEE', 'HOANG', '2023-05-10 04:27:01', NULL, NULL),
	('3', 'MANAGER', 'HOANG', '2023-05-10 04:27:14', NULL, NULL),
	('4', 'DIRECTOR', 'HOANG', '2023-05-10 04:28:32', NULL, NULL),
	('5', 'HR', 'HOANG', '2023-05-10 04:28:15', NULL, NULL);

-- Dumping structure for table vmo_project.sequelizemeta
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Dumping data for table vmo_project.sequelizemeta: ~0 rows (approximately)

-- Dumping structure for table vmo_project.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(36) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(250) NOT NULL,
  `firstName` varchar(250) DEFAULT NULL,
  `lastName` varchar(250) DEFAULT NULL,
  `managerId` varchar(36) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `isActive` int DEFAULT '1',
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.user: ~9 rows (approximately)
INSERT INTO `user` (`id`, `username`, `password`, `firstName`, `lastName`, `managerId`, `email`, `phone`, `avatar`, `address`, `isActive`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`) VALUES
	('929c8d30-f80d-11ed-8ce3-31d1083b723c', 'admin', '$2b$10$hnj4zhUBdNhJqtGplWC/fuNrMeuBbfe25kb65RFTDkv6h46ShieE2', NULL, NULL, '1', 'admin2a@gmail.com', NULL, NULL, NULL, 1, '1', '2023-05-21 19:27:49', NULL, '2023-05-21 19:27:49');

-- Dumping structure for table vmo_project.userform
CREATE TABLE IF NOT EXISTS `userform` (
  `id` varchar(36) NOT NULL,
  `managerComment` varchar(500) DEFAULT NULL,
  `userComment` varchar(500) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  `formId` varchar(36) DEFAULT NULL,
  `managerId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `formId` (`formId`),
  KEY `managerId` (`managerId`),
  CONSTRAINT `userform_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userform_ibfk_2` FOREIGN KEY (`formId`) REFERENCES `form` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userform_ibfk_3` FOREIGN KEY (`managerId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.userform: ~9 rows (approximately)
INSERT INTO `userform` (`id`, `managerComment`, `userComment`, `status`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `userId`, `formId`, `managerId`) VALUES
	('88907850-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '1', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f60-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '187d4d80-f5ee-11ed-acad-f1b6d3fed296', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f61-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '2', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f62-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '3', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f63-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '4', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f64-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '4adb36f0-f5f0-11ed-b31a-e7e6e7f2e8f3', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f65-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', '5', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('88909f66-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', 'bc094bd0-f5f2-11ed-a690-c1146f10e460', '88883af0-f5f7-11ed-8787-2bf408461181', '1'),
	('8890c670-f5f7-11ed-8787-2bf408461181', NULL, NULL, 'new', 'admin', '2023-05-19 03:45:01', 'admin', '2023-05-19 03:45:01', 'e73a6cd0-f5f2-11ed-a690-c1146f10e460', '88883af0-f5f7-11ed-8787-2bf408461181', '1');

-- Dumping structure for table vmo_project.userrole
CREATE TABLE IF NOT EXISTS `userrole` (
  `id` varchar(36) NOT NULL,
  `createdBy` varchar(255) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedBy` varchar(255) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `RoleId` varchar(36) DEFAULT NULL,
  `userId` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `RoleId` (`RoleId`),
  KEY `userId` (`userId`),
  CONSTRAINT `userrole_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userrole_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table vmo_project.userrole: ~13 rows (approximately)
INSERT INTO `userrole` (`id`, `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `RoleId`, `userId`) VALUES
	('92a45560-f80d-11ed-8ce3-31d1083b723c', '1', '2023-05-21 19:27:49', NULL, '2023-05-21 19:27:49', '1', '929c8d30-f80d-11ed-8ce3-31d1083b723c');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
