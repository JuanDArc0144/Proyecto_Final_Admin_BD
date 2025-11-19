<?php
// index.php

require_once 'config/config.php';

// Proteger la página. Si el usuario no ha iniciado sesión, redirigir a login.
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    // Usar BASE_URL para la redirección
    header('Location: ' . BASE_URL . '/login.php');
    exit();
}

// Obtener datos de la sesión
$nombre_usuario = $_SESSION['nombre'];
$rol_usuario = $_SESSION['rol'];

$page_title = 'Panel Principal';
require_once ROOT_PATH . '/templates/header.php';
?>

<div class="welcome-message content-section">
    <h1>Bienvenido, <?php echo htmlspecialchars($nombre_usuario); ?>!</h1>
    <p>Has iniciado sesión con el rol de: <strong><?php echo htmlspecialchars($rol_usuario); ?></strong>.</p>
    <p>Este es el panel principal. Desde aquí, podrás acceder a las funcionalidades correspondientes a tu rol.</p>
    
    <div class="alert alert-info" style="margin-top: 1.5rem;">
    <?php
    // Ejemplo de cómo mostrar contenido diferente según el rol
    switch ($rol_usuario) {
        case 'Administrador':
            echo '<p>Tienes acceso total al sistema, incluyendo la gestión de usuarios y respaldos.</p>';
            echo '<a href="' . BASE_URL . '/admin/backups.php" class="btn btn-primary">Gestionar Respaldos</a>';
            break;
        case 'Almacenero':
            echo '<p>Puedes gestionar el inventario, registrar entradas y salidas de productos.</p>';
            break;
        case 'Cajero':
            echo '<p>Puedes realizar ventas y consultar precios de productos.</p>';
            break;
        case 'Supervisor':
            echo '<p>Puedes supervisar las operaciones y ver reportes.</p>';
            break;
        default:
            echo '<p>Tu rol no tiene funcionalidades específicas definidas todavía.</p>';
            break;
    }
    ?>
    </div>
</div>

<?php
require_once ROOT_PATH . '/templates/footer.php';
?>
