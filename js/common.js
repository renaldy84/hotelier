

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
    if(str.length>0 && typeof str !== 'undefined'){
        console.log(str);
        return JSON.parse(str);
    }
}