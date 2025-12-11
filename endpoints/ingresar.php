<?php

session_start();
require_once '../config/DBManager.php';

header('Content-Type: application/json');

$db = new Conexion();
$conn = $db->conectar();

// 1. Validar Método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// 2. Recibir datos
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Por favor, completa todos los campos']);
    exit;
}

// 3. Buscar usuario
$sql = "SELECT * FROM empleados WHERE email = ? LIMIT 1";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Error en la consulta SQL']);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    $stmt->close();
    exit;
}

$row = $result->fetch_assoc();
$stmt->close();

// 4. Verificar contraseña
if (!password_verify($password, $row['password'])) {
    echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    exit;
}

// ============================================================================
// [NUEVO] 5. ACTUALIZAR ÚLTIMO ACCESO
// ============================================================================
// Esto guarda la fecha y hora actual en la base de datos
$updateSql = "UPDATE empleados SET ultimo_acceso = NOW() WHERE id_empleado = ?";
$updateStmt = $conn->prepare($updateSql);
if ($updateStmt) {
    $updateStmt->bind_param("i", $row['id_empleado']);
    $updateStmt->execute();
    $updateStmt->close();
}
// ============================================================================

// 6. Crear Sesión
$_SESSION['id_empleado'] = $row['id_empleado'];
$_SESSION['nombre'] = $row['nombre']; // Asegúrate que en tu BD sea 'nombre' (minúscula o mayúscula según tu tabla)
$_SESSION['puesto'] = $row['puesto'];
$_SESSION['email'] = $row['email'];
$db->logActivity($row['id_empleado'], 'LOGIN', 'Inicio de sesión exitoso');

// 7. Definir Redirección
$redirect = null;
switch ($row['puesto']) {
    case 'Admin':
        $redirect = '../templates/admin.html';
        break;
    case 'Gerente':
        $redirect = '../templates/manager.html';
        break;
    default:
        $redirect = '../templates/employee.html'; // O la página por defecto
}

// 8. Enviar respuesta exitosa
echo json_encode([
    'success' => true,
    'message' => '¡Bienvenido ' . $row['nombre'] . '!',
    'redirect' => $redirect
]);

$conn->close();