<?php

class JSQL{
    public static function ExecuteQuery($query){        
        if(strpos($query, 'SELECT') !== false && strpos($query, 'FROM') !== false){
            $this->parseSelect($query);
        } else if (strpos($query, 'INSERT') !== false){
            
        } else if (strpos($query, 'UPDATE') !== false){
            
        } else if (strpos($query, 'DELETE') !== false){
            
        } else {
            echo "<br/>Invalid query!";
        }
    }  
    
    private static function parseSelect($query){
        //SELECT Tasks.description, Tasks.id, Subjects.name FROM Tasks JOIN Subjects ON Subjects.id = Tasks.subject_id WHERE completed = 0;
        $queryBlocks = $this->getSelectBlocks($query);
        
        $columns = explode(',', str_replace('SELECT', '', $queryBlocks["select"]));
        
    }
    
    private static function getSelectBlocks($query){
        $selectLength = strpos($query, 'FROM') - strpos($query, 'SELECT');        
        $fromLength = 0;
        $hasWhereBlock = (strpos($query, 'WHERE') !== false);
        
        if($hasWhereBlock){
                $fromLength = strpos($query, 'WHERE') - strpos($query, 'FROM');
        } else {
                $fromLength = strpos($query, ';') - strpos($query, 'FROM');	
        }

        $selectBlock = substr($query, strpos($query, 'SELECT'), $selectLength);
        $fromBlock = substr($query, strpos($query, 'FROM'), $fromLength);
        $whereBlock = "";
        
        if($hasWhereBlock){
            $whereBlock = substr($query, strpos($query, 'WHERE'));
        }  
        
        return array(
            "select" => $selectBlock, 
            "from" => $fromBlock,
            "where" => $whereBlock);
    }
}

