<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;

$db = new Conexion();
$conn = $db->conectar();

// Evitar que se borre a sí mismo (opcional, lógica simple por ID 1)
if ($id == 1) {
    echo json_encode(['success' => false, 'message' => 'No puedes eliminar al Super Admin']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM empleados WHERE id_empleado = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
$conn->close();