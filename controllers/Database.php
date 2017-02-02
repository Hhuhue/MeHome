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
        $entries = $this->getEntries($table);
        $filter = json_decode($condition, true);
        $filteredEntries = array();
        
        foreach($entries as $entry){
            if($entry[$filter["attr"]] === $filter["value"]){
                array_push($filteredEntries, $entry);
            }
        }
        
        return (string)json_encode($filteredEntries);
    }
    
    public function getById($table, $id){
        $entries = $this->getEntries($table);
        $match = array();
        
        foreach($entries as $entry){
            if($entry["id"] == $id){
               $match = $entry;
               break;
            }
        }
        
        return (string)json_encode($match);
    }
    
    public function update($table, $data){
        $entries = $this->getEntries($table);
        $infos = json_decode($data, true);
        
        for($j = 0; $j < count($infos); $j++){
            for($i = 0; $i < count($entries); $i++){
                if($entries[$i]['id'] === $infos[$j]['id']){                
                    foreach(array_keys($infos[$j]) as $info){
                        $entries[$i][$info] = $infos[$j][$info];
                    }
                    break;
                }            
            }
        }      
        
        $this->push($table, $entries);
    }
    
    public function add($table, $data){
        $entries = $this->getEntries($table);
        $id = $this->getEntries("Ids");
        $infos = json_decode($data, true);
        
        $newEntry = '{ "id": ' . ($id + 1);
        foreach(array_keys($infos) as $info){
            $newEntry = $newEntry . ',"' . $info . '": ' . $infos[$info];
        }
        $newEntry = $newEntry . '}';
        
        array_push($entries, json_decode($newEntry));
        
        $this->push($table, $entries);
        $this->push("Ids", $id + 1);
    }
    
    public function dump($data){
        $fp = fopen('../data/phpdump.txt', 'w');
        fwrite($fp, $data);
        fclose($fp);
    }
    
    private function getEntries($table){
        return json_decode(file_get_contents('../data/' . $this->file), true)[$table];
    }
    
    private function push($table, $new){
        $json = json_decode(file_get_contents('../data/' . $this->file), true);
        $json[$table] = $new;
        
        $fp = fopen('../data/' . $this->file, 'w');
        fwrite($fp, json_encode($json));
        fclose($fp);
    }
}
