temp=setInterval(function(){Object.keys(window).forEach( function(element){
 if(element.indexOf("tracking3_route")>-1)
 {
   if(window[element].patched === true)
   { clearInterval(temp); return}
   console.log("tracking_route gefunden. Patching");
   (function(save){
    window[element].patched = true
    window[element].ParseRoute = function(){
      string='?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n<gpx version="1.1" creator="ICM TEST"\n<metadata>\n<name>ICM TEST</name>\n</metadata>\n';
      if(jQuery.isArray(arguments[0]) && arguments[0].length > 2)
       //console.log(arguments[0]);
       args = arguments[0]
       console.log(args);
       
       args.forEach(function(curE){
        var timestamp = Date.parse(curE.TIMESTAMP).toISOString();
        var posx = curE.POS_X.replace(",",".") 
        var posy = curE.POS_Y.replace(",",".") 
      string += 'wpt lat="' + x + '" lon="'+y+'">\n<time>'+timestamp+'</time>\n</wpt>\n';
      })
      string += '</gpx>\n';
      
      console.log(string);
       //mapObj.data.toGeoJson(function(args){console.log(args);});
       //mapObj.data.toGeoJson(function(args[0]){console.log(args[0]);});
     save.call(this, arguments);
    };
  }(window[element].ParseRoute))
  console.log("Patch beendet");
 }
})}, 3000)

google.maps.Map.prototype.toGeoJson=function(callback){
  var geo={"type": "FeatureCollection","features": []},
      fx=function(g,t){

        var that  =[],
            arr,
            f     = {
                      MultiLineString :'LineString',
                      LineString      :'Point',
                      MultiPolygon    :'Polygon',
                      Polygon         :'LinearRing',
                      LinearRing      :'Point',
                      MultiPoint      :'Point'
                    };

        switch(t){
          case 'Point':
            g=(g.get)?g.get():g;
            return([g.lng(),g.lat()]);
            break;
          default:
            arr= g.getArray();
            for(var i=0;i<arr.length;++i){
              that.push(fx(arr[i],f[t]));
            }
            if( t=='LinearRing' 
                  &&
                that[0]!==that[that.length-1]){
              that.push([that[0][0],that[0][1]]);
            }
            return that;
        }
      };

  this.data.forEach(function(feature){
   var _feature     = {type:'Feature',properties:{}}
       _id          = feature.getId(),
       _geometry    = feature.getGeometry(),
       _type        =_geometry.getType(),
       _coordinates = fx(_geometry,_type);

       _feature.geometry={type:_type,coordinates:_coordinates};
       if(typeof _id==='string'){
        _feature.id=_id;
       }

       geo.features.push(_feature);
       feature.forEachProperty(function(v,k){
          _feature.properties[k]=v;
       });
  }); 
  if(typeof callback==='function'){
    callback(geo);
  }     
  return geo;
}



//jQuery.getScript("https://rawgit.com/kkrell2016/d95a99ac80e4da6b724d48364faeda40/raw/d61746b086ca335df0871cdb93f283f67aa88b0a/icm.js")