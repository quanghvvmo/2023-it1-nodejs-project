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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

-- Dumping structure for table vmo_project.sequelizemeta
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

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

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
