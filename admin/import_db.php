<?php
// admin/import_db.php

require_once dirname(__DIR__) . '/config/config.php';

// Proteger la página. Solo los administradores pueden acceder.
if (!isset($_SESSION['loggedin']) || $_SESSION['rol'] !== 'Administrador') {
    header('Location: ' . BASE_URL . '/login.php?error=Acceso no autorizado');
    exit();
}

// --- Lógica de Importación ---

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['backup_file'])) {
    
    // Verificar si hubo errores en la subida
    if ($_FILES['backup_file']['error'] !== UPLOAD_ERR_OK) {
        header('Location: ' . BASE_URL . '/admin/backups.php?message=Error al subir el archivo. Código: ' . $_FILES['backup_file']['error'] . '&type=danger');
        exit();
    }

    // Validar la extensión del archivo
    $file_extension = pathinfo($_FILES['backup_file']['name'], PATHINFO_EXTENSION);
    if (strtolower($file_extension) !== 'sql') {
        header('Location: ' . BASE_URL . '/admin/backups.php?message=Archivo no válido. Solo se permiten archivos .sql.&type=danger');
        exit();
    }

    $uploaded_filepath = $_FILES['backup_file']['tmp_name'];

    // Construir el comando mysql
    // NOTA: Se necesita que mysql esté en el PATH del sistema o especificar la ruta completa.
    // En XAMPP, la ruta podría ser "C:\\xampp\\mysql\\bin\\mysql.exe"
    $command = sprintf(
        'mysql --user=%s --password=%s --host=%s --port=%s %s < %s',
        escapeshellarg(DB_USER),
        escapeshellarg(DB_PASS),
        escapeshellarg(DB_HOST),
        escapeshellarg(DB_PORT),
        escapeshellarg(DB_NAME),
        escapeshellarg($uploaded_filepath)
    );

    // Ejecutar el comando
    @exec($command, $output, $return_var);

    // Verificar el resultado
    if ($return_var === 0) {
        // Éxito
        $message = "Base de datos restaurada con éxito desde el archivo '" . htmlspecialchars($_FILES['backup_file']['name']) . "'.";
        header('Location: ' . BASE_URL . '/admin/backups.php?message=' . urlencode($message) . '&type=success');
        exit();
    } else {
        // Error
        $error_message = "Error al restaurar la base de datos. Código de error: " . $return_var;
        // Opcional: registrar el error en un log para depuración
        // error_log("Error en mysql import: " . implode("\n", $output));
        header('Location: ' . BASE_URL . '/admin/backups.php?message=' . urlencode($error_message) . '&type=danger');
        exit();
    }

} else {
    // Redirigir si no es una petición POST válida
    header('Location: ' . BASE_URL . '/admin/backups.php');
    exit();
}
?>
