<?php

abstract class Operation{
    const GetAll = 0;
    const Get = 1;
    const Update = 2;
    const Delete = 3;
    const Add = 4;
}

class Database{
    
    private $file;

    public function __construct($database)
    {
        $this->file = $database;
    }
    
    public function getAll($table, $condition){
        $data = json_decode(file_get_contents('../data/' . $this->file), true);
        return (string)json_encode($data[$table]);
    }
    
    public function dump($data){
        $fp = fopen('../data/phpdump.txt', 'w');
        fwrite($fp, $data);
        fclose($fp);
    }
}
