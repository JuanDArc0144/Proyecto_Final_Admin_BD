<?php
// admin/backups.php

require_once '../config/config.php';

// Proteger la página. Solo los administradores pueden acceder.
if (!isset($_SESSION['loggedin']) || $_SESSION['rol'] !== 'Administrador') {
    header('Location: ' . BASE_URL . '/login.php?error=Acceso no autorizado');
    exit();
}

$page_title = 'Gestión de Respaldos';
require_once ROOT_PATH . '/templates/header.php';
?>

<h1>Gestión de Respaldos de la Base de Datos</h1>

<?php
    if (isset($_GET['message'])) {
        $type = $_GET['type'] ?? 'success';
        echo '<div class="alert alert-' . htmlspecialchars($type) . '">' . htmlspecialchars($_GET['message']) . '</div>';
    }
?>

<!-- Sección de Exportación -->
<div class="content-section">
    <h2>Exportar (Crear Respaldo)</h2>
    <p>Haz clic en el botón para generar un respaldo completo de la base de datos. El archivo se guardará en la carpeta <code>backups</code> del servidor.</p>
    <a href="export_db.php" class="btn btn-primary">Crear Respaldo Ahora</a>
</div>

<!-- Sección de Importación -->
<div class="content-section">
    <h2>Importar (Restaurar Respaldo)</h2>
    <div class="alert alert-warning">
        <strong>¡Atención!</strong> Esta acción es destructiva. Restaurar un respaldo reemplazará todos los datos actuales de la base de datos con los del archivo de respaldo. Procede con precaución.
    </div>
    <form action="import_db.php" method="post" enctype="multipart/form-data" onsubmit="return confirm('¿Estás seguro de que quieres restaurar la base de datos con este archivo? Se perderán todos los datos actuales.');">
        <div class="input-group">
            <label for="backup_file">Selecciona un archivo de respaldo (.sql):</label>
            <input type="file" name="backup_file" id="backup_file" accept=".sql" required>
        </div>
        <button type="submit" class="btn btn-danger">Restaurar Base de Datos</button>
    </form>
</div>

<?php
require_once ROOT_PATH . '/templates/footer.php';
?>
