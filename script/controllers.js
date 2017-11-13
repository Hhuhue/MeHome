/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var task_controller = {
    "folder": 'views/Tasks/',
    "index": function(page, count){ Tasks(page, count); },
    "add_get": function() { AddTaskGet(); },
    "add_post": function(){ AddTaskPost(); },
    "update": function(){ UpdateTasks(); },
    "edit_get": function(id){ EditTaskGet(id); },
    "edit_post": function(id){ EditTaskPost(id); },    
    "delete": function(id){ DeleteTask(id); },
    "complete": function(id) { CompleteTask(id); }
};

var subject_controller = {
    "folder": 'views/Subjects/',
    "index": function(page, count){ Subjects(page, count); },
    "add_get": function() { AddSubjectGet(); },
    "add_post": function(){ AddSubjectPost(); },
    "update": function(){ UpdateTasks(); },
    "edit_get": function(id){ EditSubjectGet(id); },
    "edit_post": function(id){ EditSubjectPost(id); },
    "delete": function(id){ DeleteSubject(id); }
};

var event_controller = {
    "folder": 'views/Events/',
    "index": function(date){ Events(date); }
};