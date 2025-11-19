<?php
require_once 'config/config.php';
$page_title = 'Iniciar Sesión';
require_once ROOT_PATH . '/templates/header.php'; 
?>

<div class="form-container">
    <h2>Iniciar Sesión</h2>
    <form action="src/auth_login.php" method="POST">
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Ingresar</button>
    </form>
    <?php
        if (isset($_GET['error'])) {
            echo '<div class="alert alert-danger" style="margin-top: 1rem;">' . htmlspecialchars($_GET['error']) . '</div>';
        }
        if (isset($_GET['success'])) {
            echo '<div class="alert alert-success" style="margin-top: 1rem;">' . htmlspecialchars($_GET['success']) . '</div>';
        }
    ?>
    <div style="text-align: center; margin-top: 1rem;">
        <p>¿No tienes cuenta? <a href="register.php">Regístrate aquí</a></p>
    </div>
</div>

<?php require_once 'templates/footer.php'; ?>
