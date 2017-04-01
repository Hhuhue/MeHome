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
    
    var query = "SELECT s.id, s.name, s2.name FROM Subjects s JOIN Subjects s2 ON s.parent_id == s2.id WHERE s.active == 1;";
    var request = "?query=" + query;
    
    var action = function(json, keys = params) {
        var allSubjects = JSON.parse(json)["Lines"];
        var data = [
            {"info": "page_data", "value": ""},
            {"info": "pagination", "value": ""}
        ];            
              
        data[0]["value"] = JSON.stringify(FormatSubjectIndexData(allSubjects, keys["page"], keys["count"]));
        data[1]["value"] = JSON.stringify(GetPagination(allSubjects.length, keys["count"]));
        
        LoadPage(subject_controller["folder"] + "Subjects.xhtml", data);
    };
    
    GetRequest(serverPath + request, action);
}

/**
 * 
 * @returns {undefined}
 */
function AddSubjectGet(){
    var query = "SELECT s.id, s.name FROM Subjects s;";
    var request = "?query=" + query;    

    var action = function(json){
        var result = JSON.parse(json)["Lines"];
        var data = [
            {"info": "subject_list", "value": JSON.stringify(FormatParentSubjects(result))}
        ];

        LoadPage(subject_controller["folder"] + 'AddSubject.xhtml', data);
    };    
    
    GetRequest(serverPath + request, action);
}

/**
 * Adds a new subject in the database.
 * @returns {undefined}
 */
function AddSubjectPost(){
    var name = document.getElementById("name").value;
    var parentId = parseInt(document.getElementById("parent_id").value);
    
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
    var parentQuery = "SELECT s.id, s.name FROM Subjects s WHERE s.id != " + id + ";";
    var parentRequest = "?query=" + parentQuery;
    
    var firstAction = function(firstJson){
        var query = "SELECT s.id, s.parent_id, s.name FROM Subjects s WHERE s.id == " + id + ";";
        var request = "?query=" + query;
        var parsedJson = JSON.parse(firstJson);
        var action = function(json, parents = parsedJson["Lines"]){
            var result = JSON.parse(json)["Lines"][0];
            var data = [
                {"info": "subject_name", "value": result["s.name"]},
                {"info": "parent_id", "value": result["s.parent_id"]},
                {"info": "subject_id", "value": result["s.id"]},
                {"info": "subject_list", "value": JSON.stringify(FormatParentSubjects(parents))}
            ];
            
            console.log(JSON.stringify(result));
            LoadPage(subject_controller["folder"] + "EditSubject.xhtml", data);   
        };
    
        GetRequest(serverPath + request, action);
    };
    
    GetRequest(serverPath + parentRequest, firstAction);
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
 * Formats raw subjects informations so it can be displayed by the subject index. 
 * @param {Object} allSubjects - The raw subjects informations.
 * @param {Number} subjectCount - The number of subject displayed per page.
 * @param {Number} pageCount - The number of the current page.
 * @returns {Object} The formated information.
 */
function FormatSubjectIndexData(allSubjects, pageCount, subjectCount){
    var startIndex = (pageCount - 1) * subjectCount;
    var pageDataKeys = ["id", "name", "parent_name"];
    var pageData = {"keys": pageDataKeys, "data": []};
    
    for(var i = startIndex; i < pageCount * subjectCount && i < allSubjects.length; i++){
        pageData["data"].push({
            "id": allSubjects[i]["s.id"],
            "name": allSubjects[i]["s.name"],
            "parent_name": allSubjects[i]["s2.name"]
        });
    }
    
    return pageData;
}

/**
 * Formats raw subjects informations so it can be displayed by the subject index. 
 * @param {Object} allSubjects - The raw subjects informations.
 * @returns {Object} The formated information.
 */
function FormatParentSubjects(allSubjects){
    var pageDataKeys = ["id", "name"];
    var pageData = {"keys": pageDataKeys, "data": [{"id": "", "name": "N/A"}]};
    
    for(var i = 0; i < allSubjects.length; i++){
        pageData["data"].push({
            "id": allSubjects[i]["s.id"],
            "name": allSubjects[i]["s.name"]
        });
    }
    
    return pageData;
}