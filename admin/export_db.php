<?php
// admin/export_db.php

require_once dirname(__DIR__) . '/config/config.php';

// Proteger la página. Solo los administradores pueden acceder.
if (!isset($_SESSION['loggedin']) || $_SESSION['rol'] !== 'Administrador') {
    header('Location: ' . BASE_URL . '/login.php?error=Acceso no autorizado');
    exit();
}

// --- Lógica de Exportación ---

// Nombre del archivo de respaldo con fecha y hora
$backup_filename = DB_NAME . '-' . date("Y-m-d_H-i-s") . '.sql';
$backup_filepath = ROOT_PATH . '/backups/' . $backup_filename;

// Construir el comando mysqldump
// NOTA: Se necesita que mysqldump esté en el PATH del sistema o especificar la ruta completa.
// En XAMPP, la ruta podría ser "C:\\xampp\\mysql\\bin\\mysqldump.exe"
$command = sprintf(
    'mysqldump --user=%s --password=%s --host=%s --port=%s %s > %s',
    escapeshellarg(DB_USER),
    escapeshellarg(DB_PASS),
    escapeshellarg(DB_HOST),
    escapeshellarg(DB_PORT),
    escapeshellarg(DB_NAME),
    escapeshellarg($backup_filepath)
);

// Ejecutar el comando
@exec($command, $output, $return_var);

// Verificar el resultado
if ($return_var === 0 && file_exists($backup_filepath)) {
    // Éxito
    $message = "Respaldo '" . htmlspecialchars($backup_filename) . "' creado con éxito.";
    header('Location: ' . BASE_URL . '/admin/backups.php?message=' . urlencode($message) . '&type=success');
    exit();
} else {
    // Error
    $error_message = "Error al crear el respaldo. Código de error: " . $return_var;
    // Opcional: registrar el error en un log para depuración
    // error_log("Error en mysqldump: " . implode("\n", $output));
    header('Location: ' . BASE_URL . '/admin/backups.php?message=' . urlencode($error_message) . '&type=danger');
    exit();
}
?>
