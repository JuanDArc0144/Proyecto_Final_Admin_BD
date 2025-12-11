<?php
session_start();
header('Content-Type: application/json');

// Si existe la variable de sesión 'id_empleado', el usuario está logueado
if (isset($_SESSION['id_empleado'])) {
    echo json_encode([
        'logged_in' => true,
        'nombre' => $_SESSION['nombre'],
        'puesto' => $_SESSION['puesto']
    ]);
} else {
    // Si no hay sesión, avisamos para que JS lo saque de la página
    echo json_encode([
        'logged_in' => false
    ]);
}