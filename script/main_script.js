/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//The number of attempts to load the content of a page.
var ticks = 100;
var root = "http://localhost/MeHome/public_html/";

//On load, we load the home page and set the menu items
window.onload = function(){
    LoadPage("views/Home.xhtml");
};

//Continuously check if the current page has dynamic content to load.
setInterval(ContentLoader, 20);

/**
 * Loads the dynamic content of the current page.
 * @returns {undefined}
 */
function ContentLoader(){
    if(ticks !==0 ){
        if(document.getElementsByName("for").length !== 0){
            ExecuteFor();            
        }
        else if(document.getElementsByName("foreach").length !== 0){
            ExecuteForEach();
        }
        else if(document.getElementsByName("bar").length !== 0){
            ShowBars();  
        }
        else if(document.getElementsByName("pagination").length !== 0){
            Paginate();  
        }
        UpdateSelects();
        ticks--;
    }
}

/**
 * Loads the content of a page with its data.
 * @param {String} ref - The path to the file of the page to load
 * @param {Object[]} [data] - The data to load into the page
 * @param {String} data[].info - The name of the information 
 * @param {(String|Number)} data[].value - The value of the information
 * @returns {undefined}
 */
function LoadPage(ref, data){   
    
    var action = function(allText, params = data){
        var container = document.getElementById("content");

        if(params !== undefined){
            for(var i = 0; i < data.length; i++){                
                allText = ReplaceAll(allText, params[i]["info"], params[i]["value"]);                
            }                  
        }          

        container.innerHTML = allText;
    };
    
    GetRequest(ref, action);
    
    ticks = 100;
}

/**
 * Executes the For loops in the content of the currrent page.
 * @returns {undefined}
 */
function ExecuteFor(){
    var loops = document.getElementsByName("for");

    for (var t = 0; t < loops.length; t++){
        var loop = loops[t];
        var i = parseInt(loop.getAttribute("i"));
        var to = parseInt(loop.getAttribute("to"));
        var html = loop.innerHTML;
        
        loop.innerHTML = "";

        for (; i < to; i++){
            loop.innerHTML = loop.innerHTML + ReplaceAll(html, "i", i);
        }
        loop.setAttribute("name", "for_complete");
    }
}
/**
 * Executes the For Each loops in the content of the currrent page.
 * @returns {undefined}
 */
function ExecuteForEach(){
    var loops = document.getElementsByName("foreach");
    
    for (var t = 0; t < loops.length; t++){
        var data = JSON.parse(loops[t].getAttribute("data"));
        var keys = data["keys"];
        var html = loops[t].innerHTML;
        
        data = data["data"];
        loops[t].innerHTML = "";   
        
        for(var i = 0; i < data.length; i++){
            var content = html;
            for(var j = 0; j < keys.length; j++){
                content = ReplaceAll(content, keys[j], data[i][keys[j]]);             
            }
            loops[t].innerHTML += content;  
        }
            
        loops[t].setAttribute("name", "foreach_complete");
    }
}

/**
 * Displays the progress bars of the current page.
 * @returns {undefined}
 */
function ShowBars(){
    var bars = document.getElementsByName("bar");
    
    for(var i = 0; i < bars.length; i++){
        loadBar(bars[i].getAttribute("id"));
        bars[i].setAttribute("name", "bar_complete");
    }
}

/**
 * Replace all occurences of <tt>searched</tt> in <tt>string</tt> by the value of <tt>replacement</tt>.
 * @param {String} string - The text in which to replace the <tt>searched</tt> value
 * @param {String} searched - The value of the text to replace
 * @param {String} replacement - The value of the text to replace the searched value with
 * @returns {String} The <tt>string</tt> with <tt>searched</tt> replaced
 */
function ReplaceAll(string, searched, replacement){
    var result = string;
    
    while(result.search("%" + searched + "%") !== -1){
        result = result.replace("%" + searched + "%", replacement);		
    }	
    
    return result;
}

/**
 * Selects the option that has the same value than its select parent for each select tags.
 * @returns {undefined}
 */
function UpdateSelects(){
    var selects = document.getElementsByTagName("select");
    
    for(var i = 0; i < selects.length; i++){
        var currentSelect = selects[i];
        if(currentSelect.hasAttribute("value")){
            var value = currentSelect.getAttribute("value");
            var options = currentSelect.options;
            for(var j = 0; j < options.length; j++){
                if(options[j].getAttribute("value") === value){
                    options[j].setAttribute("selected", "selected");
                    currentSelect.removeAttribute("value");
                }
            }
        }
    }
}

/**
 * Executes a XMLHttpRequest of type GET
 * @param {String} resquest - The html GET request string
 * @param {Function} action - The function to execute on success
 * @returns {undefined}
 */
function GetRequest(request, action){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", request, true);
    
    xhr.onreadystatechange = function ()
    {
        if(xhr.readyState === XMLHttpRequest.DONE)
        {
            if(xhr.status === 200){
                var response = xhr.responseText;
                if(response.search("<br />") !== -1){
                    document.getElementById("content").innerHTML = response;
                } else {
                    action(response);                
                }            
            } else {
                console.error(xhr);
            }
        }
    };
    xhr.send();
}

/**
 * Executes a XMLHttpRequest of type POST
 * @param {String} path - The path to the targeted file
 * @param {Object} params - The parameters of the POST request
 * @returns {undefined}
 */
function PostRequest(path, params){
        
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
                    alert(response);                    
                }

            } else {
                console.error(xhr);
            }
        }
    };
    
    xhr.send(params);
}

/**
 * Adds the mi_active to the selected menu item.
 * @param {Object} item - The selectedmenu item
 * @returns {undefined}
 */
function SelectThis(item){
    var oldItem = document.getElementsByClassName("mi_active");
    if(oldItem){
        oldItem[0].className = oldItem[0].className.replace("mi_active", "");
    }
    item.className += " mi_active";
}

function setPage(page, view){
    var data = [{"info": "page", "value": page}];
    LoadPage(view, data);
}

