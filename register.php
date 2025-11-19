<?php
require_once 'config/config.php';
$page_title = 'Crear Cuenta';
require_once ROOT_PATH . '/templates/header.php'; 
?>

<div class="form-container">
    <h2>Crear Cuenta</h2>
    <form action="src/auth_register.php" method="POST">
        <div class="input-group">
            <label for="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="input-group">
            <label for="puesto">Puesto</label>
            <select id="puesto" name="puesto" required>
                <option value="Almacenero">Almacenero</option>
                <option value="Cajero">Cajero</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Administrador">Administrador</option>
            </select>
        </div>
        <div class="input-group">
            <label for="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono">
        </div>
        <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" required>
        </div>
        <button type="submit" class="btn btn-success btn-full">Registrarse</button>
    </form>
    <?php
        if (isset($_GET['error'])) {
            echo '<div class="alert alert-danger" style="margin-top: 1rem;">' . htmlspecialchars($_GET['error']) . '</div>';
        }
    ?>
    <div style="text-align: center; margin-top: 1rem;">
        <p>¿Ya tienes cuenta? <a href="login.php">Inicia sesión aquí</a></p>
    </div>
</div>

<?php require_once 'templates/footer.php'; ?>
