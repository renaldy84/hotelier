

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
    var self = this;
    if(typeof navigator.geolocation === 'undefined'){
        //return false;
        //STUB 

        console.log('use stub');
        return new Promise(function(resolve,reject){
            resolve({lat:'-6.2000595',lon:'106.8827428'});
        });
        
        //-->
    }else{
        console.log('use geolocation');
        return new Promise(function(resolve,reject){
            navigator.geolocation.getCurrentPosition(function(position){
                console.log('found',position);
                resolve({lat:position.coords.latitude, lon:position.coords.longitude});
            }, function(err){
                console.log('error',err.message);
                reject(err);
            });
        });
    }
    
}
common.watchLocation = function(){
    console.log('watchLocation');
    if(typeof navigator.geolocation === 'undefined') return false;
    var self = this;
    return new Promise(function(resolve,reject){
        self.watchId = navigator.geolocation.watchPosition(function(position){
            self.location = {lat:position.coords.latitude, lon:position.coords.longitude};
            resolve(self.location);
        }, function(err){
            try{
                reject(err);
            }catch(e){
                reject(err);
            }
            
        }, {maximumAge: 3000, timeout: 10000, enableHighAccuracy: true });
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