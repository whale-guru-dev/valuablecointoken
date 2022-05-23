"use strict";

$(document).ready(function () {
  $('span.close').click(function () {
    //Landing Page
    $('.menu').css({
      "left": "-480px"
    });
  }); // Hamburger

  $('.hamburger').click(function () {
    //Landing Page
    $('.menu').css({
      "left": "0"
    });
  });
});