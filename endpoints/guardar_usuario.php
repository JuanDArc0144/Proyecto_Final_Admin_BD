<?php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

// Desactivar visualización de errores HTML para no romper el JSON
ini_set('display_errors', 0);
ini_set('log_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']); exit;
}

try {
    $db = new Conexion();
    $conn = $db->conectar();

    $id_empleado = $_POST['id_empleado'] ?? '';
    $nombre = $_POST['nombre'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefono = $_POST['telefono'] ?? '';
    $puesto = $_POST['puesto'] ?? 'Empleado';
    $password = $_POST['password'] ?? '';

    // Validar campos obligatorios básicos
    if (empty($nombre) || empty($email)) {
        throw new Exception("Nombre y Email son obligatorios.");
    }

    if (!empty($id_empleado)) {
        // --- EDITAR USUARIO EXISTENTE ---
        if (!empty($password)) {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $sql = "UPDATE empleados SET nombre=?, email=?, telefono=?, puesto=?, password=? WHERE id_empleado=?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new Exception("Error preparando UPDATE: " . $conn->error);
            
            // CAMBIO: Usamos 's' para telefono para evitar overflow de enteros, y 'i' para ID
            $stmt->bind_param("sssssi", $nombre, $email, $telefono, $puesto, $hash, $id_empleado);
        } else {
            $sql = "UPDATE empleados SET nombre=?, email=?, telefono=?, puesto=? WHERE id_empleado=?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) throw new Exception("Error preparando UPDATE: " . $conn->error);
            
            // CAMBIO: 's' para telefono
            $stmt->bind_param("ssssi", $nombre, $email, $telefono, $puesto, $id_empleado);
        }
    } else {
        // --- CREAR NUEVO USUARIO ---
        if (empty($password)) {
            throw new Exception("La contraseña es obligatoria para nuevos usuarios");
        }
        $hash = password_hash($password, PASSWORD_DEFAULT);
        
        // VERIFICAR: Asegúrate que las columnas en tu BD sean exactamente estas
        $sql = "INSERT INTO empleados (nombre, email, telefono, puesto, password) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        
        // AQUÍ ESTABA EL ERROR PROBABLE: Si prepare falla, $stmt es false
        if (!$stmt) throw new Exception("Error preparando INSERT: " . $conn->error);
        
        // CAMBIO: Usamos "sssss" en lugar de "ssiss".
        // El teléfono (ej: 5512345678) es muy grande para un entero estándar (máx 2.1 mil millones).
        // Enviarlo como string es seguro; MySQL lo convertirá a BIGINT automáticamente.
        $stmt->bind_param("sssss", $nombre, $email, $telefono, $puesto, $hash);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Guardado correctamente']);
    } else {
        throw new Exception("Error al ejecutar: " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // Capturar cualquier error y devolverlo como JSON válido
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}