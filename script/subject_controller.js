
var folder = 'Subjects/';
var dataFile = 'subjects.json';
var dataTable = 'Subjects';

/**
 * Adds a new task in the database.
 * @returns {undefined}
 */
function AddSubject(){
    var name = document.getElementById("name").value;
    var parentId = parseInt(document.getElementById("parent").value);
    
    var json = {
        "name": '"' + name + '"',
        "parent_id": parentId,
        "active": 1
    };
    
    var request = "op=4&file=" + dataFile + "&table=" + dataTable + "&data=" + JSON.stringify(json);
    var path = root + "controllers/Controller.php";

    PostRequest(path, request);
    LoadPage('views/'+ folder + 'Subjects.xhtml', [{"info": "page", "value": 1}]);
}

/**
 * Deletes the specified task from the database.
 * @param {Number} id - The id of the task to delete
 * @returns {undefined}
 */
function DeleteSubject(id){    
    var path = root + "controllers/Controller.php";
    
    var json = [{
        "id": id,
        "active": 0
    }];

    var request = "op=2&file=" + dataFile + "&table=" + dataTable + "&data=" + JSON.stringify(json);
    
    PostRequest(path, request);
    LoadPage("views/" + folder + "Subjects.xhtml", [{"info": "page", "value": 1}]);
}

/**
 * Load the task edition page with the informations of the task to edit.
 * @param {Number} id - The id of the task to edit
 * @returns {undefined}
 */
function EditSubjectGet(id){
    var xhr = new XMLHttpRequest();
    var request = "op=1&file=" + dataFile + "&table=" + dataTable + "&id=" + id;
    
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
                        {"info": "name", "value": json["name"]},
                        {"info": "parent_id", "value": json["parent_id"]},
                        {"info": "subject_id", "value": json["id"]},
                        {"info": "parent_ids", "value": GetParentIds(json["id"])}
                    ];
                    LoadPage("views/" + folder + "EditSubject.xhtml", data);                   
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
function EditSubjectPost(id){
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
    
    var request = "op=2&file=" + dataFile + "&table=" + dataTable + "&data=" + JSON.stringify(json);
    var path = root + "controllers/Controller.php";

    PostRequest(path, request); 
    LoadPage('views/' + folder + 'Subjects.xhtml', [{"info": "page", "value": 1}]);
}

function GetParentIds(id){
    var request = "op=0&file=" + dataFile + "&table=" + dataTable + '&cndt={"cndt":{"attr":"active","value":1}}';
    var responseData = GetRequest(request);
    alert(responseData);
    return responseData;
    
}