/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
  $("#vertical").css("display", "none");
 // $("#horizontal ").hide();
  

    $("#vert").click(function () {
        $("#vertical").show();
        $("#horizontal").hide();
        $("#contenido").hide();

        $("#hori").click(function () {
        $("#vertical").hide();
        $("#horizontal").show();
        $("#contenido").show();
        
      
        
        });
    });
    
    

});
