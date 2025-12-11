<?php
// Declaración de la clase Conexion
class Conexion {
    private $host = "localhost";
    private $user = "root";
    private $password = "1234";
    private $database = "bodegatienda";
    private $port = "3306";
    private $conn;
    //Declaración del constructor (lo dejo vacío para iniciar sesión con diferentes usuarios)
    //A FUTURO: No descartar colocar un constructor para conectarse vía remota, aunque creo que no sería por aquí
    // public function __construct($user, $password){
    //     $this->user = $user;
    //     $this->password = $password;
    // }

    public function __construct(){
        //Constructor vacío
    }

    //Funcion para conectar a través de mysqli (facilisimo vdd?)
    public function conectar(){
        $this->conn = new mysqli($this->host, $this->user, $this->password, $this->database, $this->port);


        //Verificación de conexión correcta
        if ($this->conn->connect_error){
            die("Hubo una conexión fallida chavo" . $this->conn->connect_error);
        }

        $this->conn->set_charset("utf8");
        return $this->conn;
    }

    //Método para cerrar conexión
    public function cerrar(){
        if($this->conn){
            $this->conn->close();
        }
    }

    //Obtener conexión actual
    public function getConexion(){
        return $this->conn;
    }

    public function logActivity($id_empleado, $tipo, $descripcion) {
        // Asegurar que la conexión esté abierta
        if (!$this->conn) { $this->conectar(); }
        
        $sql = "INSERT INTO registro_actividad (id_empleado, tipo_accion, descripcion) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        
        if ($stmt) {
            $stmt->bind_param("iss", $id_empleado, $tipo, $descripcion);
            $stmt->execute();
            $stmt->close();
        }
    }
}
//Según VSC, la etiqueta para cerrar php es innecesaria.
