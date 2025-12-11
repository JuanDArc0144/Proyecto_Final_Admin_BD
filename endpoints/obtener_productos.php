<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

$db = new Conexion();
$conn = $db->conectar();

// Seleccionamos todas las columnas correctas según tu imagen
$sql = "SELECT id_producto, nombre, descripcion, precio_compra, precio_venta, id_categoria, id_proveedor, stock, stock_minimo FROM productos ORDER BY id_producto DESC";
$result = $conn->query($sql);

$productos = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

echo json_encode(['success' => true, 'data' => $productos]);
$conn->close();