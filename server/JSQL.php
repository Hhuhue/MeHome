<?php
$test = "SELECT t.description, t.id, s.name, s2.name" . 
	" FROM Tasks t JOIN Subjects s ON s.id = t.subject_id" .
	" JOIN Subjects s2 ON s2.id = s.parent_id" .
	" WHERE completed = 0;";

class JSQL{
    
    private $tablesName;
    private $tables;
    private $columns;
    
    public function ExecuteQuery($query){        
        if(strpos($query, 'SELECT') !== false && strpos($query, 'FROM') !== false){
            $this->parseSelect($query);
        } else if (strpos($query, 'INSERT') !== false){
            
        } else if (strpos($query, 'UPDATE') !== false){
            
        } else if (strpos($query, 'DELETE') !== false){
            
        } else {
            echo "Invalid query!";
        }
    }  
    
    private function parseSelect($query){
        $queryBlocks = $this->getSelectBlocks($query);
        
        $this->columns = explode(',', str_replace('SELECT', '', $queryBlocks["select"]));
        
        $fromBlocks = (strpos('JOIN', $queryBlocks["from"]) !== false) 
                ? explode('JOIN', $queryBlocks["from"]) 
                : array(0 => $queryBlocks["from"]);
        
        $fromBlocks[0] = str_replace('FROM', '', $fromBlocks[0]);
        $fromTable = explode(' ', $fromBlocks[0])[1];

        $this->tablesName = array(explode(' ', $fromBlocks[0])[2] => explode(' ', $fromBlocks[0])[1]);
        $this->tables[$fromTable] = json_decode(file_get_contents('../data/' . strtolower($fromTable) . '.json'), true)[$fromTable];

        for($i = 1; $i < count($fromBlocks); $i++){
            $joinTable = explode(' ', explode('ON', $fromBlocks[$i])[0]);
            $this->tablesName[$joinTable[2]] = $joinTable[1];
        }
        
        $result = [];
        
        foreach($this->tables[$fromTable] as $entry){
            $line = [];
            
            if($this->doesEntryRespectCondition($entry, $queryBlocks["where"], $fromTable)){
                foreach($this->columns as $info){
                    $colInfo = explode('.', str_replace(' ', '', $info));
                    if($this->tablesName[$colInfo[0]] == $fromTable){
                        array_push($line, $entry[$colInfo[1]]);
                    }
                }
                array_push($result, $line);  
            }    
        }
        var_dump($result);        
    }
    
    private function getSelectBlocks($query){
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
    
    private function doesEntryRespectCondition($entry, $whereBlock, $fromTable){
        if($whereBlock == ""){
            return true;
        }        
        $whereVariables = [];
        $whereParts = explode(' ', $whereBlock);
        
        foreach($whereParts as $part){
            if(strpos($part, '.') !== false){
                array_push($whereVariables, $part);
            }
        }
        
        $toEval = str_replace('WHERE', '', $whereBlock);
        $toEval = str_replace('==', '===', $toEval);
        $toEval = str_replace('!=', '!==', $toEval);
        $toEval = str_replace('AND', '&&', $toEval);
        $toEval = str_replace('OR', '||', $toEval);
        
        foreach($whereVariables as $info){ 
            $colInfo = explode('.', str_replace(' ', '', $info));
            if($this->tablesName[$colInfo[0]] == $fromTable){
                $toEval = str_replace($info, $entry[$colInfo[1]], $toEval);
            }
        }
        
        return eval("return $toEval");
    }
    
    private function joinData(){
        
    }
}

