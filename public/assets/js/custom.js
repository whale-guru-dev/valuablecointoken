$(document).ready(function(){




    $('span.close').click(function(){

        //Landing Page
        $('.menu').css({"left":"-480px"});
    
       
    
    });
    
    // Hamburger
    
    $('.hamburger').click(function(){
    
        //Landing Page
        $('.menu').css({"left":"0"});

    
    });



   jQuery(".tbl-toggle").click(function(){
    
    jQuery("tbody").slideToggle();
    jQuery(".tbl-toggle").toggleClass("active");
        
    });
    
    
    AOS.init({
        duration: 1200,
    });
    


});