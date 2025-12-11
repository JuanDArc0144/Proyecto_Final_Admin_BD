<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false]); exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? 0;

$db = new Conexion();
$conn = $db->conectar();

$stmt = $conn->prepare("DELETE FROM productos WHERE id_producto = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}
$conn->close();