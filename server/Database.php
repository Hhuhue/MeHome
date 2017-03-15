<?php

abstract class Operation{
    const GetAll = 0;
    const Get = 1;
    const Update = 2;
    const Delete = 3;
    const Add = 4;
    const Count = 5;
}

class Database{
    
    private $file;

    public function __construct($database)
    {
        $this->file = $database;
    }
    
    public function getAll($table, $params){
        $entries = $this->getEntries($table);
        $data = json_decode($params, true);
        if(isset($data['cndt'])){  
            $filter = $data['cndt'];  
            $filteredEntries = array();        
            foreach($entries as $entry){
                if(isset($entry[$filter["attr"]]) && $entry[$filter["attr"]] === $filter["value"]){
                    array_push($filteredEntries, $entry);
                }
            }
            
            $entries = $filteredEntries;
        }
        
        if(isset($data['display'])){
            $display = $data['display'];
            $startIndex = ($display['page'] - 1) * $display['count'];
            $entriesToKeep = array();               
           
            for($i = $startIndex; $i < ($startIndex + $display['count']) && $i < count($entries); $i++){
                    array_push($entriesToKeep, $entries[$i]);
            }
            
            $entries = $entriesToKeep;
        }
        
        
        return (string)json_encode($entries);
    }
    
    public function getCount($table, $conditions){
        $entries = $this->getEntries($table);
        $filter = json_decode($conditions, true);
        
        if(isset($filter)){    
            $filteredEntries = array();   
            
            foreach($entries as $entry){
                if($entry[$filter["attr"]] === $filter["value"]){
                    array_push($filteredEntries, $entry);
                }
            }
            
            $entries = $filteredEntries;
        }
        
        return count($entries);
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
                    foreach(array_keys($infos[$j]) as $key){
                        $entries[$i][$key] = $infos[$j][$key];
                    }
                    break;
                }            
            }
        }      
        
        $entries = array_values($entries);
        $this->push($table, $entries);
    }
    
    public function add($table, $data){
        $entries = $this->getEntries($table);
        $id = $this->getEntries("Ids");
        $infos = json_decode($data, true);
        
        $newEntry = '{ "id": ' . ($id + 1);
        foreach(array_keys($infos) as $info){
            $newEntry = $newEntry . ',"' . $info . '": ' . (($infos[$info] == '') ? 'null' : $infos[$info]);
        }
        $newEntry = $newEntry . '}';
        
        array_push($entries, json_decode($newEntry));
        
        $entries = array_values($entries);
        $this->push($table, $entries);
        $this->push("Ids", $id + 1);
    }
    
    public function delete($table, $id){
        $entries = $this->getEntries($table);
        
        for($i = 0; $i < count($entries); $i++){
            if($entries[$i]["id"] == $id){
               unset($entries[$i]);
               break;
            }
        }
        $entries = array_values($entries);
        $this->push($table, $entries);
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
