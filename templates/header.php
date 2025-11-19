<?php
// templates/header.php

// Asegurarse de que la sesión está iniciada en cada página que use este header
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? htmlspecialchars($page_title) : 'Bodega Tienda'; ?></title>
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>/public/css/styles.css">
</head>
<body>

<div class="navbar">
    <a href="<?php echo BASE_URL; ?>/index.php">Inicio</a>
    
    <?php if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true): ?>
        <?php
        // Mostrar enlaces específicos según el rol del usuario
        switch ($_SESSION['rol']) {
            case 'Administrador':
                echo '<a href="' . BASE_URL . '/admin/backups.php">Respaldos</a>';
                // Aquí se podrían añadir más enlaces de admin, ej: /admin/users.php
                break;
            case 'Almacenero':
                // echo '<a href="' . BASE_URL . '/inventory.php">Gestionar Inventario</a>';
                break;
            case 'Cajero':
                // echo '<a href="' . BASE_URL . '/sales.php">Registrar Venta</a>';
                break;
        }
        ?>
        <a href="<?php echo BASE_URL; ?>/logout.php" class="logout">Cerrar Sesión</a>
    <?php endif; ?>
</div>

<div class="container">
