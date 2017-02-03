/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var root = "http://localhost/MeHome/public_html/";

function AddTask(){
    var description = document.getElementById("desc").value;
    var weight = parseInt(document.getElementById("score").value);
    var progress = parseInt(document.getElementById("comp").value);
    var date = document.getElementById("date").value;
    
    var json = {
        "description": '"' + description + '"',
        "progress": progress,
        "weight": weight,
        "date": '"' + date + '"',
        "completed": 0
    };
    
    var request = "op=4&file=tasks.json&table=Tasks&data=" + JSON.stringify(json);
    var path = root + "controllers/TaskController.php";

    SendRequest(path, request);
}

function UpdateTasks(){
    var bars = document.getElementsByName("bar_complete");
    var barsToUpdate = [];
    
    for(var i = 0; i < bars.length; i++){
        var barData = bars[i].getAttribute("data").split(",");
        
        if(barData.length === 3){
            var id = parseInt(bars[i].getAttribute("id").split("_")[2]);
            var filled = parseInt(barData[1].split(":")[1]);
            
            barsToUpdate.push({"id":id, "progress": filled});
            bars[i].setAttribute("data", barData[0] + "," + barData[1]);
        }
    }
    var request = "op=2&file=tasks.json&table=Tasks&data=" + JSON.stringify(barsToUpdate);
    var path = root + "controllers/TaskController.php";
    
    SendRequest(path, request); 
}

function DeleteTask(id){
    
}

function EditTaskGet(id){
    var xhr = new XMLHttpRequest();
    var request = "op=1&file=tasks.json&table=Tasks&id=" + id;
    
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                
                if(response.search('<br />') !== -1){
                    document.getElementById('content').innerHTML = response;
                } else {
                    var json = JSON.parse(xhr.responseText);
                    var data = [
                        ["description", json["description"]],
                        ['progress', json["progress"]],
                        ["weight", json["weight"]],
                        ["date", json["date"]],
                        ["task_id", json["id"]]
                    ];
                    LoadPage("views/EditTask.xhtml", data);                   
                }    
                               
            } else {
                console.error(xhr);
            }
        }
    };
    
    xhr.open("GET", root + "controllers/TaskController.php?" + request, true);
    xhr.send();
}

function EditTaskPost(id){
    var description = document.getElementById("desc").value;
    var weight = parseInt(document.getElementById("score").value);
    var progress = parseInt(document.getElementById("comp").value);
    var date = document.getElementById("date").value;
    
    var json = [{
        "id": id,
        "description": description,
        "progress": progress,
        "weight": weight,
        "date": date
    }];
    
    var request = "op=2&file=tasks.json&table=Tasks&data=" + JSON.stringify(json);
    var path = root + "controllers/TaskController.php";

    SendRequest(path, request);
}

function CompleteTask(id){
    
    var modif = [{"id": id, "completed": 1}];
    
    var request = "op=2&file=tasks.json&table=Tasks&data=" + JSON.stringify(modif);
    var path = root + "controllers/TaskController.php";
    
    SendRequest(path, request); 
}

function SendRequest(path, params){
        
    var xhr = new XMLHttpRequest();
    xhr.open("POST", path, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function(){
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var response = xhr.responseText;
                if(response.search('<br />') !== -1){
                    document.getElementById('content').innerHTML = response;
                } else {
                    alert(xhr.responseText);                    
                }

            } else {
                console.error(xhr);
            }
        }
    };
    
    xhr.send(params);
}




