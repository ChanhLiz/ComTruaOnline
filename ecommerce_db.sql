-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_db
-- ------------------------------------------------------
-- Server version	8.0.46

use ecommerce_db;

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
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_cart_product` (`cart_id`,`product_id`),
  KEY `fk_cartitem_product` (`product_id`),
  CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Món chính'),(2,'Nước');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderdetail_order` (`order_id`),
  KEY `fk_orderdetail_product` (`product_id`),
  CONSTRAINT `fk_orderdetail_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orderdetail_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,1,1,2,39000.00),(2,1,2,1,39000.00),(3,2,6,1,39000.00),(4,3,1,1,39000.00),(5,3,6,1,39000.00),(6,3,7,1,39000.00),(7,3,8,1,39000.00),(8,4,22,1,39000.00),(9,5,1,1,39000.00),(10,6,6,1,39000.00),(11,7,2,1,39000.00),(12,7,3,1,39000.00),(13,7,1,1,39000.00),(14,7,4,1,39000.00),(15,7,5,1,39000.00),(16,7,20,2,39000.00),(17,8,6,2,39000.00),(18,8,1,1,39000.00),(19,9,6,1,39000.00),(20,9,7,2,39000.00),(21,9,1,1,39000.00),(22,9,10,1,39000.00),(23,10,12,1,39000.00),(24,10,13,1,39000.00),(25,11,1,1,39000.00),(26,11,2,1,39000.00),(27,11,3,1,39000.00),(28,12,3,1,39000.00),(29,13,11,1,39000.00),(30,14,12,1,39000.00),(31,15,12,1,39000.00),(32,16,11,1,39000.00),(33,17,11,1,39000.00),(34,18,11,1,39000.00),(35,19,11,1,39000.00),(36,20,11,1,39000.00),(37,21,11,1,39000.00),(38,22,11,1,39000.00),(39,23,11,1,39000.00),(40,24,11,1,39000.00),(41,25,12,1,39000.00),(42,26,12,1,39000.00),(43,27,12,1,39000.00),(44,28,12,1,39000.00),(45,29,12,1,39000.00),(46,30,12,1,39000.00),(47,31,12,1,39000.00),(48,32,12,1,39000.00),(49,33,11,1,39000.00),(50,34,11,1,39000.00),(51,35,11,1,39000.00),(52,36,12,1,39000.00),(53,37,11,1,39000.00),(54,38,12,1,39000.00),(55,39,11,1,39000.00),(56,40,12,1,39000.00),(57,41,11,1,39000.00),(58,42,11,1,39000.00),(59,43,11,1,39000.00),(60,44,11,1,39000.00),(61,45,22,1,39000.00),(62,46,11,1,39000.00),(63,47,22,1,39000.00),(64,48,1,1,34000.00),(65,49,1,1,40000.00),(66,50,1,3,40000.00),(67,51,1,1,40000.00),(68,52,3,3,36000.00),(69,53,15,1,25500.00),(70,54,15,1,25500.00),(71,55,15,1,25500.00),(72,56,15,4,25500.00),(73,57,15,1,25500.00),(74,58,15,2,25500.00),(75,59,3,1,36000.00),(76,59,2,1,32000.00),(77,60,1,1,40000.00),(78,61,8,1,39000.00),(79,62,3,3,36000.00),(80,62,8,1,39000.00),(81,62,49,1,15000.00),(82,63,3,2,36000.00),(83,64,8,1,39000.00),(84,64,11,1,39000.00),(85,65,11,1,39000.00),(86,66,14,10,39000.00),(87,66,15,6,25500.00),(88,66,48,5,20000.00),(89,66,12,5,39000.00),(90,66,11,4,39000.00),(91,66,8,2,39000.00);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `receiver_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('cod','bank_transfer','momo','zalopay','payment_gateway') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','waiting_payment','confirmed','shipping','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'waiting_payment',
  `total_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `shipping_fee` decimal(10,2) DEFAULT '0.00',
  `delivery_time` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'Nguyen Van A','0900000000','Binh Thanh, HCM','cod','confirmed',117000.00,'2026-06-22 06:41:58',0.00,NULL),(2,3,'kh1','0866487956','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',39000.00,'2026-06-23 10:10:33',0.00,NULL),(3,3,'kh1','0866487956','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',156000.00,'2026-06-23 10:12:45',0.00,NULL),(4,3,'kh1','0866487956','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',39000.00,'2026-06-23 12:00:08',0.00,NULL),(5,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',39000.00,'2026-06-23 12:01:14',0.00,NULL),(6,3,'kh1','0866487956','Đường AA, Bình Thạnh','cod','confirmed',39000.00,'2026-06-23 12:04:11',0.00,NULL),(7,3,'kh1','0866487956','Đường AA, Bình Thạnh','cod','confirmed',273000.00,'2026-06-23 12:41:37',0.00,NULL),(8,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',117000.00,'2026-06-23 14:38:17',0.00,NULL),(9,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',195000.00,'2026-06-23 14:40:32',0.00,NULL),(10,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',78000.00,'2026-06-24 03:49:14',0.00,NULL),(11,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',117000.00,'2026-06-24 03:49:30',0.00,NULL),(12,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',39000.00,'2026-06-24 03:49:37',0.00,NULL),(13,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',39000.00,'2026-06-24 03:51:34',0.00,NULL),(14,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 04:00:46',0.00,NULL),(15,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','momo','pending',39000.00,'2026-06-24 07:17:15',0.00,NULL),(16,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','bank_transfer','confirmed',39000.00,'2026-06-24 07:48:50',0.00,NULL),(17,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 08:04:23',0.00,NULL),(18,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:04:35',0.00,NULL),(19,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:04:50',0.00,NULL),(20,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:04:51',0.00,NULL),(21,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:04:51',0.00,NULL),(22,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:04:53',0.00,NULL),(23,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:04:59',0.00,NULL),(24,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','momo','waiting_payment',39000.00,'2026-06-24 08:05:04',0.00,NULL),(25,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:51',0.00,NULL),(26,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:53',0.00,NULL),(27,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:55',0.00,NULL),(28,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:55',0.00,NULL),(29,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:55',0.00,NULL),(30,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:56',0.00,NULL),(31,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:56',0.00,NULL),(32,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:06:57',0.00,NULL),(33,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:12:36',0.00,NULL),(34,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','waiting_payment',39000.00,'2026-06-24 08:26:35',0.00,NULL),(35,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 08:28:14',0.00,NULL),(36,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 08:51:52',0.00,NULL),(37,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','payment_gateway','waiting_payment',39000.00,'2026-06-24 08:53:01',0.00,NULL),(38,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','bank_transfer','confirmed',39000.00,'2026-06-24 08:56:05',0.00,NULL),(39,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 11:15:35',0.00,NULL),(40,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 11:16:58',0.00,NULL),(41,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 13:02:38',0.00,NULL),(42,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 13:08:48',0.00,NULL),(43,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-24 14:32:47',0.00,NULL),(44,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','zalopay','waiting_payment',39000.00,'2026-06-24 15:24:26',0.00,NULL),(45,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','pending',39000.00,'2026-06-25 07:27:58',0.00,NULL),(46,4,'kh2','0866487956','gggg','cod','pending',39000.00,'2026-06-25 09:46:58',0.00,NULL),(47,5,'trlin','0365691242','133 ngo tat to p22 binh thanh','cod','pending',39000.00,'2026-06-25 10:55:51',0.00,NULL),(48,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',34000.00,'2026-06-25 16:11:57',0.00,NULL),(49,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',40000.00,'2026-06-25 16:30:04',0.00,NULL),(50,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','bank_transfer','confirmed',120000.00,'2026-06-25 16:31:04',0.00,NULL),(51,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',40000.00,'2026-06-25 16:31:55',0.00,NULL),(52,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',108000.00,'2026-06-26 03:00:59',0.00,NULL),(53,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',25500.00,'2026-06-26 03:09:10',0.00,NULL),(54,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',25500.00,'2026-06-26 03:30:58',0.00,NULL),(55,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','confirmed',25500.00,'2026-06-26 03:33:34',0.00,NULL),(56,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','bank_transfer','confirmed',102000.00,'2026-06-26 03:33:49',0.00,NULL),(57,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','cod','confirmed',25500.00,'2026-06-26 09:13:03',0.00,NULL),(58,4,'kh2','0866487956','gggg','cod','confirmed',51000.00,'2026-06-26 09:13:20',0.00,NULL),(59,8,'Dumamay','0355555555','Thanh Hoa','bank_transfer','confirmed',68000.00,'2026-06-26 12:52:00',0.00,NULL),(60,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','momo','waiting_payment',40000.00,'2026-06-26 13:48:06',0.00,NULL),(61,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','bank_transfer','confirmed',54000.00,'2026-06-28 11:55:24',15000.00,'10:30-11:30'),(62,3,'kh1','0866487956','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','zalopay','waiting_payment',162000.00,'2026-06-28 11:56:02',0.00,'10:30-11:30'),(63,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','cod','cancelled',87000.00,'2026-06-28 12:07:48',15000.00,'10:30-11:30'),(64,11,'Abc','0912345678','D2 võ oanh, quận bình thạnh','cod','cancelled',93000.00,'2026-07-01 07:51:51',15000.00,'10:30-11:30'),(65,2,'CHIP','0365692241','Đường D3 Võ Oanh, Bình Thạnh','bank_transfer','cancelled',54000.00,'2026-07-01 08:44:41',15000.00,'10:30-11:30'),(66,12,'Chánh gay','0860487887','ĐỘNG WIBU','momo','waiting_payment',1072000.00,'2026-07-01 09:47:56',0.00,'10:30-11:30');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `promotion_id` int DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `old_price` decimal(10,2) DEFAULT NULL,
  `new_price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `thumbnail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `discount_percent` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  KEY `fk_product_promotion` (`promotion_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_product_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'Tôm Ram Thịt','Tôm Ram Thịt',40000.00,40000.00,10,'https://www.unuquan.com/img_data/images/U NU QUAN TOM RIM THIT.jpg','2026-06-20 13:46:29',0),(2,1,1,'Bún Riêu Cua','Bún Riêu Cua',40000.00,32000.00,22,'https://www.unuquan.com/img_data/images/UNU QUAN BUN RIEU CUA.jpg','2026-06-20 13:46:29',20),(3,1,1,'Heo Kho Mắm Ruốc','Heo Kho Mắm Ruốc',40000.00,36000.00,10,'https://www.unuquan.com/img_data/images/UNU QUAN HEO KHO MAM RUOC.jpg','2026-06-20 13:46:29',10),(4,1,1,'Sườn Non Ram Mặn Ngọt','Sườn Non Ram Mặn Ngọt',20000.00,18000.00,100,'https://www.unuquan.com/img_data/images/U NU QUAN SUON NON RAM MAN NGOT.jpg','2026-06-20 13:46:29',10),(5,1,1,'Đùi Gà Chiên Xốc Mắm','Đùi Gà Chiên Xốc Mắm',30000.00,27000.00,10,'https://www.unuquan.com/img_data/images/U NU QUAN DUI GA CHIEN XOC MAM.jpg','2026-06-20 13:46:29',10),(6,1,1,'Trứng Chiên Thịt Bằm','Trứng Chiên Thịt Bằm',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/UNU QUAN TRUNG CHIEN THIT BAM.jpg','2026-06-20 13:46:29',0),(7,1,1,'Đậu Hủ Nhồi Thịt Sốt Cà','Đậu Hủ Nhồi Thịt Sốt Cà',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/UNU QUAN DAU HU NHOI THIT SOT CA.jpg','2026-06-20 13:46:29',0),(8,1,1,'Đậu Ve Xào Thịt','Đậu Ve Xào Thịt',39000.00,39000.00,98,'https://www.unuquan.com/img_data/images/UNU QUAN DAU VE XAO THIT.jpg','2026-06-20 13:46:29',0),(9,1,1,'Gà Kho Sả Ớt','Gà Kho Sả Ớt',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/UNU QUAN GA KHO SA OT.jpg','2026-06-20 13:46:29',0),(10,1,1,'Canh Gà Nấu Lá Giang','Canh Gà Nấu Lá Giang',20000.00,20000.00,100,'https://www.unuquan.com/img_data/images/U NU QUAN CANH GA NAU LA GIANG.jpg','2026-06-20 13:46:29',0),(11,1,1,'Cá Nục Chiên Xốc Mắm','Cá Nục Chiên Xốc Mắm',39000.00,39000.00,99,'https://www.unuquan.com/img_data/images/U NU QUAN CÁ NUC CHIEN XOC MAM.jpg','2026-06-20 13:46:29',0),(12,1,1,'Cá Cơm Kho Tiêu','Cá Cơm Kho Tiêu',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/ca com kho tieu.jpg','2026-06-20 13:46:29',0),(13,1,1,'LÒNG GÀ XÀO MƯỚP','LÒNG GÀ XÀO MƯỚP',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG LONG GA XAO MUOP.jpg','2026-06-20 13:46:29',0),(14,1,1,'MÌ XÀO BÒ','MÌ XÀO BÒ',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG MI XAO BO-jpg.jpg','2026-06-20 13:46:29',0),(15,1,1,'HEO KHO SẢ ỚT','HEO KHO SẢ ỚT',30000.00,25500.00,5,'https://www.unuquan.com/img_data/images/COM VAN PHONG HEO KHO SẢ ỚT.jpg','2026-06-20 13:46:29',15),(16,1,1,'ĐẬU RỒNG XÀO THỊT','ĐẬU RỒNG XÀO THỊT',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG DAU RONG XAO THIT.jpg','2026-06-20 13:46:29',0),(17,1,1,'GÀ RANG LÁ CHANH','GÀ RANG LÁ CHANH',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG GA RANG LA CHANH (1).jpg','2026-06-20 13:46:29',0),(18,1,1,'GÀ KHO LÁ GIANG','GÀ KHO LÁ GIANG',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG GA KHO LA GIANG.jpg','2026-06-20 13:46:29',0),(19,1,1,'CÁ RÔ KHO TIÊU','CÁ RÔ KHO TIÊU',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG CA RO KHO TO.jpg','2026-06-20 13:46:29',0),(20,1,1,'CÁ MÓ CHIÊN SẢ','CÁ MÓ CHIÊN SẢ',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG CA MO CHIEN SA.jpg','2026-06-20 13:46:29',0),(21,1,1,'CÁ LÓC KHO TIÊU','CÁ LÓC KHO TIÊU',40000.00,34000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG CA LOC KHO TIEU.jpg','2026-06-20 13:46:29',15),(22,1,1,'CÁ BASA KHO TIÊU','CÁ BASA KHO TIÊU',40000.00,40000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG CA BASA KHO TIEU.jpg','2026-06-20 13:46:29',0),(23,1,1,'THỊT HEO KHO MĂNG','THỊT HEO KHO MĂNG',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG HEO KHO MANG.jpg','2026-06-20 13:46:29',0),(24,1,1,'BÁNH CANH TÔM THỊT','BÁNH CANH TÔM THỊT',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM VAN PHONG BANH CANH TOM THIT-JPG.jpg','2026-06-20 13:46:29',0),(25,1,1,'HEO XÀO MĂNG','HEO XÀO MĂNG',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong thit heo xao mang.jpg','2026-06-20 13:46:29',0),(26,1,1,'SƯỜN NON KHO ĐẬU HỦ','SƯỜN NON KHO ĐẬU HỦ',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong suon non kho dau hu.png','2026-06-20 13:46:29',0),(27,1,1,'ỐC XÀO SẢ ỚT','ỐC XÀO SẢ ỚT',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong oc xao sa ot.jpg','2026-06-20 13:46:29',0),(28,1,1,'MẮM CHƯNG THỊT','MẮM CHƯNG THỊT',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong mam chung thit.jpg','2026-06-20 13:46:29',0),(29,1,1,'GÀ KHO CỦ CẢI','GÀ KHO CỦ CẢI',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong ga kho cu cai.jpg','2026-06-20 13:46:29',0),(30,1,1,'GÀ KHO COCA','GÀ KHO COCA',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong ga kho coca.jpg','2026-06-20 13:46:29',0),(31,1,1,'CANH BÍ XANH NHỒI THỊT','CANH BÍ XANH NHỒI THỊT',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong canh bi xanh nhoi thit.jpg','2026-06-20 13:46:29',0),(32,1,1,'CÁ NGỪ CHIÊN XỐC MẮM','CÁ NGỪ CHIÊN XỐC MẮM',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong ca ngu chien xoc mam.jpg','2026-06-20 13:46:29',0),(33,1,1,'CÁ NỤC CHIÊN XỐC MẮM','CÁ NỤC CHIÊN XỐC MẮM',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua van phong ca bac ma chien cham mam.jpg','2026-06-20 13:46:29',0),(34,1,1,'BÚN CHẢ CÁ','BÚN CHẢ CÁ',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/COM TRUA VAN PHONG BUN CHA CA.jpg','2026-06-20 13:46:29',0),(35,1,1,'GÀ CHIÊN SỐT MẮM','GÀ CHIÊN SỐT MẮM',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com unuquan.jpg','2026-06-20 13:46:29',0),(36,1,1,'Khổ Qua Xào Trứng','Khổ Qua Xào Trứng',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/U NU QUAN KHO QUA XAO TRUNG.png','2026-06-20 13:46:29',0),(37,1,1,'Tôm Ram Mặn Ngọt','Tôm Ram Mặn Ngọt',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/U NU QUAN TOM RAM MAN NGOT.jpg','2026-06-20 13:46:29',0),(38,1,1,'Sườn Xào Chua Ngọt','Sườn Xào Chua Ngọt',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/U NU QUAN SUON XAO CHUA NGOT.jpg','2026-06-20 13:46:29',0),(39,1,1,'Cá Ngừ Kho Khóm','Cá Ngừ Kho Khóm',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/U NU QUAN CA NGU KHO KHOM.jpg','2026-06-20 13:46:29',0),(40,1,1,'Phần Cơm Đầy Đủ','Phần Cơm Đầy Đủ',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Com trua ngon ú nu quán.jpg','2026-06-20 13:46:29',0),(41,2,1,'Best Seller Trà Tắc ','Best Seller Trà Tắc ',15000.00,15000.00,100,'https://www.unuquan.com/templates/images/vien.png','2026-06-20 13:46:29',0),(42,2,1,'Trà Tắc ','Trà Tắc ',15000.00,15000.00,100,'https://www.unuquan.com/img_data/images/Trà Tắc Ú NU QUÁN.jpg','2026-06-20 13:46:29',0),(43,1,1,'Bún Thịt Nướng ','Bún Thịt Nướng ',39000.00,39000.00,100,'https://www.unuquan.com/img_data/images/Bun thit nuong U nu Quan (2).jpg','2026-06-20 13:46:29',0),(44,1,1,'Bánh cuốn ','Bánh cuốn ',25000.00,25000.00,100,'https://www.unuquan.com/img_data/images/Banh cuon - Copy.jpg','2026-06-20 13:46:29',0),(45,1,1,'Bánh Mì ','Bánh Mì ',25000.00,25000.00,100,'https://www.unuquan.com/img_data/images/Bánh mì Ú NU.jpg','2026-06-20 13:46:29',0),(46,2,1,'Nước uống Trà Chanh ','Nước uống Trà Chanh ',15000.00,15000.00,100,'https://www.unuquan.com/templates/images/vien.png','2026-06-20 13:46:29',0),(47,2,1,'Trà Chanh ','Trà Chanh ',15000.00,15000.00,100,'https://www.unuquan.com/img_data/images/Trà Tắc Ú NU QUÁN.jpg','2026-06-20 13:46:29',0),(48,2,1,'Cafe Sữa ','Cafe Sữa ',20000.00,20000.00,100,'https://www.unuquan.com/img_data/images/Cafe Sữa Đá Ú Nu Quán.jpg','2026-06-20 13:46:29',0),(49,2,1,'Nước ngọt Pepsi các loại','Nước ngọt Pepsi các loại',15000.00,15000.00,100,'https://www.unuquan.com/img_data/images/Nuoc ngot pepsi cac loai.jpg','2026-06-20 13:46:29',0),(50,2,1,'Nước ép dưa hấu','Nước ép dưa hấu',30000.00,30000.00,100,'https://www.unuquan.com/img_data/images/cach-lam-nuoc-ep-dua-hau.png','2026-06-20 13:46:29',0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_percent` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'Giảm giá khai trương',10,'2026-06-01','2026-12-31');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review_images`
--

DROP TABLE IF EXISTS `review_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_reviewimage_review` (`review_id`),
  CONSTRAINT `fk_reviewimage_review` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review_images`
--

LOCK TABLES `review_images` WRITE;
/*!40000 ALTER TABLE `review_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `review_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_product` (`user_id`,`product_id`),
  KEY `fk_review_user` (`user_id`),
  KEY `fk_review_product` (`product_id`),
  CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_rating` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (6,3,22,5,'Đóng gói chắc chắn','2026-06-25 08:39:04'),(8,3,20,5,'ok','2026-06-25 09:41:41'),(11,3,1,1,'Mặn hơn muối','2026-06-26 13:47:44');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `role` enum('admin','customer') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Quản trị viên','DABL@gmail.com','0900000000','123456',NULL,'admin','2026-06-19 12:50:35'),(2,'CHIP','chip1234@gmail.com','0365692241','$2b$10$Pd03O8NmccKqmYlfunRaCuO5N4pvvrTIpIVe.7mc.YKTwWlptnGtG','Đường D3 Võ Oanh, Bình Thạnh','admin','2026-06-20 14:29:05'),(3,'kh1','kh1@gmail.com','0866487956','$2b$10$SoYNJYpsCSPxnIWTawKHDOJn6OMVwY6xG6dV7bKA7jNuiNqnaJk3S','2/45/24 Hẻm 2/56 Võ Oanh, Bình Thạnh, TP.HCM','customer','2026-06-23 08:06:26'),(4,'kh2','kh2@gmail.com','0866487956','$2b$10$oCLq/My/72WBbK10rUfYcOobOvAMfpLuFJsFxw3xDIBp6RbWu81Cq','gggg','customer','2026-06-25 09:43:16'),(5,'trlin','user1@gmail.com','0365691242','$2b$10$MH8paZlMWr4g7/cjgUREmu7iY5tCpAdQCriLD.R5HzsNWd5BmzXf.','133 ngo tat to p22 binh thanh','customer','2026-06-25 10:50:35'),(6,'Chánh','lemon@gmail.com','0866487959','$2b$10$iN0nJ3pznd/6pKiCqo4sJeFRcv9GvxOZ1eirMFF5L5BwiK2nBvyg2','Trọ của chánh','customer','2026-06-25 11:40:08'),(7,'Dumamay','skibidi36@gmail.com','0363636363','$2b$10$Pht0bSEAupQoU8jlOzinhuyV9Plq2XhWnonqsLTueizo5dkndHxTu',NULL,'customer','2026-06-26 12:44:20'),(8,'Dumamay','aduma36@gmail.com','0355555555','$2b$10$ZSPGmYNC0dZRuaVLrYotVuw6by2beSx7jcBBaslo08.hkWQj47ery','Thanh Hoa','customer','2026-06-26 12:45:42'),(9,'haha','hihihaha222@gmail.com','0909123654','$2b$10$klbjeGb.uELbeCtpS4oaGeEPB6cvnJdWSsRGlMn7XlTfyyTotqrCi',NULL,'customer','2026-06-26 15:12:53'),(10,'Nguyễn Phương Nam','nnguyenphuongnam77@gmail.com','0355743513','$2b$10$b3sOqYI3JTe5iRsjCDGI/uwi2dByPwfIt4LCKg/ABwZu2Ow4SuOk.','8 đường số2 cityland center hills','customer','2026-07-01 07:09:15'),(11,'Abc','abc@gmail.com','0912345678','$2b$10$COCtvBk.U6cgut5Ep4gmOuTQ/akctKoo./WsN7.g2nbv8SYhv5LPC','D2 võ oanh, quận bình thạnh','customer','2026-07-01 07:47:57'),(12,'Chánh gay','gaychanh@gmail.com','0860487887','$2b$10$dbejTADKJtbLyDC1QTLWTe1Pbn0AYoui1lDG.bt9hKZMVj85.4Dry','ĐỘNG WIBU','customer','2026-07-01 09:44:42');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_menus`
--

DROP TABLE IF EXISTS `weekly_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `day_of_week` tinyint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_product_day` (`product_id`,`day_of_week`),
  CONSTRAINT `fk_weekly_menu_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_day_of_week` CHECK ((`day_of_week` between 1 and 7))
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_menus`
--

LOCK TABLES `weekly_menus` WRITE;
/*!40000 ALTER TABLE `weekly_menus` DISABLE KEYS */;
INSERT INTO `weekly_menus` VALUES (1,1,1,'2026-06-20 15:15:31'),(2,2,1,'2026-06-20 15:15:31'),(3,3,1,'2026-06-20 15:15:31'),(4,4,1,'2026-06-20 15:15:31'),(5,5,1,'2026-06-20 15:15:31'),(6,6,2,'2026-06-20 15:15:31'),(7,7,2,'2026-06-20 15:15:31'),(8,8,2,'2026-06-20 15:15:31'),(9,9,2,'2026-06-20 15:15:31'),(10,10,2,'2026-06-20 15:15:31'),(11,11,3,'2026-06-20 15:15:31'),(12,12,3,'2026-06-20 15:15:31'),(14,14,3,'2026-06-20 15:15:31'),(15,15,3,'2026-06-20 15:15:31'),(17,20,1,'2026-06-20 16:33:12'),(18,2,6,'2026-06-20 16:51:40'),(22,1,2,'2026-06-23 05:11:24'),(24,5,6,'2026-06-23 05:26:11'),(25,8,7,'2026-06-23 05:26:16'),(26,3,7,'2026-06-23 07:21:29'),(27,8,3,'2026-06-24 07:41:13'),(32,5,4,'2026-06-25 15:10:04'),(33,2,4,'2026-06-25 15:42:41'),(35,4,4,'2026-06-25 16:07:42'),(38,1,4,'2026-06-25 16:11:39'),(39,1,5,'2026-06-26 02:55:19'),(40,3,5,'2026-06-26 03:00:30'),(41,15,5,'2026-06-26 03:08:23'),(42,19,5,'2026-06-26 13:50:05'),(43,20,5,'2026-06-26 13:50:12'),(45,50,6,'2026-06-27 08:03:53'),(46,47,6,'2026-06-27 09:10:05'),(47,42,6,'2026-06-27 12:02:26'),(48,49,7,'2026-06-28 07:02:24'),(50,48,3,'2026-07-01 08:50:33');
/*!40000 ALTER TABLE `weekly_menus` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-02 10:10:02

	-- KIỂM TRA
	SHOW TABLES;
    SHOW CREATE TABLE products;
	SHOW CREATE TABLE orders;
	SHOW COLUMNS FROM orders;
	SELECT * FROM users;
	SELECT * FROM products;
	SELECT * FROM weekly_menus;
    SHOW CREATE TABLE orders;
    SHOW CREATE TABLE order_details;
    SELECT * FROM orders ORDER BY id DESC;
    SELECT * FROM order_details ORDER BY id DESC;
	SELECT
		wm.id,
		wm.day_of_week,
		p.name,
		p.thumbnail,
		p.new_price
	FROM weekly_menus wm
	JOIN products p
		ON wm.product_id = p.id
	ORDER BY wm.day_of_week;
    
SELECT
AVG(rating) AS avg_rating,
COUNT(*) AS total_reviews
FROM reviews;

ALTER TABLE reviews
ADD CONSTRAINT uq_user_product
UNIQUE(user_id, product_id);

SELECT 1
FROM orders o
JOIN order_details od
  ON od.order_id = o.id
WHERE o.user_id = 3
AND od.product_id = 1
AND o.status IN
(
  'confirmed',
  'shipping',
  'completed'
)
LIMIT 1;

-- XEM CỤ THỂ ĐÁNH GIÁ --
SELECT
    r.id,
    u.id AS user_id,
    u.full_name,
    p.id AS product_id,
    p.name AS product_name,
    r.rating,
    r.comment,
    r.created_at
FROM reviews r
JOIN users u
    ON r.user_id = u.id
JOIN products p
    ON r.product_id = p.id
ORDER BY r.created_at DESC;

-- XÓA ĐÁNH GIÁ --
DELETE FROM reviews
WHERE id = 10;

DESCRIBE products;

SELECT *
FROM order_details
WHERE order_id = 53;

SELECT id,name,stock
FROM products
WHERE id=15;

SELECT
id,
status
FROM orders
WHERE id = 53;

SELECT COUNT(*) FROM products;

SELECT COUNT(*) FROM weekly_menus;

SELECT id,name
FROM products
ORDER BY id;

SELECT * FROM categories;

UPDATE products
SET category_id = 2
WHERE id IN (41, 42, 46, 47, 48, 49, 50);