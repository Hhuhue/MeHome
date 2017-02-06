/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function loadBar(id){
    var canva = document.getElementById(id);
    var size = parseInt(canva.getAttribute("data").split(",")[0].split(":")[1]);
    var filled = parseInt(canva.getAttribute("data").split(",")[1].split(":")[1]);
    var ctx = canva.getContext("2d");
    var dim = 15;
    
    ctx.clearRect(0, 0, canva.width, canva.height);
    canva.width = dim * size;
    canva.height = dim;
    for(var i = 0; i < size; i++){
        cubeStep(ctx, {"x": dim * i, "y": 0}, dim, i < filled);
    }
}

function cubeStep(ctx, position, dimention, filled){

    if(filled){
        ctx.beginPath();
        ctx.rect(position["x"], position["y"], dimention, dimention);
        ctx.fillStyle = "rgba(087, 158, 255, 1)";
        ctx.fill();
        ctx.closePath();        
    }
    
    ctx.beginPath();
     ctx.rect(position["x"], position["y"], dimention, dimention);
    ctx.strokeStyle = "rgba(019, 083, 171, 1)";
    ctx.stroke();
    ctx.closePath();
}

function addToBar(id){
    var canva = document.getElementById(id);
    var size = parseInt(canva.getAttribute("data").split(",")[0].split(":")[1]);
    var filled = parseInt(canva.getAttribute("data").split(",")[1].split(":")[1]);
        
    if(filled < size){
        filled++;
    }
    
    canva.setAttribute("data", "size:" + size + ",filled:" + filled + ",edited");
    loadBar(id);
}

function removeToBar(id){
    var canva = document.getElementById(id);
    var size = parseInt(canva.getAttribute("data").split(",")[0].split(":")[1]);
    var filled = parseInt(canva.getAttribute("data").split(",")[1].split(":")[1]);
        
    if(filled > 0){
        filled--;
    }
    
    canva.setAttribute("data", "size:" + size + ",filled:" + filled + ",edited");
    loadBar(id);
}