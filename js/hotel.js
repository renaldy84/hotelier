var hotel = {};

hotel.list = function(callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.listHotels;
    $$.get(apiUrl,{
        access_token:at,
    },function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}
hotel.get = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.getHotel+'/'+id;
    
    $$.get(apiUrl,{access_token:at},
    function(data,status){
        
        var rs = JSON.parse(data);
        callback(rs);        
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
};

hotel.delete = function(id,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.deleteHotel+'/'+id;
    
    $$.get(apiUrl,{access_token:at},function(data,status){
        var rs = JSON.parse(data);
        if(rs.status==1){
            callback(true);            
        }else{
            callback(false);
        }
        
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}
hotel.update = function(id,data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.updateHotel+'/'+id;
    data.access_token = at;
    
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}

hotel.create = function(data,callback){
    var at = common.getAccessToken();
    var apiUrl = config.apiUrl+api.addHotel;
    data.access_token = at;
    $$.post(apiUrl,data,function(data,status){
        var rs = JSON.parse(data);
        callback(rs);       
    },function(xhr,status){
        common.handleAjaxError(xhr,status);
    });
}


hotel.addPicture = function(hotel_id,
                            picfile,
                            extension,
                            sequence){
    if(typeof hotel_id === 'undefined') return false;
    if(typeof picfile === 'undefined') return false;
    if(typeof extension === 'undefined') return false;
    if(typeof sequence === 'undefined') return false;
    return new Promise(function(resolve,reject){
        //do something here
    });
}
hotel.deletePicture = function(hotel_id,pic_id){
    if(typeof hotel_id === 'undefined') return false;
    if(typeof pic_id === 'undefined') return false;
    return new Promise(function(resolve,reject){
        //do something here
    });
}