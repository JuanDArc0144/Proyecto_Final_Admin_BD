<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

$db = new Conexion();
$conn = $db->conectar();

// Seleccionamos todo MENOS la contraseña por seguridad
$sql = "SELECT id_empleado, nombre, email, telefono, puesto, ultimo_acceso FROM empleados ORDER BY id_empleado ASC";
$result = $conn->query($sql);

$usuarios = [];
while($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode(['success' => true, 'data' => $usuarios]);
$conn->close();