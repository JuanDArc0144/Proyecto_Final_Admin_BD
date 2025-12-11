<?php
// endpoints/listar_respaldos.php
header('Content-Type: application/json');

$directorio = "../respaldos/";
$archivos = [];
$totalSize = 0;

if (is_dir($directorio)) {
    // Escanear carpeta buscando .sql
    $files = glob($directorio . "*.sql");
    
    // Ordenar por fecha de modificación (más nuevo primero)
    usort($files, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });

    foreach ($files as $file) {
        $size = filesize($file);
        $totalSize += $size;
        
        $archivos[] = [
            'nombre' => basename($file),
            'fecha' => date("d/m/Y H:i:s", filemtime($file)),
            'timestamp' => filemtime($file), // Para ordenar si hace falta
            'size' => $size,
            'path' => $file
        ];
    }
}

echo json_encode([
    'success' => true,
    'data' => $archivos,
    'stats' => [
        'count' => count($archivos),
        'total_size' => $totalSize,
        'last_backup' => count($archivos) > 0 ? $archivos[0]['fecha'] : 'N/A'
    ]
]);