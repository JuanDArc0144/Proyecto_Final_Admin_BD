<?php

require_once '../config/DBManager.php';
header('Content-Type: application/json');

$db = new Conexion();
$conn = $db->conectar();

// 1. Obtener lista de actividades (Últimas 50)
$sql = "SELECT r.*, e.nombre as usuario
        FROM registro_actividad r
        JOIN empleados e ON r.id_empleado = e.id_empleado
        ORDER BY r.fecha DESC LIMIT 50";
$result = $conn->query($sql);

$logs = [];
while($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

// 2. Calcular indicadores (Totales históricos)
$stats = [
    'productos' => 0,
    'actualizaciones' => 0,
    'respaldos' => 0
];

// Contamos rápido con SQL
$resStats = $conn->query("SELECT
    SUM(CASE WHEN tipo_accion = 'PRODUCTO_CREAR' THEN 1 ELSE 0 END) as productos,
    SUM(CASE WHEN tipo_accion LIKE '%EDITAR%' OR tipo_accion LIKE '%UPDATE%' THEN 1 ELSE 0 END) as actualizaciones,
    SUM(CASE WHEN tipo_accion = 'RESPALDO' THEN 1 ELSE 0 END) as respaldos
FROM registro_actividad");

if ($rowStats = $resStats->fetch_assoc()) {
    $stats = $rowStats;
}

echo json_encode([
    'success' => true,
    'data' => $logs,
    'stats' => $stats
]);
$conn->close();