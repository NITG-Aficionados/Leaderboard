
document.addEventListener('DOMContentLoaded', function () {
   new Zodiac('zodiac',                      // HTMLCanvasElement or id
      {                                      //// OPTIONS
         directionX: 0,                      // -1:left;0:random;1:right
         directionY: -1,                     // -1:up;0:random;1:down
         velocityX: [.1, .2],                // [minX,maxX]
         velocityY: [.5, 1],                 // [minY,maxY]
         bounceX: true,                      // bounce at left and right edge
         bounceY: false,                     // bounce at top and bottom edge
         parallax: 1,                       // float [0-1...]; 0: no paralax
         pivot: 0,                           // float [0-1...]; pivot level for parallax;
         density: 15000,                     // px^2 per node
         dotRadius: 2,                   // px value or [minR,maxR]
         backgroundColor: '#090909',      // default transparent; use alpha value for motion blur and ghosting
         dotColor: '#ff6342',
         linkColor: '#ff6342',
         linkDistance: 0,
         linkWidth: 0.5
      });
   console.log("%c Zodiac [0.1.1] ", "color:#42b983;background-color:#333;font-weight:bold;font-size:20px;");
   console.log(zodiac);
}, false);

$('.nav a').on('click', function(){
    $('.btn-navbar').click(); //bootstrap 2.x
    $('.navbar-toggle').click() //bootstrap 3.x by Richard
});

$('input').on('focusin', function() {
  $(this).parent().find('label').addClass('active');
});

$('input').on('focusout', function() {
  if (!this.value) {
    $(this).parent().find('label').removeClass('active');
  }
});

$("#cfb").click(function(){
  var username=(window.location.href.split('/')[window.location.href.split('/').length-1]);
  var handle=document.getElementById("cft").value;
  $('#cfb').html('Loading..');
    $.ajax({url: "/users/"+username+"/cf/"+handle, success: function(result){

        console.log(result);
        $("#cfr").html(result);
        $('#cfb').html('Load');

    }});
});

$("#tcb").click(function(){
  var username=(window.location.href.split('/')[window.location.href.split('/').length-1]);
  var handle=document.getElementById("tct").value;
  console.log(handle);
  $('#tcb').html('Loading..');
    $.ajax({url: "/users/"+username+"/tc/"+handle, success: function(result){

        console.log(result);
        $("#tcr").html(result);
        $('#tcb').html('Load');

    }});
});

$("#ccb").click(function(){
  var username=(window.location.href.split('/')[window.location.href.split('/').length-1]);
  var handle=document.getElementById("cct").value;
  console.log(handle);
  $('#ccb').html('Loading..');
    $.ajax({url: "/users/"+username+"/cc/"+handle, success: function(result){

        console.log(result);
        $("#ccr").html(result);
        $('#ccb').html('Load');

    }});
});




$("#hrb").click(function(){
  var username=(window.location.href.split('/')[window.location.href.split('/').length-1]);
  var handle=document.getElementById("hrt").value;
  console.log(handle);
  $('#hrb').html('Loading..');
    $.ajax({url: "/users/"+username+"/hr/"+handle, success: function(result){

        console.log(result);
        $("#hrr").html(result);
        $('#hrb').html('Load');

    }});
});

$("#heb").click(function(){
  var username=(window.location.href.split('/')[window.location.href.split('/').length-1]);
  var handle=document.getElementById("het").value;
  console.log(handle);
  $('#heb').html('Loading..');
    $.ajax({url: "/users/"+username+"/he/"+handle, success: function(result){

        console.log(result);
        $("#her").html(result);
        $('#heb').html('Load');

    }});
});

$("#rb").click(function(){
  var username=(window.location.href.split('/')[window.location.href.split('/').length-1]);
  console.log("updating ratings of:"+username);
  
  var ratings={cfr:$('#cfr').text() || 0,tcr:$('#tcr').text() || 0,ccr:$('#ccr').text() || 0,hrr:$('#hrr').text() || 0,her:$('#her').text() || 0};
  var ind=(ratings.cfr*20/3500)+(ratings.tcr*20/3700)+(ratings.ccr*20/3200)+(ratings.hrr*20/3000)+(ratings.her*20/2100);
  ind=ind.toPrecision(4);

  console.log(ind);
  $("#rb").html('Refreshing..');

    $.ajax({url: "/users/"+username+"/refresh",type:"GET",data:{ind:ind}, success: function(result){

        console.log(result);
        
        $("#rb").html('Refresh');

    }});
window.location.reload();
window.location.reload();
window.location.reload();

});

