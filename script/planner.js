/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function loadPlan(id){
    var canva = document.getElementById(id);
    var ctx = canva.getContext("2d");
    
    ctx.beginPath();
    ctx.rect(0, 0, canva.width, canva.height);
    ctx.strokeStyle = "rgba(019, 083, 171, 1)";
    ctx.stroke();
    ctx.closePath();
    
}
