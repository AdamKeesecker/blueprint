(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.cell').on('mousedown', paint);
  }

  function paint(){
    var startX = $(this).data().x;
    var startY = $(this).data().y;
    console.log(start);
  }








})();
