-- RESPALDO AUTOMÁTICO JUANRRY 
-- FECHA: 11-12-2025 02:27:21
-- --------------------------------------------------------


DROP TABLE IF EXISTS `categorias`;


CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO categorias VALUES("1","Bebidas","Refrescos, jugos, aguas embotelladas y energizantes");
INSERT INTO categorias VALUES("2","Snacks","Botanas y alimentos empaquetados para consumo rápido");
INSERT INTO categorias VALUES("3","Limpieza","Artículos de limpieza y desinfección");
INSERT INTO categorias VALUES("4","Abarrotes","Productos básicos de despensa");
INSERT INTO categorias VALUES("5","Cuidado personal","Higiene y productos de tocador");
INSERT INTO categorias VALUES("6","Computación","Laptops, componentes de PC, monitores y software");
INSERT INTO categorias VALUES("7","Telefonía","Smartphones, cargadores, cables y accesorios móviles");
INSERT INTO categorias VALUES("8","Videojuegos","Consolas, videojuegos físicos y tarjetas de regalo");
INSERT INTO categorias VALUES("9","Electrodomésticos","Aparatos eléctricos para el hogar y cocina");
INSERT INTO categorias VALUES("10","Papelería","Cuadernos, lápices, papel y artículos de oficina");
INSERT INTO categorias VALUES("11","Ferretería","Herramientas manuales, eléctricas y materiales");
INSERT INTO categorias VALUES("12","Farmacia","Medicamentos de venta libre y primeros auxilios");
INSERT INTO categorias VALUES("13","Mascotas","Alimento para perros, gatos y accesorios");
INSERT INTO categorias VALUES("14","Juguetería","Juguetes, juegos de mesa y entretenimiento infantil");
INSERT INTO categorias VALUES("15","Ropa y Textiles","Prendas de vestir básicas y blancos");

DROP TABLE IF EXISTS `empleados`;


CREATE TABLE `empleados` (
  `id_empleado` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `puesto` varchar(50) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  PRIMARY KEY (`id_empleado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO empleados VALUES("1","Juan Alberto","Admin","4434689407","jash0144@gmail.com","$2y$10$7wPvQNzR3IABY16jHY2G4e1yMKefSpzNfFCMI7A/Zv26NJISF9Rdi","2025-12-10 19:27:05");
INSERT INTO empleados VALUES("2","Regina Rodriguez","Empleado","4432565678","miniregina@gmail.com","$2y$10$OoFT.cQRs9oasuJOlqI7jO2xgfRN0FzB2jGl0dF4YXBijDr3Wzvy2","2025-12-10 19:26:40");

DROP TABLE IF EXISTS `entradas`;


CREATE TABLE `entradas` (
  `id_entrada` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `fecha` date NOT NULL,
  `id_empleado` int DEFAULT NULL,
  PRIMARY KEY (`id_entrada`),
  KEY `id_producto` (`id_producto`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `entradas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `entradas_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `inventario`;


CREATE TABLE `inventario` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `cantidad` int DEFAULT '0',
  `ubicacion` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_inventario`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO inventario VALUES("1","1","120","Estante A1");
INSERT INTO inventario VALUES("2","2","85","Estante A2");
INSERT INTO inventario VALUES("3","3","60","Pasillo B3");
INSERT INTO inventario VALUES("4","4","200","Estante C1");
INSERT INTO inventario VALUES("5","5","50","Pasillo D4");
INSERT INTO inventario VALUES("6","6","150","Estante A1");

DROP TABLE IF EXISTS `productos`;


CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `id_categoria` int DEFAULT NULL,
  `id_proveedor` int DEFAULT NULL,
  `stock` int NOT NULL,
  `stock_minimo` int NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO productos VALUES("1","Coca-Cola 600ml","Refresco de cola embotellado","8.50","12.00","1","3","25","10","2025-12-10 12:57:39");
INSERT INTO productos VALUES("2","Sabritas Clásicas 45g","Papas fritas saladas","10.00","15.00","2","2","25","10","2025-12-10 12:57:39");
INSERT INTO productos VALUES("3","Fabuloso Lavanda 1L","Limpiador multiusos con aroma lavanda","20.00","30.00","3","4","25","10","2025-12-10 12:57:39");
INSERT INTO productos VALUES("4","Arroz La Moderna 1kg","Arroz blanco de grano largo","18.00","25.00","4","2","25","10","2025-12-10 12:57:39");
INSERT INTO productos VALUES("5","Shampoo Sedal 340ml","Shampoo para cabello normal","30.00","45.00","5","4","25","10","2025-12-10 12:57:39");
INSERT INTO productos VALUES("6","Agua Bonafont 1L","Agua natural purificada","7.00","10.00","1","1","25","10","2025-12-10 12:57:39");
INSERT INTO productos VALUES("7","Laptop HP Pavilion 15","Laptop con procesador Ryzen 5 y 8GB RAM","12000.00","15500.00","6","5","10","3","2025-12-10 13:37:37");
INSERT INTO productos VALUES("8","Mouse Logitech G203","Mouse gamer con luces RGB","350.00","599.00","6","6","25","5","2025-12-10 13:37:37");
INSERT INTO productos VALUES("9","Monitor Dell 24\"","Monitor Full HD 60Hz para oficina","2500.00","3200.00","6","5","15","4","2025-12-10 13:37:37");
INSERT INTO productos VALUES("10","iPhone 13 128GB","Smartphone Apple color negro","14000.00","17999.00","7","7","30","2","2025-12-10 13:37:37");
INSERT INTO productos VALUES("11","Cable USB-C 2m","Cable de carga rápida reforzado","80.00","150.00","7","7","50","10","2025-12-10 13:37:37");
INSERT INTO productos VALUES("12","SSD Kingston 480GB","Disco estado sólido SATA 2.5","500.00","850.00","6","6","20","5","2025-12-10 13:37:37");
INSERT INTO productos VALUES("13","Licuadora Oster 10 Vel","Licuadora de vidrio clásica","600.00","950.00","9","8","12","3","2025-12-10 13:37:37");
INSERT INTO productos VALUES("14","Cuaderno Scribe Pro","Cuaderno profesional cuadro grande 100 hojas","25.00","45.00","10","9","100","20","2025-12-10 13:37:37");
INSERT INTO productos VALUES("15","Juego de Destornilladores","Set de 6 piezas punta cruz y plana","150.00","280.00","11","10","15","5","2025-12-10 13:37:37");
INSERT INTO productos VALUES("16","Alimento DogChow 20kg","Costal de alimento para perro adulto","850.00","1100.00","13","12","10","2","2025-12-10 13:37:37");
INSERT INTO productos VALUES("17","Paracetamol 500mg","Caja con 20 tabletas","15.00","35.00","12","11","40","10","2025-12-10 13:37:37");
INSERT INTO productos VALUES("19","Cyberpunk 2077","Explora Night City como nunca antes. ","650.00","900.00","8","5","100","10","2025-12-10 17:56:12");

DROP TABLE IF EXISTS `proveedores`;


CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO proveedores VALUES("1","Distribuidora El Sol","555-123-4567","contacto@elsol.com","Av. Central #45, Ciudad de México");
INSERT INTO proveedores VALUES("2","Abarrotes MX","554-987-6543","ventas@abarrotesmx.com","Calle 8 #123, Guadalajara");
INSERT INTO proveedores VALUES("3","Refrescos del Norte","553-321-0987","info@refrescosnorte.com","Carretera Norte Km 12, Monterrey");
INSERT INTO proveedores VALUES("4","Higiene Total","556-111-2222","proveedores@higienetotal.com","Calle Limpieza #9, Puebla");
INSERT INTO proveedores VALUES("5","TechGlobal S.A. de C.V.","555-888-9999","ventas@techglobal.mx","Av. Reforma 222, CDMX");
INSERT INTO proveedores VALUES("6","CompuWorld Mayorista","554-777-6666","contacto@compuworld.com","Plaza de la Tecnología L-45, Guadalajara");
INSERT INTO proveedores VALUES("7","MovilMex Distribuciones","553-666-5555","proveedores@movilmex.com","Calle 5 de Mayo #12, Monterrey");
INSERT INTO proveedores VALUES("8","ElectroHogar Nacional","552-555-4444","ventas@electrohogar.com","Blvd. Aeropuerto #100, Toluca");
INSERT INTO proveedores VALUES("9","Papelera del Centro","551-444-3333","pedidos@papeleracentro.com","Calle Madero #8, Puebla");
INSERT INTO proveedores VALUES("10","Herramientas Industriales","559-333-2222","info@ferreindustrial.mx","Zona Industrial Norte, Querétaro");
INSERT INTO proveedores VALUES("11","Farmacéutica Salud","558-222-1111","contacto@farmasalud.com","Av. Universidad #50, CDMX");
INSERT INTO proveedores VALUES("12","PetFriends Supply","557-111-0000","ventas@petfriends.com","Calle Animales #5, León");
INSERT INTO proveedores VALUES("13","Juguetronica Dist","556-000-9999","info@juguetronica.com","Centro Sur #33, Veracruz");
INSERT INTO proveedores VALUES("14","Textiles Unidos","555-123-0987","ventas@textilesunidos.com","Calle Telares #20, Aguascalientes");

DROP TABLE IF EXISTS `registro_actividad`;


CREATE TABLE `registro_actividad` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_empleado` int NOT NULL,
  `tipo_accion` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `registro_actividad_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO registro_actividad VALUES("1","1","LOGIN","Inicio de sesión exitoso","2025-12-10 19:26:20");
INSERT INTO registro_actividad VALUES("2","2","LOGIN","Inicio de sesión exitoso","2025-12-10 19:26:40");
INSERT INTO registro_actividad VALUES("3","1","LOGIN","Inicio de sesión exitoso","2025-12-10 19:27:05");

DROP TABLE IF EXISTS `salidas`;


CREATE TABLE `salidas` (
  `id_salida` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `fecha` date NOT NULL,
  `id_empleado` int DEFAULT NULL,
  PRIMARY KEY (`id_salida`),
  KEY `id_producto` (`id_producto`),
  KEY `id_empleado` (`id_empleado`),
  CONSTRAINT `salidas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `salidas_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id_empleado`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO salidas VALUES("1","1","20","2025-10-05","0");
INSERT INTO salidas VALUES("2","2","10","2025-10-06","0");
INSERT INTO salidas VALUES("3","4","30","2025-10-07","0");
INSERT INTO salidas VALUES("4","5","5","2025-10-08","0");
INSERT INTO salidas VALUES("5","6","40","2025-10-09","0");
