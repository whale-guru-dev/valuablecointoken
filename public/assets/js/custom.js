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


    $('span.close').click(function(){

        //Landing Page
        // $('.menu').css({"left":"0"});
        $('.navigation').css({"z-index":0});
        $('.navigation-container').css({"height":0});
        $('.navigations').css({"display":"none"});
    
       
    
    });
    
    // Hamburger
    
    $('.hamburger').click(function(){
    
        //Landing Page
        $('.menu').css({"left":"0"});
        $('.navigation').css({"z-index":999});
        $('.navigation-container').css({"height":"100vh"});
        $('.navigations').css({"display":"grid"});

    
    });



   jQuery(".tbl-toggle").click(function(){
    
    jQuery("tbody").slideToggle();
    jQuery(".tbl-toggle").toggleClass("active");
        
    });
    
    
    AOS.init({
        duration: 1200,
    });
    


});