var temp=setInterval(function(){Object.keys(window).forEach( function(element){
 if(element.indexOf("tracking3_route")>-1)
 {
   (function(save){
    window[element].ParseRoute = function(){
     console.log(arguments);
     save.call(this, arguments);
    };
  }(window[element].ParseRoute))
 }
})}, 3000)