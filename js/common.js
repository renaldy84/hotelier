

var common = {};
var access_token = false;
common.getAccessToken = function(){
    return this.getLocal('access_token');
}
common.setAccessToken = function(at){
    access_token = at;
    this.setLocal('access_token',access_token);
}
common.setLocal = function(name,val){
    var o = JSON.stringify(val);
    localStorage.setItem(name, o);
}
common.getLocal = function(name){
    var str = localStorage.getItem(name);
    if(typeof str !== 'undefined'){
        console.log(str);
        return JSON.parse(str);
    }
}
common.getLocation = function(){
    //cordova detect location here
    if(typeof navigator.geolocation === 'undefined'){
        //return false;
        //STUB 
        return new Promise(function(resolve,reject){
            resolve({lat:'-6.2000595',lon:'106.8827428'});
        });
        
        //-->
    }else{
        return new Promise(function(resolve,reject){
            navigator.geolocation.getCurrentPosition(function(position){
                resolve({lat:position.coords.latitude, lon:position.coords.longitude});
            }, function(err){
                reject(err);
            });
        });
    }
    
}
common.watchLocation = function(){
    if(typeof navigator.geolocation === 'undefined') return false;
    var self = this;
    return new Promise(function(resolve,reject){
        self.watchId = navigator.geolocation.watchPosition(function(position){
            self.location = {lat:position.coords.latitude, lon:position.coords.longitude};
            resolve(self.location);
        }, function(err){
            reject(err);
        }, {maximumAge: 3000, timeout: 30000, enableHighAccuracy: true });
    });
}
common.stopWatchingLocation = function(){
    if(typeof navigator.geolocation === 'undefined') return false;
    var self = this;
    return new Promise(function(resolve,reject){
           navigator.geolocation.clearWatch(self.watchId);
    });
}
common.watchId = false;
common.location = {lat:0,lon:0};