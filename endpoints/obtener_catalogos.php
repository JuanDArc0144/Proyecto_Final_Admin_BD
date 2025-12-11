<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    $db = new Conexion();
    $conn = $db->conectar();

    // 1. Obtener Categorías
    $sqlCat = "SELECT id_categoria, nombre FROM categorias";
    $resCat = $conn->query($sqlCat);
    $categorias = [];
    while($row = $resCat->fetch_assoc()) {
        $categorias[] = $row;
    }

    // 2. Obtener Proveedores
    $sqlProv = "SELECT id_proveedor, nombre FROM proveedores";
    $resProv = $conn->query($sqlProv);
    $proveedores = [];
    while($row = $resProv->fetch_assoc()) {
        $proveedores[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => [
            'categorias' => $categorias,
            'proveedores' => $proveedores
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}