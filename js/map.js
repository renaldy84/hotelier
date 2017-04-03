/**
 * handle google maps setup using cordove googlemaps plugin
 */

var map = function(){};

map.mapInstance = {};
map.marker = null;
map.currentLocation = {};

map.foo = '';

map.isAvailable = function(id,callback){
    plugin.google.maps.Map.isAvailable(function(isAvailable, message) {
            if (isAvailable) {
                callback(null,id);
            } else {
                callback( new Error(message),false);
            }
        });
}
map.loadMap = function(id,callback){    
    console.log('loading map at #',id);
    var self = this;
    // Initialize the map view
    try{
        var div = document.getElementById(id);
        self.mapInstance = plugin.google.maps.Map.getMap(div);
        
        self.mapInstance.addEventListener(plugin.google.maps.event.MAP_READY,
        function(evt){
            callback(null,true);
        });
    }catch(e){
        console.log('error:'+e.message);
        callback(e,false);
    }
        
    
}
map.getLocation = function(){
    return this.currentLocation;
}
map.setLocation = function(loc,callback){
    console.log('setPosition:'+loc.lat+','+loc.lon);
    var self = this;
    
        try{
            self.currentLocation = new plugin.google.maps.LatLng(loc.lat,loc.lon);
            
            self.mapInstance.animateCamera({
                target: {lat: loc.lat, lng: loc.lon},
                zoom: 15,
                //tilt: 90,
                //bearing: 140,
                duration: 1000
            }, function() {
                //add marker as well
                if(self.marker==null){
                    console.log('add marker');
                     self.mapInstance.addMarker({
                        'position': self.currentLocation,
                        'title': "Your Hotel Location"
                    }, function(marker) {
                        self.marker = marker;
                        callback(null,self.currentLocation,self.marker);
                            
                    });
                    
                }else{
                    console.log('update marker location');
                    self.marker.setPosition(self.currentLocation);
                    callback(null,self.currentLocation,self.marker);
                    
                }
            }); 
        }catch(e){
            callback(e,false,false);
        }         
   
}
map.bar= function(str){
    var self = this;

    self.foo = str;
}
