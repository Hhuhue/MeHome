<?php
$exemple = "SELECT t.description, t.id, s.name, s2.name" . 
	" FROM Tasks t JOIN Subjects s ON s.id = t.subject_id" .
	" JOIN Subjects s2 ON s2.id = s.parent_id" .
	" WHERE completed = 0;";

class JSQL{
    
    private $tables;
    private $tablesName;
    private $tablesJoint;
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
        
        $fromBlocks = (strpos($queryBlocks["from"], 'JOIN') !== false) 
                ? explode('JOIN', $queryBlocks["from"]) 
                : array(0 => $queryBlocks["from"]);
        
        $fromBlocks[0] = str_replace('FROM', '', $fromBlocks[0]);
        $fromTable = explode(' ', $fromBlocks[0])[1];
        $fromPref = explode(' ', $fromBlocks[0])[2];

        $this->tablesName = array($fromPref => $fromTable);
        $this->tables[$fromTable] = json_decode(file_get_contents('../data/' . strtolower($fromTable) . '.json'), true)[$fromTable];

        for($i = 1; $i < count($fromBlocks); $i++){
            $joinParts = explode('ON', $fromBlocks[$i]);
            $joinTable = explode(' ', $joinParts[0]);
            $this->tablesName[$joinTable[2]] = $joinTable[1];
            $this->tablesJoint[$joinTable[2]] = $joinParts[1];
        }
        
        $result = array("Lines" => []);
        
        foreach($this->tables[$fromTable] as $entry){
            $line = array();
            
            if($this->doesEntryRespectCondition($entry, $queryBlocks["where"], $fromPref)){
                foreach($this->columns as $info){
                    $colInfo = explode('.', str_replace(' ', '', $info));
                    if($colInfo[0] == $fromPref){
                        $value = strlen(strval($entry[$colInfo[1]])) === 0 ? 'null' : $entry[$colInfo[1]];
                        $line[str_replace(' ', '', $info)] = $value;
                    } else {
                        $line[str_replace(' ', '', $info)] = $this->joinData($entry, $info, $fromPref);
                    }
                }
                array_push($result["Lines"], $line);  
            }    
        }        
       
        echo json_encode($result);
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
    
    private function doesEntryRespectCondition($entry, $whereBlock, $fromPref){
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
            if($colInfo[0] == $fromPref){
                $value = (strlen(strval($entry[$colInfo[1]])) === 0 ? 'null' : $entry[$colInfo[1]]);
                $toEval = str_replace($info, $value, $toEval);
            } else {
                $toEval = str_replace($info, $this->joinData($entry, $info, $fromPref), $toEval);
            }
        }
        return eval("return $toEval;");
    }
    
    private function joinData($entry, $data, $fromPref){
        $dataParts = explode('.', str_replace(' ', '', $data));
        $tablePref = $dataParts[0];        
        $tableName = $this->tablesName[$tablePref];
        
        if(!isset($this->tables[$tableName])){
            $this->tables[$tableName] = json_decode(file_get_contents('../data/' . strtolower($tableName) . '.json'), true)[$tableName];            
        }
        
        $joinCondition = $this->tablesJoint[$tablePref];
        $joinVariables = [];
        $joinParts = explode(' ', $joinCondition);        
        
        foreach($joinParts as $part){
            if(strpos($part, '.') !== false){
                array_push($joinVariables, $part);
            }
        }
        
        foreach($joinVariables as $info){ 
            $colInfo = explode('.', str_replace(' ', '', $info));
            if($colInfo[0] == $fromPref){
                $value = strlen(strval($entry[$colInfo[1]])) === 0 ? 'null' : $entry[$colInfo[1]];
                $joinCondition = str_replace($info, $value, $joinCondition);
            }
        }
        
        foreach($this->tables[$tableName] as $joinedEntry){
            if($this->doesEntryRespectCondition($joinedEntry, $joinCondition, $tablePref)){
                $value = strlen(strval($joinedEntry[$dataParts[1]])) === '' ? null : $joinedEntry[$dataParts[1]];
                return $value;
            }
        }
        
        return null;
    }
    
    private function dump($data){
        $fp = fopen('../data/phpdump.txt', 'w');
        fwrite($fp, $data);
        fclose($fp);
    }
}

