-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: tollan
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `dado`
--

DROP TABLE IF EXISTS `dado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dado` (
  `ID_Dado` int NOT NULL AUTO_INCREMENT,
  `Dado` varchar(3) NOT NULL,
  PRIMARY KEY (`ID_Dado`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dado`
--

LOCK TABLES `dado` WRITE;
/*!40000 ALTER TABLE `dado` DISABLE KEYS */;
INSERT INTO `dado` VALUES (1,'D4'),(2,'D6'),(3,'D8'),(4,'D10'),(5,'D12'),(6,'D20'),(7,'DP');
/*!40000 ALTER TABLE `dado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dado_sistema`
--

DROP TABLE IF EXISTS `dado_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dado_sistema` (
  `ID_Sistema` int NOT NULL,
  `ID_Dado` int NOT NULL,
  PRIMARY KEY (`ID_Sistema`,`ID_Dado`),
  KEY `ID_DADO` (`ID_Dado`),
  KEY `ID_SISTEMA` (`ID_Sistema`),
  CONSTRAINT `dados_sistema_ibfk_1` FOREIGN KEY (`ID_Dado`) REFERENCES `dado` (`ID_Dado`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dados_sistema_ibfk_2` FOREIGN KEY (`ID_Sistema`) REFERENCES `sistema` (`ID_Sistema`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dado_sistema`
--

LOCK TABLES `dado_sistema` WRITE;
/*!40000 ALTER TABLE `dado_sistema` DISABLE KEYS */;
INSERT INTO `dado_sistema` VALUES (3,1),(4,1),(7,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(3,3),(4,3),(6,3),(7,3),(1,4),(2,4),(3,4),(4,4),(6,4),(7,4),(10,4),(3,5),(4,5),(7,5),(3,6),(4,6),(7,6),(1,7);
/*!40000 ALTER TABLE `dado_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dm`
--

DROP TABLE IF EXISTS `dm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dm` (
  `ID_DM` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  `Fecha_Nac` date NOT NULL,
  `Fecha_Alt` date NOT NULL,
  PRIMARY KEY (`ID_DM`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dm`
--

LOCK TABLES `dm` WRITE;
/*!40000 ALTER TABLE `dm` DISABLE KEYS */;
INSERT INTO `dm` VALUES (1,'Roberto','1995-01-15','2015-01-15'),(2,'Antonio','2000-08-21','2015-10-20'),(3,'María Fernanda','1998-06-30','2018-06-30'),(4,'Juan Alberto','2004-05-21','2023-03-20'),(5,'Enrique','2002-02-28','2024-09-21'),(6,'Julio César','2010-03-19','2025-08-16'),(7,'Valeria','2011-07-12','2025-09-13'),(8,'Diego','2009-11-03','2025-09-13'),(10,'Jose Antonio','2004-06-15','2025-09-13'),(11,'Antolino','2009-03-10','2025-09-16'),(12,'Luciano','2001-06-12','2025-10-27');
/*!40000 ALTER TABLE `dm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genero`
--

DROP TABLE IF EXISTS `genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genero` (
  `ID_Genero` int NOT NULL AUTO_INCREMENT,
  `Genero` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Genero`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genero`
--

LOCK TABLES `genero` WRITE;
/*!40000 ALTER TABLE `genero` DISABLE KEYS */;
INSERT INTO `genero` VALUES (1,'Apocalíptico'),(2,'Aventura'),(3,'Ciencia Ficción'),(4,'Comedia'),(5,'Cyberpunk'),(6,'Drama'),(7,'Estrategico'),(8,'Fantasía Épica'),(9,'Histórico'),(10,'Horror Cósmico'),(11,'Humor'),(12,'Mixto'),(13,'Mitología'),(14,'Misterio'),(15,'Noir'),(16,'Policíaco'),(17,'Postapocalíptico'),(18,'Rol'),(19,'Steampunk'),(20,'Superhéroes'),(21,'Survival Horror'),(22,'Terror'),(23,'Thriller'),(24,'Ucronía'),(25,'Western');
/*!40000 ALTER TABLE `genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genero_sistema`
--

DROP TABLE IF EXISTS `genero_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genero_sistema` (
  `ID_Sistema` int NOT NULL,
  `ID_Genero` int NOT NULL,
  PRIMARY KEY (`ID_Sistema`,`ID_Genero`),
  KEY `fk_sistema_has_genero_genero1_idx` (`ID_Genero`),
  KEY `fk_sistema_has_genero_sistema1_idx` (`ID_Sistema`),
  CONSTRAINT `fk_sistema_has_genero_genero1` FOREIGN KEY (`ID_Genero`) REFERENCES `genero` (`ID_Genero`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sistema_has_genero_sistema1` FOREIGN KEY (`ID_Sistema`) REFERENCES `sistema` (`ID_Sistema`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genero_sistema`
--

LOCK TABLES `genero_sistema` WRITE;
/*!40000 ALTER TABLE `genero_sistema` DISABLE KEYS */;
INSERT INTO `genero_sistema` VALUES (3,2),(4,2),(6,2),(7,2),(2,3),(8,3),(5,4),(8,4),(9,4),(2,5),(5,6),(9,6),(10,6),(6,7),(7,7),(3,8),(4,8),(6,8),(7,8),(1,10),(10,10),(5,11),(8,11),(3,13),(4,13),(7,13),(1,14),(10,14),(2,15),(5,15),(10,15),(1,16),(10,16),(2,17),(3,18),(4,18),(7,18),(1,22),(3,22),(6,22),(10,22),(1,23),(2,23),(8,23),(9,23);
/*!40000 ALTER TABLE `genero_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoja_personaje`
--

DROP TABLE IF EXISTS `hoja_personaje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoja_personaje` (
  `ID_Hoja` int NOT NULL AUTO_INCREMENT,
  `ID_Sistema` int NOT NULL,
  `Hoja` blob NOT NULL,
  PRIMARY KEY (`ID_Hoja`),
  KEY `fk_hoja_personaje_sistema1_idx` (`ID_Sistema`),
  CONSTRAINT `fk_hoja_personaje_sistema1` FOREIGN KEY (`ID_Sistema`) REFERENCES `sistema` (`ID_Sistema`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoja_personaje`
--

LOCK TABLES `hoja_personaje` WRITE;
/*!40000 ALTER TABLE `hoja_personaje` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoja_personaje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partida`
--

DROP TABLE IF EXISTS `partida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partida` (
  `ID_Partida` int NOT NULL AUTO_INCREMENT,
  `ID_Usuarios` int NOT NULL,
  `ID_Sistema` int NOT NULL,
  `ID_DM` int NOT NULL,
  `Titulo` varchar(100) NOT NULL,
  `Fecha_Inic` date NOT NULL,
  `Fecha_Fin` datetime DEFAULT NULL,
  `Horario` time NOT NULL,
  `Periocidad` enum('Semanal','Quincenal','One_Shot') NOT NULL,
  `Estado` enum('Pausada','Cancelada') DEFAULT NULL,
  `No_Jugadores` int NOT NULL,
  PRIMARY KEY (`ID_Partida`),
  KEY `fk_partida_dm1_idx` (`ID_DM`),
  KEY `fk_partida_sistema1_idx` (`ID_Sistema`),
  KEY `fk_partida_usuarios1_idx` (`ID_Usuarios`),
  CONSTRAINT `fk_partida_dm1` FOREIGN KEY (`ID_DM`) REFERENCES `dm` (`ID_DM`),
  CONSTRAINT `fk_partida_sistema1` FOREIGN KEY (`ID_Sistema`) REFERENCES `sistema` (`ID_Sistema`),
  CONSTRAINT `fk_partida_usuarios1` FOREIGN KEY (`ID_Usuarios`) REFERENCES `usuarios` (`ID_Usuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partida`
--

LOCK TABLES `partida` WRITE;
/*!40000 ALTER TABLE `partida` DISABLE KEYS */;
INSERT INTO `partida` VALUES (1,2,4,1,'Dragon Heist','2025-02-11','2025-03-11 19:00:00','17:00:00','Semanal',NULL,8),(2,2,1,3,'Watson','2025-06-12','2025-09-16 00:49:57','17:00:00','Quincenal',NULL,6),(3,2,10,5,'Sombras de Valladolid','2025-07-09','2025-10-12 09:54:31','17:00:00','Semanal',NULL,7),(4,2,6,6,'Maze the Mino','2025-08-16','2025-08-16 18:00:00','16:00:00','One_Shot',NULL,5),(5,2,2,4,'Neon Dust','2025-08-30','2025-08-30 20:00:00','18:00:00','One_Shot',NULL,4),(6,2,7,2,'Senderos de Golarion','2025-09-01',NULL,'18:00:00','Semanal','Pausada',6),(7,2,5,7,'Secretos del Internado','2025-09-13','2025-10-12 09:54:16','17:30:00','Semanal','Cancelada',5),(8,2,9,8,'Amores Prohibidos','2025-09-20','2025-10-27 00:53:59','19:00:00','Quincenal',NULL,6),(9,2,5,7,'Fiasgo en el Crucero','2025-09-16','2025-09-16 00:50:14','12:00:00','Semanal','Cancelada',6),(10,2,1,4,'Horro en el Muelle','2025-09-19',NULL,'11:00:00','Quincenal',NULL,4),(12,2,2,8,'Correr o morir','2025-09-15','2025-09-16 00:37:12','17:47:00','One_Shot','Cancelada',4),(13,2,5,11,'Coopera y encuentra al asesino','2025-09-16',NULL,'14:00:00','Semanal',NULL,4),(14,2,7,1,'Caballeros al ataque','2025-09-18',NULL,'11:00:00','One_Shot',NULL,4),(21,2,8,2,'Jarwolin','2025-10-31',NULL,'12:00:00','Quincenal','Pausada',10),(23,2,6,11,'Prueba','2025-10-27','2025-10-27 00:53:32','11:00:00','Semanal','Cancelada',6),(24,2,1,12,'Prueba2','2025-10-30',NULL,'18:00:00','Quincenal',NULL,4);
/*!40000 ALTER TABLE `partida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistema`
--

DROP TABLE IF EXISTS `sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistema` (
  `ID_Sistema` int NOT NULL AUTO_INCREMENT,
  `ID_Tipo` int NOT NULL,
  `Titulo` varchar(100) NOT NULL,
  `Descripcion` text NOT NULL,
  `Clasificacion` enum('MATURE','EVERYONE','TEENS') NOT NULL,
  `Estado` enum('ACTIVO','INACTIVO') NOT NULL,
  PRIMARY KEY (`ID_Sistema`),
  KEY `fk_sistema_tipo1_idx` (`ID_Tipo`),
  CONSTRAINT `fk_sistema_tipo1` FOREIGN KEY (`ID_Tipo`) REFERENCES `tipo` (`ID_Tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistema`
--

LOCK TABLES `sistema` WRITE;
/*!40000 ALTER TABLE `sistema` DISABLE KEYS */;
INSERT INTO `sistema` VALUES (1,5,'Call of Cthulhu','Juego de horror e investigación basado en la obra de H.P. Lovecraft, centrado en la locura y lo desconocido','MATURE','ACTIVO'),(2,5,'Cyberpunk RED','Basado en Blade Runner y obras homónimas, nunca hay finales felices en Night_City','MATURE','ACTIVO'),(3,6,'Dungeons & Dragons 3.5e','Versión de Dungeons and Dragons con temática oscura y compleja','MATURE','ACTIVO'),(4,6,'Dungeons & Dragons 5e','Versión de Dungeons and Dragons con temática de fantasía épica','TEENS','ACTIVO'),(5,2,'Fiasco','Juego narrativo cooperativo inspirado en películas de crimen que salen mal','TEENS','ACTIVO'),(6,3,'Gloomhaven','Juego de campaña cooperativo con combate táctico y gestión de recursos','TEENS','ACTIVO'),(7,4,'Pathfinder','Fantasía épica con toques personalizables y dificultad estratégica','TEENS','ACTIVO'),(8,1,'Paranoia','Juego de rol satírico y competitivo en un futuro distópico controlado por una IA','TEENS','ACTIVO'),(9,5,'Pasión de las Pasiones','Vive tu propia telenovela','TEENS','ACTIVO'),(10,5,'Vampiro La Mascarada','Un mundo controlado por lo seres de la noche, sobreviviendo a los VIVOS','MATURE','ACTIVO');
/*!40000 ALTER TABLE `sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo`
--

DROP TABLE IF EXISTS `tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo` (
  `ID_Tipo` int NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Tipo`),
  UNIQUE KEY `Genero_UNIQUE` (`Tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo`
--

LOCK TABLES `tipo` WRITE;
/*!40000 ALTER TABLE `tipo` DISABLE KEYS */;
INSERT INTO `tipo` VALUES (1,'Competitivo'),(2,'Cooperativo'),(3,'Estratégico'),(4,'Mixto'),(5,'Narrativo'),(6,'Rol');
/*!40000 ALTER TABLE `tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `ID_Usuarios` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(150) NOT NULL,
  `Correo` varchar(150) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Fecha_Alt` date NOT NULL,
  `Tipo_Usr` enum('Adm','Mod','Usr') NOT NULL DEFAULT 'Usr',
  PRIMARY KEY (`ID_Usuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','soporte@tollanlef.com','$2y$10$k84A7PCKXLUjpovdle7Wbee1k72TVFiSO/ODxmOWegGFlx4IpSFxC','2025-10-28','Adm'),(2,'Moder','soporte_mod@tollanlef.com','$2y$10$Tic94Kc1adI.om6uOIoj6e1Ny6bCMAYEAJojC.Ovmt25TV1exj0rG','2025-10-28','Mod'),(3,'Luis','20luiswolf04@gmail.com','$2y$10$JzCFxAo8gUkk2IUUrzmlQeYcPTlFSYQxY5sChHfDGfzH/Z4ePs5IC','2025-10-28','Usr'),(4,'Juan','juanito@gmail.com','$2y$10$P2dt0HBAsUUn5/IiZhpOseQqhYnNDocsZF8TKurJT2orKLc40tYau','2025-10-29','Usr'),(10,'Luis','20luiswolves04@gmail.com','$2y$10$nnU1GPWg7io9/i43JETSKuPqJTlfh.7u2Wk9UwIhUDDrPcT432Uhi','2025-10-29','Usr'),(11,'Pedro','pedro_camacho@gmail.com','$2y$10$dApslMQuCOXp5ipFNvCZmewi/GOzIAUZhlSnshXEJXW.8sCFnZZpa','2025-11-02','Usr'),(13,'Alex','alex@gmail.com','$2y$10$KivTwcK/xzgCeZui/Bi5Y.jcpkSEkOOHXIqy0UHi.ASrXdnit3FVe','2025-11-02','Usr'),(14,'JuanDArc0144','chatabeto@gmail.com','$2y$10$f.imBRPFs/6ACRvs/G7OtOEFo8QLWOw0.hisg7hFOjaeApn2YwnNG','2025-11-10','Usr'),(15,'Juan Alberto','juan44@gmail.com','$2y$10$Z7Cff9rYqd8Xoz1LRv.14eWSwDAzjdlcuCJ0J27j9u3r2qDOT1GAK','2025-11-17','Usr');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-04  9:15:48
