
var task_controller = {
    "folder": 'views/Tasks/',
    "index": function(page, count){ Tasks(page, count); },
    "add_get": function() { AddTaskGet();},
    "add_post": function(){ AddTaskPost(); },
    "update": function(){ UpdateTasks(); },
    "edit_get": function(id){ EditTaskGet(id); },
    "edit_post": function(id){ EditTaskPost(id); },
    "complete": function(id) { CompleteTask(id); }
};

function Tasks(page, count){
    var params = {"page": page, "count": count};
    var data = {"cndt": {"attr": "completed", "value": 0}};
    
    var path = root + "controllers/Controller.php";
    var request = "?op=0&file=tasks.json&table=Tasks&data=" + JSON.stringify(data);
    
    var action = function(json, keys = params) {
        var allTasks = JSON.parse(json);
        var count = allTasks.length;
        var data = [
            {"info": "page_data", "value": ""},
            {"info": "pagination", "value": ""}
        ];            
              
        data[0]["value"] = JSON.stringify(FormatTaskIndexData(allTasks, keys, count));
        data[1]["value"] = JSON.stringify(GetTaskPagination(count, keys["count"]));
        
        LoadPage(task_controller["folder"] + "Tasks.xhtml", data);
    };
    
    GetRequest(path + request, action);
}

function AddTaskGet(){
    LoadPage(task_controller["folder"] + "AddTask.xhtml");
}

/**
 * Adds a new task in the database.
 * @returns {undefined}
 */
function AddTaskPost(){
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
    var path = root + "controllers/Controller.php";

    PostRequest(path, request);
    task_controller["index"](1,5);
}

/**
 * Updates one or many tasks from the database.
 * @returns {undefined}
 */
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
    var path = root + "controllers/Controller.php";
    
    PostRequest(path, request); 
}

/**
 * Deletes the specified task from the database.
 * @param {Number} id - The id of the task to delete
 * @returns {undefined}
 */
function DeleteTask(id){    
    var request = "op=3&file=tasks.json&table=Tasks&id=" + id;
    var path = root + "controllers/Controller.php";
    
    PostRequest(path, request);
    LoadPage("views/" + task_controller["folder"] + "Tasks.xhtml", [{"info": "page", "value": 1}]);
}

/**
 * Load the task edition page with the informations of the task to edit.
 * @param {Number} id - The id of the task to edit
 * @returns {undefined}
 */
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
                        {"info": "description", "value": json["description"]},
                        {"info": "progress", "value": json["progress"]},
                        {"info": "weight", "value": json["weight"]},
                        {"info": "date", "value": json["date"]},
                        {"info": "task_id", "value": json["id"]}
                    ];
                    LoadPage(task_controller["folder"] + "EditTask.xhtml", data);                   
                }    
                               
            } else {
                console.error(xhr);
            }
        }
    };
    
    xhr.open("GET", root + "controllers/Controller.php?" + request, true);
    xhr.send();
}

/**
 * Sends the changes of the edited task to the database.
 * @param {Number} id - The id of the edited task
 * @returns {undefined}
 */
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
    var path = root + "controllers/Controller.php";

    PostRequest(path, request); 
    task_controller["index"](1,5);
}

/**
 * Changes the state of a task to completed.
 * @param {Number} id - The id of the completed task
 * @returns {undefined}
 */
function CompleteTask(id){    
    var modif = [{"id": id, "completed": 1}];
    
    var request = "op=2&file=tasks.json&table=Tasks&data=" + JSON.stringify(modif);
    var path = root + "controllers/Controller.php";
    
    PostRequest(path, request);
    task_controller["index"](1,5);
}

function GetTaskPagination(elementCount, pageCount){
    var pagination = [];
        
    do {
        pagination.push({"page": pagination.length + 1});
        elementCount -= pageCount;
    } while (elementCount >= 0);
    
    return {"keys": ["page"], "data": pagination };
}

function FormatTaskIndexData(allTasks, keys, count){
    var startIndex = (keys["page"] - 1) * keys["count"];
    var pageDataKeys = ["id", "description", "progress", "weight", "date"];
    var pageData = {"keys": pageDataKeys, "data": []};
    
    for(var i = startIndex; i < keys["page"] * keys["count"] && i < count; i++){
        pageData["data"].push({
            "id": allTasks[i]["id"],
            "description": allTasks[i]["description"],
            "progress": allTasks[i]["progress"],
            "weight": allTasks[i]["weight"],
            "date": allTasks[i]["date"]
        });
    }
    
    return pageData;
}