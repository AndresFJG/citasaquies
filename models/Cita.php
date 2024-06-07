<?php

namespace Model;

class Cita extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'citas';
    protected static $columnasDB = ['id','nombre','fecha', 'hora',];

    public $id;
    public $fecha;
    public $hora;
    public $nombre;

    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
    }
}