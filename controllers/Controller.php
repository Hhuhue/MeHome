<?php

include_once 'Database.php';
$bd;

if(isset($_GET['op'])){    
    $bd = new Database($_GET['file']);
    switch ($_GET['op']){
        case Operation::GetAll :
            echo $bd->getAll($_GET['table'], $_GET['data']); 
            break;
        case Operation::Get : 
            echo $bd->getById($_GET['table'], $_GET['id']); 
            break;
        case Operation::Count : 
            echo $bd->getCount($_GET['table'], $_GET['cndt']); 
            break;

        default:
            return -1;
    }
}
else if(isset($_POST['op'])){
    $bd = new Database($_POST['file']);
    
    switch ($_POST['op']){
        case Operation::Update :
            echo $bd->update($_POST['table'], $_POST['data']); 
            break;
        case Operation::Add :
            echo $bd->add($_POST['table'], $_POST['data']);
            break;
        case Operation::Delete : 
            echo $bd->delete($_POST['table'], $_POST['id']);
            break;
        
        default:
            return -1;
    }
}