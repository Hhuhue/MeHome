/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//The number of attempts to load the content of a page
var ticks = 100;

//On loand, we load the home page.
window.onload = function(){
    LoadPage("views/Home.xhtml", []);
};

//Continuously check if the current page has content to load
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
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ref, true);
    
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            var allText = rawFile.responseText;
            var container = document.getElementById("content");
            
            if(data !== undefined){
                for(var i = 0; i < data.length; i++){
                    allText = replaceAll(allText, data[i]["info"], data[i]["value"]);                
                }                  
            }           
            
            container.innerHTML = allText;
        }
    };
    rawFile.send(null);
    
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
            loop.innerHTML = loop.innerHTML + replaceAll(html, "i", i);
            loop.setAttribute("name", "for_complete");
        }
    }
}
/**
 * Executes the For Each loops in the content of the currrent page.
 * @returns {undefined}
 */
function ExecuteForEach(){
    var loops = document.getElementsByName("foreach");
    
    for (var t = 0; t < loops.length; t++){
        var element = loops[t].getAttribute("element");
        var from = loops[t].getAttribute("from");
        var data = loops[t].getAttribute("data").split(",");
        var condition = loops[t].getAttribute("condition").split(":");
        
        var html = loops[t].innerHTML;
        var cndt = {"attr" : condition[0], "value": parseInt(condition[1])};
        
        var request = "?op=0&file=" + from + "&table=" + element + "&cndt=" + JSON.stringify(cndt);
        var keys = {"loop" : loops[t], "data": data, "element": element, "html": html};

        loops[t].innerHTML = "";       
        
        loadJSON("controllers/TaskController.php" + request, ForEach, Error, keys);   

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
 * @param {type} searched - The value of the text to replace
 * @param {type} replacement - The value of the text to replace <tt>searched</tt> with
 * @returns {replaceAll.result} The <tt>string</tt> with <tt>searched</tt> replaced
 */
function replaceAll(string, searched, replacement){
    var result = string;
    
    while(result.search("%" + searched + "%") !== -1){
            result = result.replace("%" + searched + "%", replacement);		
    }	
    
    return result;
}

/**
 * 
 * @param {string} path
 * @param {type} success
 * @param {type} error
 * @param {Object} keys
 * @returns {undefined}
 */
function loadJSON(path, success, error, keys)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success){
                    var response = xhr.responseText;
                    if(response.search('<br />') !== -1){
                        document.getElementById('content').innerHTML = response;
                    } else {
                        success(JSON.parse(xhr.responseText), keys);                   
                    }    
                }                
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    
    xhr.open("GET", path, true);
    xhr.send();
}

/**
 * 
 * @param {type} json
 * @param {type} keys
 * @returns {undefined}
 */
function ForEach(json, keys){    
    for(var i = 0; i < json.length; i++){
        var rawData = keys["html"];

        for (var j= 0; j < keys["data"].length; j++){
            rawData = replaceAll(rawData, keys["data"][j], json[i][keys["data"][j]]);
        }
        keys["loop"].innerHTML = keys["loop"].innerHTML + rawData;
    }
}

/**
 * 
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
 * 
 * @param {type} error
 * @returns {undefined}
 */
function Error(error){
    console.error(error);
}

