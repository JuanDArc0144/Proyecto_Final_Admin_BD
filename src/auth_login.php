<?php
// src/auth_login.php

require_once dirname(__DIR__) . '/config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        header('Location: ' . BASE_URL . '/login.php?error=Todos los campos son obligatorios');
        exit();
    }

    // Conectar a la base de datos
    $db = conectar_db();

    // Hashear la contraseña con SHA1 para la comparación
    $password_hashed = sha1($password);

    // Preparar la consulta para evitar inyección SQL
    $stmt = $db->prepare("SELECT id_empleado, nombre, puesto, password FROM empleados WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();

        // Verificar la contraseña
        if ($password_hashed === $usuario['password']) {
            // Iniciar la sesión
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }

            // Guardar datos del usuario en la sesión
            $_SESSION['id_empleado'] = $usuario['id_empleado'];
            $_SESSION['nombre'] = $usuario['nombre'];
            $_SESSION['rol'] = $usuario['puesto']; // Usamos 'puesto' como el rol
            $_SESSION['loggedin'] = true;

            // Redirigir al panel principal
            header('Location: ' . BASE_URL . '/index.php');
            exit();
        }
    }

    // Si las credenciales son incorrectas
    header('Location: ' . BASE_URL . '/login.php?error=Email o contraseña incorrectos');
    exit();

} else {
    // Redirigir si se accede al archivo directamente
    header('Location: ' . BASE_URL . '/login.php');
    exit();
}
?>
