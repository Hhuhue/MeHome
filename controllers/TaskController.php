<?php

include_once 'Database.php';
$bd;

if(isset($_GET['op'])){    
    $bd = new Database($_GET['file']);
    
    switch ($_GET['op']){
        case Operation::GetAll :
            echo $bd->getAll($_GET['table'], ''); break;

        default:
            return -1;
    }
}