/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * 
 * @param {type} page
 * @param {type} count
 * @returns {undefined}
 */
function Subjects(page, count){
    var params = {"page": page, "count": count};
    var data = {"cndt": {"attr": "avtive", "value": 1}};
    
    var request = "?op=0&file=subjects.json&table=Subjects&data=" + JSON.stringify(data);
    
    var action = function(json, keys = params) {
        var allSubjects = JSON.parse(json);
        var data = [
            {"info": "page_data", "value": ""},
            {"info": "pagination", "value": ""}
        ];            
              
        data[0]["value"] = JSON.stringify(FormatSubjectsIndexData(allSubjects, keys["page"], keys["count"]));
        data[1]["value"] = JSON.stringify(GetPagination(allSubjects.length, keys["count"]));
        
        LoadPage(subject_controller["folder"] + "Tasks.xhtml", data);
    };
    
    GetRequest(serverPath + request, action);
}

/**
 * 
 * @returns {undefined}
 */
function AddSubjectGet(){
    LoadPage(subject_controller["folder"] + 'AddSubject.xhtml');
}

/**
 * Adds a new subject in the database.
 * @returns {undefined}
 */
function AddSubjectPost(){
    var name = document.getElementById("name").value;
    var parentId = parseInt(document.getElementById("parent").value);
    
    var newSubject = {
        "name": '"' + name + '"',
        "parent_id": parentId,
        "active": 1
    };
    
    var request = "op=4&file=subjects.json&table=Subjects&data=" + JSON.stringify(newSubject);
    
    PostRequest(serverPath, request); 
    Subjects(1,5);
}

/**
 * Deletes the specified task from the database.
 * @param {Number} id - The id of the task to delete
 * @returns {undefined}
 */
function DeleteSubject(id){    
    var newState = [{"id": id, "active": 0}];

    var request = "op=2&file=subjects.json&table=Subjects&data=" + JSON.stringify(newState);
    
    PostRequest(serverPath, request); 
    Subjects(1,5);
}

/**
 * Load the subject edition page with the informations of the subject to edit.
 * @param {Number} id - The id of the subject to edit
 * @returns {undefined}
 */
function EditSubjectGet(id){
    var request = "?op=1&file=subjects.json&table=Subjects&id=" + id;
    
    var action = function(){
        var json = JSON.parse(xhr.responseText);
        var data = [
            {"info": "name", "value": json["name"]},
            {"info": "parent_id", "value": json["parent_id"]},
            {"info": "subject_id", "value": json["id"]},
            {"info": "parent_ids", "value": GetParentIds(json["id"])}
        ];
        
        LoadPage(subject_controller["folder"] + "EditSubject.xhtml", data);   
    };
    
    GetRequest(serverPath + request, action);
}

/**
 * Sends the changes of the edited subject to the database.
 * @param {Number} id - The id of the edited subject.
 * @returns {undefined}
 */
function EditSubjectPost(id){
    var name = document.getElementById("name").value;
    var parentId = parseInt(document.getElementById("parent_id").value);
    
    var editedSubject = [{
        "id": id,
        "name": name,
        "parent_id": parentId
    }];
    
    var request = "op=2&file=subjects.json&table=Subjects&data=" + JSON.stringify(editedSubject);  

    PostRequest(serverPath, request);  
    Subjects(1,5);
}

/**
 * Formats raw tasks informations so it can be displayed by the task index. 
 * @param {Object} allSubjects - The raw tasks informations.
 * @param {Number} subjectCount - The number of task displayed per page.
 * @param {Number} pageCount - The number of the current page.
 * @returns {Object} The formated information.
 */
function FormatSubjectIndexData(allSubjects, pageCount, subjectCount){
    var startIndex = (pageCount - 1) * subjectCount;
    var pageDataKeys = ["id", "name", "parent_name"];
    var pageData = {"keys": pageDataKeys, "data": []};
    
    for(var i = startIndex; i < pageCount * subjectCount && i < allSubjects.length; i++){
        pageData["data"].push({
            "id": allSubjects[i]["id"],
            "name": allSubjects[i]["name"],
            "parent_name": allSubjects[i]["parent_name"]
        });
    }
    
    return pageData;
}