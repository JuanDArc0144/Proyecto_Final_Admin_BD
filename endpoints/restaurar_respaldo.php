<?php
// endpoints/restaurar_respaldo.php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

// Aumentar límites para archivos grandes
ini_set('max_execution_time', 600); // 10 minutos
ini_set('memory_limit', '256M');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$nombreArchivo = $data['archivo'] ?? '';

if (empty($nombreArchivo)) {
    echo json_encode(['success' => false, 'message' => 'No se especificó el archivo']);
    exit;
}

$rutaArchivo = "../respaldos/" . basename($nombreArchivo); // basename por seguridad

if (!file_exists($rutaArchivo)) {
    echo json_encode(['success' => false, 'message' => 'El archivo de respaldo no existe']);
    exit;
}

try {
    $db = new Conexion();
    $conn = $db->conectar();

    // Desactivar chequeo de llaves foráneas temporalmente para evitar errores al borrar tablas
    $conn->query("SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO'");
    $conn->query("SET SESSION sql_mode = 'NO_AUTO_VALUE_ON_ZERO'");
    $conn->query("SET FOREIGN_KEY_CHECKS = 0");

    // Leer el contenido del archivo SQL
    $sqlContent = file_get_contents($rutaArchivo);
    
    // Separar por punto y coma (;) para ejecutar comando por comando
    // Nota: Esto es una implementación simple. Para dumps muy complejos con triggers/procedures puede requerir un parser más robusto.
    $queries = explode(';', $sqlContent);

    foreach ($queries as $query) {
        $query = trim($query);
        if (!empty($query)) {
            if (!$conn->query($query)) {
                // Si falla una consulta, lanzamos error pero continuamos o paramos según preferencia.
                // Aquí lanzamos error para avisar.
                throw new Exception("Error SQL: " . $conn->error . " en consulta: " . substr($query, 0, 50) . "...");
            }
        }
    }

    // Reactivar llaves foráneas
    $conn->query("SET FOREIGN_KEY_CHECKS = 1");

    echo json_encode(['success' => true, 'message' => 'Base de datos restaurada correctamente']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al restaurar: ' . $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}