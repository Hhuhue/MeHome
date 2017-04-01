/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Shows all uncompleted tasks.
 * @param {Number} page - The current display page number.
 * @param {Number} count - The number of tasks displayed per page.
 * @returns {undefined}
 */
function Tasks(page, count){
    var params = {"page": page, "count": count};
    var data = {"cndt": {"attr": "completed", "value": 0}};
    
    var query = "SELECT t.id, t.description, t.progress, t.weight, t.date" +
                "FROM Tasks t WHERE t.completed == 0;"
        
    var request = "?query=" + query;
    
    var action = function(json, keys = params) {
        var allTasks = JSON.parse(json)["Lines"];
        
        var data = [
            {"info": "page_data", "value": ""},
            {"info": "pagination", "value": ""}
        ];            
              
        data[0]["value"] = JSON.stringify(FormatTaskIndexData(allTasks, keys["page"], keys["count"]));
        data[1]["value"] = JSON.stringify(GetPagination(allTasks.length, keys["count"]));
        
        LoadPage(task_controller["folder"] + "Tasks.xhtml", data);
    };
    
    GetRequest(serverPath + request, action);
}

/**
 * Shows the task creation form.
 * @returns {undefined}
 */
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
    
    var newTask = {
        "description": '"' + description + '"',
        "progress": progress,
        "weight": weight,
        "date": '"' + date + '"',
        "completed": 0
    };
    
    var request = "op=4&file=tasks.json&table=Tasks&data=" + JSON.stringify(newTask);

    PostRequest(serverPath, request);
    Tasks(1,5);
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
    
    PostRequest(serverPath, request); 
}

/**
 * Deletes the specified task from the database.
 * @param {Number} id - The id of the task to delete.
 * @returns {undefined}
 */
function DeleteTask(id){    
    var request = "op=3&file=tasks.json&table=Tasks&id=" + id;
    
    PostRequest(serverPath, request);
    
    Tasks(1,5);
}

/**
 * Load the task edition page with the informations of the task to edit.
 * @param {Number} id - The id of the task to edit.
 * @returns {undefined}
 */
function EditTaskGet(id){
    var query = "SELECT t.id, t.description, t.progress, t.weight, t.date" +
                "FROM Tasks t WHERE t.id == " + id + ";"
        
    var request = "?query=" + query;
    var action = function(json){              
        var taskToEdit = JSON.parse(json)["Lines"][0];
        var pageData = [
            {"info": "description", "value": taskToEdit["t.description"]},
            {"info": "progress", "value": taskToEdit["t.progress"]},
            {"info": "weight", "value": taskToEdit["t.weight"]},
            {"info": "date", "value": taskToEdit["t.date"]},
            {"info": "task_id", "value": taskToEdit["t.id"]}
        ];
        LoadPage(task_controller["folder"] + "EditTask.xhtml", pageData);                   
    };    
    GetRequest(serverPath + request, action);
}

/**
 * Sends the changes of the edited task to the database.
 * @param {Number} id - The id of the edited task.
 * @returns {undefined}
 */
function EditTaskPost(id){
    var description = document.getElementById("desc").value;
    var weight = parseInt(document.getElementById("score").value);
    var progress = parseInt(document.getElementById("comp").value);
    var date = document.getElementById("date").value;
    
    var editedTask = [{
        "id": id,
        "description": description,
        "progress": progress,
        "weight": weight,
        "date": date
    }];
    
    var request = "op=2&file=tasks.json&table=Tasks&data=" + JSON.stringify(editedTask);

    PostRequest(serverPath, request); 
    Tasks(1,5);
}

/**
 * Changes the state of a task to completed.
 * @param {Number} id - The id of the completed task.
 * @returns {undefined}
 */
function CompleteTask(id){    
    var newState = [{"id": id, "completed": 1}];
    
    var request = "op=2&file=tasks.json&table=Tasks&data=" + JSON.stringify(newState);
    
    PostRequest(serverPath, request);
    Tasks(1,5);
}

/**
 * Formats raw tasks informations so it can be displayed by the task index. 
 * @param {Object} allTasks - The raw tasks informations.
 * @param {Number} taskCount - The number of task displayed per page.
 * @param {Number} pageCount - The number of the current page.
 * @returns {Object} The formated information.
 */
function FormatTaskIndexData(allTasks, pageCount, taskCount){
    var startIndex = (pageCount - 1) * taskCount;
    var pageDataKeys = ["id", "description", "progress", "weight", "date"];
    var pageData = {"keys": pageDataKeys, "data": []};
    
    for(var i = startIndex; i < pageCount * taskCount && i < allTasks.length; i++){
        pageData["data"].push({
            "id": allTasks[i]["t.id"],
            "description": allTasks[i]["t.description"],
            "progress": allTasks[i]["t.progress"],
            "weight": allTasks[i]["t.weight"],
            "date": allTasks[i]["t.date"]
        });
    }
    
    return pageData;
}