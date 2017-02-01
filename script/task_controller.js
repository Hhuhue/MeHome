/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function AddTask(){
    var description = document.getElementById("desc").value;
    var weight = parseInt(document.getElementById("score").value);
    var progress = parseInt(document.getElementById("comp").value);
    var date = document.getElementById("date").value;
    
    var json = {};
    
    loadJSON("data/tasks.json", 
        function(json, keys){
            
            json["Tasks"].push({
                "id": ++json["Ids"], 
                "description": keys["desc"],
                "progress": keys["comp"],
                "weight": keys["weight"],
                "date": keys["date"],
                "completed": false
            });
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost/controllers/TaskController.php", true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.send(JSON.stringify(json));
        },
        function(error){
            console.error(error);
        },
        {"desc": description, "weight": weight, "comp": progress, "date": date}
    );   
}

function UpdateTasks(){
    var bars = document.getElementsByName("bar_complete");
    var barsToUpdate = [];
    
    for(var i = 0; i < bars.length; i++){
        var barData = bars[i].getAttribute("data").split(",");
        
        if(barData.length === 3){
            var id = parseInt(bars[i].getAttribute("id").split("_")[2]);
            var filled = parseInt(barData[1].split(":")[1]);
            
            barsToUpdate.push({"id":id, "filled": filled});
            bars[i].setAttribute("data", barData[0] + "," + barData[1]);
        }
    }
    
    loadJSON("data/tasks.json", 
        function(json, keys){
            
            for(var j = 0; j < keys.length; j++){
                for(var i = 0; i < json["Tasks"].length; i++){
                    if(json["Tasks"][i]["id"] === keys[j]["id"]){
                        json["Tasks"][i]["progress"] = keys[j]["filled"];
                        break;
                    }
                }                
            }
            
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost/controllers/TaskController.php", true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
            xhr.send(JSON.stringify(json));
        },
        function(error){
            console.error(error);
        },
        barsToUpdate
    );   
}

function DeleteTask(id){
    
}

function CompleteTask(id){
    
}


