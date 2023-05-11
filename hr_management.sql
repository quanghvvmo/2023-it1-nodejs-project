-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: hr_management
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `FormCategories`
--

DROP TABLE IF EXISTS `FormCategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FormCategories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` enum('PROBATIONARY','ANNUAL') NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FormCategories`
--

LOCK TABLES `FormCategories` WRITE;
/*!40000 ALTER TABLE `FormCategories` DISABLE KEYS */;
INSERT INTO `FormCategories` VALUES (1,'PROBATIONARY','description','2023-04-14 13:22:37','2023-04-14 13:22:37'),(2,'ANNUAL','description','2023-04-14 13:22:37','2023-04-14 13:22:37');
/*!40000 ALTER TABLE `FormCategories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Forms`
--

DROP TABLE IF EXISTS `Forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Forms` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('open','closed') NOT NULL,
  `dueDate` datetime NOT NULL,
  `createBy` varchar(255) NOT NULL,
  `updateBy` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `FormCategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FormCategoryId` (`FormCategoryId`),
  CONSTRAINT `forms_ibfk_1` FOREIGN KEY (`FormCategoryId`) REFERENCES `FormCategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Forms`
--

LOCK TABLES `Forms` WRITE;
/*!40000 ALTER TABLE `Forms` DISABLE KEYS */;
/*!40000 ALTER TABLE `Forms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RoleModules`
--

DROP TABLE IF EXISTS `RoleModules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RoleModules` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `api` varchar(255) NOT NULL,
  `isCanRead` tinyint(1) NOT NULL,
  `isCanWrite` tinyint(1) NOT NULL,
  `isCanUpdate` tinyint(1) NOT NULL,
  `isCanDelete` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RoleId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `RoleId` (`RoleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RoleModules`
--

LOCK TABLES `RoleModules` WRITE;
/*!40000 ALTER TABLE `RoleModules` DISABLE KEYS */;
INSERT INTO `RoleModules` VALUES ('1','/api/v1/forms',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('10','/api/v1/users',1,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('11','/api/v1/users',1,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('12','/api/v1/users',1,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',2),('13','/api/v1/forms',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('14','/api/v1/user-forms/report-submitted',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('15','/api/v1/user-forms/report-submitted',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('16','/api/v1/user-forms/report-unsubmitted',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('17','/api/v1/user-forms/report-unsubmitted',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('18','/api/v1/user-forms',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('19','/api/v1/user-forms-detail',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('2','/api/v1/user-forms',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('20','/api/v1/user-forms/close',0,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('21','/api/v1/user-forms/report-submitted',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('22','/api/v1/user-forms/report-unsubmitted',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('23','/api/v1/forms',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('24','/api/v1/user-forms/approve',0,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('25','/api/v1/user-forms/close',0,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('26','/api/v1/user-forms',1,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('27','/api/v1/user-forms-detail',0,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',5),('28','/api/v1/user-forms',1,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',5),('29','/api/v1/user-forms-detail',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',2),('3','/api/v1/user-forms-detail',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('30','/api/v1/users/current',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',5),('31','/api/v1/users/current',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('32','/api/v1/users/current',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('33','/api/v1/users/current',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',2),('34','/api/v1/users/current',1,0,0,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('4','/api/v1/users',1,1,1,1,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('5','/api/v1/user-forms/approve',0,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',1),('6','/api/v1/user-forms/close',0,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',3),('7','/api/v1/user-forms/approve',0,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',4),('9','/api/v1/users',1,0,1,0,'2023-04-14 13:22:37','2023-04-14 13:22:37',5);
/*!40000 ALTER TABLE `RoleModules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` enum('ADMIN','DIRECTOR','HR','MANAGER','EMPLOYEE') NOT NULL,
  `description` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'ADMIN','description','2023-04-17 12:34:56','2023-04-17 12:34:56'),(2,'DIRECTOR','description','2023-04-17 12:34:56','2023-04-17 12:34:56'),(3,'HR','description','2023-04-17 12:34:56','2023-04-17 12:34:56'),(4,'MANAGER','description','2023-04-17 12:34:56','2023-04-17 12:34:56'),(5,'EMPLOYEE','description','2023-04-17 12:34:56','2023-04-17 12:34:56');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserFormDetails`
--

DROP TABLE IF EXISTS `UserFormDetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserFormDetails` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `selfRating` varchar(255) DEFAULT NULL,
  `achievements` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `others` varchar(255) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserFormId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserFormId` (`UserFormId`),
  CONSTRAINT `userformdetails_ibfk_1` FOREIGN KEY (`UserFormId`) REFERENCES `UserForms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserFormDetails`
--

LOCK TABLES `UserFormDetails` WRITE;
/*!40000 ALTER TABLE `UserFormDetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserFormDetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserForms`
--

DROP TABLE IF EXISTS `UserForms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserForms` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `managerComment` varchar(255) DEFAULT NULL,
  `userComment` varchar(255) DEFAULT NULL,
  `status` enum('new','submitted','approved','closed') NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `FormId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `ManagerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FormId` (`FormId`),
  KEY `UserId` (`UserId`),
  KEY `ManagerId` (`ManagerId`),
  CONSTRAINT `userforms_ibfk_1` FOREIGN KEY (`FormId`) REFERENCES `Forms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userforms_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userforms_ibfk_3` FOREIGN KEY (`ManagerId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserForms`
--

LOCK TABLES `UserForms` WRITE;
/*!40000 ALTER TABLE `UserForms` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserForms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserRole`
--

DROP TABLE IF EXISTS `UserRole`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRole` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `RoleId` int NOT NULL,
  `UserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`RoleId`,`UserId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `userrole_ibfk_1` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userrole_ibfk_2` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserRole`
--

LOCK TABLES `UserRole` WRITE;
/*!40000 ALTER TABLE `UserRole` DISABLE KEYS */;
INSERT INTO `UserRole` VALUES ('2023-04-26 11:08:42','2023-04-26 11:08:42',1,'1bc39c0f-0261-49bc-b2f5-842982856e88'),('2023-04-26 14:12:19','2023-04-26 14:12:19',2,'b61f4637-80f9-4801-aca7-a7dee2ce6b47'),('2023-05-11 08:57:07','2023-05-11 08:57:07',3,'a9f9a941-3b6a-4e96-9151-da10cfe9d8df'),('2023-05-11 08:58:39','2023-05-11 08:58:39',4,'846cb8d6-7b24-45fa-8611-978c2267603d'),('2023-05-11 08:58:54','2023-05-11 08:58:54',5,'45ed343b-3a71-498f-918c-8bf9333f3328');
/*!40000 ALTER TABLE `UserRole` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `employeeId` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `CMND` int DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `ManagerId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `employeeId` (`employeeId`),
  UNIQUE KEY `CMND` (`CMND`),
  KEY `ManagerId` (`ManagerId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`ManagerId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('1bc39c0f-0261-49bc-b2f5-842982856e88','imadmin','$2b$10$k5QJK9vI/wfbjMv0QrdIk.Zux3Uyqp0gpfMehH2wwCHcGwWzEk2K2','ID000000','first','last','nguyenvanminhvu@gmail.com',NULL,NULL,NULL,0,'2023-04-26 11:08:42','2023-04-26 11:08:42',NULL,NULL),('45ed343b-3a71-498f-918c-8bf9333f3328','imemployee','$2b$10$OD2xjYxvTCQXIRVdD2I24um/F8RUAx5fWxiHdhs4EFLBkb1CUYA8W','ID000004','first','last','employee@gmail.com',NULL,NULL,NULL,0,'2023-05-11 08:58:54','2023-05-11 08:58:54','846cb8d6-7b24-45fa-8611-978c2267603d',NULL),('846cb8d6-7b24-45fa-8611-978c2267603d','immanager','$2b$10$L1A983wGwpe9QCbmmesBrOwVCMt.a5ZLQqt4V.b.NrU5nZ8ZDjMuK','ID000003','first','last','manager@gmail.com',NULL,NULL,NULL,0,'2023-05-11 08:58:39','2023-05-11 08:58:39','b61f4637-80f9-4801-aca7-a7dee2ce6b47',NULL),('a9f9a941-3b6a-4e96-9151-da10cfe9d8df','imhr','$2b$10$I8wWQCG/wJ0oWrDLbvoA.eUGd6Psqm.c2loJYc2Ib4YbMRHUhb0Sm','ID000002','first','last','hr@gmail.com',NULL,NULL,NULL,0,'2023-05-11 08:57:07','2023-05-11 08:57:07','b61f4637-80f9-4801-aca7-a7dee2ce6b47',NULL),('b61f4637-80f9-4801-aca7-a7dee2ce6b47','imdirector','$2b$10$2xKa/RZpgTtAySTMyvciWOQtUGigCRBffZhdkjsbzwAFILyMEsU8a','ID000001','new first namefad','new lastname','langlecanteam@gmail.com',NULL,NULL,NULL,0,'2023-04-26 14:12:19','2023-05-10 14:32:49','1bc39c0f-0261-49bc-b2f5-842982856e88',NULL);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-11 18:32:32
