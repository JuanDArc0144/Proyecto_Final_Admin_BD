<?php
// src/auth_register.php

require_once dirname(__DIR__) . '/config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitizar y obtener los datos del formulario
    $nombre = filter_input(INPUT_POST, 'nombre', FILTER_SANITIZE_STRING);
    $puesto = filter_input(INPUT_POST, 'puesto', FILTER_SANITIZE_STRING);
    $telefono = filter_input(INPUT_POST, 'telefono', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    // Validaciones
    if (empty($nombre) || empty($puesto) || empty($email) || empty($password)) {
        header('Location: ' . BASE_URL . '/register.php?error=Todos los campos marcados con * son obligatorios');
        exit();
    }

    // Conectar a la base de datos
    $db = conectar_db();

    // Verificar si el email ya existe
    $stmt = $db->prepare("SELECT id_empleado FROM empleados WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        header('Location: ' . BASE_URL . '/register.php?error=El correo electrónico ya está registrado');
        $stmt->close();
        $db->close();
        exit();
    }
    $stmt->close();

    // Hashear la contraseña con SHA1
    $password_hashed = sha1($password);

    // Insertar el nuevo usuario en la base de datos
    $stmt = $db->prepare("INSERT INTO empleados (nombre, puesto, telefono, email, password) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombre, $puesto, $telefono, $email, $password_hashed);

    if ($stmt->execute()) {
        // Redirigir al login con un mensaje de éxito
        header('Location: ' . BASE_URL . '/login.php?success=Registro completado. Ahora puedes iniciar sesión.');
        exit();
    } else {
        // Mostrar un error si la inserción falla
        header('Location: ' . BASE_URL . '/register.php?error=Error al registrar el usuario. Inténtalo de nuevo.');
        exit();
    }

    $stmt->close();
    $db->close();

} else {
    // Redirigir si se accede al archivo directamente
    header('Location: ' . BASE_URL . '/register.php');
    exit();
}
?>
