<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

// Desactivar visualización de errores HTML
ini_set('display_errors', 0);
ini_set('log_errors', 1);

try {
    $db = new Conexion();
    $conn = $db->conectar();

    // 1. Estadísticas básicas
    // CAMBIO: Usamos 'precio_compra' para valor inventario y 'precio_venta' si quisieras valor venta
    $sql1 = "SELECT 
                COUNT(*) as total,
                SUM(precio_compra * stock) as valor_total,
                SUM(stock) as stock_total
             FROM productos";
    $result1 = $conn->query($sql1);
    
    if (!$result1) throw new Exception("Error en consulta 1: " . $conn->error);
    $res1 = $result1->fetch_assoc();

    // 2. Stock Bajo
    // CAMBIO: Tu tabla sí tiene 'stock_minimo', esto se mantiene igual
    $sql2 = "SELECT COUNT(*) as bajo FROM productos WHERE stock < stock_minimo";
    $result2 = $conn->query($sql2);
    
    if (!$result2) throw new Exception("Error en consulta 2: " . $conn->error);
    $res2 = $result2->fetch_assoc();

    echo json_encode([
        'total_productos' => $res1['total'] ?? 0,
        'valor_inventario' => $res1['valor_total'] ?? 0,
        'total_stock' => $res1['stock_total'] ?? 0,
        'stock_bajo' => $res2['bajo'] ?? 0
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}