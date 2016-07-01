patchInterval=setInterval(function(){Object.keys(window).forEach( function(element){
 if(element.indexOf("tracking3_route")>-1)
 {
   if(window[element].patched === true)
   { clearInterval(patchInterval); return}
   console.log("tracking_route gefunden. Patchen...");
   (function(save){
    window[element].patched = true
    window[element].ParseRoute = function(){
      if(jQuery.isArray(arguments[0]) && arguments[0].length > 2)
      { 
        gpxData.Data = arguments[0];
        gpxData.last = 0;
        gpxbutton = $("#views div:first-child").clone()
        gpxbutton.attr("data-qtitle","GPX Export")
        gpxbutton.attr("title","GPX Export")
        gpxbutton.find("img").attr("src","https://cdn3.iconfinder.com/data/icons/line/36/box_expand-64.png")
        gpxbutton.append(document.createElement("a"))
        gpxbutton.find("a").attr("download", "export.gpx");
        gpxbutton.appendTo($("#views"))
        gpxbutton.find("a").append(gpxbutton.find("img").detach())
        gpxbutton.click(function(){gpxData.getGPXString();gpxbutton.remove()}) 
      }
      save.call(this, arguments);
    };
  }(window[element].ParseRoute))
  console.log("Patch beendet");
 }
})}, 3000)

gpxData = {
Data : "",
GPXString : "",
getGPXString : function (){  
  console.log("gpxstring start")
  var date = new Date();
  loadingID = f5.ShowLoading()
  loadingdialog = $("#loading_inner_"+loadingID).find("span")
  this.GPXString='<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\r\n<gpx version="1.1" creator="ICM TEST">\r\n<metadata>\r\n<name>ICM TEST</name>\r\n</metadata>\r\n';
  var len = this.Data.length
  console.log(len);
  for(var i = 0; i<len ; i++){
    var curE = this.Data[i]
    var timestamp = new Date(curE.TIMESTAMP.substr(3,3)+curE.TIMESTAMP.substr(0,3)+curE.TIMESTAMP.substr(6));
    //timestamp = timestamp.//toISOString();
    var posx = curE.POS_X.replace(",",".") 
    var posy = curE.POS_Y.replace(",",".") 
    this.GPXString += '<wpt lat="' + posx + '" lon="'+ posy +'">\r\n<time>' + timestamp.toISOString() + '</time>\r\n</wpt>\r\n';
    }
  this.GPXString += '</gpx>\r\n';
  
  f5.HideLoading(loadingID)
  curDate = new Date();
  console.log(curDate-date)
  var date = new Date();
  console.log("gpxstring end")
  gpxbutton.find("a").attr("href","data:text/plain;charset=utf8,"+encodeURIComponent(this.GPXString));
}
}

//jQuery.getScript("https://rawgit.com/kkrell2016/d95a99ac80e4da6b724d48364faeda40/raw/d61746b086ca335df0871cdb93f283f67aa88b0a/icm.js")