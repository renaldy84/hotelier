var booking = {};

booking.list = function(callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.listBookings;
    $$.get(apiUrl,{
        access_token:at,
    },function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    });
}
booking.get = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.getBooking+'/'+id;
    
    $$.get(apiUrl,{access_token:at},
    function(data,status){
        
        var rs = JSON.parse(data);
        callback(rs);        
    });
};


booking.closeBooking = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.closeBooking+'/'+id;
    
    $$.get(apiUrl,{access_token:at},
    function(data,status){
        
        var rs = JSON.parse(data);
        callback(rs);        
    });
}

booking.add = function(data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.addBooking;
    data.access_token = at;
    
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    });
}