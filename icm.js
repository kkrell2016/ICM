temp=setInterval(function(){Object.keys(window).forEach( function(element){
 if(element.indexOf("tracking3_route")>-1)
 {
   if(window[element].patched === true)
   { clearInterval(temp); return}
   console.log("tracking_route gefunden. Patching");
   (function(save){
    window[element].patched = true
    window[element].ParseRoute = function(){
      if(jQuery.isArray(arguments[0]) && arguments[0].length > 2)
       console.log(arguments[0]);
     save.call(this, arguments);
    };
  }(window[element].ParseRoute))
  console.log("Patch beendet");
 }
})}, 3000)

//jQuery.getScript("https://rawgit.com/kkrell2016/d95a99ac80e4da6b724d48364faeda40/raw/d61746b086ca335df0871cdb93f283f67aa88b0a/icm.js")