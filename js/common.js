

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
        return new Promise(function(resolve,reject){
            self.location = {lat:'-6.2000595', lon:'106.8827428'};
            resolve({lat:'-6.2000595',lon:'106.8827428'});
        });
        
        //-->
    }else if(typeof cordova.plugins.locationServices !== 'undefined'){
        console.log("use location-services plugin");
        return new Promise(function(resolve,reject){
            cordova.plugins.locationServices.geolocation.getCurrentPosition(function(position){
                self.location = {lat:position.coords.latitude, lon:position.coords.longitude};
                resolve({lat:position.coords.latitude, lon:position.coords.longitude});
            }, function(err){
                reject(err);
            });
        });    
    }else{
        return new Promise(function(resolve,reject){
            navigator.geolocation.getCurrentPosition(function(position){
                self.location = {lat:position.coords.latitude, lon:position.coords.longitude};
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
common.handleAjaxError = function(xhr,status){
    var self = this;
    return new Promise(function(resolve,reject){
        self.myApp.alert("Cannot connect to server. Please make sure you have Internet access. Check your Wifi or Mobile connection",'Connection Error');
        
        resolve(true);
    });
}
common.refreshModal = function(xhr,status){
    var self = this;
    return new Promise(function(resolve,reject){
        self.myApp.modal({
            title:'Connection Error',
            text:'Cannot connect to server.',
            buttons:[{
                text:'Refresh',
                onClick:function(){
                    self.mainView.router.loadPage(common.currentPageUrl);
                }
            }]
        });
    });
}
common.myApp = false;
common.watchId = false;
common.location = {lat:0,lon:0};
common.mainView = false;
common.currentPageUrl = '';

common.mapLoaded = false;