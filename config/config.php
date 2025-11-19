<?php
// config/config.php

// Habilitar la visualización de errores para desarrollo
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// --- Rutas de la Aplicación ---
// Ruta raíz del proyecto (ej. C:\xampp\htdocs\Proyecto_Final)
define('ROOT_PATH', dirname(__DIR__));

// URL base de la aplicación.
// Si tu proyecto está en la raíz de htdocs (http://localhost/), déjalo como '/'.
// Si está en una subcarpeta (http://localhost/Proyecto_Final/), pon '/Proyecto_Final'.
define('BASE_URL', '/Proyecto_Final');


// --- Configuración de la Base de Datos ---
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '1234'); // Por defecto en XAMPP la contraseña es vacía.
define('DB_NAME', 'bodegatienda');
define('DB_PORT', 3306);

// Iniciar sesión
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Función para conectar a la BD
function conectar_db() {
    $conexion = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($conexion->connect_error) {
        die("Error de conexión: " . $conexion->connect_error);
    }

    $conexion->set_charset("utf8");

    return $conexion;
}
?>
