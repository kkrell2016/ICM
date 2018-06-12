jQuery.getScript("https://krell.li/icm/FileSaver.js")
//--FOTOS ONLY--//
alert("Eingefügt")
patchInterval=setInterval(function(){Object.keys(window).forEach( function(element){
  if(element.indexOf("tracking3_route")>-1)
  {
    if(window[element].patched === true)
    {clearInterval(patchInterval); return}
   console.log("tracking_route gefunden. Patchen...");
   
  //AddListener patchen
    (function(org_addListener){
      google.maps.event.addListener= function(){
        if((arguments[1] == "click") && (arguments[0] instanceof MarkerWithLabel))
        {
          if(arguments[0].labelContent.indexOf("data-image-id") >0)
            gpxData.Data.push(arguments[0]);         
        } 
      return org_addListener.apply(this,arguments);
      }
    }(google.maps.event.addListener));
  
  // Parse Route Patchen damit wir immer wissen wann eine neue Route aufgerufen wurde.
    (function(old_Parse){
    window[element].patched = true
    window[element].ParseRoute = function(){
    pxbutton = $("#GPXExportBtn").remove()  
      if(jQuery.isArray(arguments[0]) && arguments[0].length > 2)
      { 
        gpxbutton = $("#views div:first-child").clone()
        gpxbutton.attr("data-qtitle","GPX Export")
        gpxbutton.attr("ID","GPXExportBtn")
        gpxbutton.attr("title","GPX Export")
        gpxbutton.find("img").attr("src","https://cdn3.iconfinder.com/data/icons/line/36/box_expand-64.png")
        gpxbutton.append(document.createElement("a"))
        gpxbutton.find("a").attr("download", "export.gpx");
        gpxbutton.appendTo($("#views"))
        gpxbutton.find("a").append(gpxbutton.find("img").detach())
        gpxbutton.click(function(){gpxData.getGPXString();gpxbutton.remove()})
        gpxData.Data = [];
      }
      old_Parse.call(this, arguments);
    };
  }(window[element].ParseRoute));
  console.log("Patch beendet");
 }
})}, 3000)

gpxData = {
Data : [],
GPXString : "",
getGPXString : function (){  
  console.log("gpxstring start")
  var date = new Date();
//  loadingID = f5.ShowLoading()
//  loadingdialog = $("#loading_inner_"+loadingID).find("span")
  this.GPXString='<?xml version="1.0" encoding="UTF-8"?>\r\n<gpx xmlns="http://www.topografix.com/GPX/1/1" creator="ICM TEST" version="1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">\r\n<metadata>\r\n<name>ICM TEST</name>\r\n</metadata>\r\n';
  var len = this.Data.length
  console.log(len);
  for(var i = 0; i<len/2 ; i++){
    var curE = this.Data[i]
    //curE.TIMESTAMP.split(".")
    //var timestamp = "" + curE.TIMESTAMP.substr(6,4) + "-" + curE.TIMESTAMP.substr(3,2) + "-" + curE.TIMESTAMP.substr(0,2) + "T" + curE.TIMESTAMP.substr(11) + ".000Z";
    //console.log(timestamp)
    //YYYY-MM-DDTHH:mm:ss.sssZ           01.02.2010 
    //timestamp = timestamp.//toISOString(); Funktioniert nicht wirklich immer. 
    var lat = curE.getPosition().lat() 
    var lon = curE.getPosition().lng() 
    this.GPXString += '<wpt lat="' + lat + '" lon="'+ lon +'">\r\n<name>' + curE.id + '</name>\r\n<sym>Waypoint</sym>\r\n</wpt>\r\n';
    }
  this.GPXString += '</gpx>\r\n';
  
  //f5.HideLoading(loadingID)
//  curDate = new Date();
//  console.log(curDate-date)
//  var date = new Date();
  console.log("gpxstring end")
  
  var blob = new Blob([this.GPXString], {type: "text/plain;charset=utf-8"});
  saveAs(blob, "export.gpx");

  //gpxbutton.find("a").attr("href","data:text/plain;charset=utf8,"+encodeURIComponent(this.GPXString));
}
}
