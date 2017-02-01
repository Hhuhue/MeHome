<?php

$fp = fopen('../data/tasks.json', 'w');
fwrite($fp, file_get_contents("php://input"));
fclose($fp);