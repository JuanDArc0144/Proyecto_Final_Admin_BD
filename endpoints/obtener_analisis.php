<?php

require_once '../config/DBManager.php';
header('Content-Type: application/json');

// Desactivar errores visibles
ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    $db = new Conexion();
    $conn = $db->conectar();

    // 1. Obtener conteo por Proveedor (Top 5)
    // Hacemos un LEFT JOIN para contar cuántos productos tiene cada proveedor
    $sqlProveedores = "SELECT
                        prov.nombre,
                        COUNT(prod.id_producto) as total
                       FROM proveedores prov
                       LEFT JOIN productos prod ON prov.id_proveedor = prod.id_proveedor
                       GROUP BY prov.id_proveedor
                       ORDER BY total DESC
                       LIMIT 5";
    
    $resProv = $conn->query($sqlProveedores);
    $dataProveedores = [];
    while($row = $resProv->fetch_assoc()) {
        $dataProveedores[] = $row;
    }

    // 2. Obtener Productos con Mayor Stock (Top 5)
    // Usamos esto como 'Modelos Destacados'
    $sqlTop = "SELECT nombre, stock, precio_venta FROM productos ORDER BY stock DESC LIMIT 5";
    $resTop = $conn->query($sqlTop);
    $dataTop = [];
    while($row = $resTop->fetch_assoc()) {
        $dataTop[] = $row;
    }

    echo json_encode([
        'success' => true,
        'proveedores' => $dataProveedores,
        'top_productos' => $dataTop
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}