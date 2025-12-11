<?php
// 1. INICIAR SESIÓN (Obligatorio para usar $_SESSION)
session_start();

require_once '../config/DBManager.php';
header('Content-Type: application/json');

// Desactivar errores visibles para no romper el JSON
ini_set('display_errors', 0);
ini_set('log_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

try {
    $db = new Conexion();
    $conn = $db->conectar();

    // Recibir ID si es edición
    $id_producto = $_POST['id_producto'] ?? '';

    // --- 2. LIMPIEZA Y CONVERSIÓN DE TIPOS ESTRICTA ---
    $nombre = $_POST['nombre'] ?? '';
    $descripcion = $_POST['descripcion'] ?? '';
    
    // Forzamos a que sean números (si viene vacío, se convierte en 0)
    $precio_compra = empty($_POST['precio_compra']) ? 0.00 : floatval($_POST['precio_compra']);
    $precio_venta = empty($_POST['precio_venta']) ? 0.00 : floatval($_POST['precio_venta']);
    
    $id_categoria = empty($_POST['categoria']) ? 0 : intval($_POST['categoria']);
    $id_proveedor = empty($_POST['proveedor']) ? 0 : intval($_POST['proveedor']);
    
    $stock = empty($_POST['stock']) ? 0 : intval($_POST['stock']);
    $stock_minimo = empty($_POST['stock_minimo']) ? 0 : intval($_POST['stock_minimo']);

    // Validaciones básicas
    if (empty($nombre)) {
        throw new Exception("El nombre del producto es obligatorio.");
    }
    if ($id_categoria === 0 || $id_proveedor === 0) {
        throw new Exception("Debes seleccionar una Categoría y un Proveedor.");
    }

    if (!empty($id_producto)) {
        // --- ACTUALIZAR ---
        $sql = "UPDATE productos SET nombre=?, descripcion=?, precio_compra=?, precio_venta=?, id_categoria=?, id_proveedor=?, stock=?, stock_minimo=? WHERE id_producto=?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception("Error preparando UPDATE: " . $conn->error);
        
        // ssddiiiii (9 variables)
        $stmt->bind_param("ssddiiiii", $nombre, $descripcion, $precio_compra, $precio_venta, $id_categoria, $id_proveedor, $stock, $stock_minimo, $id_producto);
    } else {
        // --- INSERTAR ---
        $sql = "INSERT INTO productos (nombre, descripcion, precio_compra, precio_venta, id_categoria, id_proveedor, stock, stock_minimo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) throw new Exception("Error preparando INSERT: " . $conn->error);
        
        // ssddiiii (8 variables)
        $stmt->bind_param("ssddiiii", $nombre, $descripcion, $precio_compra, $precio_venta, $id_categoria, $id_proveedor, $stock, $stock_minimo);
    }

    if ($stmt->execute()) {
        // --- LOG DE ACTIVIDAD ---
        // Verificar que exista sesión y el método logActivity
        $id_empleado_log = $_SESSION['id_empleado'] ?? 0; // Si no hay sesión, ponemos 0
        $accion = !empty($id_producto) ? 'PRODUCTO_EDITAR' : 'PRODUCTO_CREAR';
        $desc = !empty($id_producto) ? "Se editó el producto: $nombre" : "Se creó el producto: $nombre";

        if ($id_empleado_log > 0 && method_exists($db, 'logActivity')) {
            $db->logActivity($id_empleado_log, $accion, $desc);
        }

        echo json_encode(['success' => true, 'message' => 'Guardado exitosamente']);
    } else {
        throw new Exception("Error al ejecutar en BD: " . $stmt->error);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    // 3. MANEJO DE ERRORES: Devolver JSON incluso si falla
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>