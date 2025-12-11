<?php
// endpoints/crear_respaldo.php
require_once '../config/DBManager.php';
header('Content-Type: application/json');

// Aumentar tiempo de ejecución y memoria para bases de datos grandes
ini_set('max_execution_time', 600);
ini_set('memory_limit', '256M');

try {
    $db = new Conexion();
    $conn = $db->conectar();
    
    // Configuración
    $fecha = date('Y-m-d_H-i-s');
    $nombreArchivo = "backup_$fecha.sql";
    $rutaCarpeta = "../respaldos/";
    $rutaCompleta = $rutaCarpeta . $nombreArchivo;

    // Verificar si la carpeta existe, si no, crearla
    if (!file_exists($rutaCarpeta)) {
        mkdir($rutaCarpeta, 0777, true);
    }

    // Obtener lista de tablas
    $tablas = [];
    $result = $conn->query("SHOW TABLES");
    while ($row = $result->fetch_row()) {
        $tablas[] = $row[0];
    }

    $sqlScript = "-- RESPALDO AUTOMÁTICO JUANRRY \n";
    $sqlScript .= "-- FECHA: " . date("d-m-Y H:i:s") . "\n";
    $sqlScript .= "-- --------------------------------------------------------\n\n";

    // Recorrer tablas
    foreach ($tablas as $tabla) {
        // Estructura de la tabla
        $row = $conn->query("SHOW CREATE TABLE $tabla")->fetch_row();
        $sqlScript .= "\nDROP TABLE IF EXISTS `$tabla`;\n";
        $sqlScript .= "\n\n" . $row[1] . ";\n\n";

        // Datos de la tabla
        $result = $conn->query("SELECT * FROM $tabla");
        $numFields = $result->field_count;

        for ($i = 0; $i < $numFields; $i++) {
            while ($row = $result->fetch_row()) {
                $sqlScript .= "INSERT INTO $tabla VALUES(";
                for ($j = 0; $j < $numFields; $j++) {
                    $row[$j] = addslashes($row[$j]);
                    $row[$j] = str_replace("\n", "\\n", $row[$j]);
                    if (isset($row[$j])) {
                        $sqlScript .= '"' . $row[$j] . '"';
                    } else {
                        $sqlScript .= '""';
                    }
                    if ($j < ($numFields - 1)) {
                        $sqlScript .= ',';
                    }
                }
                $sqlScript .= ");\n";
            }
        }
    }

    // Guardar el archivo
    if (file_put_contents($rutaCompleta, $sqlScript)) {
        session_start(); // Necesario para saber quién lo hizo
        $db->logActivity($_SESSION['id_empleado'], 'RESPALDO', "Se generó el respaldo: $nombreArchivo");
        echo json_encode(['success' => true, 'message' => 'Respaldo creado correctamente', 'file' => $nombreArchivo]);
    } else {
        throw new Exception("No se pudo escribir el archivo en el servidor.");
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}