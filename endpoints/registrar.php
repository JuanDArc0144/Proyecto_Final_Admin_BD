<?php

// 1. Configuración y Conexión
require_once '../config/DBManager.php';

// Asegurarnos de que la respuesta sea siempre JSON
header('Content-Type: application/json');

// Iniciar conexión
try {
    $db = new Conexion();
    $conn = $db->conectar();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error de conexión a la base de datos']);
    exit;
}

// 2. Validar Método HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// 3. Recibir y Limpiar Datos
// Usamos trim() para quitar espacios accidentales al inicio o final
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telefono = isset($_POST['telefono']) ? trim($_POST['telefono']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$puesto = isset($_POST['puesto']) ? trim($_POST['puesto']) : ''; // 'Cliente' o 'Proveedor'

// 4. Validaciones Básicas
if (empty($nombre) || empty($email) || empty($password) || empty($puesto) || empty($telefono)) {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'El formato del correo electrónico no es válido.']);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'La contraseña debe tener al menos 6 caracteres.']);
    exit;
}

// 5. Verificar si el usuario ya existe
// Asumo que tu tabla se llama 'empleados' basado en tu archivo ingresar.php
$sqlCheck = "SELECT id_empleado FROM empleados WHERE email = ? LIMIT 1";
$stmtCheck = $conn->prepare($sqlCheck);

if (!$stmtCheck) {
    echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta de verificación.']);
    exit;
}

$stmtCheck->bind_param("s", $email);
$stmtCheck->execute();
$stmtCheck->store_result();

if ($stmtCheck->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Este correo electrónico ya está registrado.']);
    $stmtCheck->close();
    exit;
}
$stmtCheck->close();

// 6. Encriptar Contraseña (SEGURIDAD MODERNA)
// Esto genera un hash seguro (ej. con Bcrypt) compatible con password_verify()
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// 7. Insertar el nuevo usuario
// Ajusta los nombres de columnas (Nombre, Email, Contraseña, Puesto) si son diferentes en tu BD
$sqlInsert = "INSERT INTO empleados (nombre, puesto, telefono, email, password) VALUES (?, ?, ?, ?, ?)";
$stmtInsert = $conn->prepare($sqlInsert);

if (!$stmtInsert) {
    echo json_encode(['success' => false, 'message' => 'Error en la preparación de la consulta de registro.']);
    exit;
}

// "ssss" significa que los 4 parámetros son Strings
$stmtInsert->bind_param("ssiss", $nombre, $puesto, $telefono, $email, $passwordHash);

if ($stmtInsert->execute()) {
    echo json_encode([
        'success' => true,
        'message' => '¡Cuenta creada con éxito! Redirigiendo al login...'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar en la base de datos: ' . $stmtInsert->error
    ]);
}

// 8. Cerrar recursos
$stmtInsert->close();
$conn->close();