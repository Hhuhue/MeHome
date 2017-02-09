/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Draws a progress bar in the given canvas.
 * @param {String} id - The id property of the canvas
 * @returns {undefined}
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
        addUnit(ctx, {"x": dim * i, "y": 0}, dim, i < filled);
    }
}

/**
 * Adds a progress unit to the progress bar.
 * @param {Object} ctx - The context of the canvas
 * @param {Object} position - The position of the cube to draw
 * @param {Number} dimension - The dimension of the cube to draw
 * @param {Boolean} filled - If the cube must be filled
 * @returns {undefined}
 */
function addUnit(ctx, position, dimension, filled){

    if(filled){
        ctx.beginPath();
        ctx.rect(position["x"], position["y"], dimension, dimension);
        ctx.fillStyle = "rgba(087, 158, 255, 1)";
        ctx.fill();
        ctx.closePath();        
    }
    
    ctx.beginPath();
     ctx.rect(position["x"], position["y"], dimension, dimension);
    ctx.strokeStyle = "rgba(019, 083, 171, 1)";
    ctx.stroke();
    ctx.closePath();
}

/**
 * Fills a progress unit from the given progress bar. 
 * @param {type} id - The id property of the progress bar
 * @returns {undefined}
 */
function addProgress(id){
    var canva = document.getElementById(id);
    var size = parseInt(canva.getAttribute("data").split(",")[0].split(":")[1]);
    var filled = parseInt(canva.getAttribute("data").split(",")[1].split(":")[1]);
        
    if(filled < size){
        filled++;
    }
    
    canva.setAttribute("data", "size:" + size + ",filled:" + filled + ",edited");
    loadBar(id);
}

/**
 * Empties a progress unit from the given progress bar. 
 * @param {type} id - The id property of the progress bar
 * @returns {undefined}
 */
function removeProgress(id){
    var canva = document.getElementById(id);
    var size = parseInt(canva.getAttribute("data").split(",")[0].split(":")[1]);
    var filled = parseInt(canva.getAttribute("data").split(",")[1].split(":")[1]);
        
    if(filled > 0){
        filled--;
    }
    
    canva.setAttribute("data", "size:" + size + ",filled:" + filled + ",edited");
    loadBar(id);
}