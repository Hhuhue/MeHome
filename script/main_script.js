/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var newPage = 100;

window.onload = function(){
    LoadPage("views/Home.xhtml");
};

setInterval(function(){
    if(newPage !==0 ){
        if(document.getElementsByName("for").length !== 0){
            ExecuteFor();            
        }
        else if(document.getElementsByName("foreach").length !== 0){
            ExecuteForEach();
        }
        else if(document.getElementsByName("bar").length !== 0){
            ShowBars();  
        }
        newPage--;
    }
}, 20);

function LoadPage(ref, data){    
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", ref, true);
    
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            var allText = rawFile.responseText;
            var container = document.getElementById("content");
            container.innerHTML = allText;
        }
    };
    rawFile.send(null);
    
    newPage = 100;
}

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

function ExecuteForEach(){
    var loops = document.getElementsByName("foreach");
    
    for (var t = 0; t < loops.length; t++){
        var element = loops[t].getAttribute("element");
        var from = loops[t].getAttribute("from");
        var data = loops[t].getAttribute("data").split(",");
        
        var html = loops[t].innerHTML;

        loops[t].innerHTML = "";
        
        loadJSON("data/" + from, 
            function(json, keys){
                var datas = json[keys["element"]];
                for(var i = 0; i < datas.length; i++){
                    var rawData = keys["html"];
                    
                    for (var j= 0; j < data.length; j++){
                        rawData = replaceAll(rawData, keys["data"][j], datas[i][keys["data"][j]]);
                    }
                    keys["loop"].innerHTML = keys["loop"].innerHTML + rawData;
                }
            },
            function(error){
                console.error(error);
            },
            {"loop" : loops[t], "data": data, "element": element, "html": html}
        );   

        loops[t].setAttribute("name", "foreach_complete");
    }
}

function ShowBars(){
    var bars = document.getElementsByName("bar");
    
    for(var i = 0; i < bars.length; i++){
        loadBar(bars[i].getAttribute("id"));
        bars[i].setAttribute("name", "bar_complete");
    }
}

function replaceAll(string, searched, replacement){
    var result = string;
    
    while(result.search("%" + searched + "%") !== -1){
            result = result.replace("%" + searched + "%", replacement);		
    }	
    
    return result;
}

function loadJSON(path, success, error, keys)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText), keys);
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    
    xhr.open("GET", path, true);
    xhr.send();
}
